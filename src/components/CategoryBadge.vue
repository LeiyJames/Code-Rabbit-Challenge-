<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize',
      categoryStyles[category] || 'bg-neutral-100 text-neutral-700 border-neutral-200',
    ]"
  >
    {{ category }}
  </span>
</template>

<script setup lang="ts">
import type { ProjectCategory } from "@/types/project";

defineProps<{
  category: ProjectCategory;
}>();

const categoryStyles: Record<ProjectCategory, string> = {
  utility: "bg-slate-50 text-slate-700 border-slate-200",
  generator: "bg-zinc-50 text-zinc-700 border-zinc-200",
  tool: "bg-neutral-100 text-neutral-700 border-neutral-200",
  game: "bg-stone-50 text-stone-700 border-stone-200",
  creative: "bg-gray-50 text-gray-700 border-gray-200",
  education: "bg-slate-50 text-slate-700 border-slate-200",
};
</script>
