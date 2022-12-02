import { blogCollection, postCollection } from '../../repositories/db'
import { RepositoryTestingType } from '../../types/services'

export const testingRepository: RepositoryTestingType = {
  deleteAll: async () => {
    await postCollection.deleteMany({})
    await blogCollection.deleteMany({})

    return true
  },
}
