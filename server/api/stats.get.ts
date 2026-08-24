import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = session.user?.id
  if (!userId) throw createError({ statusCode: 401, statusMessage: 'Session invalide' })

  const [total, completed, evaluations] = await Promise.all([
    prisma.simulation.count({ where: { userId } }),
    prisma.simulation.count({ where: { userId, status: 'completed' } }),
    prisma.evaluation.findMany({ where: { simulation: { userId }, score: { not: null } }, select: { score: true } }),
  ])
  const scores = evaluations.flatMap((item) => item.score === null ? [] : [item.score])
  return { total, completed, averageScore: scores.length ? Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 10) / 10 : null }
})