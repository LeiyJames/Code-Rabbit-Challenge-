<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";
import { SpellCheck, Flame, Trophy } from "lucide-vue-next";

// --- Types ---
type WordData = {
  word: string;
  hint: string;
};

type GameState = "idle" | "playing" | "game-over";

// --- Data ---
const WORD_LIST: WordData[] = [
  { word: "JAVASCRIPT", hint: "The language of the web" },
  { word: "COMPONENT", hint: "Reusable building block in Vue" },
  { word: "REACTIVE", hint: "Updates automatically when data changes" },
  { word: "FRAMEWORK", hint: "Provides a structure for your code" },
  { word: "BROWSER", hint: "Where web apps run" },
  { word: "INTERFACE", hint: "Shared boundary between two safe components" },
  { word: "VARIABLE", hint: "Container for storing data values" },
  { word: "FUNCTION", hint: "Block of code designed to perform a task" },
  { word: "TEMPLATE", hint: "HTML structure in a Vue file" },
  { word: "DIRECTIVE", hint: "Special token in markup (e.g. v-if)" },
  { word: "DEBUGGING", hint: "Process of finding and fixing errors" },
  { word: "ALGORITHM", hint: "Step-by-step procedure for solving a problem" },
];

// --- State ---
const gameState = ref<GameState>("idle");
const currentWordObj = ref<WordData | null>(null);
const scrambledWord = ref("");
const userInput = ref("");
const score = ref(0);
const timeLeft = ref(30);
const streak = ref(0);
const timerInterval = ref<number | null>(null);
const message = ref(""); // Feeback message
const messageType = ref<"success" | "error" | "neutral">("neutral");

// --- Computed ---
const multiplier = computed(() => {
  if (streak.value >= 5) return 3;
  if (streak.value >= 2) return 2;
  return 1;
});

// --- Logic ---

function shuffleString(str: string): string {
  const arr = str.split("");
  // Fisher-Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const result = arr.join("");
  // Retry if it accidentally shuffled back to original
  if (result === str && str.length > 1) return shuffleString(str);
  return result;
}

function startGame() {
  score.value = 0;
  streak.value = 0;
  timeLeft.value = 60; // 60 seconds total game time
  userInput.value = "";
  message.value = "";
  gameState.value = "playing";
  nextWord();
  startTimer();
}

function nextWord() {
  const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
  currentWordObj.value = WORD_LIST[randomIndex];
  scrambledWord.value = shuffleString(currentWordObj.value.word);
  userInput.value = "";
  // Focus input
  setTimeout(() => {
    document.getElementById("scramble-input")?.focus();
  }, 50);
}

function startTimer() {
  if (timerInterval.value) clearInterval(timerInterval.value);
  timerInterval.value = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      endGame();
    }
  }, 1000);
}

function endGame() {
  if (timerInterval.value) clearInterval(timerInterval.value);
  gameState.value = "game-over";
  currentWordObj.value = null;
}

function checkAnswer() {
  if (gameState.value !== "playing" || !currentWordObj.value) return;

  const guess = userInput.value.toUpperCase().trim();
  const target = currentWordObj.value.word;

  if (guess === target) {
    // Correct
    const points = 10 * multiplier.value;
    score.value += points;
    streak.value++;
    // Bonus time
    timeLeft.value = Math.min(timeLeft.value + 2, 60);

    showFeedback(`+${points} Points!`, "success");
    nextWord();
  } else {
    // Incorrect
    streak.value = 0;
    showFeedback("Try again!", "error");
    userInput.value = ""; // Optional: Clear input or keep it? Keeping it lets them edit.
    // Let's shake the input instead of clearing (handled by UI animation trigger ideally, simple text here)
  }
}

function showFeedback(text: string, type: "success" | "error" | "neutral") {
  message.value = text;
  messageType.value = type;
  setTimeout(() => {
    message.value = "";
  }, 1500);
}

function skipWord() {
  if (gameState.value !== "playing") return;
  streak.value = 0;
  timeLeft.value = Math.max(timeLeft.value - 5, 0);
  showFeedback("Skipped (-5s)", "neutral");
  nextWord();
}

onUnmounted(() => {
  if (timerInterval.value) clearInterval(timerInterval.value);
});
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 font-sans">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-extrabold text-neutral-900 mb-2">
        Word Scramble
      </h1>
      <p class="text-neutral-500">
        Unscramble the coding terms before time runs out!
      </p>
    </div>

    <!-- Game Card -->
    <div
      class="bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100 p-8 relative min-h-[400px] flex flex-col items-center justify-center"
    >
      <!-- IDLE STATE -->
      <div v-if="gameState === 'idle'" class="text-center space-y-6">
        <SpellCheck class="w-14 h-14 mx-auto text-neutral-400 mb-2" />
        <h2 class="text-2xl font-bold text-neutral-900">Ready to play?</h2>
        <div class="flex justify-center gap-8 text-sm text-neutral-500">
          <div class="flex flex-col items-center">
            <span class="font-bold text-neutral-900 text-lg">60s</span>
            <span>Time Limit</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="font-bold text-neutral-900 text-lg">3x</span>
            <span>Max Multiplier</span>
          </div>
        </div>
        <button
          @click="startGame"
          class="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-primary-700 hover:scale-105 transition-all shadow-lg"
        >
          Start Game
        </button>
      </div>

      <!-- PLAYING STATE -->
      <div
        v-else-if="gameState === 'playing'"
        class="w-full max-w-md space-y-8 animate-fade-in text-center"
      >
        <!-- Score & Timer Bar -->
        <div class="flex justify-between items-center w-full">
          <div
            class="bg-neutral-100 px-4 py-2 rounded-lg flex flex-col items-start"
          >
            <span class="text-xs font-bold text-neutral-400 uppercase"
              >Score</span
            >
            <span class="text-xl font-black text-neutral-900">{{ score }}</span>
          </div>

          <div class="flex flex-col items-center">
            <div
              class="text-2xl font-bold tabular-nums"
              :class="
                timeLeft <= 5
                  ? 'text-red-500 animate-pulse'
                  : 'text-neutral-700'
              "
            >
              00:{{ timeLeft.toString().padStart(2, "0") }}
            </div>
          </div>

          <div
            class="bg-neutral-100 px-4 py-2 rounded-lg flex flex-col items-end"
          >
            <span class="text-xs font-bold text-neutral-400 uppercase"
              >Streak</span
            >
            <div class="flex items-center gap-1">
              <span class="text-orange-500 font-bold flex items-center" v-if="streak >= 2">
                <Flame class="w-4 h-4 text-orange-500 inline mr-0.5" />
                <span>{{ multiplier }}x</span>
              </span>
              <span class="text-xl font-black text-neutral-900" v-else>{{
                streak
              }}</span>
            </div>
          </div>
        </div>

        <!-- Word Display -->
        <div class="py-8">
          <h2
            class="text-4xl sm:text-5xl font-black tracking-widest text-neutral-800 break-words font-mono uppercase"
          >
            {{ scrambledWord }}
          </h2>
          <p
            class="mt-4 text-sm text-primary-600 font-medium bg-primary-50 inline-block px-3 py-1 rounded-full"
          >
            Hint: {{ currentWordObj?.hint }}
          </p>
        </div>

        <!-- Input Area -->
        <div class="relative">
          <input
            id="scramble-input"
            v-model="userInput"
            @keyup.enter="checkAnswer"
            type="text"
            placeholder="Type your guess..."
            class="w-full text-center text-xl p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all uppercase placeholder-neutral-300 font-bold tracking-wider"
            autocomplete="off"
          />

          <!-- Message Overlay -->
          <div
            v-if="message"
            class="absolute inset-x-0 -top-12 text-center font-bold text-lg animate-bounce-short"
            :class="
              messageType === 'success'
                ? 'text-green-500'
                : messageType === 'error'
                  ? 'text-red-500'
                  : 'text-neutral-500'
            "
          >
            {{ message }}
          </div>
        </div>

        <!-- Controls -->
        <div class="flex gap-4 justify-center">
          <button
            @click="skipWord"
            class="text-neutral-400 font-bold hover:text-neutral-600 transition-colors text-sm"
          >
            Skip (-5s)
          </button>
          <button
            @click="checkAnswer"
            class="bg-neutral-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-neutral-800 transition-all active:scale-95"
          >
            Submit
          </button>
        </div>
      </div>

      <!-- GAME OVER STATE -->
      <div
        v-else-if="gameState === 'game-over'"
        class="text-center space-y-6 animate-fade-in"
      >
        <Trophy class="w-14 h-14 mx-auto text-amber-500 mb-1" />
        <h2 class="text-3xl font-black text-neutral-900">Time's Up!</h2>

        <div
          class="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 w-full max-w-xs mx-auto"
        >
          <div
            class="text-sm text-neutral-500 uppercase font-bold tracking-wide mb-1"
          >
            Final Score
          </div>
          <div class="text-5xl font-black text-primary-600">{{ score }}</div>
        </div>

        <button
          @click="startGame"
          class="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-primary-700 hover:scale-105 transition-all shadow-lg w-full max-w-xs"
        >
          Play Again
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-bounce-short {
  animation: bounceShort 0.5s;
}

@keyframes bounceShort {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
