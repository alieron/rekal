import data from "@/data/data.json";

export type Topic = (typeof data.topics)[number];
export type Resource = (typeof data.resources)[number];
export type ResourceWithTopic = Resource & { topic: Topic };
export type TopicWithStats = Topic & { resourceCount: number; lastAddedAt: string | null };

export const topics = data.topics;
export const resources = data.resources;

export function getResourcesWithTopics(): ResourceWithTopic[] {
  return resources
    .map((resource) => ({
      ...resource,
      topic: topics.find((topic) => topic.id === resource.topicId) ?? topics[0],
    }))
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export function getTopicsWithStats(): TopicWithStats[] {
  return topics
    .map((topic) => {
      const topicResources = resources.filter((resource) => resource.topicId === topic.id);
      const lastAddedAt = topicResources
        .map((resource) => resource.createdAt)
        .sort((a, b) => Date.parse(b) - Date.parse(a))[0];

      return {
        ...topic,
        resourceCount: topicResources.length,
        lastAddedAt: lastAddedAt ?? null,
      };
    })
    .sort((a, b) => Date.parse(b.lastAddedAt ?? b.createdAt) - Date.parse(a.lastAddedAt ?? a.createdAt));
}

export function getTopicBySlug(slug: string) {
  return topics.find((topic) => topic.slug === slug);
}

export function getResourcesForTopic(topicId: string) {
  return getResourcesWithTopics().filter((resource) => resource.topicId === topicId);
}

export function getResourceById(id: string) {
  return getResourcesWithTopics().find((resource) => resource.id === id);
}

export function formatDate(value: string | null) {
  if (!value) return "No resources";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}
