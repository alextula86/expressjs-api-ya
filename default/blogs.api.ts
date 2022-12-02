import request from 'supertest'
import * as dotenv from 'dotenv'
dotenv.config()
import { app } from '../src'
import { BlogType, HTTPStatuses } from '../src/types'
import { blogErrorsValidator } from '../src/errors'

describe('/api/blogs',  () => {
  beforeAll(async () => {
    await request(app).delete('/api/testing/all-data')
  })

  it('should return status 200 and empty array', async () => {
    await request(app)
      .get('/api/blogs')
      .expect(HTTPStatuses.SUCCESS200, [])
  })

  it('should return status 404 for not existing blogs', async () => {
    await request(app)
      .get('/api/blogs/1')
      .expect(HTTPStatuses.NOTFOUND404)
  })

  it('should not be logged in', async () => {
    await request(app)
      .post('/api/blogs')
      .send({
        name: 'Блог 1',
        description: 'Очень хороший блог 1',
        websiteUrl: 'https://cont.ws/2425094',
      })
      .expect(HTTPStatuses.UNAUTHORIZED401)
  })

  it('should not create blog with incorrect input data', async () => {
    await request(app)
    .post('/api/blogs')
    .send({
      name: '',
      description: null,
      websiteUrl: '11111111',
    })
    .expect(HTTPStatuses.UNAUTHORIZED401)
    
    await request(app)
      .post('/api/blogs')
      .set('Authorization', `Basic ${Buffer.from(`${process.env.LOGIN}:${process.env.PASSWORD}`, 'utf8').toString('base64')}`)
      .send({
        name: '',
        description: null,
        websiteUrl: '11111111',
      })
      .expect(HTTPStatuses.BADREQUEST400, {
        errorsMessages: [
          blogErrorsValidator.nameError,
          blogErrorsValidator.descriptionError,
          blogErrorsValidator.websiteUrlError,
        ]
      })

    await request(app)
      .post('/api/blogs')
      .set('Authorization', `Basic ${Buffer.from(`${process.env.LOGIN}:${process.env.PASSWORD}`, 'utf8').toString('base64')}`)
      .send({
        name: 'name будет больше 15 символов'.repeat(2),
        description: 'description будет больше 500 символов'.repeat(20),
        websiteUrl: 'websiteUrl будет больше 500 символов'.repeat(5),
      })
      .expect(HTTPStatuses.BADREQUEST400, {
        errorsMessages: [
          blogErrorsValidator.nameError,
          blogErrorsValidator.descriptionError,
          blogErrorsValidator.websiteUrlError,
        ]
      })
      
      await request(app)
      .get('/api/blogs/1')
      .expect(HTTPStatuses.NOTFOUND404)
  })

  let createdBlog1: BlogType

  it('should create blog 1 with correct input data', async () => {
    const createdBlogResponce = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Basic ${Buffer.from(`${process.env.LOGIN}:${process.env.PASSWORD}`, 'utf8').toString('base64')}`)
      .send({
        name: 'Блог 1',
        description: 'Очень хороший блог 1',
        websiteUrl: 'https://cont.ws/2425094',
      })
      .expect(HTTPStatuses.CREATED201)

    createdBlog1 = createdBlogResponce.body

    expect(createdBlog1).toEqual({
      id: expect.any(String),
      name: 'Блог 1',
      description: 'Очень хороший блог 1',
      websiteUrl: 'https://cont.ws/2425094',
      createdAt: expect.any(String),
    })

    await request(app)
      .get(`/api/blogs/${createdBlog1.id}`)
      .expect(HTTPStatuses.SUCCESS200, createdBlog1)   
      
    await request(app)
      .get('/api/blogs')
      .expect(HTTPStatuses.SUCCESS200, [createdBlog1])
  })

  let createdBlog2: BlogType
  it('should create blog 2 with correct input data', async () => {
    const createdBlogResponce = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Basic ${Buffer.from(`${process.env.LOGIN}:${process.env.PASSWORD}`, 'utf8').toString('base64')}`)
      .send({
        name: 'Блог 2',
        description: 'Очень хороший блог 2',
        websiteUrl: 'https://cont.ws/2425095',
      })
      .expect(HTTPStatuses.CREATED201)

    createdBlog2 = createdBlogResponce.body

    expect(createdBlog2).toEqual({
      id: expect.any(String),
      name: 'Блог 2',
      description: 'Очень хороший блог 2',
      websiteUrl: 'https://cont.ws/2425095',
      createdAt: expect.any(String),
    })

    await request(app)
      .get(`/api/blogs/${createdBlog2.id}`)
      .expect(HTTPStatuses.SUCCESS200, createdBlog2)

    await request(app)
    .get('/api/blogs')
    .expect(HTTPStatuses.SUCCESS200, [createdBlog1, createdBlog2])
  })
  
  it('should not update blog 1 with incorrect input data', async () => {
    await request(app)
      .put(`/api/blogs/${createdBlog1.id}`)
      .send({
        name: '',
        description: '',
        websiteUrl: null,
      })
      .expect(HTTPStatuses.UNAUTHORIZED401)

    await request(app)
      .put(`/api/blogs/${createdBlog1.id}`)
      .set('Authorization', `Basic ${Buffer.from(`${process.env.LOGIN}:${process.env.PASSWORD}`, 'utf8').toString('base64')}`)
      .send({
        name: '',
        description: '',
        websiteUrl: null,
      })
      .expect(HTTPStatuses.BADREQUEST400, {
        errorsMessages: [
          blogErrorsValidator.nameError,
          blogErrorsValidator.descriptionError,
          blogErrorsValidator.websiteUrlError,
        ]
      })

    await request(app)
      .put(`/api/blogs/${createdBlog1.id}`)
      .set('Authorization', `Basic ${Buffer.from(`${process.env.LOGIN}:${process.env.PASSWORD}`, 'utf8').toString('base64')}`)
      .send({
        name: 'name будет больше 15 символов'.repeat(2),
        description: 'description будет больше 500 символов'.repeat(20),
        websiteUrl: 'websiteUrl будет больше 500 символов'.repeat(5),
      })
      .expect(HTTPStatuses.BADREQUEST400, {
        errorsMessages: [
          blogErrorsValidator.nameError,
          blogErrorsValidator.descriptionError,
          blogErrorsValidator.websiteUrlError,
        ] 
      })

    await request(app)
      .put('/api/blogs/' + -100)
      .set('Authorization', `Basic ${Buffer.from(`${process.env.LOGIN}:${process.env.PASSWORD}`, 'utf8').toString('base64')}`)
      .send({
        name: 'Блог 3',
        description: 'Очень хороший блог 3',
        websiteUrl: 'https://cont.ws/2425096',
      })
      .expect(HTTPStatuses.NOTFOUND404)

    await request(app)
      .get(`/api/blogs/${createdBlog1.id}`)
      .expect(HTTPStatuses.SUCCESS200, createdBlog1)   
  })

  it('should update blog 1 with correct input data', async () => {
    await request(app)
      .put(`/api/blogs/${createdBlog1.id}`)
      .set('Authorization', `Basic ${Buffer.from(`${process.env.LOGIN}:${process.env.PASSWORD}`, 'utf8').toString('base64')}`)
      .send({
        name: 'Блог 3',
        description: 'Очень хороший блог 3',
        websiteUrl: 'https://cont.ws/2425096',
      })
      .expect(HTTPStatuses.NOCONTENT204)

    await request(app)
      .get(`/api/blogs/${createdBlog1.id}`)
      .set('Authorization', `Basic ${Buffer.from(`${process.env.LOGIN}:${process.env.PASSWORD}`, 'utf8').toString('base64')}`)
      .expect(HTTPStatuses.SUCCESS200, {
        ...createdBlog1,
        name: 'Блог 3',
        description: 'Очень хороший блог 3',
        websiteUrl: 'https://cont.ws/2425096',
      })

    await request(app)
      .get(`/api/blogs/${createdBlog2.id}`)
      .expect(HTTPStatuses.SUCCESS200, createdBlog2)
  })

  it('should delete all blogs', async () => {
    await request(app)
      .delete('/api/blogs/' + -100)
      .expect(HTTPStatuses.UNAUTHORIZED401)

    await request(app)
      .delete('/api/blogs/' + -100)
      .set('Authorization', `Basic ${Buffer.from(`${process.env.LOGIN}:${process.env.PASSWORD}`, 'utf8').toString('base64')}`)
      .expect(HTTPStatuses.NOTFOUND404)

    await request(app)
      .delete(`/api/blogs/${createdBlog1.id}`)
      .set('Authorization', `Basic ${Buffer.from(`${process.env.LOGIN}:${process.env.PASSWORD}`, 'utf8').toString('base64')}`)
      .expect(HTTPStatuses.NOCONTENT204)

    await request(app)
      .delete(`/api/blogs/${createdBlog2.id}`)
      .set('Authorization', `Basic ${Buffer.from(`${process.env.LOGIN}:${process.env.PASSWORD}`, 'utf8').toString('base64')}`)
      .expect(HTTPStatuses.NOCONTENT204)

    await request(app)
      .get('/api/blogs')
      .expect(HTTPStatuses.SUCCESS200, [])
  })
})
