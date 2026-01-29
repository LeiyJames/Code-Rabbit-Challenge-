<script setup lang="ts">
import { ref, computed } from "vue";

// --- Types ---

type Question = {
  id: number;
  text: string;
  choices: string[];
  correctAnswer: number; // index 0-3
};

type Quiz = {
  id: string;
  title: string;
  description: string;
  passingScore: number; // percentage
  timeLimit?: number; // optional seconds
  questions: Question[];
  category: string;
  icon: string;
  color: string;
};

// --- Data ---

const quizzes: Quiz[] = [
  {
    id: "js-basics",
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of the core concepts of JavaScript.",
    passingScore: 70,
    category: "Development",
    icon: "⚡",
    color: "from-yellow-400 to-orange-500",
    questions: [
      {
        id: 1,
        text: "Which operator is used to check for both value and type equality?",
        choices: ["==", "===", "=", "!="],
        correctAnswer: 1,
      },
      {
        id: 2,
        text: "What is the output of typeof []?",
        choices: ['"array"', '"object"', '"undefined"', '"list"'],
        correctAnswer: 1,
      },
      {
        id: 3,
        text: "Which method removes the last element from an array?",
        choices: ["shift()", "pop()", "push()", "splice()"],
        correctAnswer: 1,
      },
      {
        id: 4,
        text: "How do you declare a variable that cannot be reassigned?",
        choices: ["var", "let", "const", "static"],
        correctAnswer: 2,
      },
      {
        id: 5,
        text: "Which of these is NOT a primitive type in JavaScript?",
        choices: ["Boolean", "String", "Object", "Symbol"],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "ux-design",
    title: "UX Design Principles",
    description: "Challenge your understanding of user experience design.",
    passingScore: 75,
    category: "Design",
    icon: "🎨",
    color: "from-purple-400 to-pink-500",
    questions: [
      {
        id: 1,
        text: 'What does "white space" refer to in design?',
        choices: [
          "Empty space around elements",
          "White colored background",
          "The header area",
          "Text spacing",
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        text: 'Which law states that "time to acquire a target is a function of the distance to and size of the target"?',
        choices: ["Hick's Law", "Fitts's Law", "Jakob's Law", "Miller's Law"],
        correctAnswer: 1,
      },
      {
        id: 3,
        text: "What is the primary goal of wireframing?",
        choices: [
          "Visual Design",
          "Code Structure",
          "Structure & Layout",
          "Final Polish",
        ],
        correctAnswer: 2,
      },
      {
        id: 4,
        text: "Contrast ratio recommendations primarily address which aspect of UX?",
        choices: ["Navigation", "Accessibility", "Performance", "Animation"],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "security-essentials",
    title: "Security Essentials",
    description: "Test your awareness of fundamental cybersecurity practices.",
    passingScore: 80,
    category: "Security",
    icon: "🛡️",
    color: "from-blue-500 to-cyan-500",
    questions: [
      {
        id: 1,
        text: "What is the most effective way to prevent unauthorized access?",
        choices: [
          "Strong Passwords",
          "Multi-Factor Authentication (MFA)",
          "Antivirus Software",
          "Firewalls",
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        text: 'What does "Phishing" primarily rely on?',
        choices: [
          "Technical Exploits",
          "Social Engineering",
          "Brute Force",
          "Malware",
        ],
        correctAnswer: 1,
      },
      {
        id: 3,
        text: "Which protocol ensures secure communication over a computer network?",
        choices: ["HTTP", "FTP", "HTTPS", "SMTP"],
        correctAnswer: 2,
      },
      {
        id: 4,
        text: 'What is "Ransomware"?',
        choices: [
          "Adware",
          "Spyware",
          "Malware that encrypts files",
          "Network scanner",
        ],
        correctAnswer: 2,
      },
      {
        id: 5,
        text: 'What is the principle of "Least Privilege"?',
        choices: [
          "Giving users all access",
          "Giving users only necessary access",
          "No access at all",
          "Admin access for everyone",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "it-support",
    title: "IT Support Fundamentals",
    description: "Basics of troubleshooting and IT infrastructure support.",
    passingScore: 70,
    category: "Operations",
    icon: "💻",
    color: "from-emerald-400 to-green-600",
    questions: [
      {
        id: 1,
        text: "What is the first step in the troubleshooting process?",
        choices: [
          "Establish a plan of action",
          "Identify the problem",
          "Test the theory",
          "Document findings",
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        text: "Which command is used to test network connectivity?",
        choices: ["ipconfig", "ping", "tracert", "netstat"],
        correctAnswer: 1,
      },
      {
        id: 3,
        text: "What does BIOS stand for?",
        choices: [
          "Basic Input Output System",
          "Binary Input Operating System",
          "Basic Internal Operating Software",
          "Built-In Operating System",
        ],
        correctAnswer: 0,
      },
      {
        id: 4,
        text: 'Which component is considered the "brain" of the computer?',
        choices: ["RAM", "Hard Drive", "CPU", "Motherboard"],
        correctAnswer: 2,
      },
      {
        id: 5,
        text: "What does DHCP do?",
        choices: [
          "Resolves domain names",
          "Assigns IP addresses",
          "Routes traffic",
          "Filters packets",
        ],
        correctAnswer: 1,
      },
    ],
  },
];

// --- State ---

type Screen = "selection" | "landing" | "quiz" | "result";

const currentScreen = ref<Screen>("selection");
const selectedQuiz = ref<Quiz | null>(null);
const currentQuestions = ref<Question[]>([]); // Store shuffled questions
const currentQuestionIndex = ref(0);
const answers = ref<number[]>([]); // Store indices of selected answers
const startTime = ref(0);
const endTime = ref(0);

// --- Computed ---

const currentQuestion = computed(() => {
  if (!currentQuestions.value.length) return null;
  return currentQuestions.value[currentQuestionIndex.value];
});

const progress = computed(() => {
  if (!currentQuestions.value.length) return 0;
  return (currentQuestionIndex.value / currentQuestions.value.length) * 100;
});

const totalTime = computed(() => {
  const diff = endTime.value - startTime.value;
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
});

const results = computed(() => {
  if (!selectedQuiz.value)
    return { correct: 0, total: 0, percentage: 0, passed: false };

  let correct = 0;
  answers.value.forEach((answer, index) => {
    // We compare with currentQuestions which are the ones the user actually answered
    if (answer === currentQuestions.value[index].correctAnswer) {
      correct++;
    }
  });

  const total = currentQuestions.value.length;
  const percentage = Math.round((correct / total) * 100);
  const passed = percentage >= selectedQuiz.value.passingScore;

  return { correct, total, percentage, passed };
});

// --- Actions ---

// Improved shuffle (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function selectQuiz(quiz: Quiz) {
  selectedQuiz.value = quiz;
  currentScreen.value = "landing";
  // Initial shuffle happens when we start
}

function startQuiz() {
  if (selectedQuiz.value) {
    currentQuestions.value = shuffleArray(selectedQuiz.value.questions);
  }
  resetQuizState();
  currentScreen.value = "quiz";
  startTime.value = performance.now();
}

function handleAnswer(choiceIndex: number) {
  answers.value.push(choiceIndex);

  if (currentQuestionIndex.value < currentQuestions.value.length - 1) {
    setTimeout(() => {
      currentQuestionIndex.value++;
    }, 250);
  } else {
    completeQuiz();
  }
}

function completeQuiz() {
  endTime.value = performance.now();
  currentScreen.value = "result";
}

function resetQuizState() {
  currentQuestionIndex.value = 0;
  answers.value = [];
  startTime.value = 0;
  endTime.value = 0;
}

function returnToSelection() {
  currentScreen.value = "selection";
  selectedQuiz.value = null;
  currentQuestions.value = [];
  resetQuizState();
}

function retryQuiz() {
  // Requirement: "make the quiz shuffle question and new question then try again"
  if (selectedQuiz.value) {
    currentQuestions.value = shuffleArray(selectedQuiz.value.questions);
  }
  resetQuizState();
  currentScreen.value = "quiz"; // Jump straight to quiz or landing? "try again" implies starting over. usually jumps to start.
  // Let's jump to landing if we want them to see the title again, but typically retry restarts the quiz immediately.
  // However, the function `retryQuiz` in the previous version went to 'landing'. I'll keep it as 'landing' or 'quiz'.
  // Since we just shuffled, let's go to landing so they can hit "Start" again or just auto-start?
  // Let's stick to 'landing' for consistency with previous behavior, but actually previous behavior was:
  // retryQuiz -> reset -> landing.
  // The user requirement says "shuffle question ... then try again".
  // I will make retry go to landing, but ensure startQuiz re-shuffles too if needed, but startQuiz already calls shuffle.
  // Wait, if I shuffle here, then startQuiz will overwrite it.
  // Let's make startQuiz satisfy the shuffle requirement.
  currentScreen.value = "landing";
}

// In startQuiz() I added the shuffle logic. So retryQuiz -> landing -> startQuiz (shuffles) works perfectly.

async function shareResults() {
  if (!selectedQuiz.value) return;

  const text = `I scored ${results.value.correct}/${results.value.total} on the ${selectedQuiz.value.title} Quiz in ${totalTime.value} 🚀`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Quiz Results",
        text: text,
      });
    } catch (err) {
      console.log("Share canceled");
    }
  } else {
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(text);
      alert("Result copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy", err);
    }
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 md:p-8 font-sans">
    <!-- Header / Nav (when applicable) -->
    <div
      v-if="currentScreen !== 'selection'"
      class="mb-8 flex items-center justify-between"
    >
      <button
        @click="returnToSelection"
        class="text-neutral-500 hover:text-neutral-800 transition-colors flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
        Back to Quizzes
      </button>

      <div v-if="selectedQuiz" class="text-sm font-medium text-neutral-400">
        {{ selectedQuiz.category }}
      </div>
    </div>

    <!-- 1. Selection Screen -->
    <div v-if="currentScreen === 'selection'" class="space-y-8 animate-fade-in">
      <div class="text-center space-y-4 mb-12">
        <h1
          class="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl"
        >
          Quiz Engine
        </h1>
        <p class="text-lg text-neutral-600 max-w-2xl mx-auto">
          Challenge yourself with our curated collection of interactive quizzes.
          Select a topic to begin.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <button
          v-for="quiz in quizzes"
          :key="quiz.id"
          @click="selectQuiz(quiz)"
          class="group relative overflow-hidden bg-white hover:shadow-xl transition-all duration-300 rounded-2xl p-8 text-left border border-neutral-100 hover:border-neutral-200"
        >
          <!-- Gradient Background on Hover -->
          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br"
            :class="quiz.color"
          ></div>

          <div class="relative z-10 flex items-start justify-between">
            <div>
              <span class="text-4xl mb-4 block">{{ quiz.icon }}</span>
              <h3
                class="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors"
              >
                {{ quiz.title }}
              </h3>
              <p class="text-neutral-500 text-sm leading-relaxed mb-4">
                {{ quiz.description }}
              </p>

              <div
                class="flex items-center gap-4 text-xs font-semibold tracking-wide uppercase text-neutral-400"
              >
                <span>{{ quiz.questions.length }} Questions</span>
                <span>•</span>
                <span>Pass: {{ quiz.passingScore }}%</span>
              </div>
            </div>

            <div
              class="bg-neutral-50 rounded-full p-3 group-hover:bg-white group-hover:shadow-md transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-neutral-400 group-hover:text-neutral-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- 2. Landing Screen -->
    <div
      v-else-if="currentScreen === 'landing' && selectedQuiz"
      class="max-w-2xl mx-auto text-center space-y-8 py-12 animate-fade-in"
    >
      <div
        class="w-24 h-24 mx-auto bg-gradient-to-br rounded-3xl flex items-center justify-center text-5xl shadow-lg mb-6"
        :class="selectedQuiz.color"
      >
        {{ selectedQuiz.icon }}
      </div>

      <h2 class="text-3xl font-bold text-neutral-900">
        {{ selectedQuiz.title }}
      </h2>

      <p class="text-xl text-neutral-600 leading-relaxed">
        {{ selectedQuiz.description }}
      </p>

      <div
        class="flex items-center justify-center gap-8 py-8 border-y border-neutral-100"
      >
        <div class="text-center">
          <div class="text-2xl font-bold text-neutral-900">
            {{ selectedQuiz.questions.length }}
          </div>
          <div class="text-xs uppercase tracking-wide text-neutral-400">
            Questions
          </div>
        </div>
        <div class="w-px h-12 bg-neutral-100"></div>
        <div class="text-center">
          <div class="text-2xl font-bold text-neutral-900">
            {{ selectedQuiz.passingScore }}%
          </div>
          <div class="text-xs uppercase tracking-wide text-neutral-400">
            To Pass
          </div>
        </div>
      </div>

      <button
        @click="startQuiz"
        class="w-full bg-neutral-900 text-white text-lg font-bold py-4 px-8 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl hover:shadow-2xl shadow-neutral-900/20"
      >
        Start Quiz
      </button>
    </div>

    <!-- 3. Quiz Active -->
    <div
      v-else-if="currentScreen === 'quiz' && selectedQuiz && currentQuestion"
      class="max-w-2xl mx-auto py-8"
    >
      <!-- Progress Bar -->
      <div class="mb-8">
        <div
          class="flex justify-between text-sm font-medium text-neutral-400 mb-2"
        >
          <span
            >Question {{ currentQuestionIndex + 1 }} of
            {{ currentQuestions.length }}</span
          >
          <span>{{ Math.round(progress) }}% completed</span>
        </div>
        <div class="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-neutral-900 transition-all duration-500 ease-out"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>

      <!-- Question -->
      <div class="mb-10 animate-slide-up">
        <h3 class="text-2xl font-bold text-neutral-900 leading-snug">
          {{ currentQuestion.text }}
        </h3>
      </div>

      <!-- Answers -->
      <div class="grid gap-4">
        <button
          v-for="(choice, index) in currentQuestion.choices"
          :key="index"
          @click="handleAnswer(index)"
          class="group text-left p-6 rounded-xl border-2 border-neutral-100 hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 flex items-center justify-between"
        >
          <span
            class="text-lg font-medium text-neutral-700 group-hover:text-primary-700"
          >
            {{ choice }}
          </span>

          <div
            class="w-6 h-6 rounded-full border-2 border-neutral-200 group-hover:border-primary-500 flex items-center justify-center"
          >
            <div
              class="w-2.5 h-2.5 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>
          </div>
        </button>
      </div>
    </div>

    <!-- 4. Results Screen -->
    <div
      v-else-if="currentScreen === 'result' && selectedQuiz"
      class="max-w-xl mx-auto text-center py-12 animate-fade-in"
    >
      <div
        class="inline-flex items-center justify-center p-4 rounded-full mb-8 ring-8 ring-opacity-50"
        :class="
          results.passed
            ? 'bg-green-100 text-green-600 ring-green-50'
            : 'bg-red-100 text-red-600 ring-red-50'
        "
      >
        <svg
          v-if="results.passed"
          xmlns="http://www.w3.org/2000/svg"
          class="h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h2 class="text-4xl font-extrabold text-neutral-900 mb-2">
        {{ results.passed ? "Quiz Passed!" : "Quiz Failed" }}
      </h2>

      <p class="text-lg text-neutral-500 mb-10">
        You scored {{ results.percentage }}% on {{ selectedQuiz.title }}
      </p>

      <div class="grid grid-cols-2 gap-4 mb-10">
        <div class="bg-neutral-50 p-6 rounded-2xl">
          <div class="text-3xl font-bold text-neutral-900 mb-1">
            {{ results.correct }}/{{ results.total }}
          </div>
          <div
            class="text-xs font-semibold uppercase tracking-wider text-neutral-400"
          >
            Correct Answers
          </div>
        </div>
        <div class="bg-neutral-50 p-6 rounded-2xl">
          <div class="text-3xl font-bold text-neutral-900 mb-1">
            {{ totalTime }}
          </div>
          <div
            class="text-xs font-semibold uppercase tracking-wider text-neutral-400"
          >
            Time Taken
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <button
          @click="shareResults"
          class="w-full bg-neutral-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"
            />
          </svg>
          Share Result
        </button>

        <button
          @click="retryQuiz"
          class="w-full bg-white border-2 border-neutral-100 text-neutral-900 font-bold py-4 rounded-xl hover:bg-neutral-50 transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.4s ease-out;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
