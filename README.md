# Competence Tester 🚀

Base Next.js 15 + TypeScript pour évaluer des compétences (électricité, informatique), avec Prisma/SQLite, Dashboard, et modales d’édition.

## 📋 Prérequis

- Node.js 18+
- npm (ou pnpm/yarn)
- SQLite (embarqué via Prisma)

## 🛠️ Installation rapide

### Windows

```bash
install.bat
```

### Linux/macOS

```bash
chmod +x install.sh
./install.sh
```

## Installation manuelle

1. Dépendances

```bash
npm install
```

1. Variables d’environnement (`.env` à la racine)

```env
DATABASE_URL="file:./dev.db"
```

1. Prisma (génération + migrations) et seed (optionnel)

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed   # si disponible
```

1. Lancer le serveur

```bash
npm run dev
```

Ouvrir <http://localhost:3000>

## 🗂️ Structure principale

```text
competence-tester/
├── README.md
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── .env (local)
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── lib/
│   └── prisma.ts
├── components/
│   └── DashboardTable.tsx
└── app/
    ├── globals.css
    ├── layout.tsx
    ├── page.tsx
    ├── dashboard/
    │   ├── page.tsx
    │   └── DashboardClient.tsx
    ├── admin/
    │   ├── page.tsx
    │   └── add-question/page.tsx
    ├── test/
    │   └── nouveau/page.tsx
    └── api/
        ├── questions/
        │   ├── route.ts
        │   └── [id]/route.ts
        └── results/
            ├── route.ts
            └── [id]/route.ts
```

## ✨ Fonctionnalités clés

- Dashboard (/dashboard)
  - Derniers résultats: modification/suppression via modale (candidat, catégorie, score, total)
  - Questions récentes: modification/suppression via modale (intitulé, etc.)
- Test (/test/nouveau?domain=electricite)
  - Modale d’informations candidat (prénom, identifiant)
  - Chargement des questions par domaine (category) via API
  - Rendu des options, barre de progression, nom du candidat, bouton pour arrêter et revenir au dashboard
- Admin
  - Ajout de questions (/admin/add-question)
  - Liste et gestion des questions (/admin)

## 🧩 API (App Router)

- Questions
  - GET `/api/questions?category=&limit=`
  - POST `/api/questions`
  - DELETE `/api/questions?id=` ou DELETE `/api/questions/[id]`
  - PATCH `/api/questions/[id]`
- Résultats
  - GET `/api/results?category=&limit=`
  - POST `/api/results`
  - DELETE `/api/results?id=` ou DELETE `/api/results/[id]`
  - PATCH `/api/results/[id]`

Notes Prisma/SQLite:

- Le champ `options` des questions est stocké en JSON (string) côté DB ; il est parsé côté UI.
- Le `percentage` d’un résultat est recalculé côté API si `score` ou `total` changent.

## 🔧 Technologies

- Next.js 15 (App Router, Server/Client Components)
- TypeScript
- Prisma + SQLite
- Tailwind CSS

## 🧪 Essayer rapidement

```bash
npm run dev
```

- Dashboard: <http://localhost:3000/dashboard>
- Nouveau test: <http://localhost:3000/test/nouveau?domain=electricite>
- Admin: <http://localhost:3000/admin> et <http://localhost:3000/admin/add-question>

## 📝 Divers

- next.config.js est minimal (suppression de l’option expérimentale `appDir` non supportée en Next 15).

---

© 2025 WeBelec
