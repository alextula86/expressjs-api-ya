export const settings = {
  MONGO_URI: process.env.JWT_SECRET || 'mongodb://localhost:27017',
  JWT_SECRET: process.env.JWT_SECRET || '123',
}
