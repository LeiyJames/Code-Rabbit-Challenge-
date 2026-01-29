<template>
  <div class="h-full flex flex-col p-6 bg-slate-50 min-h-[600px] gap-6">
    <!-- Header Controls -->
    <div
      class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-6 items-center justify-between"
    >
      <div class="flex items-center gap-4">
        <h2 class="text-xl font-bold text-slate-800">Chart Playground</h2>

        <!-- Chart Type Toggles -->
        <div class="flex bg-slate-100 p-1 rounded-lg">
          <button
            v-for="type in chartTypes"
            :key="type.value"
            @click="currentType = type.value as ChartType"
            :class="[
              'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
              currentType === type.value
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700',
            ]"
          >
            {{ type.label }}
          </button>
        </div>
      </div>

      <div class="flex gap-3">
        <button
          @click="randomizeData"
          class="flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-lg text-primary-600 font-medium hover:bg-primary-100 transition-colors text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
          Shuffle Data
        </button>
      </div>
    </div>

    <!-- Chart Area -->
    <div
      class="flex-1 bg-white rounded-2xl shadow-lg border border-slate-200 p-8 flex flex-col relative overflow-hidden"
    >
      <!-- Grid Lines Background -->
      <div
        class="absolute inset-x-8 inset-y-8 flex flex-col justify-between pointer-events-none"
      >
        <div v-for="i in 5" :key="i" class="w-full h-px bg-slate-100"></div>
      </div>

      <!-- Main SVG Chart -->
      <div class="relative flex-1 z-10 min-h-[300px]" ref="chartContainer">
        <svg
          class="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <!-- Line Chart Path -->
          <path
            v-if="currentType === 'line'"
            :d="linePath"
            fill="none"
            class="stroke-primary-500 stroke-[0.5] transition-all duration-500 ease-in-out"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <!-- Line Chart Area Fill (Optional flair) -->
          <path
            v-if="currentType === 'line'"
            :d="areaPath"
            class="fill-primary-500/10 transition-all duration-500 ease-in-out"
          />

          <!-- Bar Chart Rects -->
          <g v-if="currentType === 'bar'">
            <rect
              v-for="(point, index) in normalizedData"
              :key="index"
              :x="index * (100 / dataCount) + (100 / dataCount) * 0.15"
              :y="100 - point.percent"
              :width="(100 / dataCount) * 0.7"
              :height="point.percent"
              class="fill-primary-500 transition-all duration-500 ease-out hover:fill-primary-600"
              rx="1"
            />
          </g>

          <!-- Line Points (Dots) -->
          <g v-if="currentType === 'line'">
            <circle
              v-for="(point, index) in normalizedData"
              :key="index"
              :cx="index * (100 / (dataCount - 1))"
              :cy="100 - point.percent"
              r="1.5"
              class="fill-white stroke-primary-500 stroke-[0.5] transition-all duration-500 ease-in-out"
            />
          </g>
        </svg>

        <!-- Hover Tooltips Overlay (HTML implementation for better accessibility/styling) -->
        <div class="absolute inset-0 flex items-end">
          <div
            v-for="(point, index) in data"
            :key="point.id"
            class="flex-1 h-full flex items-end justify-center group relative cursor-crosshair pb-8"
            @mouseenter="hoverIndex = index"
            @mouseleave="hoverIndex = -1"
          >
            <!-- Hover Line -->
            <div
              class="absolute top-0 bottom-0 w-px bg-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>

            <!-- Tooltip -->
            <div
              class="absolute bottom-full mb-2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20"
              :style="{ bottom: `${(point.value / maxValue) * 100}%` }"
            >
              <div class="font-bold">{{ point.value }}</div>
              <div class="text-slate-400 text-[10px]">{{ point.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- X-Axis Labels -->
      <div class="flex justify-between mt-4 text-xs text-slate-400 px-2">
        <span
          v-for="point in data"
          :key="point.id"
          class="w-8 text-center truncate"
        >
          {{ point.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

type ChartType = "bar" | "line";

const chartTypes = [
  { value: "bar", label: "Bar Chart" },
  { value: "line", label: "Line Chart" },
];

const currentType = ref<ChartType>("bar");
const hoverIndex = ref(-1);

interface DataPoint {
  id: number;
  label: string;
  value: number;
}

const dataCount = 7; // Weekly view
const data = ref<DataPoint[]>([]);
const maxValue = computed(
  () => Math.max(...data.value.map((d) => d.value)) * 1.2,
); // Add 20% headroom

const normalizedData = computed(() => {
  return data.value.map((d) => ({
    ...d,
    percent: (d.value / maxValue.value) * 100,
  }));
});

// Generate SVG Path for Line Chart
const linePath = computed(() => {
  if (data.value.length === 0) return "";

  const points = normalizedData.value.map((d, i) => {
    const x = i * (100 / (dataCount - 1));
    const y = 100 - d.percent;
    return `${x},${y}`;
  });

  return `M ${points.join(" L ")}`;
});

// Generate Area Path (closing the loop to bottom)
const areaPath = computed(() => {
  if (data.value.length === 0) return "";
  return `${linePath.value} L 100,100 L 0,100 Z`;
});

function randomizeData() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  data.value = days.map((day, i) => ({
    id: i,
    label: day,
    value: Math.floor(Math.random() * 80) + 20, // Random 20-100
  }));
}

// Initial hydration
onMounted(() => {
  randomizeData();
});
</script>
