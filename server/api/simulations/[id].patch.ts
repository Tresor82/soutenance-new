import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = session.user?.id
  const id = getRouterParam(event, 'id')
  const body = await readBody<{ currentStep?: number; status?: string }>(event)

  if (!userId || !id) {
    throw createError({ statusCode: 401, statusMessage: 'Session invalide' })
  }
  if (body.currentStep !== undefined && (!Number.isInteger(body.currentStep) || body.currentStep < 1 || body.currentStep > 4)) {
    throw createError({ statusCode: 400, statusMessage: 'Etape invalide' })
  }
  if (body.status !== undefined && !['in_progress', 'completed'].includes(body.status)) {
    throw createError({ statusCode: 400, statusMessage: 'Statut invalide' })
  }

  const existing = await prisma.simulation.findFirst({ where: { id, userId } })
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Simulation introuvable' })
  }

  return prisma.simulation.update({
    where: { id },
    data: {
      ...(body.currentStep !== undefined ? { currentStep: body.currentStep } : {}),
      ...(body.status ? { status: body.status, ...(body.status === 'completed' ? { completedAt: new Date() } : {}) } : {}),
    },
  })
})