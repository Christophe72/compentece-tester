import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleQuestions = [
  // Questions d'électricité
  {
    category: "electricite",
    question: "Quelle est l'unité de mesure de la tension électrique ?",
    options: ["Ampère (A)", "Volt (V)", "Ohm (Ω)", "Watt (W)"],
    answer: "Volt (V)",
    level: "debutant",
  },
  {
    category: "electricite",
    question:
      "Selon la loi d'Ohm, si la tension est de 12V et la résistance de 4Ω, quelle est l'intensité ?",
    options: ["3 A", "16 A", "8 A", "48 A"],
    answer: "3 A",
    level: "intermediaire",
  },
  {
    category: "electricite",
    question: "Quel est le rôle principal d'un disjoncteur différentiel ?",
    options: [
      "Protéger contre les surintensités",
      "Protéger contre les contacts indirects",
      "Réguler la tension",
      "Mesurer la consommation",
    ],
    answer: "Protéger contre les contacts indirects",
    level: "intermediaire",
  },
  {
    category: "electricite",
    question:
      "Dans une installation triphasée équilibrée, quelle est la relation entre tension simple et tension composée ?",
    options: ["Uc = Us × √3", "Uc = Us × 2", "Uc = Us ÷ √3", "Uc = Us"],
    answer: "Uc = Us × √3",
    level: "avance",
  },
  {
    category: "electricite",
    question:
      "Quelle est la section minimale pour un circuit prises de courant 16A en cuivre ?",
    options: ["1,5 mm²", "2,5 mm²", "4 mm²", "6 mm²"],
    answer: "2,5 mm²",
    level: "intermediaire",
  },

  // Questions d'informatique
  {
    category: "informatique",
    question: "Que signifie l'acronyme TCP/IP ?",
    options: [
      "Transfer Control Protocol / Internet Protocol",
      "Transmission Control Protocol / Internet Protocol",
      "Transfer Communication Protocol / Internet Protocol",
      "Transmission Communication Protocol / Internet Protocol",
    ],
    answer: "Transmission Control Protocol / Internet Protocol",
    level: "debutant",
  },
  {
    category: "informatique",
    question: "Quelle est l'adresse IP de bouclage locale (localhost) ?",
    options: ["192.168.1.1", "10.0.0.1", "127.0.0.1", "172.16.0.1"],
    answer: "127.0.0.1",
    level: "debutant",
  },
  {
    category: "informatique",
    question:
      "Dans un réseau avec un masque /24, combien d'adresses IP sont disponibles pour les hôtes ?",
    options: ["254", "256", "255", "253"],
    answer: "254",
    level: "intermediaire",
  },
  {
    category: "informatique",
    question: "Quel port TCP utilise par défaut le protocole HTTPS ?",
    options: ["80", "443", "8080", "22"],
    answer: "443",
    level: "intermediaire",
  },
  {
    category: "informatique",
    question: "Qu'est-ce qu'un VLAN ?",
    options: [
      "Un réseau local virtuel",
      "Un protocole de routage",
      "Un type de câble réseau",
      "Un système d'exploitation",
    ],
    answer: "Un réseau local virtuel",
    level: "avance",
  },
];

async function main() {
  console.log("🌱 Début du seeding...");

  // Supprimer les données existantes
  await prisma.result.deleteMany();
  await prisma.question.deleteMany();

  console.log("🗑️  Données existantes supprimées");

  // Ajouter les questions d'exemple
  for (const question of sampleQuestions) {
    await prisma.question.create({
      data: {
        ...question,
        options: JSON.stringify(question.options), // conversion tableau → string
      },
    });
  }

  console.log(`✅ ${sampleQuestions.length} questions ajoutées`);

  // Ajouter quelques résultats d'exemple
  const sampleResults = [
    {
      candidate: "Jean Dupont",
      category: "electricite",
      score: 8,
      total: 10,
      percentage: 80,
      duration: 15,
      answers: JSON.stringify({
        q1: "Volt (V)",
        q2: "3 A",
        q3: "Protéger contre les contacts indirects",
      }),
    },
    {
      candidate: "Marie Martin",
      category: "informatique",
      score: 7,
      total: 10,
      percentage: 70,
      duration: 18,
      answers: JSON.stringify({
        q1: "Transmission Control Protocol / Internet Protocol",
        q2: "127.0.0.1",
      }),
    },
    {
      candidate: "Pierre Durand",
      category: "electricite",
      score: 6,
      total: 10,
      percentage: 60,
      duration: 22,
      answers: JSON.stringify({ q1: "Volt (V)", q2: "16 A" }),
    },
  ];

  for (const result of sampleResults) {
    await prisma.result.create({
      data: result,
    });
  }

  console.log(`✅ ${sampleResults.length} résultats d'exemple ajoutés`);
  console.log("🎉 Seeding terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
