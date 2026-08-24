import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = session.user?.id

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Session invalide' })
  }

  return prisma.simulation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, title: true, status: true, currentStep: true,
      durationSec: true, startedAt: true, completedAt: true, createdAt: true,
    },
  })
})