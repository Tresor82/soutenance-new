import { compare } from 'bcryptjs'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event)
  const email = body.email?.trim().toLowerCase()
  const password = body.password ?? ''

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email et mot de passe requis' })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !(await compare(password, user.password))) {
    throw createError({ statusCode: 401, statusMessage: 'Email ou mot de passe incorrect' })
  }

  const safeUser = { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom, role: user.role }
  await setUserSession(event, { user: safeUser })
  return { user: safeUser }
})