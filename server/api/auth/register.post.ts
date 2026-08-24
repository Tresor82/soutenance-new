import { hash } from 'bcryptjs'
import { prisma } from '../../utils/prisma'

const roles = ['etudiant', 'maitre_memoire'] as const

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    email?: string
    password?: string
    nom?: string
    prenom?: string
    role?: string
  }>(event)

  const email = body.email?.trim().toLowerCase()
  const password = body.password ?? ''
  const nom = body.nom?.trim()
  const prenom = body.prenom?.trim()
  const role = body.role ?? 'etudiant'

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Adresse email invalide' })
  }
  if (password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Le mot de passe doit contenir au moins 8 caracteres' })
  }
  if (!nom || !prenom || nom.length > 80 || prenom.length > 80) {
    throw createError({ statusCode: 400, statusMessage: 'Le nom et le prenom sont obligatoires' })
  }
  if (!roles.includes(role as (typeof roles)[number])) {
    throw createError({ statusCode: 400, statusMessage: 'Role invalide' })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw createError({ statusCode: 409, statusMessage: 'Cette adresse email est deja utilisee' })
  }

  const user = await prisma.user.create({
    data: {
      email,
      password: await hash(password, 12),
      nom,
      prenom,
      role,
    },
    select: { id: true, email: true, nom: true, prenom: true, role: true },
  })

  await setUserSession(event, { user })
  return { user }
})