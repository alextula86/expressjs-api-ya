import { blogCollection, postCollection, userCollection } from '../../repositories/db'
import { RepositoryTestingType } from '../../types/service'

export const testingRepository: RepositoryTestingType = {
  deleteAll: async () => {
    await postCollection.deleteMany({})
    await blogCollection.deleteMany({})
    await userCollection.deleteMany({})

    return true
  },
}
