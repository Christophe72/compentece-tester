import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }
    const deleted = await prisma.question.delete({
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "10");

    const whereCondition = category ? { category } : {};

    const questions = await prisma.question.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Erreur lors de la récupération des questions:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation des données
    if (
      !body.category ||
      !body.question ||
      !body.options ||
      !body.answer ||
      !body.level
    ) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.options) || body.options.length < 2) {
      return NextResponse.json(
        { error: "Au moins 2 options sont requises" },
        { status: 400 }
      );
    }

    const question = await prisma.question.create({
      data: {
        category: body.category,
        question: body.question,
        options: JSON.stringify(body.options),
        answer: body.answer,
        level: body.level,
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la question:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
