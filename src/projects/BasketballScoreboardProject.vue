<template>
  <div
    class="h-full flex flex-col items-center justify-center p-4 bg-neutral-900 rounded-xl min-h-[600px] text-white select-none"
    tabindex="0"
  >
    <!-- Main Scoreboard -->
    <div
      class="w-full max-w-4xl bg-black/40 backdrop-blur-md rounded-3xl border border-neutral-800 p-6 flex flex-col gap-8 shadow-2xl relative overflow-hidden"
    >
      <!-- Period & Timer Header -->
      <div
        class="flex justify-between items-start border-b border-neutral-800/50 pb-6"
      >
        <div class="flex flex-col items-center">
          <span
            class="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1"
            >Period</span
          >
          <div class="flex items-center gap-2">
            <button
              v-for="p in 4"
              :key="p"
              @click="setPeriod(p)"
              :class="[
                'w-8 h-8 rounded-full text-sm font-bold transition-all',
                period === p
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50'
                  : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700',
              ]"
            >
              {{ p }}
            </button>
          </div>
        </div>

        <!-- Shot Clock -->
        <div class="flex flex-col items-center">
          <span
            class="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1"
            >Shot Clock</span
          >
          <div
            class="bg-neutral-950 border border-neutral-800 rounded-lg px-6 py-2 flex items-center gap-4"
          >
            <span
              :class="[
                'text-4xl font-mono font-bold tabular-nums',
                shotClock <= 5 ? 'text-red-500' : 'text-orange-500',
              ]"
            >
              {{ shotClock }}
            </span>
            <div class="flex gap-1">
              <button
                @click="toggleShotClock"
                class="p-2 hover:bg-neutral-800 rounded-md transition-colors"
                :title="isShotClockRunning ? 'Pause' : 'Start'"
              >
                <svg
                  v-if="isShotClockRunning"
                  class="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
                <svg
                  v-else
                  class="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <button
                @click="resetShotClock"
                class="p-2 hover:bg-neutral-800 rounded-md transition-colors"
                title="Reset (24s)"
              >
                <svg
                  class="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Teams Container -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        <!-- Divider for desktop -->
        <div
          class="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-neutral-800 transform -translate-x-1/2"
        ></div>

        <!-- Team A -->
        <div
          :class="[
            'flex flex-col items-center p-4 rounded-2xl transition-all duration-300',
            leadingTeam === 'home'
              ? 'bg-orange-500/5 ring-1 ring-orange-500/20'
              : '',
          ]"
        >
          <input
            v-model="teams.home.name"
            class="bg-transparent text-center text-2xl font-bold text-neutral-300 border-b border-transparent hover:border-neutral-600 focus:border-orange-500 focus:outline-none mb-4 w-full"
          />

          <div class="relative">
            <div
              :key="teams.home.score"
              class="text-9xl font-bold font-mono text-white mb-2 tabular-nums tracking-tighter shadow-black drop-shadow-2xl animate-score-bump"
            >
              {{ teams.home.score.toString().padStart(3, "0") }}
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3 w-full max-w-[240px]">
            <button
              @click="score('home', 1)"
              class="py-3 bg-neutral-800 hover:bg-neutral-700 text-orange-400 font-bold rounded-xl transition-all active:scale-95 border border-neutral-700 shadow-lg"
            >
              +1
            </button>
            <button
              @click="score('home', 2)"
              class="py-3 bg-neutral-800 hover:bg-neutral-700 text-orange-400 font-bold rounded-xl transition-all active:scale-95 border border-neutral-700 shadow-lg"
            >
              +2
            </button>
            <button
              @click="score('home', 3)"
              class="py-3 bg-neutral-800 hover:bg-neutral-700 text-orange-400 font-bold rounded-xl transition-all active:scale-95 border border-neutral-700 shadow-lg"
            >
              +3
            </button>
          </div>
        </div>

        <!-- Team B -->
        <div
          :class="[
            'flex flex-col items-center p-4 rounded-2xl transition-all duration-300',
            leadingTeam === 'guest'
              ? 'bg-blue-500/5 ring-1 ring-blue-500/20'
              : '',
          ]"
        >
          <input
            v-model="teams.guest.name"
            class="bg-transparent text-center text-2xl font-bold text-neutral-300 border-b border-transparent hover:border-neutral-600 focus:border-blue-500 focus:outline-none mb-4 w-full"
          />

          <div class="relative">
            <div
              :key="teams.guest.score"
              class="text-9xl font-bold font-mono text-white mb-2 tabular-nums tracking-tighter shadow-black drop-shadow-2xl animate-score-bump"
            >
              {{ teams.guest.score.toString().padStart(3, "0") }}
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3 w-full max-w-[240px]">
            <button
              @click="score('guest', 1)"
              class="py-3 bg-neutral-800 hover:bg-neutral-700 text-blue-400 font-bold rounded-xl transition-all active:scale-95 border border-neutral-700 shadow-lg"
            >
              +1
            </button>
            <button
              @click="score('guest', 2)"
              class="py-3 bg-neutral-800 hover:bg-neutral-700 text-blue-400 font-bold rounded-xl transition-all active:scale-95 border border-neutral-700 shadow-lg"
            >
              +2
            </button>
            <button
              @click="score('guest', 3)"
              class="py-3 bg-neutral-800 hover:bg-neutral-700 text-blue-400 font-bold rounded-xl transition-all active:scale-95 border border-neutral-700 shadow-lg"
            >
              +3
            </button>
          </div>
        </div>
      </div>

      <!-- Footer: Reset -->
      <div
        class="border-t border-neutral-800/50 pt-6 flex justify-between items-center text-sm text-neutral-500"
      >
        <div class="hidden sm:block">
          <span class="bg-neutral-800 px-2 py-1 rounded text-xs mr-2">Tip</span>
          Use keyboard <kbd class="font-mono text-neutral-300">1/2/3</kbd> for
          Home, <kbd class="font-mono text-neutral-300">Shift + 1/2/3</kbd> for
          Guest
        </div>
        <button
          @click="confirmReset"
          class="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Reset Game
        </button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="showResetModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      @click.self="cancelReset"
    >
      <div
        class="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl transform transition-all"
      >
        <h3 class="text-xl font-bold text-white mb-2">Reset Game?</h3>
        <p class="text-neutral-400 mb-6">
          This will clear all scores, reset the period to 1, and reset the shot
          clock. This action cannot be undone.
        </p>
        <div class="flex gap-3 justify-end">
          <button
            @click="cancelReset"
            class="px-4 py-2 rounded-lg text-neutral-300 hover:bg-neutral-800 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            @click="executeReset"
            class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors font-medium shadow-lg shadow-red-900/20"
          >
            Yes, Reset Game
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, onMounted } from "vue";

const showResetModal = ref(false);

const teams = ref({
  home: { name: "LAKERS", score: 0 },
  guest: { name: "CELTICS", score: 0 },
});

const period = ref(1);
const shotClock = ref(24);
const isShotClockRunning = ref(false);
let timerInterval: number | null = null;

const leadingTeam = computed(() => {
  if (teams.value.home.score > teams.value.guest.score) return "home";
  if (teams.value.guest.score > teams.value.home.score) return "guest";
  return null;
});

function score(team: "home" | "guest", points: number) {
  teams.value[team].score += points;
  // UX: prevent negative scores logic isn't needed for adding,
  // but if we had decrement buttons it would be: Math.max(0, val)
}

function setPeriod(p: number) {
  period.value = p;
}

function toggleShotClock() {
  if (isShotClockRunning.value) {
    pauseShotClock();
  } else {
    startShotClock();
  }
}

function startShotClock() {
  if (timerInterval) return;
  isShotClockRunning.value = true;
  timerInterval = window.setInterval(() => {
    if (shotClock.value > 0) {
      shotClock.value--;
    } else {
      pauseShotClock();
      // Optional: Sound buzzer
    }
  }, 1000);
}

function pauseShotClock() {
  isShotClockRunning.value = false;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resetShotClock() {
  pauseShotClock();
  shotClock.value = 24;
}

function confirmReset() {
  showResetModal.value = true;
}

function executeReset() {
  teams.value.home.score = 0;
  teams.value.guest.score = 0;
  period.value = 1;
  resetShotClock();
  showResetModal.value = false;
}

function cancelReset() {
  showResetModal.value = false;
}

// Keyboard Controls
function handleKeydown(e: KeyboardEvent) {
  // Prevent typing in inputs from triggering shortcuts
  if ((e.target as HTMLElement).tagName === "INPUT") return;

  switch (e.key) {
    case "1":
      score("home", 1);
      break;
    case "2":
      score("home", 2);
      break;
    case "3":
      score("home", 3);
      break;
    case "!":
      score("guest", 1);
      break; // Shift + 1
    case "@":
      score("guest", 2);
      break; // Shift + 2
    case "#":
      score("guest", 3);
      break; // Shift + 3
    case " ":
      e.preventDefault();
      toggleShotClock();
      break;
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  pauseShotClock();
});
</script>

<style scoped>
@keyframes scoreBump {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
    color: #fbbf24;
  }
  100% {
    transform: scale(1);
  }
}

.animate-score-bump {
  animation: scoreBump 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
