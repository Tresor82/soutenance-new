import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session.user?.role !== 'maitre_memoire') {
    throw createError({ statusCode: 403, statusMessage: 'Acces reserve aux maitres de memoire' })
  }

  return prisma.simulation.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, nom: true, prenom: true, email: true } },
      evaluation: true,
    },
  })
})