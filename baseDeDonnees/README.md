Pour utiliser correctement l'application, vous aurez besoin d'une base de donnée dans votre environement local.

Pour la mettre en place automatiquement, placez-vous dans ce dossier avec un terminal et faites :
docker compose up -d

Ensuites revenez à la racine et faites :
npx prisma migrate dev
Pour générer les tables avec Prisma

Accès PhpMyAdmin :
http://localhost:8181/
