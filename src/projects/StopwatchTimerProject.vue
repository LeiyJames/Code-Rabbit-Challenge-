<template>
  <div
    class="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl min-h-[500px] text-white"
  >
    <div
      class="w-full max-w-md bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden"
    >
      <!-- Tabs -->
      <div class="flex border-b border-gray-700/50">
        <button
          v-for="mode in modes"
          :key="mode.id"
          @click="switchMode(mode.id)"
          :class="[
            'flex-1 py-4 text-sm font-bold tracking-wider uppercase transition-all duration-300',
            currentMode === mode.id
              ? 'bg-primary-500/20 text-primary-400'
              : 'text-gray-500 hover:text-gray-300 hover:bg-white/5',
          ]"
        >
          {{ mode.label }}
        </button>
      </div>

      <div class="p-8">
        <!-- Display Area -->
        <div
          class="relative flex items-center justify-center mb-8 mt-4 transition-[height] duration-300 ease-in-out"
          :class="currentMode === 'timer' ? 'h-64' : 'h-32'"
        >
          <!-- Circular Progress (Timer Only) -->
          <svg
            v-if="currentMode === 'timer'"
            class="absolute w-64 h-64 transform -rotate-90 pointer-events-none"
          >
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              stroke-width="8"
              fill="transparent"
              class="text-gray-700"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              stroke-width="8"
              fill="transparent"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="dashOffset"
              class="text-primary-500 transition-[stroke-dashoffset] duration-300 ease-linear"
              stroke-linecap="round"
            />
          </svg>

          <!-- Time Display -->
          <div
            class="text-center z-10 font-mono font-variant-numeric tabular-nums"
          >
            <div
              class="text-6xl font-bold tracking-tight text-white mb-2 filter drop-shadow-lg"
            >
              {{ formattedTime }}
            </div>
            <div class="text-xl text-primary-400 font-medium">
              {{
                currentMode === "stopwatch"
                  ? formattedMilliseconds
                  : isRunning
                    ? "Running"
                    : isFinished
                      ? "Done"
                      : "Paused"
              }}
            </div>
          </div>
        </div>

        <!-- Timer Input (Only when paused/reset in Timer mode) -->
        <div
          v-if="
            currentMode === 'timer' && !isRunning && !isPaused && !isFinished
          "
          class="mb-8"
        >
          <div class="flex justify-center gap-4 text-center">
            <div class="flex flex-col gap-2">
              <label class="text-xs text-gray-500 uppercase font-semibold"
                >Minutes</label
              >
              <input
                v-model.number="timerInput.minutes"
                type="number"
                min="0"
                max="999"
                class="w-24 bg-gray-900/50 border border-gray-600 rounded-xl p-3 text-center text-2xl font-bold focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-xs text-gray-500 uppercase font-semibold"
                >Seconds</label
              >
              <input
                v-model.number="timerInput.seconds"
                type="number"
                min="0"
                max="59"
                class="w-24 bg-gray-900/50 border border-gray-600 rounded-xl p-3 text-center text-2xl font-bold focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
              />
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex items-center justify-center gap-6">
          <button
            @click="toggleStart"
            :disabled="
              currentMode === 'timer' && totalTimerSeconds === 0 && !isRunning
            "
            :class="[
              'w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg transform hover:scale-105 active:scale-95 border-4',
              isRunning
                ? 'border-red-500/30 bg-red-500 text-white hover:bg-red-400'
                : 'border-emerald-500/30 bg-emerald-500 text-white hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
            ]"
          >
            <svg
              v-if="isRunning"
              class="w-8 h-8 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
            <svg v-else class="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>

          <button
            @click="reset"
            class="w-16 h-16 rounded-full bg-gray-700 text-gray-300 border-4 border-gray-600 flex items-center justify-center hover:bg-gray-600 hover:border-gray-500 transition-all duration-300 shadow-lg transform hover:scale-105 active:scale-95"
            title="Reset"
          >
            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path
                d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";

const modes = [
  { id: "stopwatch", label: "Stopwatch" },
  { id: "timer", label: "Timer" },
];

const currentMode = ref("stopwatch");

// --- Shared State ---
const isRunning = ref(false);
const animationFrameId = ref<number | null>(null);
const startTime = ref<number>(0);
const accumulatedTime = ref<number>(0); // For stopwatch pausing
const lastFrameTime = ref<number>(0);

// --- Timer Specific State ---
const timerInput = ref({ minutes: 5, seconds: 0 });
const timerDuration = ref(0);
const timerRemaining = ref(0);
const isFinished = ref(false);

// --- Constants or Calculations ---
const circumference = 2 * Math.PI * 120;

// --- Computeds ---

// Total timer seconds derived from input
const totalTimerSeconds = computed(() => {
  return (timerInput.value.minutes * 60 + timerInput.value.seconds) * 1000;
});

const currentTimeValue = computed(() => {
  if (currentMode.value === "stopwatch") {
    return accumulatedTime.value;
  } else {
    // For timer, we show remaining
    return Math.max(0, timerRemaining.value);
  }
});

// Progress for the SVG circle
const dashOffset = computed(() => {
  if (currentMode.value !== "timer" || timerDuration.value === 0) return 0;
  const progress = currentTimeValue.value / timerDuration.value;
  // Inverse for countdown: empty when 0
  return circumference * (1 - progress);
});

const formattedTime = computed(() => {
  const ms = currentTimeValue.value;
  const totalSeconds = Math.floor(ms / 1000);

  if (currentMode.value === "stopwatch") {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${pad(m)}:${pad(s)}`;
  } else {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
    return `${pad(m)}:${pad(s)}`;
  }
});

const formattedMilliseconds = computed(() => {
  const ms = currentTimeValue.value % 1000;
  return `.${pad(Math.floor(ms / 10), 2)}`;
});

// Whether currently paused (started but not running)
const isPaused = computed(() => {
  return (
    !isRunning.value &&
    accumulatedTime.value > 0 &&
    !isFinished.value &&
    currentMode.value === "timer"
  );
});

// --- Methods ---

function pad(num: number, length = 2) {
  return num.toString().padStart(length, "0");
}

function switchMode(mode: string) {
  if (isRunning.value) toggleStart();
  currentMode.value = mode;
  reset();
}

function toggleStart() {
  if (isRunning.value) {
    pause();
  } else {
    start();
  }
}

function start() {
  if (currentMode.value === "timer" && isFinished.value) {
    reset(); // Auto reset if starting finished timer
  }

  isRunning.value = true;
  isFinished.value = false;
  startTime.value = performance.now();
  lastFrameTime.value = startTime.value;

  // If timer starting fresh
  if (currentMode.value === "timer" && accumulatedTime.value === 0) {
    timerDuration.value = totalTimerSeconds.value;
    timerRemaining.value = timerDuration.value;
  }

  animate();
}

function pause() {
  isRunning.value = false;
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
    animationFrameId.value = null;
  }
}

function reset() {
  pause();
  accumulatedTime.value = 0;
  timerRemaining.value = 0;
  isFinished.value = false;
  // Don't reset timerInput, user might want to run same time again
}

function animate() {
  const now = performance.now();
  const delta = now - lastFrameTime.value;
  lastFrameTime.value = now;

  if (currentMode.value === "stopwatch") {
    accumulatedTime.value += delta;
  } else {
    // Timer logic
    // We actually track how much time has passed since start of this segment
    // But simplistic delta accumulation works well enough for short durations and handles pause nicely
    // A more robust way for timer is: remaining = duration - (accumulated_elapsed)
    // Let's stick to accumulating delta to keep pause handling simple
    timerRemaining.value -= delta;
    if (timerRemaining.value <= 0) {
      timerRemaining.value = 0;
      finishTimer();
      return;
    }
  }

  if (isRunning.value) {
    animationFrameId.value = requestAnimationFrame(animate);
  }
}

function finishTimer() {
  isRunning.value = false;
  isFinished.value = true;
  accumulatedTime.value = 0; // Reset accumulated for logic checks
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
  }
  // Optional: Play sound here
}

// Cleanup
onUnmounted(() => {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
  }
});
</script>
