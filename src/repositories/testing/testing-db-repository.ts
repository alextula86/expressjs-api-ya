import { db } from '../../mocks'
import { blogCollection, postCollection } from '../../repositories/db'
import { RepositoryTestingType } from '../../types/services'

export const testingRepository: RepositoryTestingType = {
  deleteAll: async () => {
    postCollection.drop()
    blogCollection.drop()

    return true
  },
}
