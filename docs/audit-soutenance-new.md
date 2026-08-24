# Audit du projet — Soutenance New

**Date de l'audit :** 20 août 2026
**Dépôt GitHub :** `Tresor82/soutenance-new`
**Déploiement :** Vercel (`soutenance-new.vercel.app`)

---

## 1. Contexte

Soutenance New est une reconstruction complète et indépendante de la plateforme **Soutenance+** (l'originale, en Django/Python, toujours en ligne sur `estha.pythonanywhere.com`). Les deux projets partagent le même objectif fonctionnel — permettre aux étudiants de s'entraîner à leur soutenance de mémoire — mais n'ont **aucun lien technique** entre eux.

### Stack technique

| Composant | Choix |
|---|---|
| Framework | Nuxt 4 (full-stack, avec Nitro) |
| UI | Vue.js 3 + Tailwind CSS v4 |
| Authentification | Nuxt Auth Utils (sessions par cookie) |
| Base de données | PostgreSQL hébergé sur Neon |
| ORM | Prisma 7 (avec `@prisma/adapter-pg`) |
| Hébergement | Vercel |
| Dépôt de code | GitHub — `Tresor82/soutenance-new` |

---

## 2. État actuel — ce qui est fait ✅

- [x] Projet Nuxt 4 initialisé (template `minimal`)
- [x] Tailwind CSS v4 installé et fonctionnel (`@tailwindcss/vite`, testé en local et en production)
- [x] Dépôt Git initialisé, poussé sur GitHub
- [x] Déploiement Vercel actif et fonctionnel (build Nuxt détecté automatiquement)
- [x] Node.js et npm mis à jour (Node 22.17.1, npm 11.19.0) pour résoudre un bug d'installation (`edgesOut`)
- [x] Module `nuxt-auth-utils` installé et ajouté à `nuxt.config.ts`
- [x] Variable `NUXT_SESSION_PASSWORD` générée et placée dans `.env` (en local)
- [x] Base de données PostgreSQL créée sur Neon (région Francfort)
- [x] Variable `DATABASE_URL` placée dans `.env` (en local)
- [x] Prisma 7 installé et initialisé (`prisma.config.ts`, `prisma/schema.prisma`)
- [x] Modèle `User` défini (`id`, `email`, `password`, `nom`, `prenom`, `role`, `createdAt`)
- [x] Première migration appliquée avec succès (`npx prisma migrate dev --name init`) — table `User` créée dans Neon
- [x] Dernier commit (`Add Prisma + Auth Utils setup`) poussé sur GitHub

---

## 3. En cours / à vérifier immédiatement ⚠️

- [ ] **Confirmer que le `git push` du dernier commit s'est bien terminé** (la sortie n'a pas été confirmée dans la conversation)
- [ ] **Ajouter les variables d'environnement sur Vercel** (`DATABASE_URL`, `NUXT_SESSION_PASSWORD`) — actuellement seulement présentes en local, donc le site en production plantera dès qu'il tentera d'utiliser la base de données ou les sessions
- [ ] **Redéployer manuellement sur Vercel** après ajout des variables (Vercel ne redéploie pas automatiquement suite à un simple ajout de variable)
- [ ] Installer les packages nécessaires à la connexion Prisma 7 + PostgreSQL côté application (pas seulement migration) :
  ```
  npm install @prisma/adapter-pg pg
  npm install --save-dev @types/pg
  ```
- [ ] Créer le fichier utilitaire d'initialisation Prisma dans l'app (`server/utils/prisma.ts`), avec l'adapter `pg` requis par Prisma 7

---

## 4. Tâches restantes — Backend / Auth

- [ ] Créer la route API d'inscription : `server/api/auth/register.post.ts`
  - Validation des champs (email, mot de passe, nom, prénom, rôle)
  - Hash du mot de passe (bcrypt ou argon2)
  - Création de l'utilisateur via Prisma
- [ ] Créer la route API de connexion : `server/api/auth/login.post.ts`
  - Vérification email/mot de passe
  - Création de la session via Nuxt Auth Utils (`setUserSession`)
- [ ] Créer la route de déconnexion : `server/api/auth/logout.post.ts`
- [ ] Middleware de protection des routes authentifiées (`server/middleware/` ou `definePageMeta({ middleware: 'auth' })`)
- [ ] Distinction des permissions selon le rôle (`etudiant` vs `maitre_memoire`)

---

## 5. Tâches restantes — Frontend / Pages

- [ ] Page d'accueil (landing page) présentant la plateforme
- [ ] Page d'inscription (formulaire avec sélection du rôle)
- [ ] Page de connexion
- [ ] Dashboard étudiant
  - Liste des simulations passées
  - Bouton pour démarrer une nouvelle simulation
- [ ] Dashboard maître de mémoire
  - Liste des soutenances à examiner
  - Espace de commentaire/évaluation
- [ ] Page de simulation avec :
  - [ ] Timer guidé (4 étapes, comme dans Soutenance+)
  - [ ] Enregistrement webcam (MediaRecorder API)
  - [ ] Soumission de la vidéo
- [ ] Layout général (navbar, footer) adapté au rôle connecté

---

## 6. Tâches restantes — Fonctionnalités avancées

- [ ] Stockage des vidéos de simulation (à définir : Vercel Blob, Cloudinary, S3, ou autre — SQLite/fichiers locaux à éviter à cause de l'environnement serverless de Vercel)
- [ ] Notifications par email (remplacer l'intégration Brevo utilisée dans Soutenance+, ou en garder le principe)
- [ ] Espace de commentaire du maître de mémoire sur chaque simulation
- [ ] Historique / statistiques de progression de l'étudiant

---

## 7. Tâches restantes — Sécurité & Configuration

- [ ] Vérifier que `.env` reste bien exclu du dépôt Git (déjà confirmé dans `.gitignore` ✅)
- [ ] Ne jamais republier la chaîne `DATABASE_URL` complète (mot de passe inclus) dans des conversations ou documents partagés
- [ ] Prévoir une route d'administration protégée (équivalent de l'URL cachée `/gestion-soutenance-x7k9/` utilisée dans Soutenance+)
- [ ] Mettre en place une gestion d'erreurs cohérente sur les routes API

---

## 8. Tâches restantes — Déploiement continu

- [ ] Vérifier le bon fonctionnement du site en production après ajout des variables d'environnement
- [ ] Mettre en place un flux de déploiement clair (push sur `main` → déploiement automatique Vercel)
- [ ] Envisager une branche de développement séparée si le projet grossit (`dev` → Preview Vercel, `main` → Production)

---

## 9. Document de référence du projet ⚠️

- [ ] Ajouter au dépôt le document projet ou le cahier des charges fonctionnel.
- [ ] Relire cet audit et `docs/taches-soutenance-new.md` à partir de ce document.
- [ ] Compléter les exigences, contraintes et critères d'acceptation qui ne sont pas encore couverts.

À la date de mise à jour, aucun document projet distinct n'est présent dans le dépôt. Le `README.md` contient encore le texte de démarrage Nuxt et ne peut donc pas servir de cahier des charges.

## 10. Prochaine étape recommandée

1. Confirmer le `git push`
2. Ajouter les variables d'environnement sur Vercel + redéployer
3. Installer `@prisma/adapter-pg` et `pg`
4. Créer `server/utils/prisma.ts`
5. Écrire la route d'inscription (`register.post.ts`) et tester avec un premier compte
6. Écrire la route de connexion (`login.post.ts`)
7. Construire les pages d'inscription/connexion correspondantes
