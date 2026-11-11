<template>
  <div class="rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-md text-neutral-200 font-sans transition-all duration-200">
    <!-- Top Toggle Bar (Always Visible) -->
    <div
      class="px-3 sm:px-4 py-2.5 bg-neutral-900/90 flex flex-wrap items-center justify-between gap-2.5 cursor-pointer select-none transition-colors hover:bg-neutral-900"
      @click="isExpanded = !isExpanded"
    >
      <div class="flex items-center gap-2 sm:gap-2.5 min-w-0">
        <div class="w-6 h-6 rounded-md bg-neutral-800 text-neutral-300 flex items-center justify-center shrink-0">
          <Code2 class="w-3.5 h-3.5" />
        </div>
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-xs font-semibold text-neutral-200 truncate">
            {{ data.name }} Code
          </span>
          <span class="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-400 border border-neutral-700">
            {{ activeFrameworkLabel }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- Quick copy button when collapsed -->
        <button
          v-if="!isExpanded"
          type="button"
          @click.stop="copyActiveCode"
          class="px-2 py-1 rounded-md text-[11px] font-medium bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors flex items-center gap-1 border border-neutral-700/60"
          title="Quick copy code"
        >
          <Check v-if="copiedCode" class="w-3 h-3 text-emerald-400" />
          <Copy v-else class="w-3 h-3 text-neutral-400" />
          <span class="hidden xs:inline">{{ copiedCode ? "Copied" : "Copy" }}</span>
        </button>

        <!-- Expand / Collapse Toggle -->
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all"
          :class="
            isExpanded
              ? 'bg-neutral-800 text-white font-semibold'
              : 'text-neutral-400 hover:text-white bg-neutral-850'
          "
        >
          <span>{{ isExpanded ? "Hide Code" : "Show Code" }}</span>
          <ChevronDown
            class="w-3.5 h-3.5 transition-transform duration-200"
            :class="isExpanded ? 'rotate-180 text-rose-400' : 'text-neutral-400'"
          />
        </button>
      </div>
    </div>

    <!-- Collapsible Code Container -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="isExpanded" class="border-t border-neutral-850">
        <!-- Framework Tabs Bar -->
        <div class="px-3 sm:px-4 py-2 bg-neutral-900/60 border-b border-neutral-850 flex flex-wrap items-center justify-between gap-2.5">
          <!-- Framework Tabs (Horizontally scrollable on mobile) -->
          <div class="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full no-scrollbar">
            <button
              v-for="fw in frameworkTabs"
              :key="fw.id"
              type="button"
              @click="activeFramework = fw.id"
              class="px-2.5 py-1 rounded-lg text-xs font-medium transition-all select-none whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0"
              :class="
                activeFramework === fw.id
                  ? 'bg-neutral-800 text-white font-semibold shadow-sm border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850'
              "
            >
              <component :is="fw.icon" v-if="fw.icon" class="w-3.5 h-3.5 text-neutral-400" />
              <span>{{ fw.label }}</span>
            </button>
          </div>

          <!-- Actions: Copy for AI & Copy Code -->
          <div class="flex items-center gap-2 shrink-0">
            <!-- Copy for AI Button -->
            <button
              type="button"
              @click="copyAiPrompt"
              class="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors flex items-center gap-1.5 cursor-pointer select-none"
              title="Copy structured component prompt for AI coding assistants"
            >
              <Check v-if="copiedAi" class="w-3.5 h-3.5 text-emerald-400" />
              <Bot v-else class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">{{ copiedAi ? "Prompt Copied" : "Copy for AI" }}</span>
              <span class="sm:hidden">{{ copiedAi ? "Copied" : "AI Prompt" }}</span>
            </button>

            <!-- Copy Code Button -->
            <button
              type="button"
              @click="copyActiveCode"
              class="px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-800 text-neutral-200 hover:text-white hover:bg-neutral-700 border border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer select-none"
              title="Copy code snippet to clipboard"
            >
              <Check v-if="copiedCode" class="w-3.5 h-3.5 text-emerald-400" />
              <Copy v-else class="w-3.5 h-3.5 text-neutral-400" />
              <span>{{ copiedCode ? "Copied" : "Copy Code" }}</span>
            </button>
          </div>
        </div>

        <!-- CLI Package Manager Sub-bar (if CLI is active) -->
        <div
          v-if="activeFramework === 'cli'"
          class="px-3 sm:px-4 py-2 bg-neutral-900/40 border-b border-neutral-850 flex flex-wrap items-center justify-between gap-2 text-xs"
        >
          <div class="flex items-center gap-2">
            <span class="text-neutral-500 font-mono text-[11px]">Package Manager:</span>
            <button
              v-for="pm in (['npx', 'npm', 'pnpm', 'bun'] as const)"
              :key="pm"
              type="button"
              @click="selectedPm = pm"
              class="px-2 py-0.5 rounded text-[11px] font-mono transition-colors"
              :class="
                selectedPm === pm
                  ? 'bg-neutral-800 text-white font-bold border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200'
              "
            >
              {{ pm }}
            </button>
          </div>
          <span class="text-[10px] text-neutral-500 font-mono hidden sm:inline">Terminal Command</span>
        </div>

        <!-- Code Display Area -->
        <div class="relative p-3.5 sm:p-4 font-mono text-[11px] sm:text-xs leading-relaxed overflow-x-auto max-h-[460px] overflow-y-auto">
          <pre v-if="activeFramework !== 'cli'"><code class="text-neutral-300 whitespace-pre">{{ currentCode }}</code></pre>

          <!-- Terminal Command View -->
          <div v-else class="flex items-center gap-2.5 py-2.5 px-2 text-xs sm:text-sm text-neutral-200 break-all">
            <span class="text-rose-400 select-none font-bold shrink-0">$</span>
            <span class="text-neutral-100 select-all font-mono">{{ data.cli[selectedPm] }}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { ComponentCodeData, FrameworkType } from "@/data/uiLibraryCodeData";
import { Copy, Check, Terminal, Bot, Code2, ChevronDown, Smartphone } from "lucide-vue-next";

const props = defineProps<{
  data: ComponentCodeData;
}>();

// Default is hidden so browsing components doesn't require endless scrolling
const isExpanded = ref(false);
const activeFramework = ref<FrameworkType>("vue");
const selectedPm = ref<"npx" | "npm" | "pnpm" | "bun">("npx");
const copiedCode = ref(false);
const copiedAi = ref(false);

const frameworkTabs = computed(() => {
  const tabs = [
    { id: "vue" as FrameworkType, label: "Vue 3", icon: Code2 },
    { id: "react" as FrameworkType, label: "React", icon: Code2 },
    { id: "html" as FrameworkType, label: "HTML", icon: Code2 },
    { id: "svelte" as FrameworkType, label: "Svelte", icon: Code2 },
  ];
  if (props.data.frameworks.flutter) {
    tabs.push({ id: "flutter" as FrameworkType, label: "Flutter (Dart)", icon: Smartphone });
  }
  tabs.push({ id: "cli" as FrameworkType, label: "CLI / npx", icon: Terminal });
  return tabs;
});

const activeFrameworkLabel = computed(() => {
  const match = frameworkTabs.value.find((t) => t.id === activeFramework.value);
  return match?.label || "Code";
});

const currentCode = computed(() => {
  if (activeFramework.value === "cli") {
    return props.data.cli[selectedPm.value];
  }
  return props.data.frameworks[activeFramework.value as keyof typeof props.data.frameworks] || "";
});

function copyActiveCode() {
  const codeToCopy = currentCode.value;
  navigator.clipboard.writeText(codeToCopy).then(() => {
    copiedCode.value = true;
    setTimeout(() => {
      copiedCode.value = false;
    }, 2000);
  });
}

function copyAiPrompt() {
  const fullAiPrompt = `${props.data.aiPrompt}\n\nReference Specification (${activeFramework.value.toUpperCase()}):\n${currentCode.value}`;
  navigator.clipboard.writeText(fullAiPrompt).then(() => {
    copiedAi.value = true;
    setTimeout(() => {
      copiedAi.value = false;
    }, 2000);
  });
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
