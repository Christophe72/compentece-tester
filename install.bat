@echo off
echo 🚀 Installation de Competence Tester...

REM Vérifier que Node.js est installé
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js n'est pas installé. Veuillez l'installer d'abord.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js détecté: %NODE_VERSION%

REM Installer les dépendances
echo 📦 Installation des dépendances...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur lors de l'installation des dépendances
    pause
    exit /b 1
)

REM Générer le client Prisma
echo 🔧 Génération du client Prisma...
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur lors de la génération du client Prisma
    pause
    exit /b 1
)

REM Créer et migrer la base de données
echo 📄 Création de la base de données...
call npx prisma migrate dev --name init
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erreur lors de la migration de la base de données
    pause
    exit /b 1
)

REM Seeder la base de données
echo 🌱 Ajout des données d'exemple...
call npx prisma db seed
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️ Attention: Erreur lors du seeding (optionnel)
)

echo.
echo 🎉 Installation terminée !
echo.
echo Pour démarrer l'application :
echo   npm run dev
echo.
echo L'application sera accessible sur http://localhost:3000
echo.
pause