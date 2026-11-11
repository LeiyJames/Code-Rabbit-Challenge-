<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Laptop, Building2, Bot, Award } from "lucide-vue-next";

function getPollIcon(id: string) {
  switch (id) {
    case "fav-framework":
      return Laptop;
    case "work-pref":
      return Building2;
    case "ai-impact":
      return Bot;
    default:
      return Award;
  }
}

// --- Types ---

type PollOption = {
  id: string;
  text: string;
  votes: number;
};

type Poll = {
  id: string;
  question: string;
  options: PollOption[];
  deadline?: number; // timestamp
  isClosed?: boolean;
  totalVotes: number;
  category: string;
  icon: string;
  color: string;
};

// --- Data ---

const POLLS_DATA: Poll[] = [
  {
    id: "fav-framework",
    question: "What is your favorite frontend framework in 2024?",
    category: "Development",
    icon: "laptop",
    color: "from-blue-500 to-indigo-600",
    totalVotes: 1240,
    options: [
      { id: "vue", text: "Vue.js", votes: 450 },
      { id: "react", text: "React", votes: 520 },
      { id: "svelte", text: "Svelte", votes: 180 },
      { id: "angular", text: "Angular", votes: 90 },
    ],
  },
  {
    id: "work-pref",
    question: "What is your ideal work environment?",
    category: "Lifestyle",
    icon: "office",
    color: "from-emerald-400 to-teal-500",
    totalVotes: 856,
    options: [
      { id: "remote", text: "Fully Remote", votes: 500 },
      { id: "hybrid", text: "Hybrid (1-2 days office)", votes: 300 },
      { id: "office", text: "Office / On-site", votes: 56 },
    ],
  },
  {
    id: "ai-impact",
    question: "Will AI replace software engineers?",
    category: "Technology",
    icon: "bot",
    color: "from-purple-500 to-pink-500",
    totalVotes: 2341,
    // Setting a fake deadline for demo purposes (1 minute from now on mount)
    deadline: Date.now() + 60000,
    options: [
      { id: "yes", text: "Yes, completely", votes: 120 },
      { id: "augment", text: "No, it will augment us", votes: 2100 },
      { id: "no", text: "No, it's just a tool", votes: 121 },
    ],
  },
];

// --- State ---

const polls = ref<Poll[]>(JSON.parse(JSON.stringify(POLLS_DATA))); // Deep copy to mutate
const selectedPollId = ref<string | null>(null);
const userVotes = ref<Record<string, string>>({}); // pollId -> optionId
const selectedOption = ref<string | null>(null); // Currently selected radio before submitting
const now = ref(Date.now());
const timerInterval = ref<number | null>(null);

// --- Lifecycle ---

onMounted(() => {
  // Load votes from local storage
  const storedVotes = localStorage.getItem("secure-voting-history");
  if (storedVotes) {
    userVotes.value = JSON.parse(storedVotes);

    // Apply user votes to the current state (incrementing them visually for the user)
    // Note: In a real app, the backend would already include this.
    // Here we simulate the user's vote being "added" to the base count if they already voted.
    Object.entries(userVotes.value).forEach(([pollId, _]) => {
      const poll = polls.value.find((p) => p.id === pollId);
      if (poll) {
        // We assume the mocked "base" votes didn't include "me" yet, or we just show the state as is.
        // For visual feedback consistency, let's just mark it.
        // If we want to simulate the vote count incrementing, we'd need a flag to know if we already added it to the mock data.
        // Simplification: We just use the mock data + user vote overlay logic in "computed" if needed,
        // strictly speaking we'll just display the counts from `polls` and highlight the user choice.
      }
    });
  }

  // Timer for deadlines
  timerInterval.value = window.setInterval(() => {
    now.value = Date.now();
  }, 1000);

  // Fix up the dynamic deadline for the demo poll to always be "active" for a bit when first loaded,
  // or actually persist the start time?
  // For a reliable demo, let's just keep the deadline relative to mount if not voted.
  const aiPoll = polls.value.find((p) => p.id === "ai-impact");
  if (aiPoll && !userVotes.value["ai-impact"]) {
    // If user hasn't voted, give them 2 minutes from page load for the demo
    aiPoll.deadline = Date.now() + 1000 * 120;
  }
});

onUnmounted(() => {
  if (timerInterval.value) clearInterval(timerInterval.value);
});

// --- Computed ---

const activePoll = computed(() => {
  return polls.value.find((p) => p.id === selectedPollId.value);
});

const hasVotedCurrent = computed(() => {
  if (!selectedPollId.value) return false;
  return !!userVotes.value[selectedPollId.value];
});

const isPollClosed = computed(() => {
  if (!activePoll.value) return false;
  if (activePoll.value.deadline && now.value > activePoll.value.deadline)
    return true;
  return false;
});

const timeLeft = computed(() => {
  if (!activePoll.value || !activePoll.value.deadline) return "";
  const diff = activePoll.value.deadline - now.value;
  if (diff <= 0) return "Closed";

  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
});

// Calculate percentages dynamically
const activePollResults = computed(() => {
  if (!activePoll.value) return [];

  const poll = activePoll.value;
  const total = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return poll.options
    .map((opt) => {
      const isWinner =
        Math.max(...poll.options.map((o) => o.votes)) === opt.votes;
      const percent = total === 0 ? 0 : Math.round((opt.votes / total) * 100);

      return {
        ...opt,
        percent,
        isWinner,
        isUserChoice: userVotes.value[poll.id] === opt.id,
      };
    })
    .sort((a, b) => b.votes - a.votes); // Sort by highest votes
});

// --- Actions ---

function selectPoll(id: string) {
  selectedPollId.value = id;
  selectedOption.value = null;
}

function submitVote() {
  if (!selectedPollId.value || !selectedOption.value) return;
  if (hasVotedCurrent.value || isPollClosed.value) return;

  const poll = polls.value.find((p) => p.id === selectedPollId.value);
  if (!poll) return;

  // 1. Update Internal State (Optimistic UI)
  const option = poll.options.find((o) => o.id === selectedOption.value);
  if (option) {
    option.votes++;
    poll.totalVotes++;
  }

  // 2. Persist to LocalStorage
  userVotes.value = { ...userVotes.value, [poll.id]: selectedOption.value! };
  localStorage.setItem(
    "secure-voting-history",
    JSON.stringify(userVotes.value),
  );

  // 3. Clear selection state (UI will switch to results)
  selectedOption.value = null;
}

function formatNumber(num: number) {
  return new Intl.NumberFormat("en-US").format(num);
}

async function sharePoll() {
  if (!activePoll.value) return;

  // Find user's choice text if they voted
  let choiceText = "";
  if (hasVotedCurrent.value) {
    const choiceId = userVotes.value[activePoll.value.id];
    const choice = activePoll.value.options.find((o) => o.id === choiceId);
    if (choice) choiceText = ` I voted "${choice.text}"!`;
  }

  const text = `Check out this poll: "${activePoll.value.question}"${choiceText} #SecureVote`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Cast your vote!",
        text: text,
      });
    } catch (err) {
      // ignore
    }
  } else {
    try {
      await navigator.clipboard.writeText(text);
      alert("Poll link copied to clipboard!");
    } catch (err) {
      console.error(err);
    }
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 font-sans">
    <!-- 1. Poll Selection (Home) -->
    <div v-if="!selectedPollId" class="space-y-8 animate-fade-in">
      <div class="text-center mb-12">
        <h1
          class="text-4xl font-extrabold text-neutral-900 mb-4 tracking-tight"
        >
          Secure Voting
        </h1>
        <p class="text-lg text-neutral-600">
          A client-side secure voting simulation. One user, one vote.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <button
          v-for="poll in polls"
          :key="poll.id"
          @click="selectPoll(poll.id)"
          class="group relative bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left flex flex-col h-full"
        >
          <!-- Gradient Top Bar -->
          <div
            class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r"
            :class="poll.color"
          ></div>

          <div class="mb-4">
            <div class="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 mb-3">
              <component :is="getPollIcon(poll.id)" class="w-5 h-5" />
            </div>
            <div
              class="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1"
            >
              {{ poll.category }}
            </div>
            <h3
              class="text-lg font-bold text-neutral-900 leading-tight group-hover:text-primary-600 transition-colors"
            >
              {{ poll.question }}
            </h3>
          </div>

          <div
            class="mt-auto flex items-center justify-between text-sm text-neutral-500"
          >
            <span>{{ formatNumber(poll.totalVotes) }} votes</span>
            <span
              v-if="userVotes[poll.id]"
              class="flex items-center gap-1 text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              Voted
            </span>
            <span
              v-else
              class="text-primary-500 font-medium group-hover:translate-x-1 transition-transform"
            >
              Vote Now &rarr;
            </span>
          </div>
        </button>
      </div>
    </div>

    <!-- 2. Active Poll View -->
    <div v-else-if="activePoll" class="max-w-xl mx-auto animate-slide-up">
      <!-- Nav -->
      <button
        @click="selectedPollId = null"
        class="mb-6 text-neutral-500 hover:text-neutral-900 flex items-center gap-2 transition-colors font-medium text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
        Back to Polls
      </button>

      <!-- Poll Card -->
      <div
        class="bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100"
      >
        <!-- Header -->
        <div class="p-8 pb-4">
          <!-- Timer Badge -->
          <div
            v-if="activePoll.deadline"
            class="flex justify-between items-start mb-4"
          >
            <div class="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800">
              <component :is="getPollIcon(activePoll.id)" class="w-5 h-5" />
            </div>
            <div
              class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm border"
              :class="
                isPollClosed
                  ? 'bg-red-50 text-red-600 border-red-100'
                  : 'bg-blue-50 text-blue-600 border-blue-100'
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{ timeLeft }}
            </div>
          </div>

          <h2 class="text-2xl font-bold text-neutral-900 leading-snug mb-2">
            {{ activePoll.question }}
          </h2>
          <p class="text-neutral-500 text-sm">
            {{
              isPollClosed
                ? "Voting is closed"
                : hasVotedCurrent
                  ? "Thank you for voting!"
                  : "Select on option below. You can vote only once."
            }}
          </p>
        </div>

        <!-- Voting Options (Not Voted AND Not Closed) -->
        <div
          v-if="!hasVotedCurrent && !isPollClosed"
          class="p-8 pt-0 space-y-4"
        >
          <label
            v-for="option in activePoll.options"
            :key="option.id"
            class="flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group relative overflow-hidden"
            :class="
              selectedOption === option.id
                ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                : 'border-neutral-100 hover:border-neutral-300 hover:bg-neutral-50'
            "
          >
            <div class="relative z-10 flex items-center w-full">
              <input
                type="radio"
                name="poll-option"
                :value="option.id"
                v-model="selectedOption"
                class="w-5 h-5 text-primary-600 focus:ring-primary-500 border-neutral-300 mr-4"
              />
              <span
                class="font-medium text-neutral-700 group-hover:text-neutral-900"
              >
                {{ option.text }}
              </span>
            </div>
          </label>

          <button
            @click="submitVote"
            :disabled="!selectedOption"
            class="w-full mt-6 py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            :class="
              selectedOption
                ? 'bg-neutral-900 hover:bg-neutral-800 hover:scale-[1.02] hover:shadow-xl'
                : 'bg-neutral-300 cursor-not-allowed'
            "
          >
            <span>Submit Vote</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        <!-- Results View (Voted OR Closed) -->
        <div v-else class="p-8 pt-0 space-y-6">
          <div class="space-y-4">
            <div
              v-for="result in activePollResults"
              :key="result.id"
              class="relative"
            >
              <!-- Bar Background -->
              <div
                class="flex items-center justify-between text-sm mb-1 z-10 relative"
              >
                <span class="font-medium flex items-center gap-2">
                  {{ result.text }}
                  <span
                    v-if="result.isUserChoice"
                    class="text-xs font-bold text-white bg-neutral-900 px-1.5 py-0.5 rounded ml-1"
                    title="You voted for this"
                    >YOU</span
                  >
                  <Award
                    v-if="result.isWinner"
                    class="w-4 h-4 text-amber-500 inline ml-1"
                    title="Leading"
                  />
                </span>
                <span class="font-bold tabular-nums"
                  >{{ result.percent }}%</span
                >
              </div>

              <div
                class="h-10 w-full bg-neutral-100 rounded-lg overflow-hidden relative"
              >
                <!-- Data Bar -->
                <div
                  class="h-full transition-all duration-1000 ease-out flex items-center pl-3"
                  :class="[
                    result.isWinner ? 'bg-gradient-to-r' : 'bg-neutral-300',
                    result.isWinner ? activePoll.color : '',
                  ]"
                  :style="{ width: `${result.percent}%` }"
                ></div>

                <!-- Votes Count Overlay (optional, inside bar if fits, else outside) -->
                <div
                  class="absolute inset-0 flex items-center justify-end pr-3 pointer-events-none"
                >
                  <span
                    class="text-xs font-medium text-neutral-500 mix-blend-multiply"
                    >{{ formatNumber(result.votes) }} votes</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Total Info -->
          <div
            class="pt-6 border-t border-neutral-100 text-center text-sm text-neutral-400"
          >
            Total votes cast:
            <span class="text-neutral-900 font-bold">{{
              formatNumber(activePoll.totalVotes)
            }}</span>
          </div>

          <!-- Share Button -->
          <button
            @click="sharePoll"
            class="w-full py-4 rounded-xl border-2 border-neutral-100 font-bold text-neutral-600 hover:border-neutral-200 hover:bg-neutral-50 transition-all flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Share Poll
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
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
