<template>
  <div class="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
    <!-- Global Sticky Navbar -->
    <TheNavbar />

    <!-- Hero Section -->
    <section
      class="relative overflow-hidden bg-neutral-950 text-white min-h-[85vh] flex items-center border-b border-neutral-900"
    >
      <!-- Subtle Background Grid -->
      <div
        class="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none"
      ></div>

      <div class="max-w-7xl mx-auto px-6 py-20 lg:py-28 relative z-10 w-full">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <!-- Left: Content -->
          <div class="space-y-6 text-center lg:text-left">
            <div
              class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300 shadow-sm"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Open for work & collaboration</span>
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
              Frontend Engineering
              <span class="text-neutral-400 block mt-2 font-normal text-3xl sm:text-4xl lg:text-5xl">
                Playground & Interactive Tools
              </span>
            </h1>

            <p class="text-xs sm:text-sm text-neutral-400 font-mono flex items-center justify-center lg:justify-start gap-1.5">
              <span class="text-neutral-500">></span>
              <span>{{ typewriterText }}</span>
              <span class="animate-blink text-neutral-500">|</span>
            </p>

            <p class="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
              An interactive collection of frontend architecture experiments, UI utilities, game mechanics, and test simulators built with Vue 3 and TypeScript.
            </p>

            <div class="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start pt-2">
              <button
                @click="scrollToProjects"
                class="px-5 py-2.5 bg-white text-neutral-950 hover:bg-neutral-100 rounded-xl font-medium text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer select-none"
              >
                <span>Explore Projects</span>
                <ArrowDown class="w-3.5 h-3.5" />
              </button>

              <a
                href="https://github.com/LeiyJames"
                target="_blank"
                class="px-5 py-2.5 bg-neutral-900 text-neutral-200 hover:text-white hover:bg-neutral-800 rounded-xl font-medium text-xs sm:text-sm transition-all border border-neutral-800 flex items-center gap-2"
              >
                <Github class="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          <!-- Right: Visual Code Card -->
          <div class="hidden lg:flex items-center justify-center">
            <div class="w-full max-w-md bg-neutral-900/90 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
              <div class="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900/50">
                <div class="flex items-center gap-1.5">
                  <div class="w-2.5 h-2.5 rounded-full bg-neutral-700"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-neutral-700"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-neutral-700"></div>
                </div>
                <span class="text-xs font-mono text-neutral-500">developer.ts</span>
              </div>
              <div class="p-6 font-mono text-xs leading-relaxed text-neutral-300 space-y-1.5">
                <div><span class="text-neutral-500">// Developer Profile</span></div>
                <div><span class="text-neutral-400">const</span> developer = {</div>
                <div class="pl-4">name: <span class="text-neutral-100">'Leigh James'</span>,</div>
                <div class="pl-4">role: <span class="text-neutral-100">'Frontend Developer'</span>,</div>
                <div class="pl-4">stack: [<span class="text-neutral-400">'Vue 3'</span>, <span class="text-neutral-400">'TypeScript'</span>, <span class="text-neutral-400">'Tailwind'</span>],</div>
                <div class="pl-4">focus: <span class="text-neutral-400">'Clean architecture & DX'</span>,</div>
                <div>};</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="max-w-7xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Active Users -->
        <div class="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between text-neutral-500 mb-3">
            <span class="text-xs font-semibold uppercase tracking-wider">Live Audience</span>
            <Activity class="w-4 h-4 text-emerald-600" />
          </div>
          <div class="text-3xl font-bold text-neutral-900 tracking-tight">
            <CountUp :to="activeVisitors" />
          </div>
          <p class="text-xs text-neutral-500 mt-1">Active visitors right now</p>
        </div>

        <!-- Total Views -->
        <div class="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between text-neutral-500 mb-3">
            <span class="text-xs font-semibold uppercase tracking-wider">Page Views</span>
            <Eye class="w-4 h-4 text-neutral-600" />
          </div>
          <div class="text-3xl font-bold text-neutral-900 tracking-tight">
            <CountUp :to="totalViews" />
          </div>
          <p class="text-xs text-neutral-500 mt-1">Total page impressions</p>
        </div>

        <!-- Total Projects -->
        <div class="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between text-neutral-500 mb-3">
            <span class="text-xs font-semibold uppercase tracking-wider">Projects</span>
            <FolderGit2 class="w-4 h-4 text-neutral-600" />
          </div>
          <div class="text-3xl font-bold text-neutral-900 tracking-tight">
            <CountUp :to="totalProjects" />
          </div>
          <p class="text-xs text-neutral-500 mt-1">Completed interactive modules</p>
        </div>

        <!-- Lines of Code -->
        <div class="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between text-neutral-500 mb-3">
            <span class="text-xs font-semibold uppercase tracking-wider">Source Code</span>
            <Code2 class="w-4 h-4 text-neutral-600" />
          </div>
          <div class="text-3xl font-bold text-neutral-900 tracking-tight">
            <CountUp :to="totalLinesOfCode" suffix="+" />
          </div>
          <p class="text-xs text-neutral-500 mt-1">Lines of TypeScript & Vue</p>
        </div>
      </div>

      <!-- Secondary Stats (Tech Stack + Categories) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <!-- Tech Stack -->
        <div class="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm lg:col-span-1">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-neutral-500">Core Technologies</h3>
            <span class="text-xs text-neutral-400">Stack Usage</span>
          </div>
          <div class="space-y-3">
            <div v-for="tech in topTechStack" :key="tech.name">
              <div class="flex justify-between text-xs font-medium mb-1">
                <span class="text-neutral-700">{{ tech.name }}</span>
                <span class="text-neutral-400">{{ tech.count }}</span>
              </div>
              <div class="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                <div
                  class="bg-neutral-800 h-full rounded-full transition-all duration-1000 ease-out"
                  :style="{ width: showCharts ? `${tech.percent}%` : '0%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Category Breakdown -->
        <div class="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm lg:col-span-2">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-neutral-500">Modules by Category</h3>
            <span class="text-xs text-neutral-400">Total Distribution</span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div
              v-for="cat in categoryDistribution"
              :key="cat.name"
              class="p-3.5 bg-neutral-50/70 rounded-xl border border-neutral-200/70"
            >
              <div class="text-xl font-bold text-neutral-900">{{ cat.count }}</div>
              <div class="text-xs text-neutral-500 font-medium capitalize">{{ cat.name }}s</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Grid -->
    <section
      id="projects"
      ref="projectsSection"
      class="max-w-7xl mx-auto px-6 py-12 scroll-mt-6"
    >
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              Projects & Demos
            </h2>
            <p class="text-xs sm:text-sm text-neutral-500 mt-1">
              Click any project to run the interactive sandbox and view implementation code
            </p>
          </div>
        </div>

        <!-- Hot Picks Showcase -->
        <div v-if="hotPicks.length > 0" class="mb-8">
          <div class="flex items-center gap-2 mb-3">
            <Flame class="w-4 h-4 text-amber-600" />
            <span class="text-xs font-semibold uppercase tracking-wider text-neutral-600">Featured Experiments</span>
          </div>
          <div
            ref="hotPicksCarousel"
            class="flex gap-3.5 overflow-x-auto pb-2 scrollbar-thin snap-x"
            @mouseenter="isCarouselPaused = true"
            @mouseleave="isCarouselPaused = false"
          >
            <button
              v-for="hotProject in hotPicks"
              :key="hotProject.slug"
              @click="runProject(hotProject.slug)"
              class="flex-shrink-0 w-72 sm:w-80 bg-white border border-neutral-200/90 rounded-2xl p-4 hover:border-neutral-300 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer shadow-sm"
            >
              <div class="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span class="text-[10px] font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                    Hot Pick
                  </span>
                  <h4 class="text-sm font-semibold text-neutral-900 mt-2 group-hover:text-neutral-700 transition-colors">
                    {{ hotProject.name }}
                  </h4>
                </div>
                <ArrowUpRight class="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors flex-shrink-0 mt-1" />
              </div>
              <p class="text-xs text-neutral-500 line-clamp-2 mt-1">
                {{ hotProject.description }}
              </p>
              <div class="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100">
                <CategoryBadge :category="hotProject.category" />
                <span class="text-[11px] text-neutral-400 font-mono">{{ hotProject.techStack[0] }}</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Search & Filter Bar -->
        <SearchFilter
          :filtered-count="filteredProjects.length"
          :current-category="selectedCategory"
          @search="handleSearch"
          @filter-category="handleCategoryFilter"
        />
      </div>

      <!-- Main Project Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectCard
          v-for="project in paginatedProjects"
          :key="project.slug"
          :project="project"
          :clicks="projectClicks[project.slug]"
          @run="runProject"
        />
      </div>

      <!-- Pagination Controls -->
      <div
        v-if="totalPages > 1"
        class="flex justify-center items-center gap-3 mt-12"
      >
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>

        <span class="text-xs font-medium text-neutral-600">
          Page {{ currentPage }} of {{ totalPages }}
        </span>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
          title="Next Page"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>

      <!-- No Results -->
      <div v-if="filteredProjects.length === 0" class="text-center py-16 bg-white rounded-2xl border border-neutral-200 mt-6 p-8">
        <p class="text-sm font-medium text-neutral-700">
          No projects found matching your search.
        </p>
        <p class="text-xs text-neutral-500 mt-1">
          Try clearing your search query or selecting a different category.
        </p>
      </div>
    </section>

    <!-- About Section -->
    <section class="max-w-7xl mx-auto px-6 py-16 border-t border-neutral-200">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <!-- Visual -->
        <div class="flex justify-center md:justify-end md:pr-8">
          <div class="relative w-64 h-64 lg:w-72 lg:h-72">
            <div class="relative w-full h-full rounded-2xl overflow-hidden border border-neutral-200 shadow-sm bg-neutral-100">
              <img
                src="/profile.png"
                alt="Leigh James"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="space-y-5 text-center md:text-left">
          <div class="space-y-2">
            <h2 class="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              About Me
            </h2>
            <p class="text-sm sm:text-base text-neutral-700 leading-relaxed">
              Frontend Engineer specializing in Vue.js, TypeScript, and clean user experience engineering.
            </p>
            <p class="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              I focus on building production-ready web applications, performant state management patterns, and interactive tools that combine clean code with intuitive UI.
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3 pt-2">
            <div class="bg-white p-3.5 rounded-xl border border-neutral-200/80 shadow-sm">
              <div class="text-lg font-bold text-neutral-900">2+ Years</div>
              <div class="text-xs text-neutral-500 font-medium">Industry Focus</div>
            </div>
            <div class="bg-white p-3.5 rounded-xl border border-neutral-200/80 shadow-sm">
              <div class="text-lg font-bold text-neutral-900">Vue & TypeScript</div>
              <div class="text-xs text-neutral-500 font-medium">Core Specialization</div>
            </div>
          </div>

          <div class="pt-2 flex justify-center md:justify-start">
            <a
              href="/Leigh_James_Resume.pdf"
              download
              class="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-medium hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Download class="w-3.5 h-3.5" />
              <span>Download Resume</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white text-neutral-600 py-10 border-t border-neutral-200">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div class="text-center sm:text-left">
            <h3 class="text-base font-semibold text-neutral-900">Leigh James</h3>
            <p class="text-xs text-neutral-500 mt-0.5">Frontend Developer & Playground Architect</p>
          </div>

          <div class="flex items-center gap-3">
            <a
              href="https://github.com/LeiyJames"
              target="_blank"
              class="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors shadow-sm"
              title="GitHub"
            >
              <Github class="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/leigh-james-presno-591468333/"
              target="_blank"
              class="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors shadow-sm"
              title="LinkedIn"
            >
              <Linkedin class="w-4 h-4" />
            </a>
            <a
              href="mailto:leighpresno114@gmail.com"
              class="p-2 rounded-lg border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors shadow-sm"
              title="Email"
            >
              <Mail class="w-4 h-4" />
            </a>
          </div>
        </div>

        <div class="border-t border-neutral-100 mt-8 pt-6 text-center sm:text-left text-xs text-neutral-400">
          <p>© {{ new Date().getFullYear() }} Leigh James. All rights reserved.</p>
        </div>
      </div>
    </footer>

    <!-- Back to Top Button -->
    <button
      @click="scrollToTop"
      class="fixed bottom-6 right-6 bg-neutral-900 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-50 hover:bg-neutral-800 cursor-pointer"
      :class="
        showBackToTop
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-6 pointer-events-none'
      "
      title="Back to Top"
    >
      <ArrowUp class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import TheNavbar from "@/components/TheNavbar.vue";
import ProjectCard from "@/components/ProjectCard.vue";
import SearchFilter from "@/components/SearchFilter.vue";
import CountUp from "@/components/CountUp.vue";
import CategoryBadge from "@/components/CategoryBadge.vue";
import { useVisitors } from "@/composables/useVisitors";
import { useAnalytics } from "@/composables/useAnalytics";
import { projects } from "@/data/projects";
import type { ProjectCategory } from "@/types/project";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Github,
  Linkedin,
  Mail,
  Download,
  Activity,
  Eye,
  FolderGit2,
  Code2,
  Flame,
} from "lucide-vue-next";

// --- Hero Logic ---
const typewriterText = ref("");
const typingPhrases = [
  "interactive web applications",
  "data & state flow architecture",
  "clean, maintainable codebases",
  "modern Vue 3 & TypeScript tools",
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingInterval: number | null = null;

function typeLoop() {
  const currentPhrase = typingPhrases[phraseIndex];

  if (isDeleting) {
    typewriterText.value = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriterText.value = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = 100;
  if (isDeleting) delay = 40;

  if (!isDeleting && charIndex === currentPhrase.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typingPhrases.length;
    delay = 400;
  }

  typingInterval = window.setTimeout(typeLoop, delay);
}

// --- Navigation / Smooth Scroll ---
const projectsSection = ref<HTMLElement | null>(null);

function smoothScrollTo(targetPosition: number, duration = 600) {
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t: number, b: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

function scrollToProjects(options?: boolean | Event) {
  if (projectsSection.value) {
    const top =
      projectsSection.value.getBoundingClientRect().top + window.scrollY - 20;
    if (options === false) {
      window.scrollTo(0, top);
    } else {
      smoothScrollTo(top);
    }
  }
}

// --- Back to Top Logic ---
const showBackToTop = ref(false);

function handleScroll() {
  showBackToTop.value = window.scrollY > 400;
}

function scrollToTop() {
  smoothScrollTo(0);
}

// --- Projects Logic ---
const router = useRouter();
const route = useRoute();
const searchQuery = ref("");
const selectedCategory = ref<ProjectCategory | null>(null);
const hotPicksCarousel = ref<HTMLElement | null>(null);
const isCarouselPaused = ref(false);
const scrollDirection = ref(1);
let carouselScrollInterval: number | null = null;

function startAutoScroll() {
  carouselScrollInterval = window.setInterval(() => {
    if (hotPicksCarousel.value && !isCarouselPaused.value) {
      const container = hotPicksCarousel.value;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (scrollDirection.value === 1) {
        if (container.scrollLeft >= maxScroll - 2) {
          scrollDirection.value = -1;
        } else {
          container.scrollLeft += 1.5;
        }
      } else {
        if (container.scrollLeft <= 0) {
          scrollDirection.value = 1;
        } else {
          container.scrollLeft -= 1.5;
        }
      }
    }
  }, 25);
}

const hotPicks = computed(() => {
  return projects.filter((p) => p.isHot);
});

const filteredProjects = computed(() => {
  const result = projects.filter((project) => {
    const query = searchQuery.value.toLowerCase().trim();
    const matchesSearch =
      !query ||
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.techStack.some((tech) => tech.toLowerCase().includes(query)) ||
      project.category.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory.value === null ||
      project.category === selectedCategory.value;

    return matchesSearch && matchesCategory;
  });

  return result;
});

// --- Pagination Logic ---
const ITEMS_PER_PAGE = 9;
const currentPage = ref(1);

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  return filteredProjects.value.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(filteredProjects.value.length / ITEMS_PER_PAGE),
);

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    scrollToProjects();
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    scrollToProjects();
  }
}

function handleSearch(query: string) {
  searchQuery.value = query;
  currentPage.value = 1;
}

function handleCategoryFilter(category: ProjectCategory | null) {
  selectedCategory.value = category;
  currentPage.value = 1;
}

function runProject(slug: string) {
  trackProjectClick(slug);
  sessionStorage.setItem("last_launched_project", slug);
  sessionStorage.setItem("return_to_projects", "true");
  router.push(`/playground/${slug}`);
}

function checkAndRestoreProjectsPosition() {
  const shouldReturn =
    route.hash === "#projects" ||
    sessionStorage.getItem("return_to_projects") === "true";

  if (shouldReturn) {
    sessionStorage.removeItem("return_to_projects");
    const lastSlug = sessionStorage.getItem("last_launched_project");
    if (lastSlug) {
      const projIdx = filteredProjects.value.findIndex(
        (p) => p.slug === lastSlug,
      );
      if (projIdx !== -1) {
        currentPage.value = Math.floor(projIdx / ITEMS_PER_PAGE) + 1;
      }
      sessionStorage.removeItem("last_launched_project");
    }

    nextTick(() => {
      scrollToProjects(false);
      setTimeout(() => {
        scrollToProjects(true);
      }, 100);
    });
  }
}

watch(
  () => route.hash,
  (newHash) => {
    if (newHash === "#projects") {
      nextTick(() => {
        scrollToProjects(true);
      });
    }
  },
);

// --- Stats Logic ---
const { activeVisitors } = useVisitors();
const {
  totalViews,
  projectClicks,
  trackPageView,
  trackProjectClick,
  fetchStats,
} = useAnalytics();

const totalProjects = computed(() => projects.length);
const totalLinesOfCode = computed(() => projects.length * 650 + 5000);

const categoryDistribution = computed(() => {
  const counts: Record<string, number> = {};
  projects.forEach((p) => {
    const name = p.category.charAt(0).toUpperCase() + p.category.slice(1);
    counts[name] = (counts[name] || 0) + 1;
  });
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
});

const topTechStack = computed(() => {
  return [
    { name: "Vue 3", count: projects.length, percent: 100 },
    { name: "TypeScript", count: projects.length, percent: 100 },
    { name: "Tailwind CSS", count: projects.length, percent: 100 },
    { name: "Supabase", count: 2, percent: 25 },
  ];
});

const showCharts = ref(false);

// --- Lifecycle ---
onMounted(async () => {
  typeLoop();
  window.addEventListener("scroll", handleScroll);
  startAutoScroll();

  checkAndRestoreProjectsPosition();

  await trackPageView();
  await fetchStats();

  setTimeout(() => {
    showCharts.value = true;
  }, 400);
});

onUnmounted(() => {
  if (typingInterval) clearTimeout(typingInterval);
  if (carouselScrollInterval) clearInterval(carouselScrollInterval);
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.animate-blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
