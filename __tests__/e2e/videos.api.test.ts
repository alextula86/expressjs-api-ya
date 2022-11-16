import request from 'supertest'
import moment from 'moment'
import { app } from '../../src'
import { VideoType, AvailableResolutions, HTTPStatuses } from '../../src/types'
import { errorsValidator } from '../../src/utils'

describe('/api/videos',  () => {
  beforeAll(async () => {
    await request(app).delete('/api/testing/all-data')
  })

  it('should return status 200 and empty array', async () => {
    await request(app)
      .get('/api/videos')
      .expect(HTTPStatuses.SUCCESS200, [])
  })

  it('should return status 404 for not existing videos', async () => {
    await request(app)
      .get('/api/videos/1')
      .expect(HTTPStatuses.NOTFOUND404)
  })

  it('should not create with incorrect input data', async () => {
    await request(app)
      .post('/api/videos')
      .send({
        title: '',
        author: '',
        availableResolutions: [],
      })
      .expect(HTTPStatuses.BADREQUEST400, [
        errorsValidator.titleError,
        errorsValidator.authorError,
        errorsValidator.availableResolutionsError,
      ])

      await request(app)
      .post('/api/videos')
      .send({
        title: 'title будет больше 40 символов'.repeat(3),
        author: '',
        availableResolutions: null,
      })
      .expect(HTTPStatuses.BADREQUEST400, [
        errorsValidator.titleError,
        errorsValidator.authorError,
      ])

      await request(app)
      .post('/api/videos')
      .send({
        title: '',
        author: 'author будет больше 20 символов'.repeat(2),
        availableResolutions: null,
      })
      .expect(HTTPStatuses.BADREQUEST400, [
        errorsValidator.titleError,
        errorsValidator.authorError,
      ])      

      await request(app)
      .get('/api/videos/1')
      .expect(HTTPStatuses.NOTFOUND404)
  })

  let createdVideo1: VideoType

  it('should create video 1 with correct input data', async () => {
    const createdVideoResponce = await request(app)
      .post('/api/videos')
      .send({
        title: 'Видео 1',
        author: 'Автор 1',
        availableResolutions: [AvailableResolutions.P144],
      })
      .expect(HTTPStatuses.CREATED201)

    createdVideo1 = createdVideoResponce.body

    expect(createdVideo1).toEqual({
      id: expect.any(Number),
      title: 'Видео 1',
      author: 'Автор 1',
      availableResolutions: [AvailableResolutions.P144],
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
    })

    await request(app)
      .get(`/api/videos/${createdVideo1.id}`)
      .expect(HTTPStatuses.SUCCESS200, createdVideo1)   
      
    await request(app)
      .get('/api/videos')
      .expect(HTTPStatuses.SUCCESS200, [createdVideo1])
  })

  let createdVideo2: VideoType
  it('should create video 2 with correct input data', async () => {
    const createdVideoResponce = await request(app)
      .post('/api/videos')
      .send({
        title: 'Видео 2',
        author: 'Автор 2',
        availableResolutions: null,
      })
      .expect(HTTPStatuses.CREATED201)

      createdVideo2 = createdVideoResponce.body

    expect(createdVideo2).toEqual({
      id: expect.any(Number),
      title: 'Видео 2',
      author: 'Автор 2',
      availableResolutions: null,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
    })

    await request(app)
      .get(`/api/videos/${createdVideo2.id}`)
      .expect(HTTPStatuses.SUCCESS200, createdVideo2)

    await request(app)
    .get('/api/videos')
    .expect(HTTPStatuses.SUCCESS200, [createdVideo1, createdVideo2])
  })

  it('should not update with incorrect input data', async () => {
    const publicationDate = moment().format()
      
      await request(app)
      .put(`/api/videos/${createdVideo1.id}`)
      .send({
        title: '',
        author: '',
        availableResolutions: [],
        canBeDownloaded: true,
        minAgeRestriction: 1,
        publicationDate: publicationDate,
      })
      .expect(HTTPStatuses.BADREQUEST400, [
        errorsValidator.titleError,
        errorsValidator.authorError,
        errorsValidator.availableResolutionsError,
      ])

      await request(app)
      .put(`/api/videos/${createdVideo1.id}`)
      .send({
        title: 'title будет больше 40 символов'.repeat(3),
        author: 'Автор 1',
        availableResolutions: [AvailableResolutions.P144],
        canBeDownloaded: true,
        minAgeRestriction: 0,
        publicationDate: publicationDate,
      })
      .expect(HTTPStatuses.BADREQUEST400, [
        errorsValidator.titleError,
        errorsValidator.minAgeRestrictionError,
      ])

      await request(app)
      .put(`/api/videos/${createdVideo1.id}`)
      .send({
        title: 'Видео 1',
        author: 'author будет больше 20 символов'.repeat(2),
        availableResolutions: [AvailableResolutions.P144],
        canBeDownloaded: 20,
        minAgeRestriction: 20,
        publicationDate: publicationDate,
      })
      .expect(HTTPStatuses.BADREQUEST400, [
        errorsValidator.authorError,
        errorsValidator.canBeDownloadedError,
        errorsValidator.minAgeRestrictionError,
      ])

      await request(app)
      .put('/api/videos/' + -100)
      .send({
        title: 'Видео 1 обновлен',
        author: 'Автор 1 обновлен',
        availableResolutions: [AvailableResolutions.P144, AvailableResolutions.P1440],
        canBeDownloaded: true,
        minAgeRestriction: 10,
        publicationDate: publicationDate,
      })
      .expect(HTTPStatuses.NOTFOUND404)

      await request(app)
      .get(`/api/videos/${createdVideo1.id}`)
      .expect(HTTPStatuses.SUCCESS200, createdVideo1)   
  })

  it('should update with correct input data', async () => {
    const publicationDate = new Date().toISOString()
      await request(app)
      .put(`/api/videos/${createdVideo1.id}`)
      .send({
        title: 'Видео 1 обновлен',
        author: 'Автор 1 обновлен',
        availableResolutions: [AvailableResolutions.P144, AvailableResolutions.P1440],
        canBeDownloaded: true,
        minAgeRestriction: 10,
        publicationDate: publicationDate,
      })
      .expect(HTTPStatuses.NOCONTENT204)

      await request(app)
      .get(`/api/videos/${createdVideo1.id}`)
      .expect(HTTPStatuses.SUCCESS200, {
        ...createdVideo1,
        title: 'Видео 1 обновлен',
        author: 'Автор 1 обновлен',
        availableResolutions: [AvailableResolutions.P144, AvailableResolutions.P1440],
        canBeDownloaded: true,
        minAgeRestriction: 10,
        publicationDate: publicationDate,
      })

      await request(app)
      .get(`/api/videos/${createdVideo2.id}`)
      .expect(HTTPStatuses.SUCCESS200, createdVideo2)
  })

  it('should delete all videos', async () => {
    await request(app)
      .delete('/api/videos/' + -100)
      .expect(HTTPStatuses.NOTFOUND404)

    await request(app)
      .delete(`/api/videos/${createdVideo1.id}`)
      .expect(HTTPStatuses.NOCONTENT204)

    await request(app)
      .delete(`/api/videos/${createdVideo2.id}`)
      .expect(HTTPStatuses.NOCONTENT204)

    await request(app)
      .get('/api/videos')
      .expect(HTTPStatuses.SUCCESS200, [])
  })
})
