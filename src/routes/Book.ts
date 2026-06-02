import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  const books = await prisma.book.findMany()
  res.json(books)
})

router.get('/:id', async (req : Request, res : Response) => {
    const book = await prisma.book.findUnique({
        where : {id: Number(req.params.id)}
    })
    if(!book){res.status(404).json({ message : "livro não encontrado"})}
    res.json(book)
})

router.post('/', async (req: Request, res: Response) => {
  const {name, description, author, rating} = req.body
  const book = await prisma.book.create({   
    data: {name, description, author, rating }
  })
  res.status(201).json(book)
})


export default router