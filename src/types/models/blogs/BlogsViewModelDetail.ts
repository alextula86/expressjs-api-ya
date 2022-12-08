import { BlogViewModel } from './BlogViewModel'

export type BlogsViewModelDetail = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: BlogViewModel[]
}
