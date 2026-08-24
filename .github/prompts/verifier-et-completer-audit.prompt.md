---
name: verifier-et-completer-audit
description: Verifier l'audit et les taches de Soutenance New, puis completer l'audit a partir du document projet
---

Tu dois auditer la documentation de ce projet avec rigueur.

1. Lis `docs/audit-soutenance-new.md` et `docs/taches-soutenance-new.md`.
2. Verifie chaque affirmation en la comparant au code, a `package.json`, au schema Prisma, aux migrations et a la configuration du projet.
3. Signale les incoherences, les taches deja realisees, les taches obsoletes et les omissions. Ne presente jamais une supposition comme un fait.
4. Cherche ensuite le document de reference du projet dans le depot, notamment les fichiers Markdown, texte, PDF ou bureautiques. Ignore les dossiers de dependances, les fichiers de skills et les fichiers generes. Le `README.md` ne doit etre considere comme document projet que s'il contient effectivement les exigences fonctionnelles.
5. Si un document projet est trouve, lis-le integralement et compare ses exigences a l'audit et au fichier de taches. Ajoute dans `docs/audit-soutenance-new.md` les exigences manquantes, les contraintes et les criteres d'acceptation utiles. Mets aussi `docs/taches-soutenance-new.md` a jour avec les actions correspondantes.
6. Si aucun document projet n'est trouve, indique-le clairement dans la section de suivi de l'audit et n'invente pas d'exigences. Mentionne les documents attendus ou demande leur ajout au depot.
7. Conserve les informations exactes deja presentes, garde les cases a cocher, et ajoute une date de mise a jour.
8. Termine par un court compte rendu: fichiers examines, incoherences trouvees, ajouts effectues et points restant a confirmer.

Tu peux modifier uniquement les deux fichiers dans `docs/`, sauf si une correction de documentation voisine est strictement necessaire. Ne modifie pas le code applicatif pendant cette verification.
