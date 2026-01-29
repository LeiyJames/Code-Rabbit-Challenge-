<template>
  <div
    class="h-full flex flex-col p-6 bg-slate-900 min-h-[600px] gap-6 text-slate-200 font-sans"
  >
    <!-- Top Bar: Request Config -->
    <div
      class="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-xl flex flex-col gap-4"
    >
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Method Selector -->
        <div class="relative min-w-[120px]">
          <select
            v-model="method"
            class="w-full h-full appearance-none bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            :class="methodColor"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <div
            class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"
          >
            <svg
              class="w-4 h-4 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <!-- URL Input -->
        <div class="flex-1 relative">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <span class="text-slate-500 text-sm font-mono"
              >https://api.mock.com</span
            >
          </div>
          <input
            v-model="endpoint"
            placeholder="/users"
            class="w-full h-full bg-slate-900 border border-slate-700 rounded-lg pl-[170px] pr-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-600"
            @keydown.enter="sendRequest"
          />
        </div>

        <!-- Send Button -->
        <button
          @click="sendRequest"
          :disabled="isLoading"
          class="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold px-8 py-3 rounded-lg transition-all shadow-lg active:scale-95 flex items-center justify-center min-w-[100px]"
        >
          <svg
            v-if="isLoading"
            class="animate-spin h-5 w-5 mr-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span v-else>Send</span>
        </button>
      </div>

      <!-- Settings / Tabs -->
      <div
        class="flex items-center gap-6 text-sm border-t border-slate-700 pt-4"
      >
        <div class="flex gap-4">
          <button
            @click="activeTab = 'params'"
            :class="[
              'pb-1 border-b-2 transition-colors',
              activeTab === 'params'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-slate-500 hover:text-slate-300',
            ]"
          >
            Params
          </button>
          <button
            @click="activeTab = 'body'"
            :class="[
              'pb-1 border-b-2 transition-colors',
              activeTab === 'body'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-slate-500 hover:text-slate-300',
            ]"
          >
            Body
          </button>
          <button
            @click="activeTab = 'headers'"
            :class="[
              'pb-1 border-b-2 transition-colors',
              activeTab === 'headers'
                ? 'border-blue-500 text-white'
                : 'border-transparent text-slate-500 hover:text-slate-300',
            ]"
          >
            Headers
          </button>
        </div>
        <div class="h-4 w-px bg-slate-700 mx-2"></div>
        <!-- Simulation Controls -->
        <div class="flex items-center gap-4 text-xs text-slate-400">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="settings.simulateError"
              class="rounded border-slate-600 bg-slate-800 text-red-500 focus:ring-offset-slate-900 focus:ring-red-500"
            />
            Force Error
          </label>
          <div class="flex items-center gap-2">
            <span>Delay: {{ settings.delay }}ms</span>
            <input
              type="range"
              v-model.number="settings.delay"
              min="0"
              max="3000"
              step="100"
              class="w-24 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Split -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
      <!-- Left Panel: Request Details -->
      <div
        class="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 flex flex-col overflow-hidden"
      >
        <div v-if="activeTab === 'body'" class="flex-1 flex flex-col">
          <div class="text-xs font-bold text-slate-500 uppercase mb-2">
            Request Body (JSON)
          </div>
          <textarea
            v-model="requestBody"
            class="flex-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-3 font-mono text-sm text-green-400 focus:ring-1 focus:ring-slate-500 outline-none resize-none"
            placeholder="{ 'key': 'value' }"
          ></textarea>
        </div>
        <div
          v-else
          class="flex-1 flex flex-col items-center justify-center text-slate-600 text-sm italic"
        >
          No options configured for {{ activeTab }}.
        </div>
      </div>

      <!-- Right Panel: Response -->
      <div
        class="bg-slate-800 rounded-xl border border-slate-700 flex flex-col overflow-hidden shadow-inner bg-opacity-75"
      >
        <div
          class="bg-slate-900 border-b border-slate-700 p-3 flex justify-between items-center"
        >
          <span
            class="text-xs font-bold text-slate-500 uppercase tracking-widest"
            >Response</span
          >
          <div
            v-if="response"
            class="flex items-center gap-3 text-xs font-mono"
          >
            <span
              :class="[
                'px-2 py-0.5 rounded',
                response.status >= 200 && response.status < 300
                  ? 'bg-green-900/30 text-green-400'
                  : 'bg-red-900/30 text-red-400',
              ]"
            >
              {{ response.status }} {{ response.statusText }}
            </span>
            <span class="text-slate-400">{{ response.time }}ms</span>
            <span class="text-slate-400">{{ response.size }}KB</span>
          </div>
        </div>

        <div class="flex-1 relative overflow-hidden">
          <!-- Empty State -->
          <div
            v-if="!response && !isLoading"
            class="absolute inset-0 flex flex-col items-center justify-center text-slate-600"
          >
            <svg
              class="w-12 h-12 mb-3 opacity-20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div class="text-sm">Ready to send request</div>
          </div>

          <!-- Loading State -->
          <div
            v-if="isLoading"
            class="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/50 backdrop-blur-sm z-10"
          >
            <div class="text-blue-400 font-mono text-sm animate-pulse">
              Sending Request...
            </div>
          </div>

          <!-- Code View -->
          <div
            v-if="response"
            class="h-full overflow-auto p-4 custom-scrollbar"
          >
            <pre class="font-mono text-sm text-blue-300 leading-relaxed">{{
              response.data
            }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const method = ref("GET");
const endpoint = ref("/users");
const activeTab = ref("body");
const isLoading = ref(false);
const requestBody = ref('{\n  "name": "John Doe",\n  "job": "Developer"\n}');

const settings = ref({
  delay: 800,
  simulateError: false,
});

interface MockResponse {
  status: number;
  statusText: string;
  time: number;
  size: number;
  data: any;
}

const response = ref<MockResponse | null>(null);

const methodColor = computed(() => {
  switch (method.value) {
    case "GET":
      return "text-purple-400";
    case "POST":
      return "text-green-400";
    case "PUT":
      return "text-orange-400";
    case "DELETE":
      return "text-red-400";
    default:
      return "text-slate-200";
  }
});

// Simulated Database
const mockDB = {
  users: [
    { id: 1, name: "Alice Smith", email: "alice@example.com", role: "admin" },
    { id: 2, name: "Bob Jones", email: "bob@example.com", role: "user" },
    {
      id: 3,
      name: "Charlie Day",
      email: "charlie@example.com",
      role: "editor",
    },
  ],
  todos: [
    { id: 101, title: "Fix login bug", completed: false },
    { id: 102, title: "Write tests", completed: true },
  ],
};

function sendRequest() {
  isLoading.value = true;
  response.value = null;

  const startTime = performance.now();

  setTimeout(() => {
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    // Simulate Error
    if (settings.value.simulateError) {
      response.value = {
        status: 500,
        statusText: "Internal Server Error",
        time: duration,
        size: 0.12,
        data: {
          error: "InternalServerError",
          message: "Something went wrong on the server.",
          timestamp: new Date().toISOString(),
        },
      };
      isLoading.value = false;
      return;
    }

    // Simulate Success Logic
    let data: any = {};
    let status = 200;
    let statusText = "OK";

    // Simple routing logic for simulation
    const path = endpoint.value.split("?")[0].replace(/^\//, "");

    if (path === "users") {
      if (method.value === "GET") {
        data = mockDB.users;
      } else if (method.value === "POST") {
        status = 201;
        statusText = "Created";
        try {
          const body = JSON.parse(requestBody.value);
          data = {
            id: Math.floor(Math.random() * 1000),
            ...body,
            createdAt: new Date().toISOString(),
          };
        } catch (e) {
          status = 400;
          statusText = "Bad Request";
          data = { error: "Invalid JSON in request body" };
        }
      }
    } else if (path === "todos") {
      if (method.value === "GET") data = mockDB.todos;
    } else {
      // Fallback for unknown routes
      if (method.value === "GET") {
        data = { message: `Simulated GET response from /${path}` };
      } else {
        try {
          const body = JSON.parse(requestBody.value);
          data = { message: `Recieved ${method.value}`, echo: body };
        } catch (e) {
          data = { message: `Simulated ${method.value} response` };
        }
      }
    }

    response.value = {
      status,
      statusText,
      time: duration,
      size: Number((JSON.stringify(data).length / 1024).toFixed(2)),
      data,
    };

    isLoading.value = false;
  }, settings.value.delay);
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #0f172a;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>
