import { sessionCollection } from '../db'
import { RepositorySessionType, SessionType } from '../../types'

export const sessionRepository: RepositorySessionType = {
  async findSession(ip, url, deviceTitle) {
    const foundSession: SessionType | null = await sessionCollection.findOne({
      $and: [{ ip }, { url }, { deviceTitle }]
    })

    if (!foundSession) {
      return null
    }

    return foundSession
  },
  async createdSession(createdSession) {
    await sessionCollection.insertOne(createdSession)

    return createdSession
  },
  async updateAttemptSession(id) {
    const { matchedCount } = await sessionCollection.updateOne({ id }, {
      $inc: { attempt: 1 },
      $set: { issuedAtt: new Date().toISOString() }
    })

    return matchedCount === 1   
  },
}
