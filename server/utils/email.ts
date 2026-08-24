import { Resend } from 'resend'

export async function sendEvaluationEmail(to: string, name: string, score: number | null) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return false
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Votre évaluation Soutenance New est disponible',
    text: `Bonjour ${name}, votre évaluation est disponible${score === null ? '.' : ` avec une note de ${score}/20.`}`,
  })
  return true
}