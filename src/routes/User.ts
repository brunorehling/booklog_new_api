import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import bcrypt from "bcrypt"
import { z } from "zod"
import { tokenVerification } from '../middlewares/TokenVerification'

const router = Router()

export const userSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(45),
  email: z.string().min(1, "Email é obrigatório").max(45),
  senha: z.string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(60, "Senha muito longa"),
  description: z.string().max(300),
})

function ValidatePassword(senha: string) {
  const logs: string[] = []

  if (senha.length < 8) {
    logs.push("Senha deve possuir no mínimo 8 caracteres")
  }

  let smalls = 0
  let bigs = 0
  let numbers = 0
  let symbols = 0

  for (const letra of senha) {
    if (/[a-z]/.test(letra)) smalls++
    else if (/[A-Z]/.test(letra)) bigs++
    else if (/[0-9]/.test(letra)) numbers++
    else symbols++
  }

  if (smalls === 0) logs.push("Senha deve possuir letra(s) minúscula(s)")
  if (bigs === 0) logs.push("Senha deve possuir letra(s) maiúscula(s)")
  if (numbers === 0) logs.push("Senha deve possuir número(s)")
  if (symbols === 0) logs.push("Senha deve possuir símbolo(s)")

  return logs
}

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

router.post("/", async (req, res) => {
  const validate = userSchema.safeParse(req.body)
  if (!validate.success) {
    return res.status(400).json({ error: validate.error.flatten() })
  }

  const errosSenha = ValidatePassword(validate.data.senha)
  if (errosSenha.length > 0) {
    return res.status(400).json({ error: errosSenha.join("; ") })
  }

  const salt = bcrypt.genSaltSync(12)
  const hash = bcrypt.hashSync(validate.data.senha, salt)

  const { name, email, description } = validate.data

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        senha: hash,
        description
      },
      select: {
        id: true,
        name: true,
        email: true,
        CreatedAt: true,
        UpdatedAt: true,
      },
    })
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário", details: error })
  }
})


router.put('/:id', tokenVerification, async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const loggedUserId = Number(req.loggedUserId)

  if (id !== loggedUserId) {
    res.status(403).json({ erro: "Acesso negado" })
    return
  }

  const { email, senha, name, description } = req.body

  try {
    const data: any = { email, name, description }

    if (senha) {
      data.senha = await bcrypt.hash(senha, 10)
    }

    const user = await prisma.user.update({
      where: { id },
      data
    })

    res.json(user)
  } catch (error) {
    res.status(400).json({ erro: "Erro ao atualizar usuário" })
  }
})

router.delete('/:id', tokenVerification, async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const loggedUserId = Number(req.loggedUserId)

  if (id !== loggedUserId) {
    res.status(403).json({ erro: "Acesso negado" })
    return
  }

  try {

    const user = await prisma.user.delete({
      where: { id }
    })

    res.json(user)
  } catch (error) {
    res.status(400).json({ erro: "Erro ao deletar usuário" })
  }
})

export default router