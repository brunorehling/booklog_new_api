import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from 'express'

type TokenType = {
  loggedUserId: number
  loggedUserName: string
}

// Acrescenta na interface Request (de forma global) os 2 novos atributos (TypeScript)
declare global {
  namespace Express {
    interface Request {
      loggedUserId?: string
      loggedUserName?: string
    }
  }
}

export function tokenVerification(req: Request | any, res: Response, next: NextFunction) {
  const { authorization } = req.headers

  if (!authorization) {
    res.status(401).json({ error: "Token não informado" })
    return
  }

  const token = authorization.split(" ")[1]

  try {
    const decode = jwt.verify(token, process.env.JWT_KEY as string)
    const { loggedUserId, loggedUserName } = decode as TokenType

    req.loggedUserId    = loggedUserId
    req.loggedUserName  = loggedUserName

    next()
  } catch (error) {
    res.status(401).json({ error: "Token inválido" })
  }
}