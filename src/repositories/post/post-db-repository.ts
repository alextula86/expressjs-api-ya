import { trim } from 'lodash'
import { postCollection } from '../db'

import { getNextStrId } from '../../utils'

import { RepositoryPostType, PostType, SortDirection } from '../../types'

export const postRepository: RepositoryPostType = {
  async findAllPosts({
    searchNameTerm = null,
    pageNumber = 1,
    pageSize = 10,
    sortBy = 'createdAt',
    sortDirection =  SortDirection.ASC,
  }) {
    const filter: any = {}
    const sort: any = { [sortBy]: sortDirection === SortDirection.ASC ? 1 : -1 }
    
    if (searchNameTerm) {
      filter.title = { $regex: searchNameTerm }
    }

    const totalCount = await postCollection.count(filter)
    const pagesCount = Math.ceil(totalCount / pageSize)
    const skip = (+pageNumber - 1) * +pageSize

    const posts: PostType[] = await postCollection
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(+pageSize)
      .toArray()

    return this._getPostsViewModelDetail({
      items: posts,
      totalCount,
      pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
    })
  },
  async findPostById(id) {
    const foundPost: PostType | null = await postCollection.findOne({ id })

    if (!foundPost) {
      return null
    }

    return this._getPostViewModel(foundPost)
  },
  async createdPost({ title, shortDescription, content, blogId, blogName }) {
    const createdPost: PostType = {
      id: getNextStrId(),
      title: trim(String(title)),
      shortDescription: trim(String(shortDescription)),
      content: trim(String(content)),
      blogId,
      blogName,
      createdAt: new Date().toISOString(),
    }

    await postCollection.insertOne(createdPost)

    return this._getPostViewModel(createdPost)
  },
  async updatePost({ id, title, shortDescription, content, blogId, blogName }) {  
    const { matchedCount } = await postCollection.updateOne({ id }, {
      $set: {
        title: trim(String(title)),
        shortDescription: trim(String(shortDescription)),
        content: trim(String(content)),
        blogId,
        blogName,
      }
    })

    return matchedCount === 1   
  },
  async deletePostById(id) {
    const { deletedCount } = await postCollection.deleteOne({ id })

    return deletedCount === 1
  },
  _getPostViewModel(dbPost) {
    return {
      id: dbPost.id,
      title: dbPost.title,
      shortDescription: dbPost.shortDescription,
      content: dbPost.content,
      blogId: dbPost.blogId,
      blogName: dbPost.blogName,
      createdAt: dbPost.createdAt,
    }
  },
  _getPostsViewModelDetail({ items, totalCount, pagesCount, page, pageSize }) {
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        shortDescription: item.shortDescription,
        content: item.content,
        blogId: item.blogId,
        blogName: item.blogName,
        createdAt: item.createdAt,
      })),
    }
  },  
}
