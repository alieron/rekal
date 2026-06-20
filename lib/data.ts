import data from "@/data/data.json";

export type Topic = (typeof data.topics)[number];
export type Note = (typeof data.notes)[number];
export type NoteWithTopic = Note & { topic: Topic };
export type TopicWithStats = Topic & { noteCount: number; lastEditedAt: string | null };

export const topics = data.topics;
export const notes = data.notes;

export function getNotesWithTopics(): NoteWithTopic[] {
  return notes
    .map((note) => ({
      ...note,
      topic: topics.find((topic) => topic.id === note.topicId) ?? topics[0],
    }))
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export function getTopicsWithStats(): TopicWithStats[] {
  return topics
    .map((topic) => {
      const topicNotes = notes.filter((note) => note.topicId === topic.id);
      const lastEditedAt = topicNotes
        .flatMap((note) => [note.createdAt, note.updatedAt])
        .sort((a, b) => Date.parse(b) - Date.parse(a))[0];

      return {
        ...topic,
        noteCount: topicNotes.length,
        lastEditedAt: lastEditedAt ?? null,
      };
    })
    .sort((a, b) => Date.parse(b.lastEditedAt ?? b.createdAt) - Date.parse(a.lastEditedAt ?? a.createdAt));
}

export function getTopicBySlug(slug: string) {
  return topics.find((topic) => topic.slug === slug);
}

export function getNotesForTopic(topicId: string) {
  return getNotesWithTopics().filter((note) => note.topicId === topicId);
}

export function getNoteById(id: string) {
  return getNotesWithTopics().find((note) => note.id === id);
}

export function formatDate(value: string | null) {
  if (!value) return "No notes";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export function shortDate(value: string | null) {
  if (!value) return "never";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value));
}

export function getActivityByDay() {
  const counts = new Map<string, number>();
  for (const note of notes) {
    for (const value of [note.createdAt, note.updatedAt]) {
      const key = value.slice(0, 10);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}
