<template>
  <div
    class="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl min-h-[500px]"
  >
    <div
      class="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-black/5"
    >
      <!-- Header -->
      <div class="bg-indigo-600 px-6 py-4 text-white">
        <h2 class="text-2xl font-bold">Unit Converter</h2>
        <p class="text-indigo-200 text-sm">
          Convert between common units instantly
        </p>
      </div>

      <!-- Category Tabs -->
      <div class="flex border-b border-gray-100">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="currentCategory = cat.id"
          :class="[
            'flex-1 py-3 text-sm font-medium transition-colors relative',
            currentCategory === cat.id
              ? 'text-indigo-600'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
          ]"
        >
          {{ cat.label }}
          <div
            v-if="currentCategory === cat.id"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
          ></div>
        </button>
      </div>

      <div class="p-6 space-y-6">
        <!-- Input Group -->
        <div class="space-y-4">
          <div class="relative">
            <label
              class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1"
            >
              From
            </label>
            <div class="flex gap-2">
              <input
                type="number"
                v-model="inputValue"
                @input="handleInput"
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                placeholder="Enter value"
              />
              <select
                v-model="fromUnit"
                @change="handleInput"
                class="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-gray-50"
              >
                <option
                  v-for="unit in availableUnits"
                  :key="unit.value"
                  :value="unit.value"
                >
                  {{ unit.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- Swap Button -->
          <div class="flex justify-center -my-2 relative z-10">
            <button
              @click="swapUnits"
              class="bg-white border text-gray-400 hover:text-indigo-600 hover:border-indigo-300 rounded-full p-2 shadow-sm transition-all transform hover:rotate-180"
              title="Swap units"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
                <path class="hidden" d="M0 0h24v24H0z" />
                <!-- Mask or spacer if needed layout tweak, opting for safer SVG path below instead -->
              </svg>
              <!-- Better swap icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>
          </div>

          <div class="relative">
            <label
              class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1"
            >
              To
            </label>
            <div class="flex gap-2">
              <input
                type="text"
                :value="result"
                readonly
                class="block w-full rounded-lg border-gray-300 bg-gray-50 text-gray-500 shadow-sm sm:text-sm p-2.5 border cursor-not-allowed"
                placeholder="Result"
              />
              <select
                v-model="toUnit"
                @change="handleInput"
                class="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-gray-50"
              >
                <option
                  v-for="unit in availableUnits"
                  :key="unit.value"
                  :value="unit.value"
                >
                  {{ unit.label }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Formula Display -->
        <div
          v-if="inputValue && result"
          class="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100"
        >
          <p class="text-xs text-indigo-800 font-medium text-center">
            {{ formatFormula }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

const categories = [
  { id: "length", label: "Length" },
  { id: "weight", label: "Weight" },
  { id: "temp", label: "Temp" },
];

const currentCategory = ref("length");
const inputValue = ref<number | null>(null);
const result = ref<string>("");

// Unit Definitions
const units = {
  length: [
    { value: "cm", label: "Centimeters (cm)" },
    { value: "m", label: "Meters (m)" },
    { value: "km", label: "Kilometers (km)" },
  ],
  weight: [
    { value: "kg", label: "Kilograms (kg)" },
    { value: "lb", label: "Pounds (lb)" },
  ],
  temp: [
    { value: "c", label: "Celsius (°C)" },
    { value: "f", label: "Fahrenheit (°F)" },
  ],
};

const fromUnit = ref(units.length[0].value);
const toUnit = ref(units.length[1].value);

const availableUnits = computed(() => {
  return units[currentCategory.value as keyof typeof units];
});

// Watch category change to reset units
watch(currentCategory, (newCat) => {
  const catUnits = units[newCat as keyof typeof units];
  fromUnit.value = catUnits[0].value;
  toUnit.value = catUnits[1] ? catUnits[1].value : catUnits[0].value;
  handleInput();
});

function swapUnits() {
  const temp = fromUnit.value;
  fromUnit.value = toUnit.value;
  toUnit.value = temp;
  handleInput();
}

function handleInput() {
  if (inputValue.value === null || inputValue.value === undefined) {
    result.value = "";
    return;
  }

  const res = convert(
    inputValue.value,
    fromUnit.value,
    toUnit.value,
    currentCategory.value,
  );
  // Format to avoid long decimals, but keep precision reasonable
  result.value = parseFloat(res.toFixed(4)).toString();
}

function convert(val: number, from: string, to: string, type: string): number {
  if (from === to) return val;

  if (type === "length") {
    // Convert to meters first
    let meters = val;
    if (from === "cm") meters = val / 100;
    if (from === "km") meters = val * 1000;

    // Convert from meters
    if (to === "cm") return meters * 100;
    if (to === "m") return meters;
    if (to === "km") return meters / 1000;
  }

  if (type === "weight") {
    // Convert to kg first
    let kg = val;
    if (from === "lb") kg = val * 0.45359237;

    // Convert from kg
    if (to === "kg") return kg;
    if (to === "lb") return kg / 0.45359237;
  }

  if (type === "temp") {
    if (from === "c" && to === "f") return (val * 9) / 5 + 32;
    if (from === "f" && to === "c") return ((val - 32) * 5) / 9;
  }

  return val;
}

const formatFormula = computed(() => {
  if (!result.value) return "";
  const val = inputValue.value;

  // Simple formula text generation
  if (currentCategory.value === "temp") {
    if (fromUnit.value === "c")
      return `(${val}°C × 9/5) + 32 = ${result.value}°F`;
    if (fromUnit.value === "f")
      return `(${val}°F - 32) × 5/9 = ${result.value}°C`;
  }

  return `${val} ${fromUnit.value} = ${result.value} ${toUnit.value}`;
});
</script>
