<template>
  <article
    class="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-neutral-200/80 flex flex-col h-full hover:border-neutral-300"
  >
    <!-- Top Image Section -->
    <div class="relative w-full h-44 bg-neutral-100 overflow-hidden border-b border-neutral-100">
      <img
        v-if="project.thumbnail"
        :src="project.thumbnail"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        :alt="project.name"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-neutral-100"
      >
        <span
          class="text-neutral-300 text-5xl font-black select-none"
        >
          {{ project.name.charAt(0) }}
        </span>
      </div>

      <!-- Category Float -->
      <div class="absolute top-3 right-3 z-10">
        <CategoryBadge :category="project.category" />
      </div>
    </div>

    <div class="p-5 flex flex-col gap-4 flex-grow">
      <!-- Header -->
      <div class="space-y-1.5">
        <h3
          class="text-base font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors flex items-center gap-2"
        >
          <span>{{ project.name }}</span>
          <span
            v-if="project.slug === 'qa-regression-checklist'"
            class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-neutral-100 text-neutral-700 border border-neutral-200"
          >
            Featured
          </span>
        </h3>
        <p class="text-neutral-600 text-xs leading-relaxed line-clamp-2">
          {{ project.description }}
        </p>
      </div>

      <!-- Difficulty & Concepts -->
      <div class="space-y-3 pt-1 border-t border-neutral-100">
        <div class="flex items-center justify-between">
          <DifficultyBadge :difficulty="project.difficulty" />

          <div v-if="clicks" class="flex items-center gap-1.5 text-neutral-400 text-xs">
            <Activity class="w-3.5 h-3.5 text-neutral-400" />
            <span class="font-medium text-neutral-500">{{ clicks }} runs</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-1">
          <ConceptBadge
            v-for="concept in project.concepts.slice(0, 3)"
            :key="concept"
            :concept="concept"
          />
        </div>
      </div>

      <!-- Run Button -->
      <button
        @click="$emit('run', project.slug)"
        class="w-full h-10 mt-auto bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer select-none"
      >
        <Play class="w-3.5 h-3.5 fill-current" />
        <span>Launch Project</span>
        <ArrowRight class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 text-neutral-400" />
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Project } from "@/types/project";
import CategoryBadge from "./CategoryBadge.vue";
import DifficultyBadge from "./DifficultyBadge.vue";
import ConceptBadge from "./ConceptBadge.vue";
import { Play, ArrowRight, Activity } from "lucide-vue-next";

defineProps<{
  project: Project;
  clicks?: number;
}>();

defineEmits<{
  run: [slug: string];
}>();
</script>
