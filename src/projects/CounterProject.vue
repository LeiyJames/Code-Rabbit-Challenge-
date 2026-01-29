<template>
  <div class="w-full max-w-md mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6 text-neutral-900">Counter</h2>
    
    <div class="bg-white rounded-2xl shadow-lg p-8 space-y-6">
      <!-- Display -->
      <div class="text-center">
        <div class="text-8xl font-bold text-gradient font-mono">{{ count }}</div>
        <p class="text-neutral-500 mt-2">Current Count</p>
      </div>
      
      <!-- Controls -->
      <div class="flex gap-3">
        <button
          @click="decrement"
          class="flex-1 h-14 bg-red-500 text-white rounded-xl font-semibold text-lg transition-all hover:bg-red-600 hover:scale-105 active:scale-95"
        >
          -
        </button>
        <button
          @click="reset"
          class="flex-1 h-14 bg-neutral-200 text-neutral-900 rounded-xl font-semibold text-lg transition-all hover:bg-neutral-300 hover:scale-105 active:scale-95"
        >
          Reset
        </button>
        <button
          @click="increment"
          class="flex-1 h-14 bg-green-500 text-white rounded-xl font-semibold text-lg transition-all hover:bg-green-600 hover:scale-105 active:scale-95"
        >
          +
        </button>
      </div>
      
      <!-- Quick Actions -->
      <div class="grid grid-cols-2 gap-3">
        <button
          @click="incrementByTen"
          class="h-12 bg-primary-100 text-primary-700 rounded-lg font-medium transition-all hover:bg-primary-200 hover:scale-105 active:scale-95"
        >
          +10
        </button>
        <button
          @click="decrementByTen"
          class="h-12 bg-primary-100 text-primary-700 rounded-lg font-medium transition-all hover:bg-primary-200 hover:scale-105 active:scale-95"
        >
          -10
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

const increment = () => count.value++
const decrement = () => count.value--
const reset = () => count.value = 0
const incrementByTen = () => count.value += 10
const decrementByTen = () => count.value -= 10
</script>
