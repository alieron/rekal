import { notes, topics, type Note as DbNote, type Topic as DbTopic } from "@/db/schema";
import { db } from "@/lib/db";
import { count, desc, eq, max, sql } from "drizzle-orm";

export type Topic = Omit<DbTopic, "createdAt" | "updatedAt"> & { createdAt: string; updatedAt: string };
export type Note = Omit<DbNote, "createdAt" | "updatedAt"> & { createdAt: string; updatedAt: string };
export type NoteWithTopic = Note & { topic: Topic };
export type TopicWithStats = Topic & { noteCount: number; lastEditedAt: string | null };

export async function getTopics(): Promise<Topic[]> {
  const rows = await db().select().from(topics).orderBy(desc(topics.updatedAt));
  return rows.map(serializeTopic);
}

export async function getNotesWithTopics(): Promise<NoteWithTopic[]> {
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

  return rows.map((row) => ({ ...serializeNote(row), topic: serializeTopic(row.topic) }));
}

export async function getTopicsWithStats(): Promise<TopicWithStats[]> {
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

  return rows.map((row) => ({ ...serializeTopic(row), noteCount: row.noteCount, lastEditedAt: row.lastEditedAt?.toISOString() ?? null }));
}

export async function getTopicBySlug(slug: string) {
  const rows = await db().select().from(topics).where(eq(topics.slug, slug));
  return rows[0] ? serializeTopic(rows[0]) : undefined;
}

export async function getNotesForTopic(topicId: string): Promise<NoteWithTopic[]> {
  return (await getNotesWithTopics()).filter((note) => note.topicId === topicId);
}

export async function getActivityByDay() {
  const rows = await db().select({ createdAt: notes.createdAt, updatedAt: notes.updatedAt }).from(notes);
  const counts = new Map<string, number>();
  for (const note of rows) {
    for (const value of [note.createdAt, note.updatedAt]) {
      const key = value.toISOString().slice(0, 10);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

export function formatDate(value: string | null) {
  if (!value) return "No notes";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export function shortDate(value: string | null) {
  if (!value) return "never";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value));
}

function serializeTopic(topic: DbTopic): Topic {
  return { ...topic, createdAt: topic.createdAt.toISOString(), updatedAt: topic.updatedAt.toISOString() };
}

function serializeNote(note: DbNote): Note {
  return { ...note, createdAt: note.createdAt.toISOString(), updatedAt: note.updatedAt.toISOString() };
}
