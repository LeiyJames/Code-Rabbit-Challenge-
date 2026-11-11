<template>
  <header class="sticky top-0 z-50 bg-neutral-950/85 backdrop-blur-md border-b border-neutral-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
      <!-- Brand Logo -->
      <RouterLink
        to="/"
        class="flex items-center gap-2 sm:gap-2.5 font-semibold text-xs sm:text-sm tracking-tight text-white hover:text-neutral-300 transition-colors select-none shrink-0"
      >
        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white text-neutral-950 flex items-center justify-center font-mono font-bold text-xs shadow-sm">
          <Terminal class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div class="flex flex-col">
          <span class="leading-none font-bold">Dev Playground</span>
          <span class="text-[9px] sm:text-[10px] text-neutral-400 font-mono font-normal hidden sm:inline">v1.2 • Engineering Suite</span>
        </div>
      </RouterLink>

      <!-- Center & Right Navigation -->
      <nav class="flex items-center gap-1 sm:gap-2 shrink-0">
        <RouterLink
          to="/#projects"
          class="px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all select-none flex items-center gap-1 sm:gap-1.5"
          :class="
            $route.path === '/'
              ? 'text-white bg-neutral-900 border border-neutral-800'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
          "
        >
          <FolderGit2 class="w-3.5 h-3.5" />
          <span>Projects</span>
        </RouterLink>

        <RouterLink
          to="/ui-library"
          class="px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all select-none flex items-center gap-1 sm:gap-1.5"
          :class="
            $route.path === '/ui-library'
              ? 'text-white bg-neutral-900 border border-neutral-800'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
          "
        >
          <Layers class="w-3.5 h-3.5 text-rose-400" />
          <span class="hidden sm:inline">UI/UX Library</span>
          <span class="sm:hidden">UI/UX</span>
          <span class="hidden md:inline-flex px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            NEW
          </span>
        </RouterLink>

        <div class="h-4 w-px bg-neutral-800 mx-0.5 sm:mx-1 hidden sm:block"></div>

        <a
          href="https://github.com/LeiyJames"
          target="_blank"
          rel="noopener noreferrer"
          class="px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-900/60 transition-colors flex items-center gap-1 sm:gap-1.5"
          title="GitHub Repository"
        >
          <Github class="w-3.5 h-3.5" />
          <span class="hidden md:inline">GitHub</span>
        </a>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";
import { Terminal, FolderGit2, Layers, Github } from "lucide-vue-next";

const $route = useRoute();
</script>
