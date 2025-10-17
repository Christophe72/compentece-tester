import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const data: any = {};
    if (typeof body.category === "string") data.category = body.category;
    if (typeof body.question === "string") data.question = body.question;
    if (Array.isArray(body.options))
      data.options = JSON.stringify(body.options);
    if (typeof body.answer === "string") data.answer = body.answer;
    if (typeof body.level === "string") data.level = body.level;

    const updated = await prisma.question.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur PATCH question:", error);
    return NextResponse.json(
      { error: "Mise à jour impossible" },
      { status: 500 }
    );
  }
}
