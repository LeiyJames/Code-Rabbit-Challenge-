<template>
  <div class="h-full flex flex-col p-6 bg-slate-50 min-h-[600px] gap-6">
    <!-- Header -->
    <div
      class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-4 justify-between items-center"
    >
      <div>
        <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
          <svg
            class="w-6 h-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          Phishing Detector
        </h2>
        <p class="text-slate-500 text-sm mt-1">
          Identify phishing attempts across Emails, SMS, Chat, and Websites.
        </p>
      </div>
      <div>
        <div class="bg-slate-100 rounded-lg p-1 flex">
          <button
            class="px-4 py-1.5 rounded-md text-sm font-medium transition-all bg-white shadow text-slate-800"
          >
            Practice Mode
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
      <!-- Scenario List Sidebar -->
      <div
        class="lg:w-1/4 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden"
      >
        <div
          class="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-700 flex justify-between"
        >
          <span>Scenarios</span>
          <span
            class="bg-slate-200 text-slate-600 px-2 rounded-full text-xs flex items-center"
            >{{ scenarios.length }}</span
          >
        </div>
        <div class="overflow-y-auto flex-1 p-2 space-y-1">
          <button
            v-for="item in scenarios"
            :key="item.id"
            @click="selectScenario(item)"
            :class="[
              'w-full text-left p-3 rounded-lg border transition-all',
              selectedScenario?.id === item.id
                ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-500/20'
                : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200',
            ]"
          >
            <div class="flex justify-between items-start mb-1">
              <div class="flex items-center gap-2 max-w-[70%]">
                <!-- Type Icon -->
                <span class="text-slate-400 flex-shrink-0" :title="item.type">
                  <!-- Email -->
                  <svg
                    v-if="item.type === 'email'"
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <!-- SMS -->
                  <svg
                    v-else-if="item.type === 'sms'"
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <!-- Chat -->
                  <svg
                    v-else-if="item.type === 'chat'"
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                  <!-- URL -->
                  <svg
                    v-else-if="item.type === 'url'"
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </span>
                <span class="font-bold text-slate-800 text-sm truncate">{{
                  item.senderName
                }}</span>
              </div>
              <span class="text-xs text-slate-400 whitespace-nowrap">{{
                item.time
              }}</span>
            </div>

            <!-- Subject/Preview logic varies by type -->
            <div
              v-if="item.type !== 'sms'"
              class="text-sm font-medium text-slate-600 truncate"
            >
              {{ item.subject || "Message" }}
            </div>
            <div class="text-xs text-slate-400 line-clamp-2 mt-1">
              {{ item.preview }}
            </div>

            <!-- Completion Indicator -->
            <div
              v-if="item.verdict !== null"
              :class="[
                'mt-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full w-fit',
                item.verdict === item.isPhishing
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700',
              ]"
            >
              {{ item.verdict === item.isPhishing ? "Correct" : "Incorrect" }}
            </div>
          </button>
        </div>
      </div>

      <!-- Main Viewer Area -->
      <div
        v-if="selectedScenario"
        class="lg:w-3/4 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden relative"
      >
        <!-- Action Bar (Verdict) - Overlay on bottom right -->
        <div
          v-if="selectedScenario.verdict === null"
          class="absolute bottom-6 right-6 flex gap-4 z-50"
        >
          <button
            @click="makeVerdict(false)"
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg font-bold transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <svg
              class="w-5 h-5"
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
            Safe
          </button>
          <button
            @click="makeVerdict(true)"
            class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg font-bold transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Phishing
          </button>
        </div>

        <!-- Result/Feedback Banner -->
        <div
          v-if="selectedScenario.verdict !== null"
          :class="[
            'p-4 flex flex-col md:flex-row items-start gap-4 border-b z-40 relative',
            selectedScenario.verdict === selectedScenario.isPhishing
              ? 'bg-green-50 border-green-100'
              : 'bg-red-50 border-red-100',
          ]"
        >
          <div class="flex items-start gap-4 flex-1">
            <div
              :class="[
                'p-2 rounded-full flex-shrink-0',
                selectedScenario.verdict === selectedScenario.isPhishing
                  ? 'bg-green-200 text-green-700'
                  : 'bg-red-200 text-red-700',
              ]"
            >
              <svg
                v-if="selectedScenario.verdict === selectedScenario.isPhishing"
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <svg
                v-else
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div>
              <h3
                :class="[
                  'font-bold',
                  selectedScenario.verdict === selectedScenario.isPhishing
                    ? 'text-green-800'
                    : 'text-red-800',
                ]"
              >
                {{
                  selectedScenario.verdict === selectedScenario.isPhishing
                    ? "Correct Analysis!"
                    : "Incorrect Verdict"
                }}
              </h3>
              <p
                :class="[
                  'text-sm mt-1',
                  selectedScenario.verdict === selectedScenario.isPhishing
                    ? 'text-green-700'
                    : 'text-red-700',
                ]"
              >
                This scenario is
                <strong>{{
                  selectedScenario.isPhishing ? "PHISHING" : "SAFE"
                }}</strong
                >.
              </p>
            </div>
          </div>

          <div class="w-full md:w-auto flex flex-col items-end gap-2">
            <button
              @click="resetVerdict"
              class="text-sm underline text-slate-500 hover:text-slate-800"
            >
              Try Again
            </button>
            <button
              @click="showAnalysis = !showAnalysis"
              class="text-xs px-3 py-1 bg-white border border-slate-300 rounded-md font-medium text-slate-600 hover:bg-slate-50"
            >
              {{ showAnalysis ? "Hide Analysis" : "Show Analysis" }}
            </button>
          </div>
        </div>

        <!-- Viewport Area (Simulates different apps) -->
        <div
          class="flex-1 overflow-y-auto bg-slate-100 relative p-4 md:p-8 flex justify-center"
        >
          <!-- EMAIL VIEW -->
          <div
            v-if="selectedScenario.type === 'email'"
            class="w-full max-w-3xl bg-white rounded shadow-sm border border-slate-200 min-h-[500px]"
          >
            <div class="border-b border-slate-100 p-6 bg-slate-50/50">
              <h1 class="text-xl md:text-2xl font-bold text-slate-800 mb-4">
                {{ selectedScenario.subject }}
              </h1>
              <div class="flex items-start gap-3">
                <div
                  class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg"
                >
                  {{ selectedScenario.senderName[0] }}
                </div>
                <div class="flex-1">
                  <div class="flex flex-wrap items-baseline gap-2">
                    <span class="font-bold text-slate-800">{{
                      selectedScenario.senderName
                    }}</span>
                    <span class="text-slate-500 text-sm"
                      >&lt;{{ selectedScenario.senderHandle }}&gt;</span
                    >
                  </div>
                  <div class="text-xs text-slate-400 mt-1">
                    To: Me &lt;user@company.com&gt;
                  </div>
                </div>
              </div>
            </div>
            <div class="p-8 md:p-10 prose prose-slate max-w-none">
              <div v-html="selectedScenario.content"></div>
            </div>
          </div>

          <!-- SMS VIEW -->
          <div
            v-else-if="selectedScenario.type === 'sms'"
            class="w-[320px] bg-slate-900 rounded-[30px] p-2 shadow-2xl border-4 border-slate-800 relative"
          >
            <div
              class="h-full bg-white rounded-[24px] overflow-hidden flex flex-col"
            >
              <!-- SMS Header -->
              <div
                class="bg-slate-100 p-4 border-b border-slate-200 flex items-center gap-2"
              >
                <div
                  class="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center text-xs font-bold text-slate-600"
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div class="flex-1 overflow-hidden">
                  <div class="font-bold text-sm truncate">
                    {{ selectedScenario.senderName }}
                  </div>
                  <div class="text-[10px] text-slate-500 truncate">
                    {{ selectedScenario.senderHandle }}
                  </div>
                </div>
              </div>
              <!-- SMS Body -->
              <div class="flex-1 bg-white p-4 space-y-4">
                <div
                  class="text-center text-[10px] text-slate-400 font-medium uppercase tracking-wide"
                >
                  Today {{ selectedScenario.time }}
                </div>
                <div
                  class="bg-slate-100 p-3 rounded-2xl rounded-tl-sm text-sm text-slate-800 leading-relaxed shadow-sm"
                >
                  <div v-html="selectedScenario.content"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- CHAT VIEW -->
          <div
            v-else-if="selectedScenario.type === 'chat'"
            class="w-full max-w-2xl bg-white rounded-lg shadow-xl border border-slate-200 flex flex-col h-[500px]"
          >
            <!-- Chat Header -->
            <div
              class="p-3 border-b border-slate-200 bg-white flex justify-between items-center rounded-t-lg"
            >
              <div class="flex items-center gap-3">
                <div class="relative">
                  <div
                    class="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold"
                  >
                    {{ selectedScenario.senderName[0] }}
                  </div>
                  <div
                    class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"
                  ></div>
                </div>
                <div>
                  <div class="font-bold text-slate-800">
                    {{ selectedScenario.senderName }}
                  </div>
                  <div class="text-xs text-slate-500">
                    {{ selectedScenario.senderHandle }}
                  </div>
                </div>
              </div>
              <div class="text-slate-400">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </div>
            </div>
            <!-- Chat Body -->
            <div class="flex-1 bg-slate-50 p-4 space-y-4 overflow-y-auto">
              <div class="flex items-start gap-3">
                <div
                  class="w-8 h-8 bg-indigo-600 rounded flex-shrink-0 flex items-center justify-center text-white text-xs"
                >
                  {{ selectedScenario.senderName[0] }}
                </div>
                <div class="flex-1">
                  <div class="flex items-baseline gap-2 mb-1">
                    <span class="font-bold text-slate-700 text-sm">{{
                      selectedScenario.senderName
                    }}</span>
                    <span class="text-xs text-slate-400">{{
                      selectedScenario.time
                    }}</span>
                  </div>
                  <div
                    class="bg-white border border-slate-200 p-3 rounded-lg rounded-tl-none shadow-sm text-sm text-slate-700"
                  >
                    <div v-html="selectedScenario.content"></div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Chat Input -->
            <div class="p-3 bg-white border-t border-slate-200">
              <div
                class="h-10 bg-slate-100 rounded border border-slate-200"
              ></div>
            </div>
          </div>

          <!-- URL/BROWSER VIEW -->
          <div
            v-else-if="selectedScenario.type === 'url'"
            class="w-full max-w-3xl bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden h-[500px] flex flex-col"
          >
            <!-- Browser Chrome -->
            <div
              class="bg-slate-100 border-b border-slate-200 p-2 flex items-center gap-3"
            >
              <div class="flex gap-1.5 ml-2">
                <div class="w-3 h-3 rounded-full bg-red-400"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div class="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div
                class="flex-1 bg-white border border-slate-300 rounded px-3 py-1 text-sm text-slate-600 font-mono flex items-center gap-2"
              >
                <svg
                  class="w-3 h-3 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                {{ selectedScenario.senderHandle }}
              </div>
            </div>
            <!-- Browser Content -->
            <div class="flex-1 bg-white overflow-y-auto">
              <div v-html="selectedScenario.content"></div>
            </div>
          </div>
        </div>

        <!-- Analysis Panel (Bottom Drawer) -->
        <div
          v-if="selectedScenario.verdict !== null && showAnalysis"
          class="border-t border-slate-200 bg-slate-50 p-6 animate-slide-up max-h-[40%] overflow-y-auto"
        >
          <h4
            class="font-bold text-slate-700 mb-4 uppercase text-xs tracking-wider flex items-center gap-2"
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            Security Analysis
          </h4>
          <div class="grid gap-3">
            <div
              v-for="(flag, i) in selectedScenario.flags"
              :key="i"
              class="flex gap-3 p-3 rounded bg-red-50 border border-red-100"
            >
              <svg
                class="w-5 h-5 text-red-500 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div class="text-sm text-red-800">
                <strong>Red Flag #{{ i + 1 }}:</strong> {{ flag }}
              </div>
            </div>
            <!-- Clean State -->
            <div
              v-if="selectedScenario.flags.length === 0"
              class="flex gap-3 p-3 rounded bg-green-50 border border-green-100"
            >
              <svg
                class="w-5 h-5 text-green-500 flex-shrink-0"
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
              <div class="text-sm text-green-800">
                <strong>Clean:</strong> No suspicious indicators found. Source
                is verified and content is standard.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="lg:w-3/4 flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400"
      >
        Select a scenario to analyze
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Scenario {
  id: string;
  type: "email" | "sms" | "chat" | "url";
  senderName: string;
  senderHandle: string;
  subject?: string;
  time: string;
  preview: string;
  content: string;
  isPhishing: boolean;
  flags: string[];
  verdict: boolean | null;
}

const showAnalysis = ref(true);

const scenarios = ref<Scenario[]>([
  // --- EMAILS ---
  {
    id: "1",
    type: "email",
    senderName: "IT Support",
    senderHandle: "support@company-security-update.com",
    subject: "URGENT: Password Expiry Notification",
    time: "10:42 AM",
    preview:
      "Your account password will expire in 24 hours. Click here to renew...",
    content: `
      <p>Dear User,</p>
      <p>Your corporate account password is set to expire in <strong>24 hours</strong>.</p>
      <p>To prevent loss of access to email and network resources, you must validate your credentials immediately.</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="#" style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Credentials Now</a>
      </p>
      <p>Failure to act will result in account suspension.</p>
      <p>Regards,<br>IT Security Team</p>
    `,
    isPhishing: true,
    flags: [
      'Sender domain "company-security-update.com" is illegitimate',
      'Generic greeting "Dear User" instead of your name',
      "Creates false sense of urgency (24 hours, suspension threat)",
      "Suspicious link button requesting credentials",
    ],
    verdict: null,
  },
  {
    id: "2",
    type: "email",
    senderName: "HR Department",
    senderHandle: "hr@company.com",
    subject: "Update on Q3 Employee Benefits",
    time: "Yesterday",
    preview:
      "Please find attached the updated benefits package summary for Q3...",
    content: `
      <p>Hi team,</p>
      <p>We have updated the employee benefits package for Q3. There are some minor changes to the dental plan coverage.</p>
      <p>Please review the changes on the internal portal whenever you have a moment.</p>
      <p>If you have questions, feel free to reply to this email or stop by the HR office.</p>
      <p>Best,<br>Sarah from HR</p>
    `,
    isPhishing: false,
    flags: [],
    verdict: null,
  },
  {
    id: "3",
    type: "email",
    senderName: "CEO Office",
    senderHandle: "ceo.impersonator@gmail.com",
    subject: "Quick Task - Gift Cards",
    time: "Monday",
    preview: "I am in a meeting and need you to handle something discreetly...",
    content: `
      <p>Are you available right now?</p>
      <p>I am stuck in a conference call and need you to purchase 5 x $100 Apple Gift Cards for a client gift. I will reimburse you immediately after the meeting.</p>
      <p>Please send me the scratch-off codes ASAP. Keep this confidential for now as it is a surprise.</p>
      <p>Sent from my iPhone</p>
    `,
    isPhishing: true,
    flags: [
      "Sender email is a personal Gmail account, not corporate",
      "Unusual financial request (Gift Cards) from an executive",
      "Request for secrecy/confidentiality to bypass procedure",
      '"Sent from my iPhone" used to excuse brevity/typos',
    ],
    verdict: null,
  },
  {
    id: "4",
    type: "email",
    senderName: "Vendor Accounts",
    senderHandle: "billing@quickbooks-invoicing-service.net",
    subject: "Overdue Invoice #99283 - Action Required",
    time: "8:15 AM",
    preview:
      "Your service is scheduled for suspension due to unpaid invoice...",
    content: `
      <p><strong>ATTN: Accounts Payable</strong></p>
      <p>Our records indicate that invoice #99283 for $14,500.00 is now 45 days overdue.</p>
      <p>Please review the attached PDF immediately and process payment to avoid service interruption.</p>
      <div style="background: #f1f5f9; padding: 12px; border-radius: 4px; margin: 20px 0; font-family: monospace;">
        📎 Invoice_99283_Urgent.pdf.exe
      </div>
      <p>Thank you,</p>
    `,
    isPhishing: true,
    flags: [
      "Attachment has double extension .pdf.exe (likely malware)",
      'Sender domain "quickbooks-invoicing-service.net" is unexpected',
      "High pressure tactic for large amount",
    ],
    verdict: null,
  },

  // --- SMS ---
  {
    id: "5",
    type: "sms",
    senderName: "USPS",
    senderHandle: "+1 (555) 019-2834",
    time: "12:30 PM",
    preview: "USPS: Your package cannot be delivered due to...",
    content:
      'USPS: Your package cannot be delivered due to incomplete address information. Please update your details here to avoid return to sender: <span class="text-blue-500 underline">http://usps-track-package-info.com/u/29s</span>',
    isPhishing: true,
    flags: [
      "Link is HTTP not HTTPS",
      'Domain is "usps-track-package-info.com" not "usps.com"',
      'Classic "Smishing" template inducing urgency',
    ],
    verdict: null,
  },
  {
    id: "6",
    type: "sms",
    senderName: "Chase Bank",
    senderHandle: "222-333",
    time: "2:15 PM",
    preview: "Chase Fraud Alert: Did you spend $299.00 at...",
    content:
      "Chase Fraud Alert: Did you spend $299.00 at Best Buy? Reply Y for Yes or N for No. If this wasn't you, call us immediately at 1-800-935-9935.",
    isPhishing: false,
    flags: [],
    verdict: null,
  },
  {
    id: "7",
    type: "sms",
    senderName: "Unknown",
    senderHandle: "+1 (555) 999-8888",
    time: "3:00 PM",
    preview: "Hey is this John? I found your number in my...",
    content:
      "Hey is this John? I found your number in my old contacts but forgot who it belongs to. Do you have a moment to chat?",
    isPhishing: true,
    flags: [
      'Example of "Pig Butchering" or social engineering intro',
      "Vague conversational opener from unknown number",
      "Goal is to build rapport before scamming",
    ],
    verdict: null,
  },

  // --- CHAT ---
  {
    id: "8",
    type: "chat",
    senderName: "IT Helpdesk Bot",
    senderHandle: "System Admin",
    time: "9:00 AM",
    preview: "We need to resync your MFA token...",
    content:
      "Hi there. We noticed an irregularity with your MFA token login attempts this morning. To prevent lockout, please reply with the 6-digit code sent to your phone so we can resync the server.",
    isPhishing: true,
    flags: [
      "IT Support will NEVER ask for your MFA code via chat",
      "Impersonating a bot or admin",
      "Requesting sensitive authentication info via non-secure channel",
    ],
    verdict: null,
  },
  {
    id: "9",
    type: "chat",
    senderName: "Sarah Jenkins",
    senderHandle: "Recruiter @ TopTier Tech",
    time: "11:45 AM",
    preview: "I have an amazing opportunity for a Senior Dev role...",
    content:
      "Hi! I saw your profile and it looks amazing. We have a remote Senior Dev role paying $250k. The JD is attached as a zip file. Please take a look and run the executable to see the project demo!",
    isPhishing: true,
    flags: [
      "Too good to be true offer ($250k remote)",
      "Requesting to download/run an executable file",
      "High risk of malware infection",
    ],
    verdict: null,
  },
  {
    id: "10",
    type: "chat",
    senderName: "Mike Ross",
    senderHandle: "Colleague",
    time: "1:20 PM",
    preview: "Hey, do you have the Q3 report?",
    content:
      "Hey, do you have the link to the Q3 report on the shared drive? I can't seem to find it in the folder.",
    isPhishing: false,
    flags: [],
    verdict: null,
  },

  // --- URL ---
  {
    id: "11",
    type: "url",
    senderName: "Microsoft 365",
    senderHandle: "https://login.microsoft-secure-auth-update.com",
    preview: "Sign in to your account",
    time: "N/A",
    content: `
      <div class="p-8 max-w-sm mx-auto border shadow-lg mt-10">
         <h2 class="text-2xl font-bold mb-4">Sign in</h2>
         <input class="w-full border p-2 mb-2" placeholder="Email, phone, or Skype" value="user@company.com">
         <input class="w-full border p-2 mb-4" type="password" placeholder="Password">
         <button class="bg-blue-600 text-white px-4 py-2 w-full">Sign in</button>
      </div>
    `,
    isPhishing: true,
    flags: [
      'Domain is "microsoft-secure-auth-update.com" not "microsoft.com" or "login.live.com"',
      "Combines legitimate looking keywords to fool users",
      "Classic Credential Harvesting site",
    ],
    verdict: null,
  },
  {
    id: "12",
    type: "url",
    senderName: "Crypto Wallet",
    senderHandle: "https://myetherwaIIet.com",
    preview: "Access your secure wallet",
    time: "N/A",
    content: `
      <div class="text-center mt-20">
         <h1 class="text-3xl font-bold text-slate-700">Access Your Wallet</h1>
         <p class="text-slate-500 my-4">Please enter your private key to unlock.</p>
         <textarea class="border p-2 w-96 mx-auto block" rows="4" placeholder="Enter private key..."></textarea>
         <button class="bg-indigo-600 text-white px-8 py-3 rounded mt-4">Unlock</button>
      </div>
    `,
    isPhishing: true,
    flags: [
      'Typosquatting: "myetherwaIIet" uses two capital i\'s instead of ls',
      "Asking for Private Key directly (Golden rule: Never share private key)",
      "Site looks identical to real one but domain is key",
    ],
    verdict: null,
  },
  {
    id: "13",
    type: "url",
    senderName: "Google",
    senderHandle: "https://accounts.google.com/signin",
    preview: "Sign in - Google Accounts",
    time: "N/A",
    content: `
      <div class="p-8 max-w-md mx-auto border rounded-lg mt-10 text-center">
         <div class="text-xl font-bold mb-2"><span class="text-blue-500">G</span><span class="text-red-500">o</span><span class="text-yellow-500">o</span><span class="text-blue-500">g</span><span class="text-green-500">l</span><span class="text-red-500">e</span></div>
         <h2 class="text-xl mb-4">Sign in</h2>
         <p class="mb-8">Use your Google Account</p>
         <input class="w-full border rounded p-3 mb-8" placeholder="Email or phone">
         <div class="text-left text-blue-600 text-sm mb-8">Forgot email?</div>
      </div>
    `,
    isPhishing: false,
    flags: [],
    verdict: null,
  },
]);

const selectedScenario = ref<Scenario | null>(scenarios.value[0]);

function selectScenario(item: Scenario) {
  selectedScenario.value = item;
  showAnalysis.value = true;
}

function makeVerdict(isPhishingVerdict: boolean) {
  if (selectedScenario.value) {
    selectedScenario.value.verdict = isPhishingVerdict;
  }
}

function resetVerdict() {
  if (selectedScenario.value) {
    selectedScenario.value.verdict = null;
  }
}
</script>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
