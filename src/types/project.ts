import type { Component } from "vue";

export type ProjectCategory =
  | "utility"
  | "calculator"
  | "generator"
  | "game"
  | "tool"
  | "creative"
  | "education";
export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

export interface CodeSection {
  title: string;
  language: "javascript" | "typescript" | "css" | "tailwind";
  code: string;
}

export interface Project {
  slug: string;
  name: string;
  description: string;
  techStack: string[];
  component: Component;
  category: ProjectCategory;
  difficulty: DifficultyLevel;
  concepts: string[];
  whatThisDemonstrates?: string[];
  whatILearned?: string[];
  codePreview?: CodeSection[];
  isHot?: boolean;
  isNew?: boolean;
  thumbnail?: string;
}
