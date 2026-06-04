import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { tokenVerification } from '../middlewares/TokenVerification'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  const reviews = await prisma.review.findMany({
      include: {
        User: { select: { id: true, name: true } },
        Book: { select: { id: true, name: true, author: true } }
      }
  })
  res.json(reviews)
})

router.get('/:id', tokenVerification, async (req: Request, res: Response) => {
    const review = await prisma.review.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        User: { select: { id: true, name: true } },
        Book: { select: { id: true, name: true, author: true } }
      }
    })
    if (!review) return res.status(404).json({ message: 'Review não encontrada' })
    res.json(review)
  })

router.post('/', tokenVerification, async (req: Request, res: Response) => {
  const UserId = Number(req.loggedUserId)
  const { title, rate, content, BookId } = req.body

  try {
    const review = await prisma.review.create({
      data: { title, rate, content, UserId, BookId }
    })

    await atualizarRatingLivro(BookId)

    res.status(201).json(review)
  } catch (error) {
      console.error("ERRO:", error) // 
      res.status(500).json({ erro: "Erro ao criar review" })
}
})

router.put('/:id', tokenVerification, async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const loggedUserId = Number(req.loggedUserId)
  const { title, rate, content } = req.body

  try {
    const review = await prisma.review.findUnique({ where: { id } })

    if (!review) {
      res.status(404).json({ erro: "Review não encontrada" })
      return
    }

    if (review.UserId !== loggedUserId) {
      res.status(403).json({ erro: "Acesso negado" })
      return
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { title, rate, content }
    })

    await atualizarRatingLivro(review.BookId)

    res.json(updated)
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar review" })
  }
})

router.delete('/:id', tokenVerification, async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const loggedUserId = Number(req.loggedUserId)

  try {
    const review = await prisma.review.findUnique({ where: { id } })

    if (!review) {
      res.status(404).json({ erro: "Review não encontrada" })
      return
    }

    if (review.UserId !== loggedUserId) {
      res.status(403).json({ erro: "Acesso negado" })
      return
    }

    await prisma.review.delete({ where: { id } })
    await atualizarRatingLivro(review.BookId)

    res.status(204).send()
     } catch (error) {
    res.status(500).json({ erro: "Erro ao deletar review" })
  }
})

router.post('/:id/comentarios', tokenVerification, async (req: Request, res: Response) => {
  const ReviewId = Number(req.params.id)
  const UserId = Number(req.loggedUserId)
  const { content } = req.body

  try {
    const comentario = await prisma.comment.create({
      data: { content, ReviewId, UserId },
      include: {
        author: { select: { id: true, name: true } }
      }
    })
    res.status(201).json(comentario)
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar comentário" })
  }
})

router.post("/:id/comentarios", tokenVerification, async (req, res) => {
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

router.patch('/:reviewId/comentarios/:id/reacao', tokenVerification, async (req: Request, res: Response) => {
  const commentId = Number(req.params.id)
  const userId = Number(req.loggedUserId)
  const { type } = req.body 

  if (!['like', 'dislike'].includes(type)) {
    res.status(400).json({ erro: "Tipo inválido. Use 'like' ou 'dislike'" })
    return
  }

  try {
    const existing = await prisma.commentReaction.findUnique({
      where: { userId_commentId: { userId, commentId } }
    })

    if (existing) {
      if (existing.type === type) {
        await prisma.commentReaction.delete({ where: { id: existing.id } })
      } else {
        await prisma.commentReaction.update({
          where: { id: existing.id },
          data: { type }
        })
      }
    } else {
      await prisma.commentReaction.create({
        data: { userId, commentId, type }
      })
    }

    const reactions = await prisma.commentReaction.groupBy({
      by: ['type'],
      where: { commentId },
      _count: true
    })

    const likes    = reactions.find(r => r.type === 'like')?._count ?? 0
    const dislikes = reactions.find(r => r.type === 'dislike')?._count ?? 0

    res.json({ commentId, likes, dislikes })
  } catch (error) {
    res.status(500).json({ erro: "Erro ao registrar reação" })
  }
})

async function atualizarRatingLivro(BookId: number) {
  const media = await prisma.review.aggregate({
    where: { BookId },
    _avg: { rate: true }
  })

  await prisma.book.update({
    where: { id: BookId },
    data: { rating: media._avg.rate ?? 0 }
  })
}


export default router