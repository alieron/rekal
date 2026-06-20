import { notes, topics } from "@/db/schema";
import { isAuthenticated, unauthorized } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(request)) return unauthorized();

  const { id } = await params;

  try {
    const rows = await db()
      .select({
        id: notes.id,
        topicId: notes.topicId,
        note: notes.note,
        resource: notes.resource,
        createdAt: notes.createdAt,
        updatedAt: notes.updatedAt,
        topic: {
          id: topics.id,
          slug: topics.slug,
          name: topics.name,
          description: topics.description,
          createdAt: topics.createdAt,
          updatedAt: topics.updatedAt,
        },
      })
      .from(notes)
      .innerJoin(topics, eq(topics.id, notes.topicId))
      .where(eq(notes.id, id));

    if (!rows[0]) return NextResponse.json({ error: "Note not found." }, { status: 404 });
    return NextResponse.json({ note: rows[0] });
  } catch (error) {
    return databaseError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(request)) return unauthorized();

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as {
    topicId?: string;
    note?: string;
    resource?: string | null;
  };

  const updates: Partial<typeof notes.$inferInsert> = { updatedAt: new Date() };
  if (body.topicId !== undefined) updates.topicId = body.topicId;
  if (body.note !== undefined) updates.note = body.note.trim();
  if (body.resource !== undefined) updates.resource = body.resource?.trim() || null;

  try {
    const rows = await db().update(notes).set(updates).where(eq(notes.id, id)).returning();

    if (!rows[0]) return NextResponse.json({ error: "Note not found." }, { status: 404 });
    return NextResponse.json({ note: rows[0] });
  } catch (error) {
    return databaseError(error);
  }
}

function databaseError(error: unknown) {
  const message = error instanceof Error ? error.message : "Database request failed.";
  return NextResponse.json({ error: message }, { status: 500 });
}
