import { put } from '@vercel/blob'
import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = session.user?.id
  const id = getRouterParam(event, 'id')
  if (!userId || !id) throw createError({ statusCode: 401, statusMessage: 'Session invalide' })
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw createError({ statusCode: 503, statusMessage: 'Stockage vidéo non configuré' })

  const simulation = await prisma.simulation.findFirst({ where: { id, userId } })
  if (!simulation) throw createError({ statusCode: 404, statusMessage: 'Simulation introuvable' })
  const parts = await readMultipartFormData(event)
  const video = parts?.find((part) => part.name === 'video')
  if (!video?.data || !video.type?.startsWith('video/')) throw createError({ statusCode: 400, statusMessage: 'Fichier vidéo requis' })

  const blob = await put(`simulations/${id}.webm`, video.data, { access: 'public', contentType: video.type, addRandomSuffix: false })
  await prisma.simulation.update({ where: { id }, data: { videoUrl: blob.url } })
  return { url: blob.url }
})