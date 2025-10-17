import { prisma } from "../../lib/prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  // Récupération des résultats et des questions (Server Component)
  const results = await prisma.result.findMany({
    orderBy: { date: "desc" },
    take: 20,
  });
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // Délègue le rendu interactif au composant client
  return <DashboardClient results={results} questions={questions} />;
}
