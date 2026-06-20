import { notes, topics } from "@/db/schema";
import { isAuthenticated, unauthorized } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) return unauthorized();

  try {
    const rows = await db()
      .select({
        id: notes.id,
        topicId: notes.topicId,
        note: notes.note,
        resource: notes.resource,
        metadata: notes.metadata,
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
      .orderBy(desc(notes.createdAt));

    return NextResponse.json({ notes: rows });
  } catch (error) {
    return databaseError(error);
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) return unauthorized();

  const body = (await request.json().catch(() => ({}))) as {
    topicId?: string;
    note?: string;
    resource?: string | null;
    metadata?: Record<string, unknown>;
  };
  const note = body.note?.trim();

  if (!body.topicId || !note) {
    return NextResponse.json({ error: "topicId and note are required." }, { status: 400 });
  }

  try {
    const rows = await db()
      .insert(notes)
      .values({ topicId: body.topicId, note, resource: body.resource?.trim() || null, metadata: body.metadata ?? {} })
      .returning();

    return NextResponse.json({ note: rows[0] }, { status: 201 });
  } catch (error) {
    return databaseError(error);
  }
}

function databaseError(error: unknown) {
  const message = error instanceof Error ? error.message : "Database request failed.";
  return NextResponse.json({ error: message }, { status: 500 });
}
