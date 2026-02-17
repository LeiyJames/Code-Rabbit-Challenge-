<template>
  <div class="invoice-generator-container w-full max-w-4xl mx-auto p-4">
    <header class="text-center mb-8">
      <h1
        class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 mb-2"
      >
        Invoice Generator
      </h1>
      <p class="text-slate-400 text-lg">Secure & Unique Billing Management</p>
    </header>

    <main class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Generator Section -->
      <section
        class="card bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl backdrop-blur-sm"
      >
        <h2
          class="text-2xl font-semibold mb-6 text-slate-100 border-b border-slate-700 pb-2"
        >
          Create New Invoice
        </h2>

        <div class="form-group mb-6">
          <label
            for="category-select"
            class="block mb-2 text-slate-400 font-medium"
          >
            Select Billing Category
          </label>
          <div class="relative">
            <select
              id="category-select"
              v-model="selectedCategory"
              class="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>Choose a category...</option>
              <option
                v-for="cat in categories"
                :key="cat.code"
                :value="cat.name"
              >
                {{ cat.icon }} {{ cat.name }}
              </option>
            </select>
            <div
              class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
            >
              ▼
            </div>
          </div>
        </div>

        <button
          @click="addInvoice"
          :disabled="!selectedCategory"
          class="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 shadow-lg shadow-indigo-500/20"
        >
          Generate Unique Invoice
        </button>
      </section>

      <!-- History Section -->
      <section
        class="card bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl backdrop-blur-sm relative overflow-hidden"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold text-slate-100">Recent History</h2>
          <button
            @click="clearHistory"
            class="text-xs px-3 py-1 rounded-md border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors"
          >
            Clear
          </button>
        </div>

        <div
          class="history-list-container h-[400px] overflow-y-auto pr-2 custom-scrollbar"
        >
          <div
            v-if="invoices.length === 0"
            class="text-center py-12 text-slate-500 italic"
          >
            No invoices generated yet.<br />Start by selecting a category.
          </div>

          <transition-group name="list" tag="ul" class="space-y-3">
            <li
              v-for="inv in invoices"
              :key="inv.id"
              class="invoice-item flex items-center p-4 bg-white/5 rounded-xl border border-transparent hover:border-indigo-500/50 hover:bg-white/10 transition-all group"
            >
              <div
                class="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-xl mr-4 group-hover:scale-110 transition-transform"
              >
                {{ inv.categoryIcon }}
              </div>
              <div class="flex-1 min-w-0">
                <div
                  class="font-mono font-bold text-slate-100 text-lg truncate tracking-tight"
                >
                  {{ inv.id }}
                </div>
                <div
                  class="text-xs text-slate-400 uppercase tracking-wider font-semibold"
                >
                  {{ inv.categoryName }}
                </div>
              </div>
              <div class="text-xs text-slate-500 ml-2 whitespace-nowrap">
                {{ formatTime(inv.timestamp) }}
              </div>
            </li>
          </transition-group>
        </div>
      </section>
    </main>

    <!-- Toast Notification -->
    <transition name="toast">
      <div
        v-if="toastMessage"
        class="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-slate-800 text-slate-100 px-6 py-4 rounded-xl border-l-4 border-emerald-500 shadow-2xl"
      >
        <span class="text-xl">✅</span>
        <span class="font-medium">{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Invoice {
  id: string;
  categoryName: string;
  categoryIcon: string;
  categoryCode: string;
  timestamp: number;
}

const categories = [
  { name: "Water", code: "WAT", icon: "💧" },
  { name: "Electricity", code: "ELE", icon: "⚡" },
  { name: "Dues", code: "DUE", icon: "🏠" },
  { name: "Parking", code: "PAR", icon: "🚗" },
  { name: "Insurance", code: "INS", icon: "🛡️" },
  { name: "Others", code: "OTH", icon: "📝" },
  { name: "RPT", code: "RPT", icon: "TAX" },
  { name: "Repair Fund", code: "REP", icon: "🔧" },
  { name: "Special", code: "SPE", icon: "✨" },
  { name: "Adjustment", code: "ADJ", icon: "⚖️" },
];

const selectedCategory = ref("");
const invoices = ref<Invoice[]>([]);
const toastMessage = ref("");
let toastTimeout: number | undefined;

// Watch removed as we don't persist data anymore

// Load initial data - Removed persistence
/* onMounted(() => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      invoices.value = JSON.parse(data);
    }
  } catch (e) {
    console.error("Failed to load invoices", e);
  }
}); */

function generateUniqueId(code: string): string {
  // Format: INV-CODE-TIMESTAMP-RANDOM
  const timestamp = Date.now().toString(36).toUpperCase().slice(-6);
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  const id = `${code}-${timestamp}-${random}`;

  if (invoices.value.some((inv) => inv.id === id)) {
    return generateUniqueId(code); // Retry collision
  }
  return id;
}

function addInvoice() {
  const category = categories.find((c) => c.name === selectedCategory.value);
  if (!category) return;

  const newInvoice: Invoice = {
    id: generateUniqueId(category.code),
    categoryName: category.name,
    categoryIcon: category.icon,
    categoryCode: category.code,
    timestamp: Date.now(),
  };

  invoices.value.unshift(newInvoice);
  showToast(`Invoice ${newInvoice.id} generated!`);
  selectedCategory.value = ""; // Reset selection
}

function clearHistory() {
  if (confirm("Are you sure you want to clear all invoice history?")) {
    invoices.value = [];
    showToast("History cleared.");
  }
}

function showToast(msg: string) {
  toastMessage.value = msg;
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toastMessage.value = "";
  }, 3000);
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<style scoped>
/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #334155;
  border-radius: 20px;
}

/* List Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Toast Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
