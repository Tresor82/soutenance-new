import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session.user?.role !== 'admin') throw createError({ statusCode: 403, statusMessage: 'Acces reserve aux administrateurs' })
  const [users, simulations, evaluations] = await Promise.all([
    prisma.user.count(), prisma.simulation.count(), prisma.evaluation.count(),
  ])
  return { users, simulations, evaluations }
})