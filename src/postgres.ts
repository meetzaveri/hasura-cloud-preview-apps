import {Client} from 'pg'
import {PGClient} from './types'

export const dropAndCreateDb = async (dbName: string, pgClient: PGClient) => {
  try {
    pgClient.connect()
    await pgClient.query(`
			DROP DATABASE IF EXISTS "${dbName}";
		`)
    await pgClient.query(`
			CREATE DATABASE "${dbName}";
		`)
  } catch (e) {
    throw e
  } finally {
    pgClient.end()
  }
}

export const dropDB = async (dbName: string, pgClient: PGClient) => {
  try {
    pgClient.connect()
    await pgClient.query(`
			DROP DATABASE IF EXISTS "${dbName}";
		`)
  } catch (e) {
    throw e
  } finally {
    pgClient.end()
  }
}

export const changeDbInPgString = (baseString: string, dbName: string) => {
  const urlObj = new URL(
    baseString.includes('?sslmode=require')
      ? baseString.replace('?sslmode=require', '')
      : baseString
  )
  urlObj.pathname = dbName
  return urlObj.toString()
}

export const createEphemeralDb = async (
  connectionString: string,
  dbName: string
) => {
  const connectionParams = connectionString.includes('?sslmode=require')
    ? {
        connectionString: connectionString.replace('?sslmode=require', ''),
        ssl: {
          rejectUnauthorized: false
        }
      }
    : {connectionString}

  const pgClient = new Client(connectionParams)

  try {
    await dropAndCreateDb(dbName, pgClient)
  } catch (e) {
    throw e
  }
}

export const dropEphemeralDb = async (
  connectionString: string,
  dbName: string
) => {
  const pgClient = new Client({
    connectionString
  })
  try {
    await dropDB(dbName, pgClient)
  } catch (e) {
    throw e
  }
}
