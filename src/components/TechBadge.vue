<template>
  <span
    class="inline-flex items-center px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-md text-xs font-mono border border-neutral-200/70"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>
