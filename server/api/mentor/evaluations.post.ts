import { prisma } from '../../utils/prisma'
import { sendEvaluationEmail } from '../../utils/email'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  if (session.user?.role !== 'maitre_memoire') {
    throw createError({ statusCode: 403, statusMessage: 'Acces reserve aux maitres de memoire' })
  }

  const body = await readBody<{ simulationId?: string; score?: number; comment?: string }>(event)
  if (!body.simulationId || !body.comment?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Simulation et commentaire requis' })
  }
  if (body.score !== undefined && (!Number.isInteger(body.score) || body.score < 0 || body.score > 20)) {
    throw createError({ statusCode: 400, statusMessage: 'La note doit être comprise entre 0 et 20' })
  }

  const simulation = await prisma.simulation.findUnique({ where: { id: body.simulationId }, include: { user: true } })
  if (!simulation) throw createError({ statusCode: 404, statusMessage: 'Simulation introuvable' })

  const evaluation = await prisma.evaluation.upsert({
    where: { simulationId: body.simulationId },
    create: { simulationId: body.simulationId, mentorId: session.user.id, score: body.score, comment: body.comment.trim() },
    update: { mentorId: session.user.id, score: body.score, comment: body.comment.trim() },
  })
  await sendEvaluationEmail(simulation.user.email, simulation.user.prenom, evaluation.score)
  return evaluation
})