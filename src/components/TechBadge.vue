<template>
  <span
    class="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium border border-primary-200"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>
