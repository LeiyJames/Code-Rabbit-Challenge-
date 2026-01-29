<template>
  <span
    class="px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-md text-xs font-medium border border-neutral-200"
  >
    {{ concept }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  concept: string
}>()
</script>
