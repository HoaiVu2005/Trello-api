import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from './environment'

let trelloDatabaseInstances = null

const mongoDBClientInstances = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})
export const CONNECT_DB = async() => {
  await mongoDBClientInstances.connect()
  trelloDatabaseInstances = mongoDBClientInstances.db(env.DATABASE_NAME)
}
export const GET_DB = () => {
  if (!trelloDatabaseInstances) throw new Error('Please connect to Database first!!!')
  return trelloDatabaseInstances
}