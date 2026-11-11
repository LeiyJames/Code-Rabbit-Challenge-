<template>
  <div class="space-y-4">
    <!-- Search Input -->
    <div class="relative">
      <Search
        class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
      />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search projects by name, description, or tech stack..."
        class="w-full px-4 py-2.5 pl-10 pr-10 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all shadow-sm text-sm placeholder:text-neutral-400"
      />
      <button
        v-if="searchQuery"
        @click="searchQuery = ''"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1 rounded-md transition-colors"
        title="Clear search"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- Category Filter -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Categories
        </label>
        <button
          v-if="selectedCategory !== null || searchQuery"
          @click="resetAllFilters"
          class="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1.5"
        >
          <RotateCcw class="w-3 h-3" />
          <span>Reset filters</span>
        </button>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in categoryList"
          :key="cat.value ?? 'all'"
          @click="selectCategory(cat.value)"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 border cursor-pointer select-none',
            selectedCategory === cat.value
              ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
              : 'bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 border-neutral-200 shadow-sm',
          ]"
        >
          <component :is="cat.icon" class="w-3.5 h-3.5" />
          <span>{{ cat.label }}</span>
        </button>
      </div>
    </div>

    <!-- Results Count -->
    <div class="flex items-center justify-between text-xs text-neutral-500 pt-0.5">
      <p>
        <span class="font-semibold text-neutral-900">{{ filteredCount }}</span>
        {{ filteredCount === 1 ? "project" : "projects" }} found
        <span v-if="selectedCategory"> in <span class="capitalize font-medium text-neutral-800">{{ selectedCategory }}</span></span>
        <span v-if="searchQuery"> matching "<span class="font-medium text-neutral-800">{{ searchQuery }}</span>"</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, markRaw } from "vue";
import type { Component } from "vue";
import type { ProjectCategory } from "@/types/project";
import {
  Search,
  X,
  RotateCcw,
  LayoutGrid,
  Gamepad2,
  Wrench,
  SlidersHorizontal,
  Wand2,
  Palette,
  GraduationCap,
} from "lucide-vue-next";

const props = withDefaults(
  defineProps<{
    filteredCount: number;
    currentCategory?: ProjectCategory | null;
  }>(),
  {
    currentCategory: null,
  }
);

const emit = defineEmits<{
  search: [query: string];
  filterCategory: [category: ProjectCategory | null];
}>();

const searchQuery = ref("");
const selectedCategory = ref<ProjectCategory | null>(props.currentCategory);

interface CategoryOption {
  value: ProjectCategory | null;
  label: string;
  icon: Component;
}

const categoryList: CategoryOption[] = [
  {
    value: null,
    label: "All Projects",
    icon: markRaw(LayoutGrid),
  },
  {
    value: "game",
    label: "Games",
    icon: markRaw(Gamepad2),
  },
  {
    value: "tool",
    label: "Tools",
    icon: markRaw(Wrench),
  },
  {
    value: "utility",
    label: "Utilities",
    icon: markRaw(SlidersHorizontal),
  },
  {
    value: "generator",
    label: "Generators",
    icon: markRaw(Wand2),
  },
  {
    value: "creative",
    label: "Creative",
    icon: markRaw(Palette),
  },
  {
    value: "education",
    label: "Education",
    icon: markRaw(GraduationCap),
  },
];

function selectCategory(category: ProjectCategory | null) {
  selectedCategory.value = category;
}

function resetAllFilters() {
  searchQuery.value = "";
  selectedCategory.value = null;
}

watch(
  () => props.currentCategory,
  (newVal) => {
    selectedCategory.value = newVal ?? null;
  }
);

watch(searchQuery, (newQuery) => {
  emit("search", newQuery);
});

watch(selectedCategory, (newCategory) => {
  emit("filterCategory", newCategory);
});
</script>
