## Comandos iniciales

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Documentacion
```bash

# Cosas a instalar
npm install prisma @prisma/client
npm install decimal.js
npm i zod
npm install tsx --save-dev

# Cosas a instalar
npm install tailwindcss @tailwindcss/postcss postcss
npm install next-themes
npm install gsap
npm install react-hot-toast


# Para prisma
npx prisma generate
npx prisma db push
npx prisma db seed

#Cosas a instalar Neon
npm install pg

```

## Faker en la BD
¿Como acceder a el menu de la BD?
```bash
npx prisma studio
```
Generador de datos falsos
[https://fakerjs.dev/](https://fakerjs.dev/) 


```
Comandos Utiles .Dev
rafce 



# 1. Resetea todo al último commit remoto, borrando cambios locales
git reset --hard HEAD

# 2. Limpia archivos no rastreados (como archivos nuevos o temporales)
git clean -fd

# 3. Asegúrate de estar en la rama correcta (por ejemplo, 'main')
git checkout my-ramita

# 4. Trae y fusiona los últimos cambios del repositorio remoto
git pull origin my-ramita