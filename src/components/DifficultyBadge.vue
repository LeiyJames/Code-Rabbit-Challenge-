<template>
  <span
    :class="[
      'px-3 py-1 rounded-full text-xs font-semibold',
      difficultyStyles[difficulty]
    ]"
  >
    {{ difficulty }}
  </span>
</template>

<script setup lang="ts">
import type { DifficultyLevel } from '@/types/project'

defineProps<{
  difficulty: DifficultyLevel
}>()

const difficultyStyles: Record<DifficultyLevel, string> = {
  Beginner: 'bg-green-100 text-green-800 border border-green-300',
  Intermediate: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  Advanced: 'bg-red-100 text-red-800 border border-red-300'
}
</script>
