import 'dotenv/config'
import cors from 'cors'
import express, { Request, Response } from 'express'
import userRoutes from './routes/User.js'
import reviewsRoutes from './routes/Review.js'
import booksRoutes from './routes/Book.js'
import loginRoutes from './routes/Login.js'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.use('/users', userRoutes)
app.use('/users/login', loginRoutes)
app.use('/reviews', reviewsRoutes)
app.use('/books', booksRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('Olá, mundo!')
})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})