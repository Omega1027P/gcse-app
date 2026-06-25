import syllabus from "../../../content/syllabus/aqa-maths-8300.json";
import type { SyllabusJson, TopicJson, UnitJson, LearningObjectiveJson } from "@/lib/types";

export function getSyllabus(): SyllabusJson {
  return syllabus as SyllabusJson;
}

export function getUnits(): UnitJson[] {
  return getSyllabus().units.toSorted((a, b) => a.order - b.order);
}

export function getAllTopics(): (TopicJson & { unitId: string; unitTitle: string })[] {
  return getUnits().flatMap((unit) =>
    unit.topics.map((topic) => ({
      ...topic,
      unitId: unit.id,
      unitTitle: unit.title,
    }))
  );
}

export function getAllObjectives(): (LearningObjectiveJson & {
  unitId: string;
  unitTitle: string;
  topicId: string;
  topicTitle: string;
})[] {
  return getUnits().flatMap((unit) =>
    unit.topics.flatMap((topic) =>
      topic.learningObjectives.map((lo) => ({
        ...lo,
        unitId: unit.id,
        unitTitle: unit.title,
        topicId: topic.id,
        topicTitle: topic.title,
      }))
    )
  );
}

export function findTopicById(topicId: string) {
  return getAllTopics().find((t) => t.id === topicId);
}

export function countObjectives(): number {
  return getAllObjectives().length;
}

export function countTopics(): number {
  return getAllTopics().length;
}
