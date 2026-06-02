import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

router.get('/:id', async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) }
  })
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' })
  res.json(user)
})

router.get('/:id/reviews', async (req: Request, res: Response) => {
  const userReviews = await prisma.review.findMany({
    where: { UserId: Number(req.params.id) }
  })
  if (!userReviews) return res.status(404).json({ message: 'Usuário não encontrado' })
  res.json(userReviews)
})

router.post('/', async (req: Request, res: Response) => {
  const { email, senha, name, description } = req.body
  const user = await prisma.user.create({
    data: { email, senha, name, description }
  })
  res.status(201).json(user)
})

router.put('/:id', async (req: Request, res: Response) => {
  const { email, senha, name, description } = req.body
  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: { email, senha, name, description }
  })
  res.json(user)
})

router.delete('/:id', async (req: Request, res: Response) => {
  await prisma.user.delete({ where: { id: Number(req.params.id) } })
  res.status(204).send()
})

export default router