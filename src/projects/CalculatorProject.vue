<template>
  <div class="w-full max-w-md mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6 text-neutral-900">Calculator</h2>
    
    <div class="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <!-- Display -->
      <div class="bg-neutral-900 text-white text-right p-6 rounded-xl">
        <div class="text-sm text-neutral-400 h-6 font-mono">{{ previousValue }}</div>
        <div class="text-4xl font-bold font-mono">{{ display }}</div>
      </div>
      
      <!-- Buttons -->
      <div class="grid grid-cols-4 gap-3">
        <button
          v-for="btn in buttons"
          :key="btn.value"
          @click="handleClick(btn.value)"
          :class="[
            'h-16 rounded-xl font-semibold text-lg transition-all hover:scale-105 active:scale-95',
            btn.type === 'operator' 
              ? 'bg-primary-500 text-white hover:bg-primary-600' 
              : btn.type === 'clear'
              ? 'bg-red-500 text-white hover:bg-red-600'
              : btn.type === 'equals'
              ? 'bg-green-500 text-white hover:bg-green-600 col-span-2'
              : 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300'
          ]"
        >
          {{ btn.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const currentValue = ref('0')
const previousValue = ref('')
const operator = ref('')
const waitingForOperand = ref(false)

const display = computed(() => currentValue.value)

const buttons = [
  { label: 'C', value: 'clear', type: 'clear' },
  { label: '÷', value: '/', type: 'operator' },
  { label: '×', value: '*', type: 'operator' },
  { label: '←', value: 'backspace', type: 'operator' },
  
  { label: '7', value: '7', type: 'number' },
  { label: '8', value: '8', type: 'number' },
  { label: '9', value: '9', type: 'number' },
  { label: '-', value: '-', type: 'operator' },
  
  { label: '4', value: '4', type: 'number' },
  { label: '5', value: '5', type: 'number' },
  { label: '6', value: '6', type: 'number' },
  { label: '+', value: '+', type: 'operator' },
  
  { label: '1', value: '1', type: 'number' },
  { label: '2', value: '2', type: 'number' },
  { label: '3', value: '3', type: 'number' },
  { label: '=', value: '=', type: 'equals' },
  
  { label: '0', value: '0', type: 'number' },
  { label: '.', value: '.', type: 'number' },
]

function handleClick(value: string) {
  if (value === 'clear') {
    currentValue.value = '0'
    previousValue.value = ''
    operator.value = ''
    waitingForOperand.value = false
    return
  }
  
  if (value === 'backspace') {
    if (currentValue.value.length > 1) {
      currentValue.value = currentValue.value.slice(0, -1)
    } else {
      currentValue.value = '0'
    }
    return
  }
  
  if (['+', '-', '*', '/'].includes(value)) {
    if (operator.value && !waitingForOperand.value) {
      calculate()
    }
    previousValue.value = currentValue.value + ' ' + value
    operator.value = value
    waitingForOperand.value = true
    return
  }
  
  if (value === '=') {
    calculate()
    return
  }
  
  if (value === '.' && currentValue.value.includes('.')) {
    return
  }
  
  if (waitingForOperand.value) {
    currentValue.value = value
    waitingForOperand.value = false
  } else {
    currentValue.value = currentValue.value === '0' ? value : currentValue.value + value
  }
}

function calculate() {
  if (!operator.value || !previousValue.value) return
  
  const prev = parseFloat(previousValue.value)
  const current = parseFloat(currentValue.value)
  let result = 0
  
  switch (operator.value) {
    case '+':
      result = prev + current
      break
    case '-':
      result = prev - current
      break
    case '*':
      result = prev * current
      break
    case '/':
      result = prev / current
      break
  }
  
  currentValue.value = String(result)
  previousValue.value = ''
  operator.value = ''
  waitingForOperand.value = false
}
</script>
