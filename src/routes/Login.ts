
import jwt from "jsonwebtoken"
import { prisma } from '../lib/prisma'
import { Router } from "express"
import bcrypt from 'bcrypt'

const router = Router()

router.post("/", async (req, res) => {
  const { email, senha } = req.body

  const DefaultLog = "Login ou senha incorretos"

  if (!email || !senha) {
    res.status(400).json({ erro: DefaultLog })
    return
  }

  try {
    const user = await prisma.user.findFirst({
      where: { email }
    })

    if (user == null) {
      res.status(400).json({ erro: DefaultLog })
      return
    }

    console.log(user.senha)
    console.log(bcrypt.compareSync(senha, user.senha)) 

    if (bcrypt.compareSync(senha, user.senha)) {
      const token = jwt.sign({
        loggedUserId: user.id,
        loggedUserName: user.email
      },
        process.env.JWT_KEY as string,
        { expiresIn: "1h" }
      )

      res.status(200).json({
        id: user.id,
        email: user.email,
        token
      })
    } else {
      res.status(400).json({ erro: DefaultLog })
    }
  } catch (error) {
    console.error("ERRO NO LOGIN:", error) // <-- adiciona isso
    res.status(400).json(error)
  }
})

export default router