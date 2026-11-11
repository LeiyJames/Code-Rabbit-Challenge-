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
      class="bg-white border-b border-neutral-200 sticky top-0 z-20 backdrop-blur-md bg-white/95"
    >
      <div
        class="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between flex-wrap gap-4"
      >
        <div class="flex items-center gap-3">
          <button
            @click="goBack"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors border border-transparent hover:border-neutral-200 cursor-pointer"
            title="Back to projects"
          >
            <ArrowLeft class="w-4 h-4" />
            <span>Projects</span>
          </button>

          <RouterLink
            to="/ui-library"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors border border-transparent hover:border-neutral-200"
            title="Explore UI/UX Library"
          >
            <Layers class="w-3.5 h-3.5 text-rose-500" />
            <span class="hidden sm:inline">UI/UX Library</span>
          </RouterLink>

          <div class="h-4 w-px bg-neutral-200"></div>

          <h1 class="text-base font-semibold text-neutral-900">
            {{ project?.name || "Loading..." }}
          </h1>

          <CategoryBadge v-if="project" :category="project.category" />
        </div>

        <div v-if="project" class="flex items-center gap-2.5">
          <!-- Tech Stack -->
          <div class="hidden md:flex gap-1.5">
            <TechBadge
              v-for="tech in project.techStack"
              :key="tech"
              :label="tech"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2">
            <button
              v-if="!isFullWidthProject"
              @click="toggleCodePreview"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg text-xs font-medium transition-all shadow-sm cursor-pointer select-none"
              title="Toggle code preview"
            >
              <Code class="w-3.5 h-3.5 text-neutral-500" />
              <span>{{ showCode ? "Hide" : "Show" }} Code</span>
            </button>
            <button
              v-if="!isFullWidthProject"
              @click="handleReset"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg text-xs font-medium transition-all shadow-sm cursor-pointer select-none"
              title="Reset project"
            >
              <RotateCcw class="w-3.5 h-3.5 text-neutral-500" />
              <span>Reset</span>
            </button>
            <button
              @click="toggleFullscreen"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg text-xs font-medium transition-all shadow-sm cursor-pointer select-none"
              title="Toggle fullscreen"
            >
              <Maximize2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Fullscreen Header -->
    <header
      v-else
      class="bg-white border-b border-neutral-200 px-6 py-3 flex items-center justify-between"
    >
      <div class="flex items-center gap-3">
        <h1 class="text-sm font-semibold text-neutral-900">{{ project?.name }}</h1>
        <CategoryBadge v-if="project" :category="project.category" />
      </div>
      <button
        @click="toggleFullscreen"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-medium transition-all cursor-pointer"
        title="Exit fullscreen"
      >
        <Minimize2 class="w-3.5 h-3.5" />
        <span>Exit Fullscreen</span>
      </button>
    </header>

    <!-- Project Content -->
    <main
      :class="[
        'mx-auto',
        isFullscreen ? 'h-[calc(100vh-60px)] overflow-auto' : '',
        isFullWidthProject
          ? 'w-full max-w-none px-0 py-0'
          : 'px-6 py-8 max-w-7xl',
      ]"
    >
      <div v-if="project">
        <!-- Side-by-side Layout with Code -->
        <div
          :class="[
            'flex gap-6',
            showCode && !isFullWidthProject ? 'flex-col lg:flex-row' : '',
          ]"
        >
          <!-- Project Component -->
          <div
            :class="[
              'min-h-[600px]',
              isFullWidthProject
                ? 'w-full'
                : 'bg-white rounded-2xl shadow-sm border border-neutral-200/80 p-8 w-full',
              showCode && !isFullWidthProject ? 'lg:w-1/2' : 'w-full',
            ]"
          >
            <ErrorBoundary>
              <component :is="project.component" :key="componentKey" />
            </ErrorBoundary>
          </div>

          <!-- Code Preview Panel (Right Side) -->
          <div
            v-if="!isFullWidthProject && showCode && project.codePreview"
            class="lg:w-1/2"
          >
            <div class="bg-neutral-950 text-white rounded-2xl overflow-hidden border border-neutral-800 shadow-sm">
              <!-- Tabs Header -->
              <div class="bg-neutral-900 border-b border-neutral-800">
                <div class="flex items-center justify-between px-4 py-2">
                  <!-- Tab Buttons -->
                  <div class="flex gap-1.5 overflow-x-auto">
                    <button
                      v-for="(section, index) in project.codePreview"
                      :key="index"
                      @click="activeTab = index"
                      :class="[
                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer',
                        activeTab === index
                          ? 'bg-neutral-800 text-white shadow-sm'
                          : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50',
                      ]"
                    >
                      <span class="flex items-center gap-1.5">
                        {{ section.title }}
                        <span
                          class="px-1.5 py-0.2 rounded text-[10px] font-mono bg-neutral-800 text-neutral-400 border border-neutral-700"
                        >
                          {{ section.language }}
                        </span>
                      </span>
                    </button>
                  </div>

                  <!-- Copy Button -->
                  <button
                    @click="copyCurrentTab"
                    class="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ml-4 text-neutral-200 cursor-pointer"
                  >
                    <Check v-if="codeCopied" class="w-3.5 h-3.5 text-emerald-400" />
                    <Copy v-else class="w-3.5 h-3.5 text-neutral-400" />
                    <span>{{ codeCopied ? "Copied" : "Copy" }}</span>
                  </button>
                </div>
              </div>

              <!-- Code Content (Read-only) -->
              <div class="p-5 overflow-x-auto max-h-[600px] overflow-y-auto font-mono text-xs leading-relaxed text-neutral-200">
                <pre><code>{{ project.codePreview[activeTab].code }}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- What This Demonstrates Section -->
        <div
          v-if="
            !isFullWidthProject &&
            project.whatThisDemonstrates &&
            project.whatThisDemonstrates.length > 0
          "
          class="mt-8 bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm"
        >
          <div class="flex items-center gap-2 mb-1">
            <CheckCircle2 class="w-4 h-4 text-neutral-700" />
            <h3 class="text-sm font-semibold text-neutral-900">
              What This Demonstrates
            </h3>
          </div>
          <p class="text-xs text-neutral-500 mb-4">
            Technical highlights and engineering considerations implemented in this module
          </p>
          <ul class="space-y-2.5">
            <li
              v-for="(item, index) in project.whatThisDemonstrates"
              :key="index"
              class="flex items-start gap-2.5 text-xs text-neutral-700 leading-relaxed"
            >
              <div class="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0"></div>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>

        <!-- What I Learned Section -->
        <div
          v-if="project.whatILearned && project.whatILearned.length > 0"
          class="mt-4 bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm"
        >
          <div class="flex items-center gap-2 mb-1">
            <Lightbulb class="w-4 h-4 text-neutral-700" />
            <h3 class="text-sm font-semibold text-neutral-900">
              Key Takeaways
            </h3>
          </div>
          <p class="text-xs text-neutral-500 mb-4">
            Observations, learnings, and performance insights gained
          </p>
          <ul class="space-y-2.5">
            <li
              v-for="(item, index) in project.whatILearned"
              :key="index"
              class="flex items-start gap-2.5 text-xs text-neutral-700 leading-relaxed"
            >
              <div class="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0"></div>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div v-else class="bg-white rounded-2xl border border-neutral-200 p-12 text-center max-w-md mx-auto shadow-sm">
        <p class="text-neutral-700 text-sm font-medium mb-1">Project not found</p>
        <p class="text-neutral-500 text-xs mb-4">The project you are looking for does not exist or was moved.</p>
        <button
          @click="goBack"
          class="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>Return to Projects</span>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute, RouterLink } from "vue-router";
import TechBadge from "@/components/TechBadge.vue";
import CategoryBadge from "@/components/CategoryBadge.vue";
import ErrorBoundary from "@/components/ErrorBoundary.vue";
import { getProjectBySlug } from "@/data/projects";
import {
  ArrowLeft,
  Code,
  RotateCcw,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  CheckCircle2,
  Lightbulb,
  Layers,
} from "lucide-vue-next";

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

const isFullWidthProject = computed(
  () =>
    project.value?.slug === "qa-regression-checklist" ||
    project.value?.slug === "html-portrait",
);

function goBack() {
  sessionStorage.setItem("return_to_projects", "true");
  if (project.value?.slug) {
    sessionStorage.setItem("last_launched_project", project.value.slug);
  }
  router.push({ path: "/", hash: "#projects" });
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
}

function toggleCodePreview() {
  showCode.value = !showCode.value;
  if (showCode.value) {
    activeTab.value = 0;
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
</script>
