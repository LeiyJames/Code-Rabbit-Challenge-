<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps<{
  to: number;
  duration?: number;
  suffix?: string;
}>();

const displayValue = ref(0);
const observer = ref<IntersectionObserver | null>(null);
const elementRef = ref<HTMLElement | null>(null);

function animate() {
  const start = 0;
  const end = props.to;
  const duration = props.duration || 2000;
  let startTime: number | null = null;

  function update(currentTime: number) {
    if (!startTime) startTime = currentTime;
    const progress = Math.min((currentTime - startTime) / duration, 1);

    // Ease out quart
    const ease = 1 - Math.pow(1 - progress, 4);

    displayValue.value = Math.floor(start + (end - start) * ease);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      displayValue.value = end;
    }
  }

  requestAnimationFrame(update);
}

onMounted(() => {
  observer.value = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animate();
      observer.value?.disconnect();
    }
  });

  if (elementRef.value) {
    observer.value.observe(elementRef.value);
  }
});
</script>

<template>
  <span ref="elementRef">{{ displayValue }}{{ suffix }}</span>
</template>
