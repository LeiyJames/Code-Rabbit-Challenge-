<template>
  <div class="w-full max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6 text-neutral-900">Password Generator</h2>
    
    <div class="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <!-- Generated Password Display -->
      <div class="bg-neutral-900 text-white p-6 rounded-xl">
        <div class="flex items-center justify-between gap-4">
          <div class="flex-1 font-mono text-xl break-all">
            {{ password || 'Click Generate' }}
          </div>
          <button
            @click="copyPassword"
            :disabled="!password"
            class="px-4 py-2 bg-neutral-900 text-white rounded-lg font-medium text-xs transition-all hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Check v-if="copied" class="w-3.5 h-3.5" />
            <Copy v-else class="w-3.5 h-3.5" />
            <span>{{ copied ? 'Copied' : 'Copy' }}</span>
          </button>
        </div>
      </div>
      
      <!-- Strength Indicator -->
      <div v-if="password" class="space-y-2">
        <div class="flex justify-between text-sm">
          <span class="font-medium text-neutral-700">Strength</span>
          <span :class="strengthColor" class="font-semibold">{{ strength }}</span>
        </div>
        <div class="h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div
            :class="[strengthColor, 'h-full transition-all duration-300']"
            :style="{ width: strengthPercentage + '%' }"
          ></div>
        </div>
      </div>
      
      <!-- Length Control -->
      <div>
        <label class="block text-sm font-medium text-neutral-700 mb-3">
          <span class="flex justify-between items-center">
            <span>Password Length</span>
            <span class="text-2xl font-bold text-primary-600">{{ length }}</span>
          </span>
        </label>
        <div class="relative">
          <input
            v-model.number="length"
            type="range"
            min="6"
            max="32"
            class="w-full h-3 rounded-full appearance-none cursor-pointer slider-thumb"
            :style="{ background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${(length - 6) / 26 * 100}%, #e5e5e5 ${(length - 6) / 26 * 100}%, #e5e5e5 100%)` }"
          />
          <div class="flex justify-between text-xs text-neutral-500 mt-2">
            <span>6</span>
            <span>16</span>
            <span>32</span>
          </div>
        </div>
      </div>
      
      <!-- Options -->
      <div class="space-y-3">
        <label class="flex items-center gap-3 cursor-pointer">
          <input
            v-model="includeUppercase"
            type="checkbox"
            class="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
          />
          <span class="text-neutral-700 font-medium">Uppercase Letters (A-Z)</span>
        </label>
        
        <label class="flex items-center gap-3 cursor-pointer">
          <input
            v-model="includeLowercase"
            type="checkbox"
            class="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
          />
          <span class="text-neutral-700 font-medium">Lowercase Letters (a-z)</span>
        </label>
        
        <label class="flex items-center gap-3 cursor-pointer">
          <input
            v-model="includeNumbers"
            type="checkbox"
            class="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
          />
          <span class="text-neutral-700 font-medium">Numbers (0-9)</span>
        </label>
        
        <label class="flex items-center gap-3 cursor-pointer">
          <input
            v-model="includeSymbols"
            type="checkbox"
            class="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
          />
          <span class="text-neutral-700 font-medium">Symbols (!@#$%^&*)</span>
        </label>
      </div>
      
      <!-- Generate Button -->
      <button
        @click="generatePassword"
        class="w-full h-14 bg-primary-500 text-white rounded-xl font-semibold text-lg transition-all hover:bg-primary-600 hover:scale-105 active:scale-95"
      >
        Generate Password
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Copy, Check } from 'lucide-vue-next'

const password = ref('')
const length = ref(16)
const includeUppercase = ref(true)
const includeLowercase = ref(true)
const includeNumbers = ref(true)
const includeSymbols = ref(true)
const copied = ref(false)

const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const lowercase = 'abcdefghijklmnopqrstuvwxyz'
const numbers = '0123456789'
const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'

const strength = computed(() => {
  if (!password.value) return 'None'
  
  const len = password.value.length
  const hasUpper = /[A-Z]/.test(password.value)
  const hasLower = /[a-z]/.test(password.value)
  const hasNum = /[0-9]/.test(password.value)
  const hasSym = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password.value)
  
  const varietyCount = [hasUpper, hasLower, hasNum, hasSym].filter(Boolean).length
  
  if (len < 8 || varietyCount < 2) return 'Weak'
  if (len < 12 || varietyCount < 3) return 'Medium'
  if (len >= 16 && varietyCount >= 3) return 'Strong'
  return 'Medium'
})

const strengthColor = computed(() => {
  switch (strength.value) {
    case 'Weak': return 'bg-red-500 text-neutral-900'
    case 'Medium': return 'bg-yellow-500 text-neutral-900'
    case 'Strong': return 'bg-green-500 text-neutral-900'
    default: return 'bg-neutral-300 text-neutral-900'
  }
})

const strengthPercentage = computed(() => {
  switch (strength.value) {
    case 'Weak': return 33
    case 'Medium': return 66
    case 'Strong': return 100
    default: return 0
  }
})

function generatePassword() {
  let charset = ''
  
  if (includeUppercase.value) charset += uppercase
  if (includeLowercase.value) charset += lowercase
  if (includeNumbers.value) charset += numbers
  if (includeSymbols.value) charset += symbols
  
  if (charset === '') {
    alert('Please select at least one character type')
    return
  }
  
  let result = ''
  const charsetLength = charset.length
  
  for (let i = 0; i < length.value; i++) {
    const randomIndex = Math.floor(Math.random() * charsetLength)
    result += charset[randomIndex]
  }
  
  password.value = result
  copied.value = false
}

async function copyPassword() {
  try {
    await navigator.clipboard.writeText(password.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Generate initial password
generatePassword()
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
