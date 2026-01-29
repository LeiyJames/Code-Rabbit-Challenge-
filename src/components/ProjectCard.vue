<template>
  <article
    class="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-neutral-100"
  >
    <div class="p-6 space-y-4">
      <!-- Header -->
      <div class="space-y-2">
        <div class="flex items-start justify-between gap-2">
          <h3 class="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors flex-1">
            {{ project.name }}
          </h3>
          <CategoryBadge :category="project.category" />
        </div>
        <p class="text-neutral-600 text-sm leading-relaxed">
          {{ project.description }}
        </p>
      </div>
      
      <!-- Difficulty & Concepts -->
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <span class="text-xs text-neutral-500 font-medium">Difficulty:</span>
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
      
      <!-- Tech Stack -->
      <div class="flex flex-wrap gap-2">
        <TechBadge
          v-for="tech in project.techStack"
          :key="tech"
          :label="tech"
        />
      </div>
      
      <!-- Run Button -->
      <button
        @click="$emit('run', project.slug)"
        class="w-full h-12 bg-primary-500 text-white rounded-xl font-semibold transition-all hover:bg-primary-600 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
      >
        <span>Run Project</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Project } from '@/types/project'
import TechBadge from './TechBadge.vue'
import CategoryBadge from './CategoryBadge.vue'
import DifficultyBadge from './DifficultyBadge.vue'
import ConceptBadge from './ConceptBadge.vue'

defineProps<{
  project: Project
}>()

defineEmits<{
  run: [slug: string]
}>()
</script>
