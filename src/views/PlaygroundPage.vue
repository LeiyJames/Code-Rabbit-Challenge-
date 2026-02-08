<template>
  <div
    :class="[
      'min-h-screen bg-neutral-50',
      isFullscreen && 'fixed inset-0 z-50 bg-white',
    ]"
  >
    <!-- Header -->
    <header
      v-if="!isFullscreen"
      class="bg-white border-b border-neutral-200 sticky top-0 z-10"
    >
      <div
        class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-4"
      >
        <div class="flex items-center gap-4">
          <button
            @click="goBack"
            class="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            title="Back to home"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span class="font-medium">Back</span>
          </button>

          <div class="h-6 w-px bg-neutral-300"></div>

          <h1 class="text-xl font-bold text-neutral-900">
            {{ project?.name || "Loading..." }}
          </h1>

          <CategoryBadge v-if="project" :category="project.category" />
        </div>

        <div v-if="project" class="flex items-center gap-3">
          <!-- Tech Stack -->
          <div class="hidden md:flex gap-2">
            <TechBadge
              v-for="tech in project.techStack"
              :key="tech"
              :label="tech"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button
              v-if="!isQaProject"
              @click="toggleCodePreview"
              class="px-3 py-2 bg-neutral-200 text-neutral-700 rounded-lg font-medium hover:bg-neutral-300 transition-all text-sm"
              title="Toggle code preview"
            >
              {{ showCode ? "Hide" : "Show" }} Code
            </button>
            <button
              v-if="!isQaProject"
              @click="handleReset"
              class="px-3 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-all text-sm"
              title="Reset project"
            >
              Reset
            </button>
            <button
              @click="toggleFullscreen"
              class="px-3 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-all text-sm"
              title="Toggle fullscreen"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Fullscreen Header -->
    <header
      v-else
      class="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between"
    >
      <h1 class="text-xl font-bold text-neutral-900">{{ project?.name }}</h1>
      <button
        @click="toggleFullscreen"
        class="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg font-medium hover:bg-neutral-300 transition-all"
        title="Exit fullscreen"
      >
        Exit Fullscreen
      </button>
    </header>

    <!-- Project Content -->
    <main
      :class="[
        'mx-auto',
        isFullscreen ? 'h-[calc(100vh-80px)] overflow-auto' : '',
        isQaProject ? 'w-full max-w-none px-0 py-0' : 'px-6 py-8 max-w-7xl',
      ]"
    >
      <div v-if="project">
        <!-- Side-by-side Layout with Code -->
        <div
          :class="[
            'flex gap-6',
            showCode && !isQaProject ? 'flex-col lg:flex-row' : '',
          ]"
        >
          <!-- Project Component -->
          <div
            :class="[
              'min-h-[600px]',
              isQaProject
                ? 'w-full'
                : 'bg-white rounded-2xl shadow-lg p-8 w-full',
              showCode && !isQaProject ? 'lg:w-1/2' : 'w-full',
            ]"
          >
            <ErrorBoundary>
              <component :is="project.component" :key="componentKey" />
            </ErrorBoundary>
          </div>

          <!-- Code Preview Panel (Right Side) - Single Box with Tabs -->
          <div
            v-if="!isQaProject && showCode && project.codePreview"
            class="lg:w-1/2"
          >
            <div class="bg-neutral-900 text-white rounded-xl overflow-hidden">
              <!-- Tabs Header -->
              <div class="bg-neutral-800 border-b border-neutral-700">
                <div class="flex items-center justify-between px-4 py-2">
                  <!-- Tab Buttons -->
                  <div class="flex gap-2 overflow-x-auto">
                    <button
                      v-for="(section, index) in project.codePreview"
                      :key="index"
                      @click="activeTab = index"
                      :class="[
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                        activeTab === index
                          ? 'bg-neutral-700 text-white'
                          : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50',
                      ]"
                    >
                      <span class="flex items-center gap-2">
                        {{ section.title }}
                        <span
                          :class="[
                            'px-1.5 py-0.5 rounded text-xs',
                            getLanguageColor(section.language),
                          ]"
                        >
                          {{ section.language }}
                        </span>
                      </span>
                    </button>
                  </div>

                  <!-- Copy Button -->
                  <button
                    @click="copyCurrentTab"
                    class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm transition-colors flex items-center gap-2 ml-4"
                  >
                    <svg
                      v-if="!codeCopied"
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <svg
                      v-else
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {{ codeCopied ? "Copied!" : "Copy" }}
                  </button>
                </div>
              </div>

              <!-- Code Content (Read-only) -->
              <div class="p-6 overflow-x-auto max-h-[600px] overflow-y-auto">
                <pre
                  class="text-sm leading-relaxed"
                ><code :class="getLanguageTextColor(project.codePreview[activeTab].language)">{{ project.codePreview[activeTab].code }}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- What This Demonstrates Section -->
        <div
          v-if="
            !isQaProject &&
            project.whatThisDemonstrates &&
            project.whatThisDemonstrates.length > 0
          "
          class="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <h3
            class="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            What This Demonstrates
          </h3>
          <p class="text-sm text-blue-700 mb-4 italic">
            Engineering maturity and technical decision-making
          </p>
          <ul class="space-y-3">
            <li
              v-for="(item, index) in project.whatThisDemonstrates"
              :key="index"
              class="flex items-start gap-3 text-blue-900"
            >
              <svg
                class="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="leading-relaxed">{{ item }}</span>
            </li>
          </ul>
        </div>

        <!-- What I Learned Section -->
        <div
          v-if="project.whatILearned && project.whatILearned.length > 0"
          class="mt-6 bg-primary-50 border border-primary-200 rounded-xl p-6"
        >
          <h3
            class="text-lg font-bold text-primary-900 mb-4 flex items-center gap-2"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            What I Learned
          </h3>
          <ul class="space-y-2">
            <li
              v-for="(item, index) in project.whatILearned"
              :key="index"
              class="flex items-start gap-2 text-primary-800"
            >
              <svg
                class="w-5 h-5 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div v-else class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <p class="text-neutral-600">Project not found</p>
        <button
          @click="goBack"
          class="mt-4 px-6 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import TechBadge from "@/components/TechBadge.vue";
import CategoryBadge from "@/components/CategoryBadge.vue";
import ErrorBoundary from "@/components/ErrorBoundary.vue";
import { getProjectBySlug } from "@/data/projects";

const router = useRouter();
const route = useRoute();

const isFullscreen = ref(false);
const showCode = ref(false);
const componentKey = ref(0);
const activeTab = ref(0);
const codeCopied = ref(false);

const project = computed(() => {
  const slug = route.params.slug as string;
  return getProjectBySlug(slug);
});

const isQaProject = computed(
  () => project.value?.slug === "qa-regression-checklist"
);

function goBack() {
  router.push("/");
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
}

function toggleCodePreview() {
  showCode.value = !showCode.value;
  if (showCode.value) {
    activeTab.value = 0; // Reset to first tab when opening
  }
}

function handleReset() {
  componentKey.value++;
}

async function copyCurrentTab() {
  if (project.value?.codePreview) {
    try {
      const currentSection = project.value.codePreview[activeTab.value];
      await navigator.clipboard.writeText(currentSection.code);
      codeCopied.value = true;
      setTimeout(() => {
        codeCopied.value = false;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  }
}

function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    typescript: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    javascript: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
    css: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
    tailwind: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
  };
  return colors[language] || "bg-neutral-600 text-neutral-300";
}

function getLanguageTextColor(language: string): string {
  const colors: Record<string, string> = {
    typescript: "text-blue-300",
    javascript: "text-yellow-300",
    css: "text-purple-300",
    tailwind: "text-cyan-300",
  };
  return colors[language] || "text-green-400";
}
</script>
