# Taches du projet - Soutenance New

Ce fichier reprend les actions identifiees dans l'audit du projet. Il doit etre verifie avec l'etat reel du code avant chaque mise a jour.

## Priorite immediate

- [ ] Confirmer que le dernier `git push` est termine et que le commit est present sur GitHub.
- [ ] Ajouter `DATABASE_URL` et `NUXT_SESSION_PASSWORD` dans les variables d'environnement Vercel.
- [ ] Red deployer l'application apres l'ajout des variables.
- [x] Installer `@prisma/adapter-pg`, `pg`, `bcryptjs` et `@types/pg`.
- [x] Creer `server/utils/prisma.ts` avec l'adapter PostgreSQL requis par Prisma 7.

## Backend et authentification

- [x] Creer la route d'inscription `server/api/auth/register.post.ts`.
- [x] Valider l'email, le mot de passe, le nom, le prenom et le role.
- [x] Hacher les mots de passe avec bcryptjs.
- [x] Creer la route de connexion `server/api/auth/login.post.ts`.
- [x] Creer la route de deconnexion `server/api/auth/logout.post.ts`.
- [x] Exposer la session courante via `server/api/auth/me.get.ts`.
- [x] Proteger les routes de simulation avec `requireUserSession`.
- [x] Appliquer les permissions selon les roles `etudiant` et `maitre_memoire`.

## Interface et parcours

- [x] Construire la page d'accueil.
- [x] Construire les formulaires d'inscription et de connexion.
- [x] Construire le dashboard etudiant et l'historique des simulations.
- [ ] Construire le dashboard maitre de memoire et l'espace d'evaluation.
- [x] Construire la page de simulation avec timer guide en quatre etapes.
- [x] Ajouter l'enregistrement webcam avec la MediaRecorder API.
- [x] Ajouter la soumission de la video vers Vercel Blob.
- [ ] Ajouter un layout adapte au role connecte.

## Fonctionnalites et exploitation

- [ ] Choisir un stockage de videos compatible avec Vercel (Vercel Blob, Cloudinary, S3 ou equivalent).
- [ ] Ajouter les notifications par email.
- [x] Ajouter les commentaires et evaluations du maitre de memoire.
- [x] Ajouter l'historique et les statistiques de progression.
- [x] Mettre en place une route d'administration protegee.
- [ ] Uniformiser la gestion des erreurs des routes API.
- [ ] Verifier le fonctionnement en production.
- [ ] Documenter le flux `main` vers Vercel et envisager une branche `dev`.

## Points de securite

- [ ] Maintenir `.env` hors du depot Git.
- [ ] Ne jamais publier la valeur complete de `DATABASE_URL`.
- [ ] Verifier les controles d'autorisation, et pas seulement l'authentification.

## Source

Liste initialement extraite de `docs/audit-soutenance-new.md`, datee du 20 aout 2026. Toute nouvelle exigence doit etre justifiee par le document projet ou par le code existant.
