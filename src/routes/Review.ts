import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  const reviews = await prisma.review.findMany()
  res.json(reviews)
})

router.get('/:id', async (req: Request, res: Response) => {
    const review = await prisma.review.findUnique({
      where: { id: Number(req.params.id) }
    })
    if (!review) return res.status(404).json({ message: 'Review não encontrada' })
    res.json(review)
  })

router.post('/', async (req: Request, res: Response) => {
  const {title, rate, content, UserId, BookId } = req.body
  const review = await prisma.review.create({   
    data: {title, rate, content, UserId, BookId }
  })
  res.status(201).json(review)
})

router.put('/:id', async (req: Request, res: Response) => {
  const { title, rate, content, UserId, BookId } = req.body
  const review = await prisma.review.update({
    where: { id: Number(req.params.id) },
    data: { title, rate, content, UserId, BookId }
  })
  res.json(review)
})

router.delete('/:id', async (req: Request, res: Response) => {
  await prisma.review.delete({ where: { id: Number(req.params.id) } })
  res.status(204).send()
})

export default router