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
    const deleted = await prisma.result.delete({ where: { id: Number(id) } });
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
    if (typeof body.candidate === "string") data.candidate = body.candidate;
    if (typeof body.category === "string") data.category = body.category;
    if (typeof body.score === "number") data.score = body.score;
    if (typeof body.total === "number") data.total = body.total;
    if (typeof body.duration === "number") data.duration = body.duration;
    if (body.answers) data.answers = JSON.stringify(body.answers);

    // Recalcule le pourcentage si score/total fournis
    if (data.score !== undefined || data.total !== undefined) {
      const existing = await prisma.result.findUnique({
        where: { id: Number(id) },
        select: { score: true, total: true },
      });
      const score = data.score ?? existing?.score ?? 0;
      const total = data.total ?? existing?.total ?? 0;
      data.percentage = total > 0 ? (score / total) * 100 : 0;
    }

    const updated = await prisma.result.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur PATCH résultat:", error);
    return NextResponse.json(
      { error: "Mise à jour impossible" },
      { status: 500 }
    );
  }
}
