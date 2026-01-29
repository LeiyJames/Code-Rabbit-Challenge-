<template>
  <div class="space-y-4">
    <!-- Search Input -->
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search projects..."
        class="w-full px-4 py-3 pl-12 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
      />
      <svg
        class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    
    <!-- Difficulty Filter -->
    <div>
      <label class="block text-sm font-medium text-neutral-700 mb-2">Filter by Difficulty</label>
      <div class="flex flex-wrap gap-2">
        <button
          @click="selectedDifficulty = null"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 active:scale-95',
            selectedDifficulty === null
              ? 'bg-neutral-800 text-white'
              : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
          ]"
        >
          All Levels
        </button>
        <button
          v-for="difficulty in difficulties"
          :key="difficulty"
          @click="selectedDifficulty = difficulty"
          :class="[
            'px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 border-2',
            selectedDifficulty === difficulty
              ? difficultyActiveStyles[difficulty]
              : difficultyInactiveStyles[difficulty]
          ]"
        >
          {{ difficulty }}
        </button>
      </div>
    </div>
    
    <!-- Results Count -->
    <p class="text-sm text-neutral-600">
      {{ filteredCount }} {{ filteredCount === 1 ? 'project' : 'projects' }} found
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ProjectCategory, DifficultyLevel } from '@/types/project'

const props = defineProps<{
  filteredCount: number
}>()

const emit = defineEmits<{
  search: [query: string]
  filterCategory: [category: ProjectCategory | null]
  filterDifficulty: [difficulty: DifficultyLevel | null]
}>()

const searchQuery = ref('')
const selectedCategory = ref<ProjectCategory | null>(null)
const selectedDifficulty = ref<DifficultyLevel | null>(null)

const categories: ProjectCategory[] = ['utility', 'calculator', 'generator', 'tool', 'game']
const difficulties: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced']

const difficultyActiveStyles: Record<DifficultyLevel, string> = {
  'Beginner': 'bg-green-500 text-white border-green-600',
  'Intermediate': 'bg-yellow-500 text-white border-yellow-600',
  'Advanced': 'bg-red-500 text-white border-red-600'
}

const difficultyInactiveStyles: Record<DifficultyLevel, string> = {
  'Beginner': 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100',
  'Intermediate': 'bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100',
  'Advanced': 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
}

watch(searchQuery, (newQuery) => {
  emit('search', newQuery)
})

watch(selectedCategory, (newCategory) => {
  emit('filterCategory', newCategory)
})

watch(selectedDifficulty, (newDifficulty) => {
  emit('filterDifficulty', newDifficulty)
})
</script>
