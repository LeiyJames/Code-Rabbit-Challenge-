<template>
  <article
    class="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-neutral-100 flex flex-col h-full"
  >
    <!-- Top Image Section -->
    <div class="relative w-full h-48 bg-neutral-100 overflow-hidden">
      <img
        v-if="project.thumbnail"
        :src="project.thumbnail"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        :alt="project.name"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-indigo-50"
      >
        <span
          class="text-primary-200 text-6xl font-black opacity-20 select-none"
          >{{ project.name.charAt(0) }}</span
        >
      </div>

      <!-- Category Float -->
      <div class="absolute top-4 right-4 z-10">
        <CategoryBadge :category="project.category" />
      </div>

      <!-- Overlay Gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      ></div>
    </div>

    <div class="p-6 flex flex-col gap-4 h-full">
      <!-- Header -->
      <div class="space-y-2">
        <h3
          class="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors"
        >
          {{ project.name }}
          <span
            v-if="project.slug === 'qa-regression-checklist'"
            class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200"
          >
            Premium
          </span>
        </h3>
        <p class="text-neutral-600 text-sm leading-relaxed line-clamp-2">
          {{ project.description }}
        </p>
      </div>

      <!-- Difficulty & Concepts -->
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <span
            class="text-xs text-neutral-400 font-bold uppercase tracking-wider"
            >Level</span
          >
          <DifficultyBadge :difficulty="project.difficulty" />
        </div>
        <div class="flex flex-wrap gap-1.5">
          <ConceptBadge
            v-for="concept in project.concepts"
            :key="concept"
            :concept="concept"
          />
        </div>
      </div>

      <!-- Run Button -->
      <button
        @click="$emit('run', project.slug)"
        class="w-full h-12 bg-neutral-900 group-hover:bg-primary-600 text-white rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 mt-auto shadow-lg shadow-neutral-200 group-hover:shadow-primary-200"
      >
        <span>Launch Project</span>
        <svg
          class="w-5 h-5 transition-transform group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Project } from "@/types/project";
import CategoryBadge from "./CategoryBadge.vue";
import DifficultyBadge from "./DifficultyBadge.vue";
import ConceptBadge from "./ConceptBadge.vue";

defineProps<{
  project: Project;
}>();

defineEmits<{
  run: [slug: string];
}>();
</script>
