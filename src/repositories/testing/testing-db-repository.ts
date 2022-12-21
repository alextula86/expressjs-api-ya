import { blogCollection, postCollection, commentCollection, userCollection } from '../../repositories/db'
import { RepositoryTestingType } from '../../types'

export const testingRepository: RepositoryTestingType = {
  deleteAll: async () => {
    await blogCollection.deleteMany({})
    await postCollection.deleteMany({})
    await commentCollection.deleteMany({})
    await userCollection.deleteMany({})

    return true
  },
}
