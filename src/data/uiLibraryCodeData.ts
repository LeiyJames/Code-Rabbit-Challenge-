export type FrameworkType = "vue" | "react" | "html" | "svelte" | "flutter" | "cli" | "ai";

export interface ComponentCodeData {
  id: string;
  name: string;
  description: string;
  cli: {
    npx: string;
    npm: string;
    pnpm: string;
    bun: string;
  };
  aiPrompt: string;
  frameworks: {
    vue: string;
    react: string;
    html: string;
    svelte: string;
    flutter?: string;
  };
}

export const GLOBAL_AI_SYSTEM_PROMPT = `You are an expert Frontend Engineer utilizing the Dev Playground Design System.
Follow these design and architecture guidelines strictly:
1. Palette & Styling:
   - Primary: Tailwind Neutral / Slate monochrome scale (bg-neutral-900 text-white dark:bg-white dark:text-neutral-900).
   - Surfaces: neutral-50 / neutral-950 with border-neutral-200 / border-neutral-800.
   - Accents: Subdued rose (rose-600 / rose-400), emerald for success, amber for warning.
2. Icons & Visuals:
   - Use Lucide icons (lucide-vue-next, lucide-react, or lucide-svelte).
   - NEVER use raw emojis or dingbats in code, UI text, or labels.
3. Accessibility (a11y):
   - Always include focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 on interactive elements.
   - Ensure WCAG AA contrast ratio (4.5:1 minimum for body text).
   - Provide aria-labels on icon-only buttons and stateful toggles.
4. Transitions:
   - Use smooth, rapid micro-interactions: transition-all duration-150 ease-out active:scale-[0.98].`;

export const UI_CODE_CATALOG: Record<string, ComponentCodeData> = {
  button: {
    id: "button",
    name: "Button",
    description: "Interactive button trigger with primary, outline, soft, danger, loading, and disabled states.",
    cli: {
      npx: "npx dev-ui@latest add button",
      npm: "npm i lucide-vue-next clsx tailwind-merge",
      pnpm: "pnpm add lucide-vue-next clsx tailwind-merge",
      bun: "bun add lucide-vue-next clsx tailwind-merge"
    },
    aiPrompt: `Create an accessible Button component using Tailwind CSS and Lucide icons.
Requirements:
- Variants: 'primary' (bg-neutral-900 text-white), 'secondary' (bg-neutral-100 text-neutral-800), 'outline' (border border-neutral-300), 'danger' (bg-rose-600 text-white), 'ghost' (transparent hover:bg-neutral-100).
- Sizes: 'sm' (px-3 py-1.5 text-xs), 'md' (px-4 py-2 text-sm), 'lg' (px-5 py-2.5 text-base).
- States: loading with spinner, disabled (opacity-50 cursor-not-allowed), active:scale-[0.98].
- Accessibility: focus-visible:ring-2 focus-visible:ring-neutral-900.
- No emojis; use real Lucide icons.`,
    frameworks: {
      vue: `<script setup lang="ts">
import { computed } from "vue";
import { Loader2 } from "lucide-vue-next";

interface Props {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  loading: false,
  disabled: false
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case "secondary":
      return "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200";
    case "outline":
      return "border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800";
    case "danger":
      return "bg-rose-600 text-white hover:bg-rose-700 shadow-sm";
    case "ghost":
      return "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800";
    case "primary":
    default:
      return "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 shadow-sm";
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case "sm": return "px-3 py-1.5 text-xs rounded-lg";
    case "lg": return "px-5 py-2.5 text-base rounded-xl";
    case "md":
    default: return "px-4 py-2 text-sm rounded-xl";
  }
});
</script>

<template>
  <button
    :disabled="disabled || loading"
    class="font-medium transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none"
    :class="[variantClasses, sizeClasses]"
  >
    <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
    <slot />
  </button>
</template>`,
      react: `import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  className = '',
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 shadow-sm',
    secondary: 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200',
    outline: 'border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
    ghost: 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
  }[variant];

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-5 py-2.5 text-base rounded-xl'
  }[size];

  return (
    <button
      disabled={disabled || loading}
      className={\`font-medium transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none \${variantClasses} \${sizeClasses} \${className}\`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};`,
      html: `<!-- Primary Solid Button -->
<button
  type="button"
  class="px-4 py-2 bg-neutral-900 text-white rounded-xl text-sm font-medium shadow-sm hover:bg-neutral-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 select-none disabled:opacity-50 disabled:cursor-not-allowed"
>
  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M12 2v20M2 12h20"/>
  </svg>
  <span>Create Action</span>
</button>

<!-- Outline Button -->
<button
  type="button"
  class="px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-xl text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
>
  <span>Secondary Option</span>
</button>`,
      svelte: `<script lang="ts">
  import { Loader2 } from 'lucide-svelte';

  export let variant: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let loading = false;
  export let disabled = false;

  const variants = {
    primary: 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 shadow-sm',
    secondary: 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200',
    outline: 'border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
    ghost: 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-5 py-2.5 text-base rounded-xl'
  };
</script>

<button
  disabled={disabled || loading}
  class="font-medium transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none {variants[variant]} {sizes[size]}"
  on:click
  {...$$restProps}
>
  {#if loading}
    <Loader2 class="w-4 h-4 animate-spin" />
  {/if}
  <slot />
</button>`
    }
  },

  input: {
    id: "input",
    name: "Text Input",
    description: "Accessible text field with floating labels, clear actions, password reveals, and error/success states.",
    cli: {
      npx: "npx dev-ui@latest add input",
      npm: "npm i lucide-vue-next",
      pnpm: "pnpm add lucide-vue-next",
      bun: "bun add lucide-vue-next"
    },
    aiPrompt: `Create a clean, accessible Input component with Tailwind CSS and Lucide icons.
Requirements:
- Label with uppercase tracking-wider styling.
- Clear button when value is present.
- Support validation states: 'default', 'success' (border-emerald-500 + CheckCircle2 icon), 'error' (border-rose-500 + AlertCircle icon).
- Proper accessibility: focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900, ARIA invalid states.
- Clean neutral styling matching modern minimalist dark/light design systems.`,
    frameworks: {
      vue: `<script setup lang="ts">
import { computed } from "vue";
import { X, CheckCircle2, AlertCircle } from "lucide-vue-next";

const model = defineModel<string>({ default: "" });

const props = withDefaults(
  defineProps<{
    label?: string;
    placeholder?: string;
    state?: "default" | "success" | "error";
    helperText?: string;
  }>(),
  {
    state: "default"
  }
);
</script>

<template>
  <div class="space-y-1.5 w-full">
    <label v-if="label" class="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
      {{ label }}
    </label>
    <div class="relative">
      <input
        v-model="model"
        type="text"
        :placeholder="placeholder"
        class="w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
        :class="{
          'border-neutral-300 dark:border-neutral-800': state === 'default',
          'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20': state === 'success',
          'border-rose-500 bg-rose-50/20 dark:bg-rose-950/20': state === 'error'
        }"
      />
      <button
        v-if="model && state === 'default'"
        type="button"
        @click="model = ''"
        class="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-neutral-600"
      >
        <X class="w-3.5 h-3.5" />
      </button>
      <CheckCircle2 v-else-if="state === 'success'" class="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
      <AlertCircle v-else-if="state === 'error'" class="w-4 h-4 text-rose-500 absolute right-3 top-1/2 -translate-y-1/2" />
    </div>
    <p v-if="helperText" class="text-[11px]" :class="state === 'error' ? 'text-rose-600' : (state === 'success' ? 'text-emerald-600' : 'text-neutral-400')">
      {{ helperText }}
    </p>
  </div>
</template>`,
      react: `import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  state?: 'default' | 'success' | 'error';
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  state = 'default',
  helperText,
  value,
  onChange,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          value={value}
          onChange={onChange}
          className={\`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 \${
            state === 'success'
              ? 'border-emerald-500 bg-emerald-50/20'
              : state === 'error'
              ? 'border-rose-500 bg-rose-50/20'
              : 'border-neutral-300 dark:border-neutral-800'
          } \${className}\`}
          {...props}
        />
        {state === 'success' && (
          <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
        )}
        {state === 'error' && (
          <AlertCircle className="w-4 h-4 text-rose-500 absolute right-3 top-1/2 -translate-y-1/2" />
        )}
      </div>
      {helperText && (
        <p className={\`text-[11px] \${state === 'error' ? 'text-rose-600' : state === 'success' ? 'text-emerald-600' : 'text-neutral-400'}\`}>
          {helperText}
        </p>
      )}
    </div>
  );
};`,
      html: `<div class="space-y-1.5 w-full">
  <label class="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
    Workspace Domain
  </label>
  <div class="relative">
    <input
      type="text"
      placeholder="e.g. acme.company"
      class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all placeholder:text-neutral-400"
    />
  </div>
  <p class="text-[11px] text-neutral-400">Unique alphanumeric subdomain for team routing.</p>
</div>`,
      svelte: `<script lang="ts">
  import { X, CheckCircle2, AlertCircle } from 'lucide-svelte';

  export let value = '';
  export let label = '';
  export let placeholder = '';
  export let state: 'default' | 'success' | 'error' = 'default';
  export let helperText = '';
</script>

<div class="space-y-1.5 w-full">
  {#if label}
    <label class="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
      {label}
    </label>
  {/if}
  <div class="relative">
    <input
      bind:value
      type="text"
      {placeholder}
      class="w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 {state === 'success' ? 'border-emerald-500' : state === 'error' ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-800'}"
    />
    {#if state === 'success'}
      <CheckCircle2 class="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
    {:else if state === 'error'}
      <AlertCircle class="w-4 h-4 text-rose-500 absolute right-3 top-1/2 -translate-y-1/2" />
    {/if}
  </div>
  {#if helperText}
    <p class="text-[11px] {state === 'error' ? 'text-rose-600' : state === 'success' ? 'text-emerald-600' : 'text-neutral-400'}">
      {helperText}
    </p>
  {/if}
</div>`
    }
  },

  modal: {
    id: "modal",
    name: "Modal Dialog",
    description: "Accessible dialog overlay with backdrop blur, keyboard ESC dismissal, and action buttons.",
    cli: {
      npx: "npx dev-ui@latest add modal",
      npm: "npm i lucide-vue-next",
      pnpm: "pnpm add lucide-vue-next",
      bun: "bun add lucide-vue-next"
    },
    aiPrompt: `Create an accessible Modal Dialog component using Tailwind CSS and Vue 3 / React.
Requirements:
- Semi-transparent backdrop with blur: bg-black/60 backdrop-blur-sm.
- Modal card: rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl.
- Close on click outside (@click.self) and on Escape key press.
- Header with icon badge, title, and close button.
- Footer with Cancel (ghost/secondary) and Confirm action buttons.
- Accessible focus trapping and role="dialog" aria-modal="true".`,
    frameworks: {
      vue: `<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { X, AlertTriangle } from "lucide-vue-next";

const isOpen = defineModel<boolean>("open", { default: false });

function handleKey(e: KeyboardEvent) {
  if (e.key === "Escape" && isOpen.value) {
    isOpen.value = false;
  }
}

onMounted(() => window.addEventListener("keydown", handleKey));
onUnmounted(() => window.removeEventListener("keydown", handleKey));
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      role="dialog"
      aria-modal="true"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      @click.self="isOpen = false"
    >
      <div class="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl space-y-4 text-white">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <AlertTriangle class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-base font-semibold">Confirm Action</h3>
              <p class="text-xs text-neutral-400">Please review before continuing.</p>
            </div>
          </div>
          <button @click="isOpen = false" class="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors">
            <X class="w-4 h-4" />
          </button>
        </div>
        <p class="text-xs text-neutral-400 leading-relaxed">
          Are you sure you want to proceed? This will apply configuration updates to your cloud infrastructure.
        </p>
        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-800">
          <button @click="isOpen = false" class="px-4 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
            Cancel
          </button>
          <button @click="isOpen = false" class="px-4 py-2 rounded-xl text-xs font-medium bg-neutral-100 text-neutral-900 hover:bg-white transition-colors shadow-sm">
            Confirm & Proceed
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>`,
      react: `import React, { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl space-y-4 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="text-xs text-neutral-400">Please review before continuing.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="text-xs text-neutral-400 leading-relaxed">{children}</div>
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-800">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-xl text-xs font-medium bg-white text-neutral-950 hover:bg-neutral-100 transition-colors shadow-sm">
            Confirm & Proceed
          </button>
        </div>
      </div>
    </div>
  );
};`,
      html: `<!-- Accessible Backdrop Modal Container -->
<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true">
  <div class="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl space-y-4 text-white">
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-neutral-800 text-white flex items-center justify-center">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>
        </div>
        <div>
          <h3 class="text-base font-semibold">Confirmation Dialog</h3>
          <p class="text-xs text-neutral-400">Modal message description.</p>
        </div>
      </div>
    </div>
    <p class="text-xs text-neutral-400 leading-relaxed">Dialog description content goes here.</p>
    <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-800">
      <button class="px-4 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white">Cancel</button>
      <button class="px-4 py-2 rounded-xl text-xs font-medium bg-white text-neutral-950 font-semibold">Confirm</button>
    </div>
  </div>
</div>`,
      svelte: `<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { X, AlertTriangle } from 'lucide-svelte';

  export let isOpen = false;
  export let title = 'Confirm Action';

  const dispatch = createEventDispatcher();

  function close() {
    isOpen = false;
    dispatch('close');
  }

  function confirm() {
    dispatch('confirm');
    close();
  }
</script>

{#if isOpen}
  <div
    role="dialog"
    aria-modal="true"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    on:click|self={close}
  >
    <div class="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl space-y-4 text-white">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
            <AlertTriangle class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-base font-semibold">{title}</h3>
            <p class="text-xs text-neutral-400">Please review before continuing.</p>
          </div>
        </div>
        <button on:click={close} class="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors">
          <X class="w-4 h-4" />
        </button>
      </div>
      <slot />
      <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-800">
        <button on:click={close} class="px-4 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors">
          Cancel
        </button>
        <button on:click={confirm} class="px-4 py-2 rounded-xl text-xs font-medium bg-white text-neutral-950 hover:bg-neutral-100 transition-colors shadow-sm">
          Confirm & Proceed
        </button>
      </div>
    </div>
  </div>
{/if}`
    }
  },

  toast: {
    id: "toast",
    name: "Toast Notifications",
    description: "Stackable floating notifications with auto-dismiss, progress indicator, and icon accents.",
    cli: {
      npx: "npx dev-ui@latest add toast",
      npm: "npm i lucide-vue-next",
      pnpm: "pnpm add lucide-vue-next",
      bun: "bun add lucide-vue-next"
    },
    aiPrompt: `Create a Toast notification system in Vue 3 or React using Tailwind CSS and Lucide icons.
Requirements:
- Types: 'success' (CheckCircle2 in emerald), 'warning' (AlertTriangle in amber), 'error' (AlertCircle in rose), 'info' (Info in sky).
- Floating container: fixed bottom-6 right-6 z-50 space-y-2.
- Toast card: p-4 rounded-xl shadow-2xl border backdrop-blur-md bg-neutral-900/95 border-neutral-700 text-white.
- Auto-dismiss after 4 seconds with manual close X button.
- Smooth slide & scale entry transition.`,
    frameworks: {
      vue: `<script setup lang="ts">
import { ref } from "vue";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-vue-next";

interface ToastItem {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
}

const toasts = ref<ToastItem[]>([]);

function addToast(type: ToastItem["type"], title: string, message: string) {
  const id = Math.random().toString(36).slice(2);
  toasts.value.push({ id, type, title, message });
  setTimeout(() => removeToast(id), 4000);
}

function removeToast(id: string) {
  toasts.value = toasts.value.filter((t) => t.id !== id);
}

defineExpose({ addToast });
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none max-w-sm w-full">
    <TransitionGroup
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
        <button @click="removeToast(toast.id)" class="text-neutral-500 hover:text-white p-0.5 rounded transition-colors">
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>`,
      react: `import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

export const ToastContainer: React.FC<{ toasts: ToastItem[]; onRemove: (id: string) => void }> = ({
  toasts,
  onRemove
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto p-4 rounded-xl shadow-2xl border backdrop-blur-md flex items-start justify-between gap-3 bg-neutral-900/95 border-neutral-700 text-white animate-in slide-in-from-bottom-2 duration-150"
        >
          <div className="flex items-start gap-2.5">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />}
            <div className="space-y-0.5">
              <div className="text-xs font-semibold">{toast.title}</div>
              <div className="text-[11px] text-neutral-400 leading-snug">{toast.message}</div>
            </div>
          </div>
          <button onClick={() => onRemove(toast.id)} className="text-neutral-500 hover:text-white p-0.5 rounded transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};`,
      html: `<!-- Floating Toast Card -->
<div class="p-4 rounded-xl shadow-2xl border backdrop-blur-md flex items-start justify-between gap-3 bg-neutral-900/95 border-neutral-700 text-white max-w-sm">
  <div class="flex items-start gap-2.5">
    <div class="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"></div>
    <div class="space-y-0.5">
      <div class="text-xs font-semibold">Changes Synchronized</div>
      <div class="text-[11px] text-neutral-400 leading-snug">All configuration settings are saved.</div>
    </div>
  </div>
  <button class="text-neutral-500 hover:text-white p-0.5 rounded">&times;</button>
</div>`,
      svelte: `<script lang="ts">
  import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-svelte';

  export let toasts: Array<{ id: string; type: string; title: string; message: string }> = [];
  export let onRemove: (id: string) => void;
</script>

<div class="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none max-w-sm w-full">
  {#each toasts as toast (toast.id)}
    <div class="pointer-events-auto p-4 rounded-xl shadow-2xl border backdrop-blur-md flex items-start justify-between gap-3 bg-neutral-900/95 border-neutral-700 text-white">
      <div class="flex items-start gap-2.5">
        {#if toast.type === 'success'}
          <CheckCircle2 class="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
        {:else if toast.type === 'error'}
          <AlertCircle class="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
        {:else}
          <Info class="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
        {/if}
        <div class="space-y-0.5">
          <div class="text-xs font-semibold">{toast.title}</div>
          <div class="text-[11px] text-neutral-400 leading-snug">{toast.message}</div>
        </div>
      </div>
      <button on:click={() => onRemove(toast.id)} class="text-neutral-500 hover:text-white p-0.5 rounded transition-colors">
        <X class="w-3.5 h-3.5" />
      </button>
    </div>
  {/each}
</div>`
    }
  },

  badge: {
    id: "badge",
    name: "Badge & Pill Tags",
    description: "Status indicator pills with subtle pulse indicator dots and clean borders.",
    cli: {
      npx: "npx dev-ui@latest add badge",
      npm: "npm i lucide-vue-next",
      pnpm: "pnpm add lucide-vue-next",
      bun: "bun add lucide-vue-next"
    },
    aiPrompt: `Create a versatile Badge / Tag component using Tailwind CSS.
Requirements:
- Variants: 'operational' (emerald with pulsing indicator dot), 'warning' (amber dot), 'archived' (neutral dot), 'critical' (rose dot), 'pill' (monochrome black/white).
- Subtle, professional palette: border border-{color}-500/20 bg-{color}-500/10 text-{color}-600.
- Typography: text-xs font-medium font-sans or font-mono.
- Completely emoji-free.`,
    frameworks: {
      vue: `<script setup lang="ts">
interface Props {
  variant?: "success" | "warning" | "error" | "neutral" | "solid";
  pulsing?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: "neutral",
  pulsing: false
});
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium select-none"
    :class="{
      'border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400': variant === 'success',
      'border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400': variant === 'warning',
      'border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400': variant === 'error',
      'border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400': variant === 'neutral',
      'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold': variant === 'solid'
    }"
  >
    <span
      v-if="variant !== 'solid'"
      class="w-1.5 h-1.5 rounded-full"
      :class="{
        'bg-emerald-500': variant === 'success',
        'bg-amber-500': variant === 'warning',
        'bg-rose-500': variant === 'error',
        'bg-neutral-400': variant === 'neutral',
        'animate-pulse': pulsing
      }"
    />
    <slot />
  </span>
</template>`,
      react: `import React from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'solid';
  pulsing?: boolean;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', pulsing = false, children }) => {
  const styles = {
    success: 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    warning: 'border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    error: 'border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400',
    neutral: 'border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400',
    solid: 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold'
  }[variant];

  const dotColors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
    neutral: 'bg-neutral-400',
    solid: ''
  }[variant];

  return (
    <span className={\`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium select-none \${styles}\`}>
      {variant !== 'solid' && (
        <span className={\`w-1.5 h-1.5 rounded-full \${dotColors} \${pulsing ? 'animate-pulse' : ''}\`} />
      )}
      {children}
    </span>
  );
};`,
      html: `<!-- Status Indicator Badge (Operational) -->
<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
  <span>Operational</span>
</span>`,
      svelte: `<script lang="ts">
  export let variant: 'success' | 'warning' | 'error' | 'neutral' | 'solid' = 'neutral';
  export let pulsing = false;
</script>

<span
  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium select-none {variant === 'success' ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-600' : variant === 'error' ? 'border border-rose-500/20 bg-rose-500/10 text-rose-600' : 'border border-neutral-300 bg-neutral-100 text-neutral-600'}"
>
  {#if variant !== 'solid'}
    <span class="w-1.5 h-1.5 rounded-full {variant === 'success' ? 'bg-emerald-500' : 'bg-neutral-400'} {pulsing ? 'animate-pulse' : ''}"></span>
  {/if}
  <slot />
</span>`
    }
  },

  card: {
    id: "card",
    name: "Metric KPI Card",
    description: "Analytics KPI tile with trend indicators, label, large value, and supporting subtitle.",
    cli: {
      npx: "npx dev-ui@latest add card",
      npm: "npm i lucide-vue-next",
      pnpm: "pnpm add lucide-vue-next",
      bun: "bun add lucide-vue-next"
    },
    aiPrompt: `Create a sleek Metric / KPI Card component with Tailwind CSS and Lucide icons.
Requirements:
- Header with metric label and trend badge (e.g. +24.8% with ArrowUpRight in emerald or -3.1% with ArrowDownRight in rose).
- Large prominent figure: text-2xl font-bold mt-3.
- Subtitle: text-[11px] text-neutral-400.
- Clean rounded-xl card border: border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/60.`,
    frameworks: {
      vue: `<script setup lang="ts">
import { ArrowUpRight, ArrowDownRight } from "lucide-vue-next";

defineProps<{
  label: string;
  value: string;
  trend?: string;
  isPositive?: boolean;
  subtitle?: string;
}>();
</script>

<template>
  <div class="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/60 flex flex-col justify-between">
    <div class="flex items-center justify-between">
      <span class="text-xs text-neutral-500 font-medium">{{ label }}</span>
      <span
        v-if="trend"
        class="inline-flex items-center gap-0.5 text-xs font-semibold"
        :class="isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'"
      >
        <ArrowUpRight v-if="isPositive" class="w-3 h-3" />
        <ArrowDownRight v-else class="w-3 h-3" />
        {{ trend }}
      </span>
    </div>
    <div class="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-3">{{ value }}</div>
    <div v-if="subtitle" class="text-[11px] text-neutral-400 mt-1">{{ subtitle }}</div>
  </div>
</template>`,
      react: `import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  trend?: string;
  isPositive?: boolean;
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  trend,
  isPositive = true,
  subtitle
}) => {
  return (
    <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/60 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-500 font-medium">{label}</span>
        {trend && (
          <span className={\`inline-flex items-center gap-0.5 text-xs font-semibold \${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}\`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-3">{value}</div>
      {subtitle && <div className="text-[11px] text-neutral-400 mt-1">{subtitle}</div>}
    </div>
  );
};`,
      html: `<div class="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/60 flex flex-col justify-between">
  <div class="flex items-center justify-between">
    <span class="text-xs text-neutral-500 font-medium">Daily Active Users</span>
    <span class="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
      &uarr; +18.4%
    </span>
  </div>
  <div class="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-3">48,290</div>
  <div class="text-[11px] text-neutral-400 mt-1">Metrics aggregated over past 24h</div>
</div>`,
      svelte: `<script lang="ts">
  import { ArrowUpRight, ArrowDownRight } from 'lucide-svelte';

  export let label = '';
  export let value = '';
  export let trend = '';
  export let isPositive = true;
  export let subtitle = '';
</script>

<div class="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950/60 flex flex-col justify-between">
  <div class="flex items-center justify-between">
    <span class="text-xs text-neutral-500 font-medium">{label}</span>
    {#if trend}
      <span class="inline-flex items-center gap-0.5 text-xs font-semibold {isPositive ? 'text-emerald-600' : 'text-rose-600'}">
        {#if isPositive}
          <ArrowUpRight class="w-3 h-3" />
        {:else}
          <ArrowDownRight class="w-3 h-3" />
        {/if}
        {trend}
      </span>
    {/if}
  </div>
  <div class="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-3">{value}</div>
  {#if subtitle}
    <div class="text-[11px] text-neutral-400 mt-1">{subtitle}</div>
  {/if}
</div>`
    }
  },
  mobileNav: {
    id: "mobileNav",
    name: "Mobile App Navigation & Tab Bar",
    description: "Mobile-first floating bottom tab bar with active indicator pills, notification counter badges, and responsive thumb-zone ergonomics.",
    cli: {
      npx: "npx dev-ui@latest add mobile-nav",
      npm: "npm i lucide-vue-next clsx tailwind-merge",
      pnpm: "pnpm add lucide-vue-next clsx tailwind-merge",
      bun: "bun add lucide-vue-next clsx tailwind-merge"
    },
    aiPrompt: `Create an accessible Mobile App Bottom Tab Bar using Tailwind CSS and Lucide icons.
Requirements:
- Floating pill bottom tab bar: rounded-3xl bg-neutral-900/95 backdrop-blur-lg text-white border border-neutral-800.
- Items: Home, Search, Bag (with badge), Saved/Wishlist, Profile.
- Active state: bg-white/15 text-white rounded-2xl.
- Inactive state: text-neutral-400 hover:text-white.
- Notification badge on Bag icon: w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold.
- Strict zero emojis; use real Lucide icons.`,
    frameworks: {
      vue: `<script setup lang="ts">
import { ref } from "vue";
import { Home, Search, ShoppingBag, Heart, User } from "lucide-vue-next";

const activeTab = ref("home");
const tabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "search", label: "Search", icon: Search },
  { id: "bag", label: "Bag", icon: ShoppingBag, badge: 2 },
  { id: "wishlist", label: "Saved", icon: Heart },
  { id: "profile", label: "Profile", icon: User },
];
</script>

<template>
  <nav class="w-full max-w-sm mx-auto p-2 rounded-3xl bg-neutral-900/95 backdrop-blur-lg border border-neutral-800 shadow-2xl flex items-center justify-around select-none">
    <button
      v-for="t in tabs"
      :key="t.id"
      @click="activeTab = t.id"
      class="relative p-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all cursor-pointer"
      :class="activeTab === t.id ? 'bg-white/15 text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
    >
      <component :is="t.icon" class="w-5 h-5" />
      <span class="text-[10px] font-medium leading-none">{{ t.label }}</span>
      <span v-if="t.badge" class="absolute top-1.5 right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
        {{ t.badge }}
      </span>
    </button>
  </nav>
</template>`,
      react: `import React, { useState } from 'react';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';

export default function MobileTabBar() {
  const [activeTab, setActiveTab] = useState('home');
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'bag', label: 'Bag', icon: ShoppingBag, badge: 2 },
    { id: 'wishlist', label: 'Saved', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="w-full max-w-sm mx-auto p-2 rounded-3xl bg-neutral-900/95 backdrop-blur-lg border border-neutral-800 shadow-2xl flex items-center justify-around select-none">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={'relative p-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all ' + (isActive ? 'bg-white/15 text-white shadow-xs' : 'text-neutral-400 hover:text-white')}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-none">{t.label}</span>
            {t.badge && (
              <span className="absolute top-1.5 right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {t.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}`,
      html: `<!-- Floating Mobile Bottom Tab Bar -->
<nav class="w-full max-w-sm mx-auto p-2 rounded-3xl bg-neutral-900/95 backdrop-blur-lg border border-neutral-800 shadow-2xl flex items-center justify-around text-neutral-400 select-none">
  <button class="p-2.5 rounded-2xl bg-white/15 text-white flex flex-col items-center gap-1">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
    <span class="text-[10px] font-medium leading-none">Home</span>
  </button>
  <button class="p-2.5 rounded-2xl flex flex-col items-center gap-1 hover:text-white">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
    <span class="text-[10px] font-medium leading-none">Search</span>
  </button>
  <button class="relative p-2.5 rounded-2xl flex flex-col items-center gap-1 hover:text-white">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
    <span class="text-[10px] font-medium leading-none">Bag</span>
    <span class="absolute top-1.5 right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">2</span>
  </button>
</nav>`,
      flutter: `import 'package:flutter/material.dart';

void main() => runApp(const MobileNavigationApp());

class MobileNavigationApp extends StatelessWidget {
  const MobileNavigationApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF0A0A0A),
        colorScheme: const ColorScheme.dark(
          primary: Colors.white,
          secondary: Color(0xFFF43F5E), // Rose 500
          surface: Color(0xFF171717),  // Neutral 900
        ),
      ),
      home: const MobileNavScreen(),
    );
  }
}

class MobileNavScreen extends StatefulWidget {
  const MobileNavScreen({super.key});

  @override
  State<MobileNavScreen> createState() => _MobileNavScreenState();
}

class _MobileNavScreenState extends State<MobileNavScreen> {
  int _currentIndex = 0;

  final List<Widget> _views = const [
    Center(child: Text('Home Feed', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold))),
    Center(child: Text('Search Catalog', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold))),
    Center(child: Text('Orders & Bag', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold))),
    Center(child: Text('Saved Wishlist', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold))),
    Center(child: Text('User Profile', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold))),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(child: _views[_currentIndex]),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
          child: Container(
            height: 66,
            decoration: BoxDecoration(
              color: const Color(0xFF171717).withOpacity(0.95), // Neutral 900
              borderRadius: BorderRadius.circular(33),
              border: Border.all(color: const Color(0xFF262626)),
              boxShadow: const [
                BoxShadow(color: Colors.black54, blurRadius: 18, offset: Offset(0, 8)),
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildTab(icon: Icons.home_rounded, label: 'Home', index: 0),
                _buildTab(icon: Icons.search_rounded, label: 'Search', index: 1),
                _buildTab(icon: Icons.shopping_bag_outlined, label: 'Bag', index: 2, badge: 2),
                _buildTab(icon: Icons.favorite_border_rounded, label: 'Saved', index: 3),
                _buildTab(icon: Icons.person_outline_rounded, label: 'Profile', index: 4),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTab({
    required IconData icon,
    required String label,
    required int index,
    int? badge,
  }) {
    final bool active = _currentIndex == index;

    return GestureDetector(
      onTap: () => setState(() => _currentIndex = index),
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeOut,
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: active ? Colors.white.withOpacity(0.12) : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(icon, size: 22, color: active ? Colors.white : const Color(0xFFA3A3A3)),
                const SizedBox(height: 3),
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: active ? FontWeight.w600 : FontWeight.normal,
                    color: active ? Colors.white : const Color(0xFFA3A3A3),
                  ),
                ),
              ],
            ),
            if (badge != null)
              Positioned(
                top: -3,
                right: -6,
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(
                    color: Color(0xFFF43F5E), // Rose 500
                    shape: BoxShape.circle,
                  ),
                  constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
                  child: Center(
                    child: Text(
                      badge.toString(),
                      style: const TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        height: 1,
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}`,
      svelte: `<script>
  let activeTab = 'home';
</script>

<nav class="w-full max-w-sm mx-auto p-2 rounded-3xl bg-neutral-900/95 backdrop-blur-lg border border-neutral-800 shadow-2xl flex items-center justify-around text-neutral-400 select-none">
  <button on:click={() => activeTab = 'home'} class="p-2.5 rounded-2xl flex flex-col items-center gap-1 {activeTab === 'home' ? 'bg-white/15 text-white' : 'hover:text-white'}">
    <span class="text-[10px] font-medium leading-none">Home</span>
  </button>
</nav>`
    }
  },

  mobileFabNav: {
    id: "mobileFabNav",
    name: "Notched Center-FAB Bottom Dock",
    description: "Mobile bottom dock featuring an elevated center action FAB for primary creation workflows, notification pings, and thumb ergonomics.",
    cli: {
      npx: "npx dev-ui@latest add mobile-fab-nav",
      npm: "npm i lucide-vue-next",
      pnpm: "pnpm add lucide-vue-next",
      bun: "bun add lucide-vue-next"
    },
    aiPrompt: `Create a mobile bottom dock navigation bar with an elevated center Floating Action Button (FAB).
Requirements:
- Container: w-full max-w-sm rounded-2xl bg-neutral-900/95 backdrop-blur-lg border border-neutral-800 shadow-2xl.
- Center elevated button: -top-5 rounded-full w-12 h-12 bg-rose-600 text-white shadow-lg border-4 border-neutral-950.
- Surrounding tabs: Feed (Home), Explore (Compass), Inbox (MessageSquare with unread ping dot), Profile (User).
- Active state: text-white, Inactive state: text-neutral-400 hover:text-white.`,
    frameworks: {
      vue: `<script setup lang="ts">
import { ref } from "vue";
import { Home, Compass, Plus, MessageSquare, User } from "lucide-vue-next";

const activeTab = ref("feed");
const emit = defineEmits(["create"]);
</script>

<template>
  <div class="w-full max-w-sm mx-auto relative select-none">
    <nav class="p-2 rounded-2xl bg-neutral-900/95 backdrop-blur-lg border border-neutral-800 shadow-2xl flex items-center justify-between px-4">
      <button
        @click="activeTab = 'feed'"
        class="p-2 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer"
        :class="activeTab === 'feed' ? 'text-white' : 'text-neutral-400 hover:text-white'"
      >
        <Home class="w-5 h-5" />
        <span class="text-[10px] font-medium">Feed</span>
      </button>

      <button
        @click="activeTab = 'explore'"
        class="p-2 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer"
        :class="activeTab === 'explore' ? 'text-white' : 'text-neutral-400 hover:text-white'"
      >
        <Compass class="w-5 h-5" />
        <span class="text-[10px] font-medium">Explore</span>
      </button>

      <!-- Center Elevated Action FAB -->
      <div class="relative -top-5 flex flex-col items-center">
        <button
          @click="emit('create')"
          class="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 border-4 border-neutral-950 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          title="Create New Action"
        >
          <Plus class="w-6 h-6 stroke-[2.5]" />
        </button>
        <span class="text-[10px] font-medium text-neutral-400 mt-1">Post</span>
      </div>

      <button
        @click="activeTab = 'messages'"
        class="relative p-2 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer"
        :class="activeTab === 'messages' ? 'text-white' : 'text-neutral-400 hover:text-white'"
      >
        <MessageSquare class="w-5 h-5" />
        <span class="text-[10px] font-medium">Inbox</span>
        <span class="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-rose-500"></span>
      </button>

      <button
        @click="activeTab = 'profile'"
        class="p-2 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer"
        :class="activeTab === 'profile' ? 'text-white' : 'text-neutral-400 hover:text-white'"
      >
        <User class="w-5 h-5" />
        <span class="text-[10px] font-medium">Profile</span>
      </button>
    </nav>
  </div>
</template>`,
      react: `import React, { useState } from 'react';
import { Home, Compass, Plus, MessageSquare, User } from 'lucide-react';

export const MobileFabNav: React.FC<{ onCreate?: () => void }> = ({ onCreate }) => {
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <div className="w-full max-w-sm mx-auto relative select-none">
      <nav className="p-2 rounded-2xl bg-neutral-900/95 backdrop-blur-lg border border-neutral-800 shadow-2xl flex items-center justify-between px-4">
        <button
          onClick={() => setActiveTab('feed')}
          className={'p-2 rounded-xl flex flex-col items-center gap-1 transition-all ' + (activeTab === 'feed' ? 'text-white' : 'text-neutral-400 hover:text-white')}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Feed</span>
        </button>

        <button
          onClick={() => setActiveTab('explore')}
          className={'p-2 rounded-xl flex flex-col items-center gap-1 transition-all ' + (activeTab === 'explore' ? 'text-white' : 'text-neutral-400 hover:text-white')}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium">Explore</span>
        </button>

        <div className="relative -top-5 flex flex-col items-center">
          <button
            onClick={onCreate}
            className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 border-4 border-neutral-950 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span className="text-[10px] font-medium text-neutral-400 mt-1">Post</span>
        </div>

        <button
          onClick={() => setActiveTab('messages')}
          className={'relative p-2 rounded-xl flex flex-col items-center gap-1 transition-all ' + (activeTab === 'messages' ? 'text-white' : 'text-neutral-400 hover:text-white')}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-medium">Inbox</span>
          <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-rose-500" />
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={'p-2 rounded-xl flex flex-col items-center gap-1 transition-all ' + (activeTab === 'profile' ? 'text-white' : 'text-neutral-400 hover:text-white')}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>
    </div>
  );
};`,
      html: `<!-- Mobile Notched Center-FAB Dock -->
<div class="w-full max-w-sm mx-auto relative select-none">
  <nav class="p-2 rounded-2xl bg-neutral-900/95 backdrop-blur-lg border border-neutral-800 shadow-2xl flex items-center justify-between px-4 text-neutral-400">
    <button class="p-2 text-white flex flex-col items-center gap-1">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
      <span class="text-[10px] font-medium">Feed</span>
    </button>
    <button class="p-2 hover:text-white flex flex-col items-center gap-1">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></svg>
      <span class="text-[10px] font-medium">Explore</span>
    </button>
    <div class="relative -top-5 flex flex-col items-center">
      <button class="w-12 h-12 rounded-full bg-rose-600 text-white shadow-lg border-4 border-neutral-950 flex items-center justify-center">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"/></svg>
      </button>
      <span class="text-[10px] font-medium text-neutral-400 mt-1">Post</span>
    </div>
    <button class="relative p-2 hover:text-white flex flex-col items-center gap-1">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <span class="text-[10px] font-medium">Inbox</span>
      <span class="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-rose-500"></span>
    </button>
    <button class="p-2 hover:text-white flex flex-col items-center gap-1">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      <span class="text-[10px] font-medium">Profile</span>
    </button>
  </nav>
</div>`,
      svelte: `<script>
  let activeTab = 'feed';
</script>

<div class="w-full max-w-sm mx-auto relative select-none">
  <nav class="p-2 rounded-2xl bg-neutral-900/95 backdrop-blur-lg border border-neutral-800 shadow-2xl flex items-center justify-between px-4">
    <button on:click={() => activeTab = 'feed'} class="p-2 rounded-xl flex flex-col items-center gap-1 {activeTab === 'feed' ? 'text-white' : 'text-neutral-400 hover:text-white'}">
      <span class="text-[10px] font-medium">Feed</span>
    </button>
    <button on:click={() => activeTab = 'explore'} class="p-2 rounded-xl flex flex-col items-center gap-1 {activeTab === 'explore' ? 'text-white' : 'text-neutral-400 hover:text-white'}">
      <span class="text-[10px] font-medium">Explore</span>
    </button>
    <div class="relative -top-5 flex flex-col items-center">
      <button class="w-12 h-12 rounded-full bg-rose-600 text-white shadow-lg border-4 border-neutral-950 flex items-center justify-center">
        +
      </button>
      <span class="text-[10px] font-medium text-neutral-400 mt-1">Post</span>
    </div>
  </nav>
</div>`,
      flutter: `import 'package:flutter/material.dart';

void main() => runApp(const NotchedFabNavApp());

class NotchedFabNavApp extends StatelessWidget {
  const NotchedFabNavApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF0A0A0A),
      ),
      home: const NotchedFabHomeScreen(),
    );
  }
}

class NotchedFabHomeScreen extends StatefulWidget {
  const NotchedFabHomeScreen({super.key});

  @override
  State<NotchedFabHomeScreen> createState() => _NotchedFabHomeScreenState();
}

class _NotchedFabHomeScreenState extends State<NotchedFabHomeScreen> {
  int _tabIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Text('Active Tab Index: ' + _tabIndex.toString(), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Create Post triggered')),
          );
        },
        backgroundColor: const Color(0xFFE11D48), // Rose 600
        elevation: 6,
        shape: const CircleBorder(side: BorderSide(color: Color(0xFF0A0A0A), width: 3)),
        child: const Icon(Icons.add_rounded, size: 28, color: Colors.white),
      ),
      bottomNavigationBar: BottomAppBar(
        color: const Color(0xFF171717),
        shape: const CircularNotchedRectangle(),
        notchMargin: 8.0,
        clipBehavior: Clip.antiAlias,
        child: SizedBox(
          height: 60,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              IconButton(
                icon: Icon(Icons.home_filled, color: _tabIndex == 0 ? Colors.white : Colors.white54),
                onPressed: () => setState(() => _tabIndex = 0),
              ),
              IconButton(
                icon: Icon(Icons.explore_outlined, color: _tabIndex == 1 ? Colors.white : Colors.white54),
                onPressed: () => setState(() => _tabIndex = 1),
              ),
              const SizedBox(width: 48), // Spacer for notched center FAB
              IconButton(
                icon: Icon(Icons.mail_outline_rounded, color: _tabIndex == 2 ? Colors.white : Colors.white54),
                onPressed: () => setState(() => _tabIndex = 2),
              ),
              IconButton(
                icon: Icon(Icons.person_outline_rounded, color: _tabIndex == 3 ? Colors.white : Colors.white54),
                onPressed: () => setState(() => _tabIndex = 3),
              ),
            ],
          ),
        ),
      ),
    );
  }
}`
    }
  },

  mobileHeaderNav: {
    id: "mobileHeaderNav",
    name: "Mobile Segmented Top Header Bar",
    description: "Smartphone top app bar with navigation back chevron, title, action triggers, and scrollable horizontal category filter pills.",
    cli: {
      npx: "npx dev-ui@latest add mobile-header-nav",
      npm: "npm i lucide-vue-next",
      pnpm: "pnpm add lucide-vue-next",
      bun: "bun add lucide-vue-next"
    },
    aiPrompt: `Create a mobile top app bar header with scrollable segmented category pills.
Requirements:
- Top bar: Back Chevron button, Title ('Discover Feeds'), Search and Filter icons.
- Sub-bar: Horizontally scrollable chip filter pills ('All Feeds', 'Trending', 'Following', 'New Releases', 'Bookmarked').
- Active chip: bg-rose-600 text-white font-semibold.
- Inactive chip: bg-neutral-800 text-neutral-400 hover:text-white.`,
    frameworks: {
      vue: `<script setup lang="ts">
import { ref } from "vue";
import { ChevronLeft, Search, SlidersHorizontal } from "lucide-vue-next";

const activeCategory = ref("all");
const categories = [
  { id: "all", label: "All Feeds" },
  { id: "trending", label: "Trending" },
  { id: "following", label: "Following" },
  { id: "releases", label: "New Releases" },
  { id: "saved", label: "Bookmarked" }
];
</script>

<template>
  <header class="w-full max-w-sm mx-auto rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl overflow-hidden text-white select-none">
    <!-- Top Action Bar -->
    <div class="p-3.5 flex items-center justify-between border-b border-neutral-800">
      <div class="flex items-center gap-2">
        <button class="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 cursor-pointer">
          <ChevronLeft class="w-4 h-4" />
        </button>
        <h1 class="font-bold text-sm">Discover Feeds</h1>
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
        v-for="cat in categories"
        :key="cat.id"
        @click="activeCategory = cat.id"
        class="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer"
        :class="activeCategory === cat.id ? 'bg-rose-600 text-white shadow-xs font-semibold' : 'bg-neutral-800 text-neutral-400 hover:text-white'"
      >
        {{ cat.label }}
      </button>
    </div>
  </header>
</template>`,
      react: `import React, { useState } from 'react';
import { ChevronLeft, Search, SlidersHorizontal } from 'lucide-react';

export const MobileHeaderNav: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const categories = [
    { id: 'all', label: 'All Feeds' },
    { id: 'trending', label: 'Trending' },
    { id: 'following', label: 'Following' },
    { id: 'releases', label: 'New Releases' },
    { id: 'saved', label: 'Bookmarked' }
  ];

  return (
    <header className="w-full max-w-sm mx-auto rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl overflow-hidden text-white select-none">
      <div className="p-3.5 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-sm">Discover Feeds</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300">
            <Search className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-neutral-900/60">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ' + (activeCategory === cat.id ? 'bg-rose-600 text-white font-semibold shadow-xs' : 'bg-neutral-800 text-neutral-400 hover:text-white')}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </header>
  );
};`,
      html: `<!-- Mobile Segmented Top Header Bar -->
<header class="w-full max-w-sm mx-auto rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl overflow-hidden text-white select-none">
  <div class="p-3.5 flex items-center justify-between border-b border-neutral-800">
    <div class="flex items-center gap-2">
      <button class="w-8 h-8 rounded-lg bg-neutral-800 text-neutral-300 flex items-center justify-center">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <span class="font-bold text-sm">Discover Feeds</span>
    </div>
    <div class="flex items-center gap-1.5">
      <button class="w-8 h-8 rounded-lg bg-neutral-800 text-neutral-300 flex items-center justify-center">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </button>
    </div>
  </div>
  <div class="p-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-neutral-900/60">
    <button class="px-3 py-1 rounded-full text-xs font-semibold bg-rose-600 text-white">All Feeds</button>
    <button class="px-3 py-1 rounded-full text-xs font-medium bg-neutral-800 text-neutral-400">Trending</button>
    <button class="px-3 py-1 rounded-full text-xs font-medium bg-neutral-800 text-neutral-400">Following</button>
  </div>
</header>`,
      svelte: `<script>
  let activeCategory = 'all';
</script>

<header class="w-full max-w-sm mx-auto rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl overflow-hidden text-white select-none">
  <div class="p-3.5 flex items-center justify-between border-b border-neutral-800">
    <span class="font-bold text-sm">Discover Feeds</span>
  </div>
  <div class="p-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
    <button on:click={() => activeCategory = 'all'} class="px-3 py-1 rounded-full text-xs font-medium {activeCategory === 'all' ? 'bg-rose-600 text-white' : 'bg-neutral-800 text-neutral-400'}">All Feeds</button>
    <button on:click={() => activeCategory = 'trending'} class="px-3 py-1 rounded-full text-xs font-medium {activeCategory === 'trending' ? 'bg-rose-600 text-white' : 'bg-neutral-800 text-neutral-400'}">Trending</button>
  </div>
</header>`,
      flutter: `import 'package:flutter/material.dart';

void main() => runApp(const MobileHeaderApp());

class MobileHeaderApp extends StatelessWidget {
  const MobileHeaderApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(scaffoldBackgroundColor: const Color(0xFF0A0A0A)),
      home: const MobileHeaderScreen(),
    );
  }
}

class MobileHeaderScreen extends StatefulWidget {
  const MobileHeaderScreen({super.key});

  @override
  State<MobileHeaderScreen> createState() => _MobileHeaderScreenState();
}

class _MobileHeaderScreenState extends State<MobileHeaderScreen> {
  int _selectedChip = 0;
  final List<String> _chips = const ['All Feeds', 'Trending', 'Following', 'New Releases', 'Bookmarked'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF171717),
        elevation: 0,
        title: const Text('Discover Feeds', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
          onPressed: () {},
        ),
        actions: [
          IconButton(icon: const Icon(Icons.search_rounded), onPressed: () {}),
          IconButton(icon: const Icon(Icons.tune_rounded), onPressed: () {}),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(48),
          child: Container(
            height: 48,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: _chips.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, i) {
                final bool isSelected = _selectedChip == i;
                return GestureDetector(
                  onTap: () => setState(() => _selectedChip = i),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFFE11D48) : const Color(0xFF262626),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Center(
                      child: Text(
                        _chips[i],
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          color: isSelected ? Colors.white : Colors.white70,
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ),
      ),
      body: Center(
        child: Text('Selected category: ' + _chips[_selectedChip]),
      ),
    );
  }
}`
    }
  },

  mobileActionSheet: {
    id: "mobileActionSheet",
    name: "Mobile Action Sheet (Bottom Drawer)",
    description: "iOS/Android modal action sheet with drag dismiss handle, one-tap quick actions, and dismiss triggers.",
    cli: {
      npx: "npx dev-ui@latest add mobile-action-sheet",
      npm: "npm i lucide-vue-next",
      pnpm: "pnpm add lucide-vue-next",
      bun: "bun add lucide-vue-next"
    },
    aiPrompt: `Create a mobile bottom modal action sheet with gesture dismiss handle.
Requirements:
- Bottom sheet drawer: rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border.
- Drag handle: w-12 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto.
- Action items: Share Link, Save Collection.
- Cancel button at the bottom.
- Smooth transition: enter slide-in-from-bottom duration-200.`,
    frameworks: {
      vue: `<script setup lang="ts">
import { ref } from "vue";
import { Share2, Bookmark } from "lucide-vue-next";

const isOpen = defineModel<boolean>("open", { default: false });
const emit = defineEmits(["share", "save"]);
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-8"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-8"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs"
      @click.self="isOpen = false"
    >
      <div class="w-full max-w-sm bg-neutral-900 text-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-neutral-800 space-y-4">
        <!-- Drag Handle Indicator -->
        <div class="w-12 h-1 bg-neutral-700 rounded-full mx-auto"></div>

        <div class="text-center space-y-0.5">
          <h4 class="text-sm font-bold">Quick Actions</h4>
          <p class="text-xs text-neutral-400">Select an action to proceed</p>
        </div>

        <div class="space-y-1.5 pt-1">
          <button
            @click="emit('share'); isOpen = false"
            class="w-full py-2.5 px-4 rounded-xl text-xs font-medium bg-neutral-800 hover:bg-neutral-700/80 text-neutral-200 flex items-center gap-3 transition-colors cursor-pointer"
          >
            <Share2 class="w-4 h-4 text-neutral-400" />
            <span>Share Application Link</span>
          </button>
          <button
            @click="emit('save'); isOpen = false"
            class="w-full py-2.5 px-4 rounded-xl text-xs font-medium bg-neutral-800 hover:bg-neutral-700/80 text-neutral-200 flex items-center gap-3 transition-colors cursor-pointer"
          >
            <Bookmark class="w-4 h-4 text-neutral-400" />
            <span>Save to Favorites Collection</span>
          </button>
        </div>

        <button
          @click="isOpen = false"
          class="w-full py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  </Transition>
</template>`,
      react: `import React from 'react';
import { Share2, Bookmark } from 'lucide-react';

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onShare?: () => void;
  onSave?: () => void;
}

export const MobileActionSheet: React.FC<ActionSheetProps> = ({ isOpen, onClose, onShare, onSave }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-neutral-900 text-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-neutral-800 space-y-4 animate-in slide-in-from-bottom duration-200">
        <div className="w-12 h-1 bg-neutral-700 rounded-full mx-auto" />
        <div className="text-center space-y-0.5">
          <h4 className="text-sm font-bold">Quick Actions</h4>
          <p className="text-xs text-neutral-400">Select an action to proceed</p>
        </div>
        <div className="space-y-1.5 pt-1">
          <button onClick={onShare} className="w-full py-2.5 px-4 rounded-xl text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-3">
            <Share2 className="w-4 h-4 text-neutral-400" />
            <span>Share Application Link</span>
          </button>
          <button onClick={onSave} className="w-full py-2.5 px-4 rounded-xl text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-3">
            <Bookmark className="w-4 h-4 text-neutral-400" />
            <span>Save to Favorites Collection</span>
          </button>
        </div>
        <button onClick={onClose} className="w-full py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-300">
          Cancel
        </button>
      </div>
    </div>
  );
};`,
      html: `<!-- Mobile Action Sheet Drawer -->
<div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
  <div class="w-full max-w-sm bg-neutral-900 text-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-neutral-800 space-y-4">
    <div class="w-12 h-1 bg-neutral-700 rounded-full mx-auto"></div>
    <div class="text-center space-y-0.5">
      <h4 class="text-sm font-bold">Quick Actions</h4>
      <p class="text-xs text-neutral-400">Select an action to proceed</p>
    </div>
    <div class="space-y-1.5 pt-1">
      <button class="w-full py-2.5 px-4 rounded-xl text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-3">
        <span>Share Application Link</span>
      </button>
    </div>
    <button class="w-full py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 text-neutral-300">Cancel</button>
  </div>
</div>`,
      svelte: `<script>
  export let isOpen = false;
</script>

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
    <div class="w-full max-w-sm bg-neutral-900 text-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-neutral-800 space-y-4">
      <div class="w-12 h-1 bg-neutral-700 rounded-full mx-auto"></div>
      <slot />
    </div>
  </div>
{/if}`,
      flutter: `import 'package:flutter/material.dart';

void showCustomActionSheet(BuildContext context) {
  showModalBottomSheet(
    context: context,
    backgroundColor: const Color(0xFF171717),
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
    ),
    builder: (context) {
      return SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 44,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.white24,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 16),
              const Text('Quick Actions', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white)),
              const SizedBox(height: 12),
              ListTile(
                leading: const Icon(Icons.share_outlined, color: Colors.white70),
                title: const Text('Share Application Link', style: TextStyle(color: Colors.white, fontSize: 13)),
                onTap: () => Navigator.pop(context),
              ),
              ListTile(
                leading: const Icon(Icons.bookmark_outline_rounded, color: Colors.white70),
                title: const Text('Save to Favorites Collection', style: TextStyle(color: Colors.white, fontSize: 13)),
                onTap: () => Navigator.pop(context),
              ),
              const SizedBox(height: 8),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF262626),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Cancel', style: TextStyle(color: Colors.white70)),
                ),
              ),
            ],
          ),
        ),
      );
    },
  );
}`
    }
  }

};
