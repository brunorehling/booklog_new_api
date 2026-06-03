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

  const media = await prisma.review.aggregate({
    where: { BookId: review.BookId },
    _avg: { rate: true }
  })

  await prisma.book.update({
    where: { id: Number(review.BookId) },
    data: { rating: media._avg.rate ?? 0 }
  })
    res.status(201).json(review)
  })

router.put('/:id', async (req: Request, res: Response) => {
  const { title, rate, content, UserId, BookId } = req.body
  const review = await prisma.review.update({
    where: { id: Number(req.params.id) },
    data: { title, rate, content, UserId, BookId }
  })
  
  const media = await prisma.review.aggregate({
    where: { BookId: review.BookId },
    _avg: { rate: true }
  })

  await prisma.book.update({
    where: { id: Number(review.BookId) },
    data: { rating: media._avg.rate ?? 0 }
  })
    res.status(201).json(review)
  })

router.delete('/:id', async (req: Request, res: Response) => {
  const review = await prisma.review.delete({ 
    where: { id: Number(req.params.id) } 
  })

  const media = await prisma.review.aggregate({
    where: { BookId: review.BookId },
    _avg: { rate: true }
  })

  await prisma.book.update({
    where: { id: review.BookId },
    data: { rating: media._avg.rate ?? 0 }
  })

  res.status(204).send()
})


//Rotas para os comentários

router.get("/:id/comentarios", async (req, res) => {
  const ReviewId = Number(req.params.id)
  if (isNaN(ReviewId)) return res.status(400).json({ error: "ID inválido" })

  try {
    const comentarios = await prisma.comment.findMany({
      where: { ReviewId },
      include: { 
        author: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { likes: "desc" },
    })
    res.status(200).json(comentarios)
  } catch (error) {
    console.error('Erro ao buscar comentários:', error)
    res.status(500).json({ error: "Erro ao buscar comentários", details: error })
  }
})

router.post("/:id/comentarios", async (req, res) => {
  const ReviewId = Number(req.params.id)
  if (isNaN(ReviewId)) return res.status(400).json({ error: "ID inválido" })

  const { content, UserId } = req.body

  try{
   const comentario = await prisma.comment.create({
      data: { content, ReviewId, UserId },
      include: { 
        author: {
          select: {
            id: true,
            name: true
          }
        }
      },
    })
    res.status(201).json(comentario)
  } catch (error) {
    console.error('Erro ao criar comentário:', error)
    res.status(500).json({ error: "Erro ao criar comentário", details: error })
  }
})

router.patch('/:reviewId/comentarios/:id/like', async (req, res) => {
  const id = Number(req.params.id)

  const comentario = await prisma.comment.update({
    where: { id },
    data: { likes: { increment: 1 } }
  })

  res.status(201).json(comentario)
})

router.patch('/:reviewId/comentarios/:id/deslike', async (req, res) => {
  const id = Number(req.params.id)

  const comentario = await prisma.comment.update({
    where: { id },
    data: { deslikes: { increment: 1 } }
  })

  res.json(comentario)
})


export default router