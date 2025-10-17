export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }
    const deleted = await prisma.result.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    return NextResponse.json(
      { error: "Suppression impossible" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const candidate = searchParams.get("candidate");
    const limit = parseInt(searchParams.get("limit") || "50");

    const whereCondition: any = {};
    if (category) whereCondition.category = category;
    if (candidate) whereCondition.candidate = candidate;

    const results = await prisma.result.findMany({
      where: whereCondition,
      orderBy: { date: "desc" },
      take: limit,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Erreur lors de la récupération des résultats:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation des données
    if (
      !body.candidate ||
      !body.category ||
      body.score === undefined ||
      body.total === undefined
    ) {
      return NextResponse.json(
        { error: "Les champs candidate, category, score et total sont requis" },
        { status: 400 }
      );
    }

    // Calcul du pourcentage (évite division par zéro)
    let percentage = 0;
    if (body.total && body.total > 0) {
      percentage = (body.score / body.total) * 100;
    }

    const result = await prisma.result.create({
      data: {
        candidate: body.candidate,
        category: body.category,
        score: body.score,
        total: body.total,
        percentage,
        duration: body.duration,
        answers: JSON.stringify(body.answers || {}),
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du résultat:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
