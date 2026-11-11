<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border',
      difficultyStyles[difficulty],
    ]"
  >
    <span
      class="w-1.5 h-1.5 rounded-full"
      :class="difficultyDots[difficulty]"
    ></span>
    {{ difficulty }}
  </span>
</template>

<script setup lang="ts">
import type { DifficultyLevel } from "@/types/project";

defineProps<{
  difficulty: DifficultyLevel;
}>();

const difficultyStyles: Record<DifficultyLevel, string> = {
  Beginner: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
  Intermediate: "bg-amber-50 text-amber-800 border-amber-200/80",
  Advanced: "bg-rose-50 text-rose-800 border-rose-200/80",
};

const difficultyDots: Record<DifficultyLevel, string> = {
  Beginner: "bg-emerald-500",
  Intermediate: "bg-amber-500",
  Advanced: "bg-rose-500",
};
</script>
