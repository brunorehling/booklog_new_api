import { PrismaClient } from '../../generated/prisma/client.js'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const adapter = new PrismaMariaDb({
  host: 'localhost',
  port: 3306,
  user: 'segredo ultra secreto',
  password: 'segredo ultra secreto',
  database: 'segredo ultra secreto'
})

export const prisma = new PrismaClient({ adapter })