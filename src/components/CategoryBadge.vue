<template>
  <span
    :class="[
      'px-3 py-1 rounded-full text-xs font-medium border',
      categoryStyles[category]
    ]"
  >
    {{ category }}
  </span>
</template>

<script setup lang="ts">
import type { ProjectCategory } from '@/types/project'

defineProps<{
  category: ProjectCategory
}>()

const categoryStyles: Record<ProjectCategory, string> = {
  utility: 'bg-blue-50 text-blue-700 border-blue-200',
  calculator: 'bg-purple-50 text-purple-700 border-purple-200',
  generator: 'bg-green-50 text-green-700 border-green-200',
  tool: 'bg-orange-50 text-orange-700 border-orange-200',
  game: 'bg-pink-50 text-pink-700 border-pink-200'
}
</script>
