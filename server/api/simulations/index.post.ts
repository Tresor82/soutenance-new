import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = session.user?.id

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Session invalide' })
  }

  const body = await readBody<{ title?: string }>(event)
  const title = body.title?.trim() || 'Répétition de soutenance'

  if (title.length > 120) {
    throw createError({ statusCode: 400, statusMessage: 'Le titre est trop long' })
  }

  return prisma.simulation.create({
    data: { title, userId, startedAt: new Date(), status: 'in_progress' },
    select: {
      id: true, title: true, status: true, currentStep: true,
      durationSec: true, startedAt: true, completedAt: true, createdAt: true,
    },
  })
})