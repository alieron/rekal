import { isAuthenticated, unauthorized } from "@/lib/api-auth";
import { notes, topics } from "@/db/schema";
import { db, toSlug } from "@/lib/db";
import { count, desc, max, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) return unauthorized();

  try {
    const rows = await db()
      .select({
        id: topics.id,
        slug: topics.slug,
        name: topics.name,
        description: topics.description,
        createdAt: topics.createdAt,
        updatedAt: topics.updatedAt,
        noteCount: count(notes.id),
        lastEditedAt: max(notes.updatedAt),
      })
      .from(topics)
      .leftJoin(notes, sql`${notes.topicId} = ${topics.id}`)
      .groupBy(topics.id)
      .orderBy(desc(sql`coalesce(max(${notes.updatedAt}), ${topics.updatedAt})`));

    return NextResponse.json({ topics: rows });
  } catch (error) {
    return databaseError(error);
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) return unauthorized();

  const body = (await request.json().catch(() => ({}))) as {
    name?: string;
    slug?: string;
    description?: string;
  };
  const name = body.name?.trim();
  const slug = toSlug(body.slug || body.name || "");

  if (!name || !slug) {
    return NextResponse.json({ error: "Topic name is required." }, { status: 400 });
  }

  try {
    const rows = await db()
      .insert(topics)
      .values({ name, slug, description: body.description?.trim() ?? "" })
      .returning();

    return NextResponse.json({ topic: rows[0] }, { status: 201 });
  } catch (error) {
    return databaseError(error);
  }
}

function databaseError(error: unknown) {
  const message = error instanceof Error ? error.message : "Database request failed.";
  return NextResponse.json({ error: message }, { status: 500 });
}
