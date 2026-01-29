<template>
  <div class="h-full flex flex-col p-6 bg-slate-50 min-h-[600px] gap-6">
    <!-- Header -->
    <div
      class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-4 justify-between items-center"
    >
      <div>
        <h2 class="text-xl font-bold text-slate-800">Test Case Builder</h2>
        <p class="text-slate-500 text-sm mt-1">
          Design, organize, and export structured test suites.
        </p>
      </div>
      <div class="flex gap-3">
        <button
          @click="exportJSON"
          class="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm"
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Export JSON
        </button>
        <button
          @click="copyTextSummary"
          class="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors text-sm shadow-md"
        >
          <svg
            v-if="copied"
            class="w-4 h-4"
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
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          </svg>
          {{ copied ? "Copied!" : "Copy List" }}
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
      <!-- Sidebar: Case List -->
      <div
        class="lg:w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden"
      >
        <div
          class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"
        >
          <h3 class="font-bold text-slate-700">
            Test Cases ({{ testCases.length }})
          </h3>
          <button
            @click="addNewCase"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            New
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-2 space-y-2">
          <div
            v-for="tc in testCases"
            :key="tc.id"
            @click="selectCase(tc.id)"
            :class="[
              'p-3 rounded-lg cursor-pointer border transition-all hover:shadow-sm',
              selectedId === tc.id
                ? 'bg-primary-50 border-primary-200 ring-1 ring-primary-500/20'
                : 'bg-white border-slate-100 hover:border-primary-100',
            ]"
          >
            <div class="flex justify-between items-start mb-1">
              <span class="text-xs font-mono font-bold text-slate-400">{{
                tc.id
              }}</span>
              <span
                :class="[
                  'text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase',
                  getStatusColor(tc.status),
                ]"
              >
                {{ tc.status }}
              </span>
            </div>
            <div class="font-medium text-slate-800 truncate">
              {{ tc.title || "Untitled Case" }}
            </div>
          </div>

          <div
            v-if="testCases.length === 0"
            class="p-8 text-center text-slate-400 text-sm"
          >
            No test cases yet. Click "New" to start.
          </div>
        </div>
      </div>

      <!-- Editor -->
      <div
        v-if="currentCase"
        class="lg:w-2/3 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden"
      >
        <!-- Editor Header -->
        <div
          class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"
        >
          <div class="flex gap-4 items-center">
            <input
              v-model="currentCase.title"
              placeholder="Test Case Title"
              class="bg-transparent font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 rounded px-2 w-full max-w-md"
            />
          </div>
          <button
            @click="deleteCase(currentCase.id)"
            class="text-slate-400 hover:text-red-500 transition-colors p-2"
            title="Delete Case"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        <!-- Editor Body -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-500 uppercase"
                >Case ID</label
              >
              <input
                v-model="currentCase.id"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-500 uppercase"
                >Status</label
              >
              <select
                v-model="currentCase.status"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="deprecated">Deprecated</option>
              </select>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-500 uppercase"
              >Description</label
            >
            <textarea
              v-model="currentCase.description"
              rows="2"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
            ></textarea>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-500 uppercase"
              >Pre-conditions</label
            >
            <textarea
              v-model="currentCase.preConditions"
              rows="2"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
              placeholder="e.g. User is logged in"
            ></textarea>
          </div>

          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <label class="block text-xs font-bold text-slate-500 uppercase"
                >Test Steps</label
              >
              <button
                @click="addStep"
                class="text-xs text-primary-600 font-medium hover:text-primary-700"
              >
                + Add Step
              </button>
            </div>
            <div class="space-y-2">
              <div
                v-for="(_, idx) in currentCase.steps"
                :key="idx"
                class="flex gap-2 items-start"
              >
                <span
                  class="flex-shrink-0 w-6 flex items-center justify-center text-slate-400 font-mono text-sm pt-2"
                  >{{ idx + 1 }}.</span
                >
                <textarea
                  v-model="currentCase.steps[idx]"
                  rows="1"
                  class="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  placeholder="Action..."
                ></textarea>
                <button
                  @click="removeStep(idx)"
                  class="mt-2 text-slate-300 hover:text-red-400 transition-colors"
                  :disabled="currentCase.steps.length === 1"
                >
                  &times;
                </button>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-500 uppercase"
              >Expected Result</label
            >
            <textarea
              v-model="currentCase.expectedResult"
              rows="2"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none"
              placeholder="e.g. Dashboard loads successfully"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="lg:w-2/3 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8"
      >
        <svg
          class="w-16 h-16 mb-4 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p>Select a test case to edit or create a new one.</p>
        <button
          @click="addNewCase"
          class="mt-4 px-6 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-all font-medium"
        >
          Create New Case
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface TestCase {
  id: string;
  title: string;
  status: "draft" | "active" | "deprecated";
  description: string;
  preConditions: string;
  steps: string[];
  expectedResult: string;
}

const testCases = ref<TestCase[]>([
  {
    id: "TC-001",
    title: "Login - Valid Credentials",
    status: "active",
    description: "Verify user can login with valid username and password",
    preConditions: "User account exists",
    steps: [
      "Navigate to login page",
      "Enter valid username",
      "Enter valid password",
      "Click Login button",
    ],
    expectedResult: "User is redirected to the dashboard",
  },
  {
    id: "TC-002",
    title: "Login - Invalid Password",
    status: "active",
    description: "Verify user cannot login with incorrect password",
    preConditions: "User account exists",
    steps: [
      "Navigate to login page",
      "Enter valid username",
      "Enter invalid password",
      "Click Login button",
    ],
    expectedResult: "Error message 'Invalid credentials' is displayed",
  },
  {
    id: "TC-003",
    title: "Search Functionality",
    status: "active",
    description: "Verify search returns relevant results",
    preConditions: "Database contains searchable items",
    steps: [
      "Navigate to home page",
      "Click search bar",
      "Type 'iPhone'",
      "Press Enter",
    ],
    expectedResult: "List of items containing 'iPhone' is displayed",
  },
  {
    id: "TC-004",
    title: "Add to Cart",
    status: "active",
    description: "Verify user can add item to shopping cart",
    preConditions: "User is on product detail page",
    steps: [
      "Select 'Blue' color option",
      "Select quantity '1'",
      "Click 'Add to Cart' button",
    ],
    expectedResult: "Cart counter increments by 1, success toast appears",
  },
  {
    id: "TC-005",
    title: "Checkout Flow - Guest",
    status: "draft",
    description: "Verify guest user can complete purchase",
    preConditions: "Cart has items, user is not logged in",
    steps: [
      "Navigate to cart",
      "Click 'Checkout'",
      "Select 'Guest Checkout'",
      "Enter shipping details",
      "Enter payment details",
      "Confirm order",
    ],
    expectedResult: "Order confirmation page is displayed with Order ID",
  },
  {
    id: "TC-006",
    title: "Password Reset Request",
    status: "active",
    description: "Verify password reset email is sent",
    preConditions: "User account exists",
    steps: [
      "Navigate to login page",
      "Click 'Forgot Password'",
      "Enter registered email",
      "Click 'Send Reset Link'",
    ],
    expectedResult: "Success message displayed, email received in inbox",
  },
  {
    id: "TC-007",
    title: "Form Validation - Required Fields",
    status: "active",
    description: "Verify error messages for empty required fields",
    preConditions: "User is on registration page",
    steps: [
      "Leave 'Email' field empty",
      "Leave 'Password' field empty",
      "Click 'Register' button",
    ],
    expectedResult: "Red error text appears below Email and Password fields",
  },
  {
    id: "TC-008",
    title: "Profile Image Upload",
    status: "active",
    description: "Verify user can upload a profile picture",
    preConditions: "User is logged in on profile settings",
    steps: [
      "Click 'Edit Profile'",
      "Click 'Upload Photo'",
      "Select a valid JPG image (<2MB)",
      "Click 'Save'",
    ],
    expectedResult: "New profile image is displayed immediately",
  },
  {
    id: "TC-009",
    title: "Responsive Menu - Mobile",
    status: "active",
    description: "Verify navigation menu works on mobile view",
    preConditions: "Viewport width is < 768px",
    steps: [
      "Open page on mobile device/simulation",
      "Tap hamburger menu icon",
      "Tap 'Products' link",
    ],
    expectedResult: "Menu expands, clicking link navigates to Products page",
  },
  {
    id: "TC-010",
    title: "API Error Handling",
    status: "active",
    description: "Verify graceful handling of 500 errors",
    preConditions: "SERVER_DOWN env flag is true",
    steps: ["Navigate to dashboard", "Wait for data fetch"],
    expectedResult:
      "User sees 'Service Unavailable' empty state, not a white screen",
  },
]);

const selectedId = ref<string>(testCases.value[0].id);
const copied = ref(false);

const currentCase = computed(() =>
  testCases.value.find((tc) => tc.id === selectedId.value),
);

function addNewCase() {
  const newId = `TC-${(testCases.value.length + 1).toString().padStart(3, "0")}`;
  const newCase: TestCase = {
    id: newId,
    title: "",
    status: "draft",
    description: "",
    preConditions: "",
    steps: [""],
    expectedResult: "",
  };
  testCases.value.push(newCase);
  selectedId.value = newId;
}

function selectCase(id: string) {
  selectedId.value = id;
}

function deleteCase(id: string) {
  if (confirm("Delete this test case?")) {
    const idx = testCases.value.findIndex((tc) => tc.id === id);
    testCases.value.splice(idx, 1);
    if (testCases.value.length > 0) {
      selectedId.value = testCases.value[0].id;
    } else {
      selectedId.value = "";
    }
  }
}

function addStep() {
  if (currentCase.value) {
    currentCase.value.steps.push("");
  }
}

function removeStep(idx: number) {
  if (currentCase.value && currentCase.value.steps.length > 1) {
    currentCase.value.steps.splice(idx, 1);
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";
    case "draft":
      return "bg-slate-200 text-slate-600";
    case "deprecated":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100";
  }
}

function copyTextSummary() {
  const text = testCases.value
    .map((tc) => {
      return `[${tc.id}] ${tc.title} (${tc.status.toUpperCase()})
Pre: ${tc.preConditions}
Steps:
${tc.steps.map((s, i) => `  ${i + 1}. ${s}`).join("\n")}
Expected: ${tc.expectedResult}
----------------------------------------`;
    })
    .join("\n\n");

  navigator.clipboard.writeText(text).then(() => {
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  });
}

function exportJSON() {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(testCases.value, null, 2));
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "test_cases.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}
</script>
