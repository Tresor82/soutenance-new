# Soutenance New

Plateforme Nuxt permettant aux étudiants de répéter leur soutenance et aux maîtres de mémoire de suivre les simulations.

## Stack

- Nuxt 4, Vue 3 et Tailwind CSS v4
- Prisma 7 avec PostgreSQL
- Nuxt Auth Utils pour les sessions par cookie
- bcryptjs pour le hachage des mots de passe

## Installation locale

```bash
npm install
npx prisma generate
npm run dev
```

Application locale : http://localhost:3000

## Variables d'environnement

Créer un fichier `.env` local contenant `DATABASE_URL` et `NUXT_SESSION_PASSWORD` (32 caractères minimum). Ne jamais publier ces valeurs.

## Base de données

Après avoir configuré `DATABASE_URL`, appliquer les migrations avec `npx prisma migrate dev`.

## Fonctionnalités disponibles

- Inscription, connexion et déconnexion
- Rôles étudiant et maître de mémoire
- Simulations de deux minutes en quatre étapes
- Historique et statistiques étudiant
- Consultation des simulations par le maître de mémoire
- Notes et commentaires sur les simulations

## À configurer

- Enregistrement webcam et stockage vidéo compatible Vercel
- Notifications email
- Variables d'environnement et redéploiement Vercel

Le choix du fournisseur vidéo et email est nécessaire avant d’ajouter leurs clés.
