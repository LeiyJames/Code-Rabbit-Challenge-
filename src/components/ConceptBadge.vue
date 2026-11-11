<template>
  <span
    class="inline-flex items-center px-2 py-0.5 bg-neutral-100/90 text-neutral-600 rounded-md text-xs font-medium border border-neutral-200/80"
  >
    {{ concept }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  concept: string;
}>();
</script>
