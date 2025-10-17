#!/bin/bash

echo "🚀 Installation de Competence Tester..."

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "✅ Node.js détecté: $(node --version)"

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Générer le client Prisma
echo "🔧 Génération du client Prisma..."
npx prisma generate

# Créer et migrer la base de données
echo "📄 Création de la base de données..."
npx prisma migrate dev --name init

# Seeder la base de données
echo "🌱 Ajout des données d'exemple..."
npx prisma db seed

echo "🎉 Installation terminée !"
echo ""
echo "Pour démarrer l'application :"
echo "  npm run dev"
echo ""
echo "L'application sera accessible sur http://localhost:3000"