<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import TheNavbar from "@/components/TheNavbar.vue";
import ComponentCodeBox from "@/components/ComponentCodeBox.vue";
import { UI_CODE_CATALOG } from "@/data/uiLibraryCodeData";
import {
  Palette,
  MousePointerClick,
  TextCursorInput,
  Tag,
  Bell,
  LayoutGrid,
  Check,
  Search,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  Download,
  Plus,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Sun,
  Moon,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Heart,
  ShoppingBag,
  Monitor,
  Smartphone,
  Home,
  User,
  Share2,
  Bookmark,
  Compass,
  MessageSquare,
  SlidersHorizontal
} from "lucide-vue-next";

// --- State & Canvas Preview Mode ---
const previewMode = ref<"light" | "dark">("light");
const searchQuery = ref("");
const activeSection = ref("buttons");
const copiedKey = ref<string | null>(null);

function copySnippet(key: string, snippet: string) {
  navigator.clipboard.writeText(snippet).then(() => {
    copiedKey.value = key;
    setTimeout(() => {
      if (copiedKey.value === key) copiedKey.value = null;
    }, 2000);
  });
}

// --- Interactive Component States ---
// 1. Button Playground
const buttonSize = ref<"sm" | "md" | "lg">("md");
const buttonLoading = ref(false);
const buttonDisabled = ref(false);
const buttonWithIcon = ref(true);

// 2. Input Playground
const inputText = ref("");
const passwordText = ref("super-secret-password");
const showPassword = ref(false);
const toggleState = ref(true);
const checkboxState = ref(true);
const selectedPlan = ref<"starter" | "pro" | "scale">("pro");

// 3. Modal State
const isModalOpen = ref(false);

// 4. Toast State
interface Toast {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
}
const toasts = ref<Toast[]>([]);

function triggerToast(type: "success" | "warning" | "error" | "info") {
  const id = `toast-${Date.now()}`;
  const titles = {
    success: "Changes saved",
    warning: "API rate limit approaching",
    error: "Connection timeout",
    info: "New update available"
  };
  const messages = {
    success: "Your workspace settings have been synchronized successfully.",
    warning: "You have utilized 85% of your allotted query capacity.",
    error: "Could not reach database endpoint. Retrying in 5s...",
    info: "Dev Playground v1.2 has been loaded with new UI components."
  };

  const newToast: Toast = {
    id,
    type,
    title: titles[type],
    message: messages[type]
  };

  toasts.value.push(newToast);

  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }, 4000);
}

function removeToast(id: string) {
  toasts.value = toasts.value.filter((t) => t.id !== id);
}

// 5. Tabs State
const activeTab = ref<"general" | "security" | "notifications">("general");

// 6. Platform Filter & Mobile Navigation States
const selectedPlatform = ref<"all" | "web" | "mobile">("all");
const mobileNavActiveTab = ref("home");
const mobileFabActiveTab = ref("feed");
const mobileHeaderActiveTab = ref("all");
const isActionSheetOpen = ref(false);

// --- Navigation Sections: Separated into Web and Mobile UI ---
export interface UiSection {
  id: string;
  label: string;
  icon: any;
  count: number;
  platform: "web" | "mobile";
}

const sections: UiSection[] = [
  // Web UI / UX (Desktop & Responsive)
  { id: "buttons", label: "Buttons & Actions", icon: MousePointerClick, count: 6, platform: "web" },
  { id: "inputs", label: "Inputs & Forms", icon: TextCursorInput, count: 7, platform: "web" },
  { id: "badges", label: "Badges & Tags", icon: Tag, count: 5, platform: "web" },
  { id: "feedback", label: "Feedback & Overlays", icon: Bell, count: 4, platform: "web" },
  { id: "cards", label: "Web Cards & Metrics", icon: LayoutGrid, count: 4, platform: "web" },
  { id: "tokens", label: "Design Foundations", icon: Palette, count: 3, platform: "web" },

  // Mobile App UI / UX (iOS / Android / Smartphones)
  { id: "mobile-navigation", label: "Mobile App Navigation & Patterns", icon: Smartphone, count: 4, platform: "mobile" }
];

const filteredSections = computed(() => {
  let list = sections;
  if (selectedPlatform.value !== "all") {
    list = list.filter((s) => s.platform === selectedPlatform.value);
  }
  if (!searchQuery.value.trim()) return list;
  const q = searchQuery.value.toLowerCase().trim();
  return list.filter((s) => s.label.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
});

const webSections = computed(() => filteredSections.value.filter((s) => s.platform === "web"));
const mobileSections = computed(() => filteredSections.value.filter((s) => s.platform === "mobile"));

function scrollToSection(id: string) {
  activeSection.value = id;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Handle ESC for modal
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape" && isModalOpen.value) {
    isModalOpen.value = false;
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-neutral-100 selection:text-neutral-900">
    <!-- Shared Top Navbar -->
    <TheNavbar />

    <!-- Sub-Header / Hero Banner -->
    <section class="border-b border-neutral-900 bg-neutral-950/60 backdrop-blur-md relative overflow-hidden">
      <!-- Subtle Grid -->
      <div
        class="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"
      ></div>

      <div class="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="space-y-3 max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>Design System & Architecture</span>
            </div>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              UI/UX Component Library
            </h1>
            <p class="text-sm sm:text-base text-neutral-400 leading-relaxed">
              Production-grade, accessible UI patterns engineered with Vue 3 and Tailwind CSS.
              Explore interactive micro-interactions, stateful variants, and copyable snippets.
            </p>
          </div>

          <!-- Preview Canvas Controls (Light / Dark) -->
          <div class="flex items-center gap-3 flex-wrap">
            <!-- Canvas Light / Dark -->
            <div class="flex items-center p-1 rounded-xl bg-neutral-900 border border-neutral-800">
              <span class="text-xs text-neutral-400 font-medium px-2.5">Canvas:</span>
              <button
                @click="previewMode = 'light'"
                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                :class="
                  previewMode === 'light'
                    ? 'bg-white text-neutral-950 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                "
              >
                <Sun class="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button
                @click="previewMode = 'dark'"
                class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                :class="
                  previewMode === 'dark'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                "
              >
                <Moon class="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content Area: Sidebar + Component Sections -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Mobile / Tablet Quick Navigation Bar (< lg) -->
        <div class="lg:hidden col-span-1 space-y-2.5">
          <div class="flex items-center gap-2">
            <!-- Platform Toggle Chips -->
            <div class="flex items-center p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs shrink-0">
              <button
                @click="selectedPlatform = 'all'"
                class="px-2.5 py-1 rounded-lg font-medium transition-all"
                :class="selectedPlatform === 'all' ? 'bg-neutral-800 text-white' : 'text-neutral-400'"
              >
                All
              </button>
              <button
                @click="selectedPlatform = 'web'"
                class="px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1"
                :class="selectedPlatform === 'web' ? 'bg-neutral-800 text-white' : 'text-neutral-400'"
              >
                <Monitor class="w-3 h-3 text-sky-400" />
                <span>Web</span>
              </button>
              <button
                @click="selectedPlatform = 'mobile'"
                class="px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1"
                :class="selectedPlatform === 'mobile' ? 'bg-neutral-800 text-white' : 'text-neutral-400'"
              >
                <Smartphone class="w-3 h-3 text-rose-400" />
                <span>Mobile</span>
              </button>
            </div>

            <!-- Search Filter -->
            <div class="relative flex-1">
              <Search class="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Filter components..."
                class="w-full h-8 pl-8 pr-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-500 outline-none focus:border-neutral-700 transition-colors"
              />
            </div>
          </div>

          <!-- Section Chips -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              v-for="sec in filteredSections"
              :key="sec.id"
              @click="scrollToSection(sec.id)"
              class="px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 border transition-all cursor-pointer"
              :class="
                activeSection === sec.id
                  ? 'bg-neutral-800 text-white border-neutral-700 shadow-sm'
                  : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-neutral-200'
              "
            >
              <component :is="sec.icon" class="w-3.5 h-3.5 text-neutral-400" />
              <span>{{ sec.label }}</span>
            </button>
          </div>
        </div>

        <!-- Left Desktop Sidebar Navigation -->
        <aside class="hidden lg:block lg:col-span-3 sticky top-24 space-y-4">
          <!-- Platform Filter Switcher in Sidebar -->
          <div class="p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs flex items-center justify-between">
            <button
              @click="selectedPlatform = 'all'"
              class="flex-1 py-1.5 rounded-lg font-medium transition-all text-center cursor-pointer"
              :class="selectedPlatform === 'all' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
            >
              All
            </button>
            <button
              @click="selectedPlatform = 'web'"
              class="flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1 cursor-pointer"
              :class="selectedPlatform === 'web' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
            >
              <Monitor class="w-3 h-3 text-sky-400" />
              <span>Web</span>
            </button>
            <button
              @click="selectedPlatform = 'mobile'"
              class="flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1 cursor-pointer"
              :class="selectedPlatform === 'mobile' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
            >
              <Smartphone class="w-3 h-3 text-rose-400" />
              <span>Mobile</span>
            </button>
          </div>

          <!-- Search in UI Library -->
          <div class="relative">
            <Search class="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Filter components..."
              class="w-full h-9 pl-9 pr-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-500 outline-none focus:border-neutral-700 transition-colors"
            />
          </div>

          <!-- Component Index List (Grouped by Platform) -->
          <div class="rounded-xl border border-neutral-900 bg-neutral-900/50 p-2 space-y-1">
            <!-- Web Group Header -->
            <div
              v-if="(selectedPlatform === 'all' || selectedPlatform === 'web') && webSections.length > 0"
              class="px-2.5 pt-1.5 pb-1 text-[10px] font-bold tracking-wider text-neutral-400 uppercase flex items-center justify-between"
            >
              <div class="flex items-center gap-1.5">
                <Monitor class="w-3 h-3 text-sky-400" />
                <span>Web UI Components</span>
              </div>
              <span class="text-[9px] font-mono text-neutral-500">{{ webSections.length }}</span>
            </div>

            <button
              v-for="sec in webSections"
              :key="sec.id"
              @click="scrollToSection(sec.id)"
              class="w-full px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors text-left cursor-pointer"
              :class="
                activeSection === sec.id
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              "
            >
              <div class="flex items-center gap-2.5">
                <component :is="sec.icon" class="w-3.5 h-3.5 text-neutral-400" />
                <span>{{ sec.label }}</span>
              </div>
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700/50">
                {{ sec.count }}
              </span>
            </button>

            <!-- Mobile Group Header -->
            <div
              v-if="(selectedPlatform === 'all' || selectedPlatform === 'mobile') && mobileSections.length > 0"
              class="px-2.5 pt-3 pb-1 text-[10px] font-bold tracking-wider text-neutral-400 uppercase flex items-center justify-between border-t border-neutral-800/80 mt-2"
            >
              <div class="flex items-center gap-1.5">
                <Smartphone class="w-3 h-3 text-rose-400" />
                <span>Mobile App UI/UX</span>
              </div>
              <span class="text-[9px] font-mono text-neutral-500">{{ mobileSections.length }}</span>
            </div>

            <button
              v-for="sec in mobileSections"
              :key="sec.id"
              @click="scrollToSection(sec.id)"
              class="w-full px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors text-left cursor-pointer"
              :class="
                activeSection === sec.id
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              "
            >
              <div class="flex items-center gap-2.5">
                <component :is="sec.icon" class="w-3.5 h-3.5 text-neutral-400" />
                <span>{{ sec.label }}</span>
              </div>
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700/50">
                {{ sec.count }}
              </span>
            </button>
          </div>

          <!-- Design Principles Card -->
          <div class="rounded-xl border border-neutral-900 bg-neutral-900/40 p-4 space-y-2.5 text-xs text-neutral-400">
            <div class="flex items-center gap-2 font-semibold text-neutral-200">
              <ShieldCheck class="w-4 h-4 text-emerald-400" />
              <span>UX Principles</span>
            </div>
            <ul class="space-y-1.5 text-[11px] leading-relaxed text-neutral-400">
              <li>• Focus rings with <code class="text-neutral-300">focus-visible:ring-2</code> for keyboard a11y.</li>
              <li>• WCAG AA contrast ratio compliance on all typography.</li>
              <li>• Predictable transitions with <code class="text-neutral-300">duration-150 ease-out</code>.</li>
              <li>• Zero emojis for professional, timeless product styling.</li>
            </ul>
          </div>
        </aside>

        <!-- Right Main Showcase Canvas -->
        <main class="lg:col-span-9 space-y-12">
          <!-- ============================================== -->
          <!-- PART 1: WEB UI / UX COMPONENTS (Web/Desktop)   -->
          <!-- ============================================== -->
          <div
            v-if="selectedPlatform === 'all' || selectedPlatform === 'web'"
            class="space-y-12"
          >
            <!-- Web Category Header / Banner (shown only when Web platform filter is selected) -->
            <div
              v-if="selectedPlatform === 'web'"
              class="flex items-center justify-between pb-4 border-b border-neutral-900"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-sky-950/80 border border-sky-800/60 flex items-center justify-center text-sky-400">
                  <Monitor class="w-4 h-4" />
                </div>
                <div>
                  <h2 class="text-xl font-bold text-white flex items-center gap-2">
                    <span>Web UI / UX Components</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                      Web & Responsive
                    </span>
                  </h2>
                  <p class="text-xs text-neutral-400 mt-0.5">
                    Production-grade web interfaces, desktop layouts, validation forms, metric tiles, and tokens.
                  </p>
                </div>
              </div>
              <span class="text-xs font-mono text-neutral-500">6 Categories</span>
            </div>

            <!-- 1. BUTTONS & ACTIONS SECTION -->
          <section id="buttons" class="space-y-6 scroll-mt-24">
            <div class="flex items-center justify-between pb-3 border-b border-neutral-900">
              <div>
                <h2 class="text-xl font-bold text-white flex items-center gap-2">
                  <MousePointerClick class="w-5 h-5 text-rose-400" />
                  <span>Buttons & Actions</span>
                </h2>
                <p class="text-xs text-neutral-400 mt-0.5">
                  Action triggers with interactive states, loading spinners, and sizing options.
                </p>
              </div>
              <span class="text-xs font-mono text-neutral-500">6 Components</span>
            </div>

            <!-- Interactive Live Button Playground -->
            <div
              class="rounded-2xl border transition-colors p-6 space-y-6"
              :class="
                previewMode === 'light'
                  ? 'bg-white border-neutral-200 text-neutral-900'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-100 dark'
              "
            >
              <!-- Controls Header -->
              <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b" :class="previewMode === 'light' ? 'border-neutral-200' : 'border-neutral-800'">
                <div class="flex flex-wrap items-center gap-2 text-xs">
                  <span class="font-semibold text-neutral-500">Controls:</span>
                  <label class="inline-flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" v-model="buttonLoading" class="rounded accent-neutral-900" />
                    <span>Loading</span>
                  </label>
                  <label class="inline-flex items-center gap-1.5 cursor-pointer ml-2">
                    <input type="checkbox" v-model="buttonDisabled" class="rounded accent-neutral-900" />
                    <span>Disabled</span>
                  </label>
                  <label class="inline-flex items-center gap-1.5 cursor-pointer ml-2">
                    <input type="checkbox" v-model="buttonWithIcon" class="rounded accent-neutral-900" />
                    <span>Icon</span>
                  </label>
                </div>

                <!-- Size Selector -->
                <div class="flex items-center gap-1 p-0.5 rounded-lg border" :class="previewMode === 'light' ? 'bg-neutral-100 border-neutral-200' : 'bg-neutral-950 border-neutral-800'">
                  <button
                    v-for="s in (['sm', 'md', 'lg'] as const)"
                    :key="s"
                    @click="buttonSize = s"
                    class="px-2 py-0.5 rounded text-xs uppercase font-mono font-medium"
                    :class="buttonSize === s ? (previewMode === 'light' ? 'bg-white shadow-sm font-bold' : 'bg-neutral-800 text-white font-bold') : 'text-neutral-400'"
                  >
                    {{ s }}
                  </button>
                </div>
              </div>

              <!-- Button Variants Showcase -->
              <div class="flex flex-wrap items-center gap-4 py-2">
                <!-- Primary Solid -->
                <button
                  :disabled="buttonDisabled || buttonLoading"
                  class="rounded-xl font-medium transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed select-none"
                  :class="[
                    buttonSize === 'sm' && 'px-3 py-1.5 text-xs',
                    buttonSize === 'md' && 'px-4 py-2 text-sm',
                    buttonSize === 'lg' && 'px-5 py-2.5 text-base',
                    previewMode === 'light'
                      ? 'bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98]'
                      : 'bg-white text-neutral-950 hover:bg-neutral-100 active:scale-[0.98]'
                  ]"
                >
                  <Loader2 v-if="buttonLoading" class="w-4 h-4 animate-spin" />
                  <Sparkles v-else-if="buttonWithIcon" class="w-4 h-4" />
                  <span>Primary Solid</span>
                </button>

                <!-- Secondary Soft -->
                <button
                  :disabled="buttonDisabled || buttonLoading"
                  class="rounded-xl font-medium transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed select-none"
                  :class="[
                    buttonSize === 'sm' && 'px-3 py-1.5 text-xs',
                    buttonSize === 'md' && 'px-4 py-2 text-sm',
                    buttonSize === 'lg' && 'px-5 py-2.5 text-base',
                    previewMode === 'light'
                      ? 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:scale-[0.98]'
                      : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700 active:scale-[0.98]'
                  ]"
                >
                  <Loader2 v-if="buttonLoading" class="w-4 h-4 animate-spin" />
                  <Plus v-else-if="buttonWithIcon" class="w-4 h-4" />
                  <span>Secondary Soft</span>
                </button>

                <!-- Outline -->
                <button
                  :disabled="buttonDisabled || buttonLoading"
                  class="rounded-xl font-medium transition-all border flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed select-none"
                  :class="[
                    buttonSize === 'sm' && 'px-3 py-1.5 text-xs',
                    buttonSize === 'md' && 'px-4 py-2 text-sm',
                    buttonSize === 'lg' && 'px-5 py-2.5 text-base',
                    previewMode === 'light'
                      ? 'border-neutral-300 text-neutral-700 hover:bg-neutral-50 active:scale-[0.98]'
                      : 'border-neutral-700 text-neutral-200 hover:bg-neutral-800 active:scale-[0.98]'
                  ]"
                >
                  <Loader2 v-if="buttonLoading" class="w-4 h-4 animate-spin" />
                  <Download v-else-if="buttonWithIcon" class="w-4 h-4" />
                  <span>Outline Button</span>
                </button>

                <!-- Danger / Destructive -->
                <button
                  :disabled="buttonDisabled || buttonLoading"
                  class="rounded-xl font-medium transition-all bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed select-none"
                  :class="[
                    buttonSize === 'sm' && 'px-3 py-1.5 text-xs',
                    buttonSize === 'md' && 'px-4 py-2 text-sm',
                    buttonSize === 'lg' && 'px-5 py-2.5 text-base'
                  ]"
                >
                  <Loader2 v-if="buttonLoading" class="w-4 h-4 animate-spin" />
                  <AlertCircle v-else-if="buttonWithIcon" class="w-4 h-4" />
                  <span>Destructive</span>
                </button>

                <!-- Ghost Button -->
                <button
                  :disabled="buttonDisabled || buttonLoading"
                  class="rounded-xl font-medium transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed select-none"
                  :class="[
                    buttonSize === 'sm' && 'px-3 py-1.5 text-xs',
                    buttonSize === 'md' && 'px-4 py-2 text-sm',
                    buttonSize === 'lg' && 'px-5 py-2.5 text-base',
                    previewMode === 'light'
                      ? 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  ]"
                >
                  <span>Ghost Action</span>
                </button>
              </div>

              <!-- Multi-framework Code, CLI & AI Prompt Box -->
              <ComponentCodeBox :data="UI_CODE_CATALOG.button" />
            </div>
          </section>

          <!-- 2. INPUTS & FORM CONTROLS SECTION -->
          <section id="inputs" class="space-y-6 scroll-mt-24">
            <div class="flex items-center justify-between pb-3 border-b border-neutral-900">
              <div>
                <h2 class="text-xl font-bold text-white flex items-center gap-2">
                  <TextCursorInput class="w-5 h-5 text-emerald-400" />
                  <span>Inputs & Form Controls</span>
                </h2>
                <p class="text-xs text-neutral-400 mt-0.5">
                  Forms with validation states, search boxes, interactive toggles, and radio cards.
                </p>
              </div>
              <span class="text-xs font-mono text-neutral-500">7 Components</span>
            </div>

            <div
              class="rounded-2xl border transition-colors p-6 space-y-8"
              :class="
                previewMode === 'light'
                  ? 'bg-white border-neutral-200 text-neutral-900'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-100 dark'
              "
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Standard Input with Clear -->
                <div class="space-y-1.5">
                  <label class="block text-xs font-semibold uppercase tracking-wider" :class="previewMode === 'light' ? 'text-neutral-700' : 'text-neutral-300'">
                    Standard Text Input
                  </label>
                  <div class="relative">
                    <input
                      v-model="inputText"
                      type="text"
                      placeholder="e.g. Acme Corporation"
                      class="w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                      :class="
                        previewMode === 'light'
                          ? 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder:text-neutral-400'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus:border-neutral-500'
                      "
                    />
                    <button
                      v-if="inputText"
                      @click="inputText = ''"
                      class="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-neutral-400 hover:text-neutral-600"
                    >
                      <X class="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p class="text-[11px] text-neutral-400">Includes clear action and fluid focus border.</p>
                </div>

                <!-- Password with Show/Hide Toggle -->
                <div class="space-y-1.5">
                  <label class="block text-xs font-semibold uppercase tracking-wider" :class="previewMode === 'light' ? 'text-neutral-700' : 'text-neutral-300'">
                    Password with Reveal Action
                  </label>
                  <div class="relative">
                    <input
                      v-model="passwordText"
                      :type="showPassword ? 'text' : 'password'"
                      class="w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm font-mono transition-all outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                      :class="
                        previewMode === 'light'
                          ? 'bg-neutral-50 border-neutral-300 text-neutral-900'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-100 focus:border-neutral-500'
                      "
                    />
                    <button
                      @click="showPassword = !showPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600"
                      title="Toggle password visibility"
                    >
                      <EyeOff v-if="showPassword" class="w-4 h-4" />
                      <Eye v-else class="w-4 h-4" />
                    </button>
                  </div>
                  <p class="text-[11px] text-neutral-400">Accessible eye reveal toggle with monospace font.</p>
                </div>

                <!-- Validated Success Input -->
                <div class="space-y-1.5">
                  <label class="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Validated Input (Success)
                  </label>
                  <div class="relative">
                    <input
                      type="text"
                      value="verified_account@company.com"
                      readonly
                      class="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-emerald-500 text-sm outline-none"
                      :class="previewMode === 'light' ? 'bg-emerald-50/40 text-neutral-900' : 'bg-emerald-950/20 text-neutral-100'"
                    />
                    <CheckCircle2 class="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <p class="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check class="w-3 h-3" /> Email address verified and available.
                  </p>
                </div>

                <!-- Error State Input -->
                <div class="space-y-1.5">
                  <label class="block text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                    Error Input State
                  </label>
                  <div class="relative">
                    <input
                      type="text"
                      value="invalid-subdomain!#@"
                      class="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-rose-500 text-sm outline-none"
                      :class="previewMode === 'light' ? 'bg-rose-50/40 text-neutral-900' : 'bg-rose-950/20 text-neutral-100'"
                    />
                    <AlertCircle class="w-4 h-4 text-rose-500 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <p class="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertCircle class="w-3 h-3" /> Special characters are not allowed.
                  </p>
                </div>
              </div>

              <!-- Switches, Checkboxes, & Radio Cards -->
              <div class="pt-4 border-t space-y-4" :class="previewMode === 'light' ? 'border-neutral-200' : 'border-neutral-800'">
                <div class="flex flex-wrap items-center gap-8">
                  <!-- Interactive Switch -->
                  <div class="flex items-center gap-3">
                    <button
                      @click="toggleState = !toggleState"
                      class="w-11 h-6 rounded-full transition-colors relative cursor-pointer select-none p-0.5"
                      :class="toggleState ? 'bg-neutral-900 dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-800'"
                    >
                      <div
                        class="w-5 h-5 rounded-full transition-transform duration-200"
                        :class="[
                          toggleState ? 'translate-x-5' : 'translate-x-0',
                          toggleState ? 'bg-white dark:bg-neutral-950' : 'bg-white dark:bg-neutral-400'
                        ]"
                      ></div>
                    </button>
                    <div>
                      <div class="text-xs font-semibold">Enable Realtime Telemetry</div>
                      <div class="text-[11px] text-neutral-400">Stream metrics via WebSockets</div>
                    </div>
                  </div>

                  <!-- Custom Checkbox -->
                  <label class="inline-flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      v-model="checkboxState"
                      class="w-4 h-4 rounded text-neutral-900 focus:ring-neutral-900 cursor-pointer accent-neutral-900"
                    />
                    <span class="text-xs font-medium">Remember filters for this session</span>
                  </label>
                </div>

                <!-- Radio Card Selector -->
                <div class="space-y-2 pt-2">
                  <label class="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Interactive Plan Selection Cards
                  </label>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div
                      @click="selectedPlan = 'starter'"
                      class="p-4 rounded-xl border cursor-pointer transition-all select-none flex flex-col justify-between"
                      :class="
                        selectedPlan === 'starter'
                          ? (previewMode === 'light' ? 'border-neutral-900 bg-neutral-900/5 ring-1 ring-neutral-900 text-neutral-900 shadow-sm' : 'border-white bg-white/10 ring-1 ring-white text-white shadow-sm')
                          : (previewMode === 'light' ? 'border-neutral-200 hover:border-neutral-300 text-neutral-800' : 'border-neutral-800 hover:border-neutral-700 text-neutral-200')
                      "
                    >
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-bold">Starter</span>
                        <Check v-if="selectedPlan === 'starter'" class="w-3.5 h-3.5" :class="previewMode === 'light' ? 'text-neutral-900' : 'text-white'" />
                      </div>
                      <div class="text-lg font-extrabold mt-2">$0 <span class="text-xs font-normal text-neutral-500">/mo</span></div>
                      <div class="text-[11px] text-neutral-400 mt-1">Up to 3 active sandbox projects.</div>
                    </div>

                    <div
                      @click="selectedPlan = 'pro'"
                      class="p-4 rounded-xl border cursor-pointer transition-all select-none flex flex-col justify-between"
                      :class="
                        selectedPlan === 'pro'
                          ? (previewMode === 'light' ? 'border-neutral-900 bg-neutral-900/5 ring-1 ring-neutral-900 text-neutral-900 shadow-sm' : 'border-white bg-white/10 ring-1 ring-white text-white shadow-sm')
                          : (previewMode === 'light' ? 'border-neutral-200 hover:border-neutral-300 text-neutral-800' : 'border-neutral-800 hover:border-neutral-700 text-neutral-200')
                      "
                    >
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-bold flex items-center gap-1.5">
                          <span>Pro Engineer</span>
                          <span class="px-1.5 py-0.2 rounded text-[9px] bg-rose-500/10 text-rose-500 font-semibold font-mono">POPULAR</span>
                        </span>
                        <Check v-if="selectedPlan === 'pro'" class="w-3.5 h-3.5" :class="previewMode === 'light' ? 'text-neutral-900' : 'text-white'" />
                      </div>
                      <div class="text-lg font-extrabold mt-2">$19 <span class="text-xs font-normal text-neutral-500">/mo</span></div>
                      <div class="text-[11px] text-neutral-400 mt-1">Unlimited playgrounds & analytics.</div>
                    </div>

                    <div
                      @click="selectedPlan = 'scale'"
                      class="p-4 rounded-xl border cursor-pointer transition-all select-none flex flex-col justify-between"
                      :class="
                        selectedPlan === 'scale'
                          ? (previewMode === 'light' ? 'border-neutral-900 bg-neutral-900/5 ring-1 ring-neutral-900 text-neutral-900 shadow-sm' : 'border-white bg-white/10 ring-1 ring-white text-white shadow-sm')
                          : (previewMode === 'light' ? 'border-neutral-200 hover:border-neutral-300 text-neutral-800' : 'border-neutral-800 hover:border-neutral-700 text-neutral-200')
                      "
                    >
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-bold">Enterprise</span>
                        <Check v-if="selectedPlan === 'scale'" class="w-3.5 h-3.5" :class="previewMode === 'light' ? 'text-neutral-900' : 'text-white'" />
                      </div>
                      <div class="text-lg font-extrabold mt-2">$49 <span class="text-xs font-normal text-neutral-500">/mo</span></div>
                      <div class="text-[11px] text-neutral-400 mt-1">Dedicated clusters & custom hooks.</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Multi-framework Code, CLI & AI Prompt Box -->
              <ComponentCodeBox :data="UI_CODE_CATALOG.input" />
            </div>
          </section>

          <!-- 3. FEEDBACK & OVERLAYS (MODALS & TOASTS) -->
          <section id="feedback" class="space-y-6 scroll-mt-24">
            <div class="flex items-center justify-between pb-3 border-b border-neutral-900">
              <div>
                <h2 class="text-xl font-bold text-white flex items-center gap-2">
                  <Bell class="w-5 h-5 text-amber-400" />
                  <span>Feedback & Overlays</span>
                </h2>
                <p class="text-xs text-neutral-400 mt-0.5">
                  Toast notifications, backdrop modals, alert banners, and skeleton placeholders.
                </p>
              </div>
              <span class="text-xs font-mono text-neutral-500">4 Components</span>
            </div>

            <div
              class="rounded-2xl border transition-colors p-6 space-y-6"
              :class="
                previewMode === 'light'
                  ? 'bg-white border-neutral-200 text-neutral-900'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-100 dark'
              "
            >
              <!-- Interactive Trigger Buttons -->
              <div class="space-y-3">
                <div class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Test Live Triggers
                </div>
                <div class="flex flex-wrap items-center gap-3">
                  <button
                    @click="isModalOpen = true"
                    :class="previewMode === 'light' ? 'bg-neutral-900 text-white hover:bg-neutral-800' : 'bg-white text-neutral-950 hover:bg-neutral-100 font-semibold'" class="px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <span>Open Modal Dialog</span>
                    <ChevronRight class="w-3.5 h-3.5" />
                  </button>

                  <button
                    @click="triggerToast('success')"
                    class="px-3 py-2 rounded-xl text-xs font-medium border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 class="w-3.5 h-3.5" />
                    <span>Trigger Success Toast</span>
                  </button>

                  <button
                    @click="triggerToast('warning')"
                    class="px-3 py-2 rounded-xl text-xs font-medium border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors flex items-center gap-1.5"
                  >
                    <AlertTriangle class="w-3.5 h-3.5" />
                    <span>Trigger Warning Toast</span>
                  </button>

                  <button
                    @click="triggerToast('error')"
                    class="px-3 py-2 rounded-xl text-xs font-medium border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors flex items-center gap-1.5"
                  >
                    <AlertCircle class="w-3.5 h-3.5" />
                    <span>Trigger Error Toast</span>
                  </button>
                </div>
              </div>

              <!-- Static Alert Banners Preview -->
              <div class="space-y-3 pt-4 border-t" :class="previewMode === 'light' ? 'border-neutral-200' : 'border-neutral-800'">
                <div class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  System Alert Banners
                </div>
                <div class="space-y-2.5">
                  <!-- Info Banner -->
                  <div class="p-3.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 flex items-start justify-between gap-3 text-xs">
                    <div class="flex items-start gap-2.5">
                      <Info class="w-4 h-4 text-neutral-500 mt-0.5" />
                      <div>
                        <span :class="previewMode === 'light' ? 'text-neutral-900' : 'text-neutral-100'" class="font-semibold">Scheduled maintenance notice</span>
                        <p :class="previewMode === 'light' ? 'text-neutral-600' : 'text-neutral-400'" class="text-[11px] mt-0.5">Automated database index rebalancing will take place Sunday at 03:00 UTC.</p>
                      </div>
                    </div>
                  </div>

                  <!-- Success Banner -->
                  <div class="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 flex items-start justify-between gap-3 text-xs">
                    <div class="flex items-start gap-2.5">
                      <CheckCircle2 class="w-4 h-4 text-emerald-500 mt-0.5" />
                      <div>
                        <span class="font-semibold">Deployment completed successfully</span>
                        <p class="text-[11px] opacity-80 mt-0.5">Commit 8f3a921 is now live across edge regions.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Skeleton Loading Shimmer Preview -->
              <div class="space-y-3 pt-4 border-t" :class="previewMode === 'light' ? 'border-neutral-200' : 'border-neutral-800'">
                <div class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Skeleton Loading Placeholders
                </div>
                <div class="p-4 rounded-xl border" :class="previewMode === 'light' ? 'border-neutral-200 bg-neutral-50' : 'border-neutral-800 bg-neutral-950'">
                  <div class="animate-pulse space-y-3">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-neutral-300 dark:bg-neutral-800"></div>
                      <div class="space-y-1.5 flex-1">
                        <div class="h-3 w-32 rounded bg-neutral-300 dark:bg-neutral-800"></div>
                        <div class="h-2 w-20 rounded bg-neutral-200 dark:bg-neutral-850"></div>
                      </div>
                    </div>
                    <div class="h-2 w-full rounded bg-neutral-200 dark:bg-neutral-850"></div>
                    <div class="h-2 w-4/5 rounded bg-neutral-200 dark:bg-neutral-850"></div>
                  </div>
                </div>
              </div>

              <!-- Multi-framework Code, CLI & AI Prompt Boxes for Modal & Toast -->
              <div class="space-y-4 pt-2">
                <ComponentCodeBox :data="UI_CODE_CATALOG.modal" />
                <ComponentCodeBox :data="UI_CODE_CATALOG.toast" />
              </div>
            </div>
          </section>

          <!-- 4. BADGES & DATA DISPLAY -->
          <section id="badges" class="space-y-6 scroll-mt-24">
            <div class="flex items-center justify-between pb-3 border-b border-neutral-900">
              <div>
                <h2 class="text-xl font-bold text-white flex items-center gap-2">
                  <Tag class="w-5 h-5 text-indigo-400" />
                  <span>Badges & Status Pills</span>
                </h2>
                <p class="text-xs text-neutral-400 mt-0.5">
                  Subtle indicators with indicator dots and pill styles.
                </p>
              </div>
              <span class="text-xs font-mono text-neutral-500">5 Components</span>
            </div>

            <div
              class="rounded-2xl border transition-colors p-6 space-y-6"
              :class="
                previewMode === 'light'
                  ? 'bg-white border-neutral-200 text-neutral-900'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-100 dark'
              "
            >
              <div class="space-y-3">
                <div class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Status Indicator Badges
                </div>
                <div class="flex flex-wrap items-center gap-3">
                  <!-- Active -->
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Operational</span>
                  </span>

                  <!-- Pending -->
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>Synchronizing</span>
                  </span>

                  <!-- Inactive -->
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                    <span class="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
                    <span>Archived</span>
                  </span>

                  <!-- Danger -->
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    <span>Critical Alert</span>
                  </span>

                  <!-- High Contrast Monochrome -->
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                    <span>v1.2.0</span>
                  </span>
                </div>
              </div>

              <!-- Tech Tag Cloud -->
              <div class="space-y-3 pt-4 border-t" :class="previewMode === 'light' ? 'border-neutral-200' : 'border-neutral-800'">
                <div class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Filter Chips & Tech Badges
                </div>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in ['TypeScript', 'Vue 3', 'Tailwind CSS', 'Vite', 'GSAP', 'Web Audio', 'Supabase', 'Pinia']"
                    :key="tag"
                    class="px-2.5 py-1 rounded-lg text-xs font-mono font-medium border cursor-pointer hover:border-neutral-400 transition-colors"
                    :class="previewMode === 'light' ? 'bg-neutral-50 border-neutral-200 text-neutral-700' : 'bg-neutral-950 border-neutral-800 text-neutral-300'"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- Multi-framework Code, CLI & AI Prompt Box -->
              <ComponentCodeBox :data="UI_CODE_CATALOG.badge" />
            </div>
          </section>

          <!-- 5. DATA DISPLAY & METRICS CARDS -->
          <section id="cards" class="space-y-6 scroll-mt-24">
            <div class="flex items-center justify-between pb-3 border-b border-neutral-900">
              <div>
                <h2 class="text-xl font-bold text-white flex items-center gap-2">
                  <LayoutGrid class="w-5 h-5 text-sky-400" />
                  <span>Data Display & Metrics Cards</span>
                </h2>
                <p class="text-xs text-neutral-400 mt-0.5">
                  KPI analytics tiles with trend percentages and clean border hierarchy.
                </p>
              </div>
              <span class="text-xs font-mono text-neutral-500">4 Components</span>
            </div>

            <div
              class="rounded-2xl border transition-colors p-6 space-y-6"
              :class="
                previewMode === 'light'
                  ? 'bg-white border-neutral-200 text-neutral-900'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-100 dark'
              "
            >
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <!-- KPI 1 -->
                <div
                  class="p-4 rounded-xl border flex flex-col justify-between"
                  :class="previewMode === 'light' ? 'border-neutral-200 bg-neutral-50/60' : 'border-neutral-800 bg-neutral-950/60'"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-neutral-500 font-medium">Total Playground Visits</span>
                    <span class="inline-flex items-center gap-0.5 text-xs text-emerald-600 font-semibold">
                      <ArrowUpRight class="w-3 h-3" /> +24.8%
                    </span>
                  </div>
                  <div class="text-2xl font-bold mt-3">128,490</div>
                  <div class="text-[11px] text-neutral-400 mt-1">Updated across all regions</div>
                </div>

                <!-- KPI 2 -->
                <div
                  class="p-4 rounded-xl border flex flex-col justify-between"
                  :class="previewMode === 'light' ? 'border-neutral-200 bg-neutral-50/60' : 'border-neutral-800 bg-neutral-950/60'"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-neutral-500 font-medium">Avg Interaction Time</span>
                    <span class="inline-flex items-center gap-0.5 text-xs text-emerald-600 font-semibold">
                      <ArrowUpRight class="w-3 h-3" /> +12.3%
                    </span>
                  </div>
                  <div class="text-2xl font-bold mt-3">4m 32s</div>
                  <div class="text-[11px] text-neutral-400 mt-1">Per active session</div>
                </div>

                <!-- KPI 3 -->
                <div
                  class="p-4 rounded-xl border flex flex-col justify-between"
                  :class="previewMode === 'light' ? 'border-neutral-200 bg-neutral-50/60' : 'border-neutral-800 bg-neutral-950/60'"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-neutral-500 font-medium">Error Drop Rate</span>
                    <span class="inline-flex items-center gap-0.5 text-xs text-rose-600 font-semibold">
                      <ArrowDownRight class="w-3 h-3" /> -0.4%
                    </span>
                  </div>
                  <div class="text-2xl font-bold mt-3">0.08%</div>
                  <div class="text-[11px] text-neutral-400 mt-1">Target threshold: &lt; 0.5%</div>
                </div>
              </div>

              <!-- Interactive Tabs Preview -->
              <div class="space-y-3 pt-4 border-t" :class="previewMode === 'light' ? 'border-neutral-200' : 'border-neutral-800'">
                <div class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Segmented Tabs & Content Switcher
                </div>
                <!-- Underline Tab Row -->
                <div class="flex items-center gap-4 border-b" :class="previewMode === 'light' ? 'border-neutral-200' : 'border-neutral-800'">
                  <button
                    @click="activeTab = 'general'"
                    class="pb-2.5 text-xs font-semibold border-b-2 transition-colors -mb-px"
                    :class="
                      activeTab === 'general'
                        ? (previewMode === 'light' ? 'border-neutral-900 text-neutral-900' : 'border-white text-white')
                        : 'border-transparent text-neutral-400 hover:text-neutral-200'
                    "
                  >
                    General Settings
                  </button>
                  <button
                    @click="activeTab = 'security'"
                    class="pb-2.5 text-xs font-semibold border-b-2 transition-colors -mb-px"
                    :class="
                      activeTab === 'security'
                        ? (previewMode === 'light' ? 'border-neutral-900 text-neutral-900' : 'border-white text-white')
                        : 'border-transparent text-neutral-400 hover:text-neutral-200'
                    "
                  >
                    Security & Access
                  </button>
                  <button
                    @click="activeTab = 'notifications'"
                    class="pb-2.5 text-xs font-semibold border-b-2 transition-colors -mb-px"
                    :class="
                      activeTab === 'notifications'
                        ? (previewMode === 'light' ? 'border-neutral-900 text-neutral-900' : 'border-white text-white')
                        : 'border-transparent text-neutral-400 hover:text-neutral-200'
                    "
                  >
                    Notifications
                  </button>
                </div>
                <div :class="previewMode === 'light' ? 'bg-neutral-100 text-neutral-700' : 'bg-neutral-950 text-neutral-300'" class="p-4 rounded-xl text-xs">
                  Active view: <strong :class="previewMode === 'light' ? 'text-neutral-900' : 'text-white'" class="uppercase font-mono font-bold">{{ activeTab }}</strong> panel contents displayed here.
                </div>
              </div>

              <!-- Multi-framework Code, CLI & AI Prompt Box -->
              <ComponentCodeBox :data="UI_CODE_CATALOG.card" />
            </div>
          </section>

          <!-- 6. DESIGN TOKENS -->
          <section id="tokens" class="space-y-6 scroll-mt-24">
            <div class="flex items-center justify-between pb-3 border-b border-neutral-900">
              <div>
                <h2 class="text-xl font-bold text-white flex items-center gap-2">
                  <Palette class="w-5 h-5 text-rose-400" />
                  <span>Design Foundations & Tokens</span>
                </h2>
                <p class="text-xs text-neutral-400 mt-0.5">
                  Core neutral palette, typography hierarchy, and spacing tokens.
                </p>
              </div>
              <span class="text-xs font-mono text-neutral-500">3 Foundations</span>
            </div>

            <div
              class="rounded-2xl border transition-colors p-6 space-y-6"
              :class="
                previewMode === 'light'
                  ? 'bg-white border-neutral-200 text-neutral-900'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-100 dark'
              "
            >
              <div class="space-y-3">
                <div class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Neutral Monochrome Scale (Click to Copy HEX)
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  <div
                    v-for="color in [
                      { label: 'neutral-50', hex: '#fafafa', text: 'text-neutral-900' },
                      { label: 'neutral-100', hex: '#f5f5f5', text: 'text-neutral-900' },
                      { label: 'neutral-200', hex: '#e5e5e5', text: 'text-neutral-900' },
                      { label: 'neutral-400', hex: '#a3a3a3', text: 'text-neutral-900' },
                      { label: 'neutral-800', hex: '#262626', text: 'text-white' },
                      { label: 'neutral-950', hex: '#0a0a0a', text: 'text-white' }
                    ]"
                    :key="color.hex"
                    @click="copySnippet(color.hex, color.hex)"
                    class="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 cursor-pointer hover:scale-105 transition-transform flex flex-col justify-between h-20"
                    :style="{ backgroundColor: color.hex }"
                  >
                    <span class="text-[10px] font-mono font-bold" :class="color.text">{{ color.label }}</span>
                    <span class="text-[10px] font-mono opacity-80" :class="color.text">
                      {{ copiedKey === color.hex ? 'COPIED!' : color.hex }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- ============================================== -->
        <!-- PART 2: MOBILE APP UI / UX COMPONENTS          -->
        <!-- ============================================== -->
        <div
          v-if="selectedPlatform === 'all' || selectedPlatform === 'mobile'"
          class="space-y-12 pt-6"
        >
          <!-- Category Divider / Banner -->
          <div class="flex items-center justify-between pb-4 border-b border-neutral-900">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-rose-950/80 border border-rose-800/60 flex items-center justify-center text-rose-400">
                <Smartphone class="w-4 h-4" />
              </div>
              <div>
                <h2 class="text-xl font-bold text-white flex items-center gap-2">
                  <span>Mobile App UI / UX Components</span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    Mobile Viewports
                  </span>
                </h2>
                <p class="text-xs text-neutral-400 mt-0.5">
                  Mobile-first ergonomics, smartphone frames, touch target patterns, and app navigation.
                </p>
              </div>
            </div>
            <span class="text-xs font-mono text-neutral-500">4 Patterns</span>
          </div>

          <!-- MOBILE APP NAVIGATION & PATTERNS SECTION -->
          <section id="mobile-navigation" class="space-y-8 scroll-mt-24">
            <div class="flex items-center justify-between pb-3 border-b border-neutral-900">
              <div>
                <h3 class="text-lg font-bold text-white flex items-center gap-2">
                  <Smartphone class="w-4 h-4 text-rose-400" />
                  <span>Mobile App Navigation & Patterns</span>
                </h3>
                <p class="text-xs text-neutral-400 mt-0.5">
                  Production mobile navigation architectures: each navigation pattern with live playground, responsive thumb ergonomics, and standalone framework code.
                </p>
              </div>
              <span class="text-xs font-mono text-neutral-500">4 Patterns</span>
            </div>

            <!-- PATTERN 1: Floating Island Bottom Tab Bar -->
            <div
              class="rounded-2xl border transition-colors p-6 sm:p-8 space-y-6"
              :class="
                previewMode === 'light'
                  ? 'bg-white border-neutral-200 text-neutral-900'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-100 dark'
              "
            >
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span class="text-xs font-bold uppercase tracking-wider" :class="previewMode === 'light' ? 'text-neutral-900' : 'text-neutral-100'">
                    Pattern 1: Floating Island Bottom Tab Bar
                  </span>
                  <p class="text-xs mt-0.5" :class="previewMode === 'light' ? 'text-neutral-600' : 'text-neutral-400'">
                    Pill-shaped floating dock with active pill highlight and notification badges.
                  </p>
                </div>
                <span class="text-xs font-mono" :class="previewMode === 'light' ? 'text-neutral-600' : 'text-neutral-400'">
                  Active: <strong :class="previewMode === 'light' ? 'text-neutral-900' : 'text-white'" class="capitalize font-bold">{{ mobileNavActiveTab }}</strong>
                </span>
              </div>

              <!-- Interactive Live Preview Frame -->
              <div
                class="py-6 px-4 rounded-2xl flex justify-center transition-colors"
                :class="previewMode === 'light' ? 'bg-neutral-100 border border-neutral-200' : 'bg-neutral-950 border border-neutral-800'"
              >
                <nav class="w-full max-w-sm p-2 rounded-3xl bg-neutral-900/95 backdrop-blur-lg border border-neutral-800 shadow-2xl flex items-center justify-around select-none">
                  <button
                    v-for="t in [
                      { id: 'home', label: 'Home', icon: Home },
                      { id: 'search', label: 'Search', icon: Search },
                      { id: 'bag', label: 'Orders', icon: ShoppingBag, badge: 2 },
                      { id: 'wishlist', label: 'Saved', icon: Heart },
                      { id: 'profile', label: 'Profile', icon: User }
                    ]"
                    :key="t.id"
                    @click="mobileNavActiveTab = t.id"
                    class="relative p-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all cursor-pointer"
                    :class="mobileNavActiveTab === t.id ? 'bg-white/15 text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
                  >
                    <component :is="t.icon" class="w-5 h-5" />
                    <span class="text-[10px] font-medium leading-none">{{ t.label }}</span>
                    <span v-if="t.badge" class="absolute top-1.5 right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {{ t.badge }}
                    </span>
                  </button>
                </nav>
              </div>

              <!-- Pattern 1 Code Box -->
              <div class="pt-2">
                <ComponentCodeBox :data="UI_CODE_CATALOG.mobileNav" />
              </div>
            </div>

            <!-- PATTERN 2: Notched Center-FAB Bottom Dock -->
            <div
              class="rounded-2xl border transition-colors p-6 sm:p-8 space-y-6"
              :class="
                previewMode === 'light'
                  ? 'bg-white border-neutral-200 text-neutral-900'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-100 dark'
              "
            >
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span class="text-xs font-bold uppercase tracking-wider" :class="previewMode === 'light' ? 'text-neutral-900' : 'text-neutral-100'">
                    Pattern 2: Notched Center-FAB Bottom Dock
                  </span>
                  <p class="text-xs mt-0.5" :class="previewMode === 'light' ? 'text-neutral-600' : 'text-neutral-400'">
                    High-utility bottom dock featuring an elevated center action FAB for primary creation workflows.
                  </p>
                </div>
                <span class="text-xs font-mono" :class="previewMode === 'light' ? 'text-neutral-600' : 'text-neutral-400'">
                  Active: <strong :class="previewMode === 'light' ? 'text-neutral-900' : 'text-white'" class="capitalize font-bold">{{ mobileFabActiveTab }}</strong>
                </span>
              </div>

              <!-- Interactive Live Preview Frame -->
              <div
                class="py-6 px-4 rounded-2xl flex justify-center transition-colors"
                :class="previewMode === 'light' ? 'bg-neutral-100 border border-neutral-200' : 'bg-neutral-950 border border-neutral-800'"
              >
                <div class="w-full max-w-sm relative">
                  <div class="p-2 rounded-2xl bg-neutral-900/95 backdrop-blur-lg border border-neutral-800 shadow-2xl flex items-center justify-between px-4 select-none">
                    <!-- Left items -->
                    <button
                      @click="mobileFabActiveTab = 'feed'"
                      class="p-2 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer"
                      :class="mobileFabActiveTab === 'feed' ? 'text-white' : 'text-neutral-400 hover:text-white'"
                    >
                      <Home class="w-5 h-5" />
                      <span class="text-[10px] font-medium">Feed</span>
                    </button>

                    <button
                      @click="mobileFabActiveTab = 'explore'"
                      class="p-2 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer"
                      :class="mobileFabActiveTab === 'explore' ? 'text-white' : 'text-neutral-400 hover:text-white'"
                    >
                      <Compass class="w-5 h-5" />
                      <span class="text-[10px] font-medium">Explore</span>
                    </button>

                    <!-- Center Elevated FAB -->
                    <div class="relative -top-5 flex flex-col items-center">
                      <button
                        @click="triggerToast('info')"
                        class="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 border-4 border-neutral-950 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                        title="Create New Action"
                      >
                        <Plus class="w-6 h-6 stroke-[2.5]" />
                      </button>
                      <span class="text-[10px] font-medium text-neutral-400 mt-1">Post</span>
                    </div>

                    <!-- Right items -->
                    <button
                      @click="mobileFabActiveTab = 'messages'"
                      class="relative p-2 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer"
                      :class="mobileFabActiveTab === 'messages' ? 'text-white' : 'text-neutral-400 hover:text-white'"
                    >
                      <MessageSquare class="w-5 h-5" />
                      <span class="text-[10px] font-medium">Inbox</span>
                      <span class="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-rose-500"></span>
                    </button>

                    <button
                      @click="mobileFabActiveTab = 'profile'"
                      class="p-2 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer"
                      :class="mobileFabActiveTab === 'profile' ? 'text-white' : 'text-neutral-400 hover:text-white'"
                    >
                      <User class="w-5 h-5" />
                      <span class="text-[10px] font-medium">Profile</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Pattern 2 Code Box -->
              <div class="pt-2">
                <ComponentCodeBox :data="UI_CODE_CATALOG.mobileFabNav" />
              </div>
            </div>

            <!-- PATTERN 3: Mobile Segmented Top Header Bar -->
            <div
              class="rounded-2xl border transition-colors p-6 sm:p-8 space-y-6"
              :class="
                previewMode === 'light'
                  ? 'bg-white border-neutral-200 text-neutral-900'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-100 dark'
              "
            >
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span class="text-xs font-bold uppercase tracking-wider" :class="previewMode === 'light' ? 'text-neutral-900' : 'text-neutral-100'">
                    Pattern 3: Mobile Segmented Top Header Bar
                  </span>
                  <p class="text-xs mt-0.5" :class="previewMode === 'light' ? 'text-neutral-600' : 'text-neutral-400'">
                    Top app bar with navigation back button, title, action triggers, and scrollable segment pills.
                  </p>
                </div>
                <span class="text-xs font-mono" :class="previewMode === 'light' ? 'text-neutral-600' : 'text-neutral-400'">
                  Category: <strong :class="previewMode === 'light' ? 'text-neutral-900' : 'text-white'" class="capitalize font-bold">{{ mobileHeaderActiveTab }}</strong>
                </span>
              </div>

              <!-- Interactive Live Preview Frame -->
              <div
                class="py-6 px-4 rounded-2xl flex justify-center transition-colors"
                :class="previewMode === 'light' ? 'bg-neutral-100 border border-neutral-200' : 'bg-neutral-950 border border-neutral-800'"
              >
                <div class="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl overflow-hidden text-white select-none">
                  <!-- Top Bar -->
                  <div class="p-3.5 flex items-center justify-between border-b border-neutral-800">
                    <div class="flex items-center gap-2">
                      <button class="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 cursor-pointer">
                        <ChevronLeft class="w-4 h-4" />
                      </button>
                      <div class="font-bold text-sm">Discover Feeds</div>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <button class="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 cursor-pointer">
                        <Search class="w-4 h-4" />
                      </button>
                      <button class="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 cursor-pointer">
                        <SlidersHorizontal class="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <!-- Scrollable Category Tabs -->
                  <div class="p-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-neutral-900/60">
                    <button
                      v-for="cat in [
                        { id: 'all', label: 'All Feeds' },
                        { id: 'trending', label: 'Trending' },
                        { id: 'following', label: 'Following' },
                        { id: 'releases', label: 'New Releases' },
                        { id: 'saved', label: 'Bookmarked' }
                      ]"
                      :key="cat.id"
                      @click="mobileHeaderActiveTab = cat.id"
                      class="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer"
                      :class="
                        mobileHeaderActiveTab === cat.id
                          ? 'bg-rose-600 text-white shadow-xs font-semibold'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      "
                    >
                      {{ cat.label }}
                    </button>
                  </div>

                  <!-- Content placeholder -->
                  <div class="p-4 text-center text-xs text-neutral-400 border-t border-neutral-800 bg-neutral-950/40">
                    Viewing <span class="text-white font-semibold uppercase">{{ mobileHeaderActiveTab }}</span> feed content stream
                  </div>
                </div>
              </div>

              <!-- Pattern 3 Code Box -->
              <div class="pt-2">
                <ComponentCodeBox :data="UI_CODE_CATALOG.mobileHeaderNav" />
              </div>
            </div>

            <!-- PATTERN 4: Mobile Action Sheet (Bottom Drawer) -->
            <div
              class="rounded-2xl border transition-colors p-6 sm:p-8 space-y-6"
              :class="
                previewMode === 'light'
                  ? 'bg-white border-neutral-200 text-neutral-900'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-100 dark'
              "
            >
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span class="text-xs font-bold uppercase tracking-wider" :class="previewMode === 'light' ? 'text-neutral-900' : 'text-neutral-100'">
                    Pattern 4: Mobile Action Sheet (Bottom Drawer)
                  </span>
                  <p class="text-xs mt-0.5" :class="previewMode === 'light' ? 'text-neutral-600' : 'text-neutral-400'">
                    iOS/Android modal action sheet with gesture dismiss handle and quick single-tap actions.
                  </p>
                </div>
                <button
                  @click="isActionSheetOpen = true"
                  class="px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
                  :class="
                    previewMode === 'light'
                      ? 'bg-neutral-900 hover:bg-neutral-800 text-white'
                      : 'bg-neutral-100 hover:bg-white text-neutral-950 font-bold'
                  "
                >
                  Open Action Sheet
                </button>
              </div>

              <!-- Pattern 4 Code Box -->
              <div class="pt-2">
                <ComponentCodeBox :data="UI_CODE_CATALOG.mobileActionSheet" />
              </div>
            </div>
          </section>
        </div>
      </main>
      </div>
    </div>

    <!-- Interactive Backdrop Modal Dialog -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="isModalOpen = false"
      >
        <div class="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl space-y-4 text-white">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                <AlertTriangle class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-base font-semibold">Discard Unsaved Changes?</h3>
                <p class="text-xs text-neutral-400">This action cannot be undone.</p>
              </div>
            </div>
            <button
              @click="isModalOpen = false"
              class="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <p class="text-xs text-neutral-400 leading-relaxed">
            You have modified custom parameters in your current sandbox session. If you navigate away now, your modifications will be reset to default configuration.
          </p>

          <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-800">
            <button
              @click="isModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Keep Editing
            </button>
            <button
              @click="isModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs font-medium bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-sm"
            >
              Discard Changes
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Interactive Mobile Action Sheet Modal -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isActionSheetOpen"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs"
        @click.self="isActionSheetOpen = false"
      >
        <div
          class="w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border space-y-4 animate-in slide-in-from-bottom duration-200"
          :class="
            previewMode === 'light'
              ? 'bg-white border-neutral-200 text-neutral-900'
              : 'bg-neutral-900 border-neutral-800 text-white'
          "
        >
          <!-- Drag Handle Indicator -->
          <div
            class="w-12 h-1 rounded-full mx-auto"
            :class="previewMode === 'light' ? 'bg-neutral-300' : 'bg-neutral-700'"
          ></div>

          <div class="text-center space-y-0.5">
            <h4
              class="text-sm font-bold"
              :class="previewMode === 'light' ? 'text-neutral-900' : 'text-white'"
            >
              Mobile Navigation Actions
            </h4>
            <p
              class="text-xs"
              :class="previewMode === 'light' ? 'text-neutral-500' : 'text-neutral-400'"
            >
              Mobile-first action sheet with one-tap actions
            </p>
          </div>

          <div class="space-y-1.5 pt-1">
            <button
              @click="triggerToast('info'); isActionSheetOpen = false"
              class="w-full py-2.5 px-4 rounded-xl text-xs font-medium flex items-center gap-3 transition-colors cursor-pointer"
              :class="
                previewMode === 'light'
                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700/60'
              "
            >
              <Share2 class="w-4 h-4 text-neutral-400" />
              <span>Share Application Link</span>
            </button>
            <button
              @click="triggerToast('success'); isActionSheetOpen = false"
              class="w-full py-2.5 px-4 rounded-xl text-xs font-medium flex items-center gap-3 transition-colors cursor-pointer"
              :class="
                previewMode === 'light'
                  ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700/60'
              "
            >
              <Bookmark class="w-4 h-4 text-neutral-400" />
              <span>Save to Favorites Collection</span>
            </button>
          </div>

          <button
            @click="isActionSheetOpen = false"
            class="w-full py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            :class="
              previewMode === 'light'
                ? 'bg-neutral-200/90 hover:bg-neutral-300 text-neutral-800'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            "
          >
            Cancel
          </button>
        </div>
      </div>
    </transition>

    <!-- Floating Live Toast Container -->
    <div class="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none max-w-sm w-full">
      <transition-group
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-3 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-2 scale-95"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto p-4 rounded-xl shadow-2xl border backdrop-blur-md flex items-start justify-between gap-3 bg-neutral-900/95 border-neutral-700 text-white"
        >
          <div class="flex items-start gap-2.5">
            <CheckCircle2 v-if="toast.type === 'success'" class="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <AlertTriangle v-else-if="toast.type === 'warning'" class="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <AlertCircle v-else-if="toast.type === 'error'" class="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
            <Info v-else class="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
            <div class="space-y-0.5">
              <div class="text-xs font-semibold">{{ toast.title }}</div>
              <div class="text-[11px] text-neutral-400 leading-snug">{{ toast.message }}</div>
            </div>
          </div>
          <button
            @click="removeToast(toast.id)"
            class="text-neutral-500 hover:text-white p-0.5 rounded transition-colors"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>
      </transition-group>
    </div>
  </div>
</template>
