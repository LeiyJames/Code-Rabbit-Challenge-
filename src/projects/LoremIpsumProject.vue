<template>
  <div class="w-full max-w-3xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6 text-neutral-900">Lorem Ipsum Generator</h2>
    
    <div class="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <!-- Controls -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">
            Type
          </label>
          <div class="flex gap-2">
            <button
              v-for="type in types"
              :key="type"
              @click="selectedType = type"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 active:scale-95',
                selectedType === type
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              ]"
            >
              {{ type }}
            </button>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-3">
            <span class="flex justify-between items-center">
              <span>Count</span>
              <span class="text-2xl font-bold text-primary-600">{{ count }}</span>
            </span>
          </label>
          <div class="relative">
            <input
              v-model.number="count"
              type="range"
              min="1"
              max="10"
              class="w-full h-3 bg-gradient-to-r from-primary-200 to-primary-500 rounded-full appearance-none cursor-pointer slider-thumb"
              :style="{ background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${(count - 1) / 9 * 100}%, #e5e5e5 ${(count - 1) / 9 * 100}%, #e5e5e5 100%)` }"
            />
            <div class="flex justify-between text-xs text-neutral-500 mt-2">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>
        </div>
        
        <div class="flex gap-3">
          <button
            @click="generate"
            class="flex-1 h-12 bg-primary-500 text-white rounded-xl font-semibold transition-all hover:bg-primary-600 hover:scale-105 active:scale-95"
          >
            Generate
          </button>
          <button
            @click="copyToClipboard"
            class="flex-1 h-12 bg-neutral-200 text-neutral-900 rounded-xl font-semibold transition-all hover:bg-neutral-300 hover:scale-105 active:scale-95"
          >
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
        </div>
      </div>
      
      <!-- Output -->
      <div class="bg-neutral-50 rounded-xl p-6 min-h-[200px] max-h-[400px] overflow-y-auto">
        <p class="text-neutral-700 leading-relaxed whitespace-pre-wrap">{{ output }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const types = ['Paragraphs', 'Sentences', 'Words']
const selectedType = ref('Paragraphs')
const count = ref(3)
const output = ref('')
const copied = ref(false)

const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
]

function generateWords(num: number): string {
  const words = []
  for (let i = 0; i < num; i++) {
    words.push(loremWords[Math.floor(Math.random() * loremWords.length)])
  }
  return words.join(' ')
}

function generateSentence(): string {
  const length = Math.floor(Math.random() * 10) + 5
  const sentence = generateWords(length)
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
}

function generateParagraph(): string {
  const sentences = []
  const numSentences = Math.floor(Math.random() * 4) + 3
  for (let i = 0; i < numSentences; i++) {
    sentences.push(generateSentence())
  }
  return sentences.join(' ')
}

function generate() {
  const results = []
  
  if (selectedType.value === 'Paragraphs') {
    for (let i = 0; i < count.value; i++) {
      results.push(generateParagraph())
    }
    output.value = results.join('\n\n')
  } else if (selectedType.value === 'Sentences') {
    for (let i = 0; i < count.value; i++) {
      results.push(generateSentence())
    }
    output.value = results.join(' ')
  } else {
    output.value = generateWords(count.value * 10)
  }
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Generate initial content
generate()
</script>

<style scoped>
.slider-thumb::-webkit-slider-thumb {
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.4);
  transition: all 0.2s ease;
}

.slider-thumb::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.6);
}

.slider-thumb::-webkit-slider-thumb:active {
  transform: scale(1.05);
}

.slider-thumb::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.4);
  transition: all 0.2s ease;
}

.slider-thumb::-moz-range-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.6);
}

.slider-thumb::-moz-range-thumb:active {
  transform: scale(1.05);
}
</style>
