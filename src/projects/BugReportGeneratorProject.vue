<template>
  <div class="h-full flex flex-col p-6 bg-slate-50 min-h-[600px] gap-6">
    <!-- Header -->
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-slate-800">Bug Report Generator</h2>
          <p class="text-slate-500 text-sm mt-1">
            Create professional, standardized bug reports in seconds.
          </p>
        </div>
        <button
          @click="copyReport"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all shadow-md active:scale-95"
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
          {{ copied ? "Copied to Clipboard!" : "Copy to Clipboard" }}
        </button>
      </div>
    </div>

    <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
      <!-- Input Form -->
      <div
        class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-y-auto"
      >
        <h3
          class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2"
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Details
        </h3>

        <div class="space-y-6">
          <!-- Title & Severity -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="md:col-span-2 space-y-2">
              <label class="block text-sm font-medium text-slate-700"
                >Bug Title</label
              >
              <input
                v-model="form.title"
                placeholder="e.g. Navigation menu closes unexpectedly on mobile"
                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700"
                >Severity</label
              >
              <select
                v-model="form.severity"
                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700"
              >Description</label
            >
            <textarea
              v-model="form.description"
              rows="2"
              placeholder="Briefly describe the issue..."
              class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none resize-none"
            ></textarea>
          </div>

          <!-- Steps -->
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <label class="block text-sm font-medium text-slate-700"
                >Steps to Reproduce</label
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
                v-for="(_, index) in form.steps"
                :key="index"
                class="flex gap-2"
              >
                <span
                  class="flex-shrink-0 w-6 h-9 flex items-center justify-center text-slate-400 font-mono text-sm bg-slate-100 rounded"
                  >{{ index + 1 }}</span
                >
                <input
                  v-model="form.steps[index]"
                  placeholder="What did you do?"
                  class="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  @keydown.enter.prevent="addStep"
                />
                <button
                  @click="removeStep(index)"
                  class="px-2 text-slate-400 hover:text-red-500 transition-colors"
                  :disabled="form.steps.length === 1"
                >
                  &times;
                </button>
              </div>
            </div>
          </div>

          <!-- Results -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700"
                >Expected Result</label
              >
              <textarea
                v-model="form.expected"
                rows="3"
                placeholder="What should have happened?"
                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none resize-none"
              ></textarea>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700"
                >Actual Result</label
              >
              <textarea
                v-model="form.actual"
                rows="3"
                placeholder="What actually happened?"
                class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Environment -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700"
              >Environment</label
            >
            <input
              v-model="form.environment"
              placeholder="Browser, OS, Version, Device..."
              class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>
      </div>

      <!-- Live Preview -->
      <div
        class="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6 overflow-hidden flex flex-col"
      >
        <h3
          class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"
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
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          Live Preview (Markdown)
        </h3>
        <div
          class="flex-1 bg-slate-950 rounded-lg p-4 font-mono text-sm text-slate-300 overflow-y-auto whitespace-pre-wrap border border-slate-800 leading-relaxed"
        >
          {{ reportMarkdown }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";

const copied = ref(false);

const form = reactive({
  title: "",
  severity: "Medium",
  description: "",
  steps: [""],
  expected: "",
  actual: "",
  environment: "Chrome 122, Windows 11",
});

function addStep() {
  form.steps.push("");
}

function removeStep(index: number) {
  if (form.steps.length > 1) {
    form.steps.splice(index, 1);
  }
}

const reportMarkdown = computed(() => {
  const stepsList = form.steps
    .filter((s) => s.trim())
    .map((s, i) => `${i + 1}. ${s}`)
    .join("\n");

  return `### ${form.severity.toUpperCase()}: ${form.title || "Untitled Bug"}

**Description**
${form.description || "No description provided."}

**Steps to Reproduce**
${stepsList || "No steps provided."}

**Expected Result**
${form.expected || "N/A"}

**Actual Result**
${form.actual || "N/A"}

**Environment**
${form.environment || "N/A"}`;
});

async function copyReport() {
  try {
    await navigator.clipboard.writeText(reportMarkdown.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy", err);
  }
}
</script>
