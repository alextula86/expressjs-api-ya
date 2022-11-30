import { db } from '../../mocks'

import { RepositoryTestingType } from '../../types/services'

export const testingRepository: RepositoryTestingType = {
  deleteAll: async () => {
    db.videos = []
    db.posts = []
    db.blogs = []

    return true
  },
}
