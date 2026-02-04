<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-violet-50 font-sans text-slate-800 p-4 md:p-8"
  >
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header Section -->
      <div
        class="flex flex-col md:flex-row gap-6 md:items-start justify-between"
      >
        <div class="space-y-2">
          <h1
            class="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight"
          >
            QA Test Flow
          </h1>
          <p
            class="text-slate-500 max-w-xl text-sm md:text-base leading-relaxed"
          >
            Orchestrate regression testing with precision. Manage priorities,
            track real-time coverage, and visualize project health.
          </p>

          <!-- Environment & Build Info -->
          <div class="flex flex-wrap gap-4 mt-4">
            <div
              class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all"
            >
              <span
                class="text-xs font-bold text-slate-400 uppercase tracking-wider"
                >Env:</span
              >
              <input
                v-model="projectMeta.environment"
                @change="persist"
                placeholder="e.g. Staging"
                class="bg-transparent border-none p-0 text-sm font-semibold text-slate-700 placeholder-slate-300 w-24 focus:ring-0"
              />
            </div>
            <div
              class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all"
            >
              <span
                class="text-xs font-bold text-slate-400 uppercase tracking-wider"
                >Build:</span
              >
              <input
                v-model="projectMeta.build"
                @change="persist"
                placeholder="e.g. v1.0.0"
                class="bg-transparent border-none p-0 text-sm font-semibold text-slate-700 placeholder-slate-300 w-24 focus:ring-0"
              />
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-3">
          <!-- File Input for Import -->
          <input
            type="file"
            ref="fileInput"
            class="hidden"
            accept=".json"
            @change="handleImport"
          />

          <button
            @click="addRow()"
            class="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 hover:-translate-y-0.5"
            title="Add a new test row"
          >
            <span class="mr-2 text-lg leading-none">+</span> New Test
          </button>

          <button
            @click="triggerImport"
            class="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300"
            title="Restore from JSON backup"
          >
            <svg
              class="w-4 h-4 mr-2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Import
          </button>

          <button
            @click="exportJSON"
            class="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300"
            title="Save backup as JSON"
          >
            <svg
              class="w-4 h-4 mr-2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            Backup
          </button>

          <button
            @click="exportCSV"
            class="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300"
            title="Export checklist to CSV"
          >
            <svg
              class="w-4 h-4 mr-2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            CSV
          </button>

          <button
            @click="clearAll"
            class="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-rose-600 transition-all duration-200 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100 hover:border-rose-200"
            title="Clear all rows"
          >
            Clear
          </button>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <!-- Total -->
        <div
          class="p-4 bg-white border border-indigo-100 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-1 group hover:border-indigo-200 transition-colors"
        >
          <div
            class="text-3xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors"
          >
            {{ rows.length }}
          </div>
          <div
            class="text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Total Tests
          </div>
        </div>

        <!-- Pass -->
        <div
          class="p-4 bg-white border border-emerald-100 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-1 group hover:border-emerald-200 transition-colors"
        >
          <div class="text-3xl font-bold text-emerald-600">
            {{ counts.pass }}
          </div>
          <div
            class="text-xs font-semibold uppercase tracking-wider text-emerald-600/70"
          >
            Passed
          </div>
        </div>

        <!-- Fail -->
        <div
          class="p-4 bg-white border border-rose-100 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-1 group hover:border-rose-200 transition-colors relative overflow-hidden"
        >
          <div class="text-3xl font-bold text-rose-600 relative z-10">
            {{ counts.fail }}
          </div>
          <div
            class="text-xs font-semibold uppercase tracking-wider text-rose-600/70 relative z-10"
          >
            Failed
          </div>
          <div
            v-if="counts.fail > 0"
            class="absolute -right-4 -top-4 w-16 h-16 bg-rose-50 rounded-full blur-xl opacity-50"
          ></div>
        </div>

        <!-- Blocked -->
        <div
          class="p-4 bg-white border border-amber-100 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-1 group hover:border-amber-200 transition-colors"
        >
          <div class="text-3xl font-bold text-amber-500">
            {{ counts.blocked }}
          </div>
          <div
            class="text-xs font-semibold uppercase tracking-wider text-amber-500/70"
          >
            Blocked
          </div>
        </div>

        <!-- Progress -->
        <div
          class="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 col-span-2 md:col-span-4 lg:col-span-1 text-white"
        >
          <div class="flex items-end gap-1">
            <span class="text-3xl font-bold">{{ completionPercent }}</span>
            <span class="text-sm font-medium opacity-60 mb-1">%</span>
          </div>
          <div class="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              class="bg-indigo-400 h-full rounded-full transition-all duration-500"
              :style="{ width: `${completionPercent}%` }"
            ></div>
          </div>
          <div
            class="text-[10px] uppercase font-bold tracking-widest opacity-40"
          >
            Coverage
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div
        class="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl shadow-indigo-100/50 overflow-hidden flex flex-col"
      >
        <!-- View Tabs -->
        <div class="flex border-b border-indigo-50">
          <button
            @click="currentView = 'checklist'"
            class="px-6 py-4 text-sm font-bold uppercase tracking-wide transition-all border-b-2"
            :class="
              currentView === 'checklist'
                ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                : 'border-transparent text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
            "
            title="Test Suite"
          >
            Test Suite
          </button>
          <button
            @click="currentView = 'analytics'"
            class="px-6 py-4 text-sm font-bold uppercase tracking-wide transition-all border-b-2"
            :class="
              currentView === 'analytics'
                ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                : 'border-transparent text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
            "
          >
            Analytics Report
          </button>
        </div>

        <!-- Content Transition -->
        <Transition
          mode="out-in"
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <!-- Checklist View Wrapper -->
          <div
            v-if="currentView === 'checklist'"
            key="checklist"
            class="flex flex-col"
          >
            <!-- Filters Toolbar -->
            <div
              class="p-6 border-b border-indigo-50/50 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4"
            >
              <div class="flex-1 max-w-md relative group">
                <input
                  v-model="query"
                  class="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 pl-10 transition-all group-hover:bg-white"
                  placeholder="Search tests, modules, or bugs..."
                />
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <svg
                    class="w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>

              <div
                class="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0"
              >
                <select
                  v-model="moduleFilter"
                  class="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 min-w-[140px]"
                >
                  <option value="">All Modules</option>
                  <option v-for="m in uniqueModules" :key="m" :value="m">
                    {{ m }}
                  </option>
                </select>

                <select
                  v-model="statusFilter"
                  class="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 min-w-[130px]"
                >
                  <option value="">All Status</option>
                  <option value="untested">Untested</option>
                  <option value="pass">Pass</option>
                  <option value="fail">Fail</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>

            <!-- Bulk Actions Bar -->
            <div
              v-if="selectedIds.size > 0"
              class="bg-indigo-50 border-b border-indigo-100 px-6 py-3 flex flex-wrap items-center gap-4 transition-all"
            >
              <span class="text-sm font-bold text-indigo-700">
                {{ selectedIds.size }} selected
              </span>
              <div class="h-4 w-px bg-indigo-200"></div>
              <div class="flex items-center gap-2">
                <button
                  @click="bulkStatus('pass')"
                  class="px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
                >
                  Mark Pass
                </button>
                <button
                  @click="bulkStatus('fail')"
                  class="px-3 py-1 text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors"
                >
                  Mark Fail
                </button>
                <button
                  @click="bulkStatus('untested')"
                  class="px-3 py-1 text-xs font-bold text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
                >
                  Reset
                </button>
              </div>
              <div class="flex-1"></div>
              <button
                @click="bulkDelete"
                class="px-3 py-1 text-xs font-bold text-rose-600 border border-rose-200 hover:bg-rose-50 rounded-lg transition-colors"
              >
                Delete Selected
              </button>
            </div>

            <!-- Data Table -->
            <div class="overflow-x-auto min-h-[400px] px-4 pb-4">
              <table
                class="w-full text-sm text-left border-separate border-spacing-y-2"
              >
                <thead class="text-xs text-slate-500 uppercase bg-slate-50/50">
                  <tr>
                    <!-- Checkbox Header -->
                    <th scope="col" class="px-4 py-4 w-[40px]">
                      <input
                        type="checkbox"
                        :checked="isAllSelected"
                        @change="toggleAll"
                        class="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                      />
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-4 font-semibold tracking-wider w-[240px]"
                    >
                      Test Name
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-4 font-semibold tracking-wider w-[120px]"
                    >
                      Priority
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-4 font-semibold tracking-wider w-[180px]"
                    >
                      Module
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-4 font-semibold tracking-wider w-[180px]"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-4 font-semibold tracking-wider"
                    >
                      Observations
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-4 font-semibold tracking-wider text-right w-[160px]"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="row in filteredRows"
                    :key="row.rowId"
                    class="bg-white hover:bg-indigo-50/40 transition-shadow shadow-sm hover:shadow-md rounded-xl"
                  >
                    <!-- Checkbox Cell -->
                    <td
                      class="px-4 py-4 align-top first:rounded-l-xl border-y border-l border-indigo-50/20 first:border-l relative group/row"
                    >
                      <div class="flex items-center h-full pt-1.5 gap-3">
                        <input
                          type="checkbox"
                          :checked="selectedIds.has(row.rowId)"
                          @change="toggleSelection(row.rowId)"
                          class="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                        />
                        <!-- Quick Open Button -->
                        <button
                          @click="openTestDetails(row)"
                          class="md:hidden opacity-0 group-hover/row:opacity-100 transition-opacity p-1 hover:bg-indigo-50 rounded text-indigo-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>

                    <td
                      class="px-6 py-4 align-top border-y border-indigo-50/20"
                    >
                      <textarea
                        v-model="row.testName"
                        v-auto-height
                        rows="1"
                        placeholder="Enter test name..."
                        class="w-full bg-transparent border-none p-0 focus:ring-0 text-slate-700 font-medium placeholder-slate-300 resize-none overflow-hidden leading-relaxed"
                      ></textarea>
                      <!-- Tags Display -->
                      <div
                        v-if="row.tags && row.tags.length > 0"
                        class="flex flex-wrap gap-1 mt-2"
                      >
                        <span
                          v-for="tag in row.tags"
                          :key="tag"
                          class="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-wider"
                        >
                          {{ tag }}
                        </span>
                      </div>

                      <!-- Assignee Display (Mini) -->
                      <div
                        v-if="row.assignee"
                        class="flex items-center gap-1 mt-1"
                      >
                        <svg
                          class="w-3 h-3 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          ></path>
                        </svg>
                        <span class="text-xs text-slate-500">{{
                          row.assignee
                        }}</span>
                      </div>
                    </td>

                    <!-- Priority Cell -->
                    <td
                      class="px-6 py-4 align-top border-y border-indigo-50/20"
                    >
                      <select
                        v-model="row.priority"
                        class="w-full bg-transparent text-xs font-bold uppercase tracking-wider border-none p-0 focus:ring-0 cursor-pointer"
                        :class="{
                          'text-rose-600': row.priority === 'high',
                          'text-amber-600': row.priority === 'medium',
                          'text-slate-500': row.priority === 'low',
                        }"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </td>

                    <td
                      class="px-6 py-4 align-top border-y border-indigo-50/20"
                    >
                      <textarea
                        v-model="row.module"
                        v-auto-height
                        rows="1"
                        placeholder="Module name"
                        class="w-full bg-transparent border-none p-0 focus:ring-0 text-slate-600 placeholder-slate-300 resize-none overflow-hidden leading-relaxed"
                      ></textarea>
                    </td>

                    <td
                      class="px-6 py-4 align-top border-y border-indigo-50/20"
                    >
                      <div class="relative group/select">
                        <select
                          v-model="row.status"
                          @change="
                            logHistory(row, 'Status updated to ' + row.status)
                          "
                          class="appearance-none cursor-pointer w-full py-1.5 pl-3 pr-8 rounded-lg text-xs font-bold uppercase tracking-wider border-0 ring-1 ring-slate-200 group-hover/select:ring-indigo-200 focus:ring-2 focus:ring-indigo-500 transition-all text-left"
                          :class="statusPillClass(row.status)"
                        >
                          <option value="untested">Untested</option>
                          <option value="pass">PASS</option>
                          <option value="fail">FAIL</option>
                          <option value="blocked">BLOCKED</option>
                        </select>
                        <div
                          class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-slate-400"
                        >
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </td>

                    <td
                      class="px-6 py-4 align-top border-y border-indigo-50/20"
                    >
                      <div class="relative">
                        <textarea
                          v-model="row.bug"
                          v-auto-height
                          rows="1"
                          :placeholder="
                            row.status === 'fail'
                              ? 'Describe bug...'
                              : 'Add notes...'
                          "
                          class="w-full bg-transparent border-none p-0 focus:ring-0 text-slate-600 resize-none overflow-hidden placeholder-slate-300 text-sm leading-relaxed"
                        ></textarea>
                        <div
                          v-if="row.status === 'fail' && !row.bug"
                          class="absolute right-0 top-0 text-rose-400 pointer-events-none"
                        >
                          <span class="text-lg animate-pulse">!</span>
                        </div>
                      </div>
                    </td>

                    <td
                      class="px-6 py-4 align-top text-right first:rounded-l-xl last:rounded-r-xl border-y border-r border-indigo-50/20"
                    >
                      <div class="flex items-center justify-end gap-2">
                        <button
                          @click="openTestDetails(row)"
                          class="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100"
                          title="Edit Details"
                        >
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>

                        <div
                          v-if="!isFiltered"
                          class="flex items-center gap-1 mr-1"
                        >
                          <button
                            @click="moveRowUp(row.rowId)"
                            class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 disabled:cursor-not-allowed"
                            :disabled="
                              rows.findIndex((r) => r.rowId === row.rowId) === 0
                            "
                            title="Move Up"
                          >
                            <svg
                              class="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 15l7-7 7 7"
                              ></path>
                            </svg>
                          </button>
                          <button
                            @click="moveRowDown(row.rowId)"
                            class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 disabled:cursor-not-allowed"
                            :disabled="
                              rows.findIndex((r) => r.rowId === row.rowId) ===
                              rows.length - 1
                            "
                            title="Move Down"
                          >
                            <svg
                              class="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          </button>
                        </div>
                        <button
                          @click="duplicateRow(row.rowId)"
                          class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                          title="Duplicate"
                        >
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            ></path>
                          </svg>
                        </button>
                        <button
                          @click="removeRow(row.rowId)"
                          class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                          title="Delete"
                        >
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr v-if="filteredRows.length === 0">
                    <td colspan="7" class="px-6 py-12 text-center">
                      <div
                        class="flex flex-col items-center justify-center text-slate-400 gap-3"
                      >
                        <div
                          class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center"
                        >
                          <svg
                            class="w-8 h-8 text-slate-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <p class="font-medium">No results found</p>
                        <p class="text-sm">
                          Try adjusting your filters or adding a new test.
                        </p>
                        <button
                          @click="addRow()"
                          class="mt-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          Add Test
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Analytics Dashboard View -->
          <div v-else key="analytics" class="p-6 space-y-8 min-h-[400px]">
            <!-- Project Health & Chart -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Visual Chart -->
              <div
                class="col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden"
              >
                <h3
                  class="w-full text-left text-sm font-bold text-slate-500 uppercase tracking-widest mb-6"
                >
                  Status Distribution
                </h3>

                <div class="relative w-48 h-48">
                  <!-- Donut Chart SVG -->
                  <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
                    <circle
                      v-for="(seg, i) in donutSegments"
                      :key="i"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke-width="12"
                      :stroke="seg.color"
                      :stroke-dasharray="`${animationReady ? seg.length : 0} ${circumference}`"
                      :stroke-dashoffset="seg.offset"
                      class="transition-all duration-1000 ease-out"
                    />
                    <!-- Center Text -->
                  </svg>
                  <div
                    class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                  >
                    <span
                      class="text-3xl font-extrabold text-slate-800 transition-all duration-700 delay-300 transform"
                      :class="
                        animationReady
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-4 opacity-0'
                      "
                      >{{ completionPercent }}%</span
                    >
                    <span
                      class="text-xs font-semibold text-slate-400 uppercase tracking-wide transition-all duration-700 delay-500 transform"
                      :class="
                        animationReady
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-4 opacity-0'
                      "
                      >Complete</span
                    >
                  </div>
                </div>

                <!-- Legend -->
                <div class="flex flex-wrap justify-center gap-4 mt-6">
                  <div class="flex items-center gap-1.5">
                    <span class="w-3 h-1 rounded-full bg-emerald-500"></span>
                    <span class="text-xs font-bold text-slate-600">Pass</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="w-3 h-1 rounded-full bg-rose-500"></span>
                    <span class="text-xs font-bold text-slate-600">Fail</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="w-3 h-1 rounded-full bg-amber-500"></span>
                    <span class="text-xs font-bold text-slate-600"
                      >Blocked</span
                    >
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="w-3 h-1 rounded-full bg-slate-200"></span>
                    <span class="text-xs font-bold text-slate-400"
                      >Untested</span
                    >
                  </div>
                </div>
              </div>

              <!-- Quick Summary -->
              <div
                class="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div
                  class="p-6 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl text-white shadow-lg shadow-indigo-200 flex flex-col justify-between"
                >
                  <div>
                    <div
                      class="text-indigo-100 text-sm font-semibold uppercase tracking-wider mb-1"
                    >
                      Project Health
                    </div>
                    <div class="text-3xl font-bold">
                      {{ healthScore }} / 100
                    </div>
                  </div>
                  <div class="mt-4 text-indigo-100 text-sm leading-relaxed">
                    <span v-if="healthScore >= 90"
                      >Excellent! Your project is stable and ready for
                      release.</span
                    >
                    <span v-else-if="healthScore >= 70"
                      >Good, but watch out for those failed tests.</span
                    >
                    <span v-else
                      >Needs attention. High failure rate or low coverage
                      detected.</span
                    >
                  </div>
                </div>

                <div
                  class="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-center gap-4"
                >
                  <div>
                    <div class="flex justify-between items-end mb-1">
                      <span class="text-sm font-bold text-slate-500 uppercase"
                        >Test Velocity</span
                      >
                      <span class="text-xs text-slate-400"
                        >Based on status</span
                      >
                    </div>
                    <div
                      class="w-full bg-slate-100 h-2 rounded-full overflow-hidden"
                    >
                      <div
                        class="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out"
                        :style="{
                          width: animationReady
                            ? `${(counts.pass / (rows.length || 1)) * 100}%`
                            : '0%',
                        }"
                      ></div>
                    </div>
                    <div class="mt-2 text-xs text-slate-500">
                      <strong class="text-slate-800">{{ counts.pass }}</strong>
                      passed tests out of {{ rows.length }} total.
                    </div>
                  </div>

                  <hr class="border-slate-100" />

                  <div class="flex items-center justify-between">
                    <div class="text-sm font-bold text-slate-500 uppercase">
                      Blockers
                    </div>
                    <span
                      class="px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-bold text-xs"
                      >{{ counts.blocked }} issues</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Top Defects -->
            <div v-if="bugStats.length > 0">
              <h3
                class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"
              >
                <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                Active Defects
                <span
                  class="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700"
                  >{{ bugStats.length }}</span
                >
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="bug in bugStats"
                  :key="bug.rowId"
                  class="p-4 bg-rose-50 border border-rose-100 rounded-xl"
                >
                  <div class="flex justify-between items-start mb-2">
                    <span class="font-medium text-sm text-rose-900">{{
                      bug.testName || "Untitled Test"
                    }}</span>
                    <span
                      class="text-xs font-semibold text-rose-600 uppercase bg-rose-200/50 px-2 py-0.5 rounded ml-2 whitespace-nowrap"
                      >{{ bug.module }}</span
                    >
                  </div>
                  <p class="text-sm text-slate-700 font-medium line-clamp-2">
                    {{ bug.bug || "No description provided" }}
                  </p>
                </div>
              </div>
            </div>
            <div
              v-else
              class="p-6 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 gap-2"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span class="font-medium"
                >No active defects found. Good job!</span
              >
            </div>

            <!-- Module Performance Table -->
            <div>
              <h3
                class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"
              >
                <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                Module Performance
              </h3>
              <div
                class="overflow-x-auto rounded-xl border border-slate-200 shadow-sm"
              >
                <table class="w-full text-sm text-left">
                  <thead
                    class="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500"
                  >
                    <tr>
                      <th class="px-6 py-3">Module</th>
                      <th class="px-6 py-3 text-center">Coverage</th>
                      <th class="px-6 py-3 text-right">Pass</th>
                      <th class="px-6 py-3 text-right">Fail</th>
                      <th class="px-6 py-3 text-right">Blocked</th>
                      <th class="px-6 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 bg-white">
                    <tr
                      v-for="mod in moduleStats"
                      :key="mod.name"
                      class="hover:bg-slate-50/50"
                    >
                      <td class="px-6 py-3 font-medium text-slate-700">
                        {{ mod.name || "Unassigned" }}
                      </td>
                      <td class="px-6 py-3 w-[200px]">
                        <div class="flex items-center gap-3">
                          <div
                            class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"
                          >
                            <div
                              class="h-full bg-indigo-500 rounded-full"
                              :style="{ width: `${mod.coverage}%` }"
                            ></div>
                          </div>
                          <span class="text-xs font-mono text-slate-500 w-8"
                            >{{ mod.coverage }}%</span
                          >
                        </div>
                      </td>
                      <td
                        class="px-6 py-3 text-right text-emerald-600 font-medium"
                      >
                        {{ mod.pass }}
                      </td>
                      <td
                        class="px-6 py-3 text-right text-rose-600 font-medium"
                      >
                        {{ mod.fail }}
                      </td>
                      <td
                        class="px-6 py-3 text-right text-amber-600 font-medium"
                      >
                        {{ mod.blocked }}
                      </td>
                      <td class="px-6 py-3 text-right font-bold text-slate-800">
                        {{ mod.total }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Bottom Bar -->
        <div
          class="bg-indigo-50/30 px-6 py-4 border-t border-indigo-50 flex items-center justify-between text-xs text-slate-500"
        >
          <div>
            Last saved:
            <span class="font-mono text-indigo-600">{{
              lastSavedAt ? new Date(lastSavedAt).toLocaleTimeString() : "—"
            }}</span>
          </div>
          <div>{{ rows.length }} rows total</div>
        </div>
      </div>

      <datalist id="moduleSuggestions">
        <option v-for="m in moduleSuggestions" :key="m" :value="m" />
      </datalist>

      <!-- Bulk Delete Confirmation Modal -->
      <Teleport to="body">
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="showBulkDeleteModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
            @click.self="showBulkDeleteModal = false"
          >
            <div
              class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 transform transition-all scale-100"
            >
              <div class="flex items-center gap-4 mb-4">
                <div class="p-3 bg-rose-100 text-rose-600 rounded-full">
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-slate-800">
                    Delete {{ selectedIds.size }} tests?
                  </h3>
                  <p class="text-sm text-slate-500">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <p class="text-slate-600 mb-6">
                You are about to permanently remove
                <span class="font-bold text-slate-900">{{
                  selectedIds.size
                }}</span>
                test cases.
              </p>

              <div class="flex justify-end gap-3">
                <button
                  @click="showBulkDeleteModal = false"
                  class="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  @click="confirmBulkDelete"
                  class="px-4 py-2 text-white bg-rose-600 rounded-lg hover:bg-rose-700 font-bold shadow-lg shadow-rose-200 transition-all hover:shadow-rose-300 transform hover:-translate-y-0.5"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Clear Confirmation Modal -->
      <Teleport to="body">
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="showClearModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
            @click.self="showClearModal = false"
          >
            <div
              class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 transform transition-all scale-100"
            >
              <div class="flex items-center gap-4 mb-4">
                <div class="p-3 bg-rose-100 text-rose-600 rounded-full">
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-slate-800">
                    Clear Checklist?
                  </h3>
                  <p class="text-sm text-slate-500">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <p class="text-slate-600 mb-6">
                Are you sure you want to delete all
                <span class="font-bold text-slate-900">{{ rows.length }}</span>
                tests? This will permanently remove all test data and reset the
                dashboard.
              </p>

              <div class="flex justify-end gap-3">
                <button
                  @click="showClearModal = false"
                  class="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  @click="confirmClear"
                  class="px-4 py-2 text-white bg-rose-600 rounded-lg hover:bg-rose-700 font-medium shadow-lg shadow-rose-200 transition-all hover:-translate-y-0.5"
                >
                  Yes, Clear All
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
      <!-- Test Details Modal -->
      <Teleport to="body">
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
          enter-to-class="opacity-100 translate-y-0 md:scale-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0 md:scale-100"
          leave-to-class="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
        >
          <div
            v-if="editingRow"
            class="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-sm"
            @click.self="closeTestDetails"
          >
            <div
              class="w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <!-- Modal Header -->
              <div
                class="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50"
              >
                <div class="flex-1 mr-8">
                  <span
                    class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block"
                    >Test Case Details</span
                  >
                  <input
                    v-model="editingRow.testName"
                    class="w-full text-xl font-bold bg-transparent border-none p-0 focus:ring-0 text-slate-800 placeholder-slate-400"
                    placeholder="Test Case Title"
                  />
                </div>
                <button
                  @click="closeTestDetails"
                  class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors"
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <!-- Modal Content -->
              <div class="flex-1 overflow-y-auto p-6">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <!-- Left Col: Main Info -->
                  <div class="lg:col-span-2 space-y-6">
                    <!-- Steps & Results -->
                    <div class="space-y-4">
                      <div>
                        <label
                          class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2"
                          >Test Steps</label
                        >
                        <textarea
                          v-model="editingRow.steps"
                          v-auto-height
                          rows="3"
                          class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-shadow"
                          placeholder="- Step 1&#10;- Step 2&#10;- Step 3"
                        ></textarea>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2"
                            >Expected Result</label
                          >
                          <textarea
                            v-model="editingRow.expectedResult"
                            v-auto-height
                            rows="2"
                            class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                            placeholder="What should happen?"
                          ></textarea>
                        </div>
                        <div>
                          <label
                            class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2"
                            >Actual Result</label
                          >
                          <textarea
                            v-model="editingRow.actualResult"
                            v-auto-height
                            rows="2"
                            class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                            placeholder="What actually happened?"
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <!-- Notes / Bug -->
                    <div>
                      <label
                        class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2"
                        >Bugs / Observations</label
                      >
                      <textarea
                        v-model="editingRow.bug"
                        v-auto-height
                        rows="2"
                        class="w-full bg-red-50/50 border border-rose-100 rounded-xl p-4 text-sm text-slate-700 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-none"
                        placeholder="Describe any bugs found..."
                      ></textarea>
                    </div>

                    <!-- History Log -->
                    <div>
                      <label
                        class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3"
                        >Activity Log</label
                      >
                      <div
                        class="bg-indigo-50/30 rounded-xl border border-indigo-50 p-4 max-h-40 overflow-y-auto space-y-3"
                      >
                        <div
                          v-if="
                            !editingRow.history ||
                            editingRow.history.length === 0
                          "
                          class="text-xs text-slate-400 italic"
                        >
                          No history recorded yet.
                        </div>
                        <div
                          v-else
                          v-for="(entry, idx) in [
                            ...(editingRow.history || []),
                          ].reverse()"
                          :key="idx"
                          class="flex gap-3 text-sm"
                        >
                          <div
                            class="text-xs font-mono text-slate-400 shrink-0 pt-0.5"
                          >
                            {{
                              new Date(entry.date).toLocaleString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            }}
                          </div>
                          <div>
                            <span class="font-bold text-slate-700 text-xs">{{
                              entry.by
                            }}</span>
                            <span class="text-slate-600 text-xs">
                              {{ entry.action }}</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right Col: Meta -->
                  <div class="space-y-6">
                    <!-- Status Card -->
                    <div
                      class="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4"
                    >
                      <div>
                        <label
                          class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1"
                          >Status</label
                        >
                        <select
                          v-model="editingRow.status"
                          @change="
                            logHistory(
                              editingRow,
                              'Status changed to ' + editingRow.status,
                            )
                          "
                          class="w-full rounded-xl border-slate-200 font-bold uppercase tracking-wide focus:ring-2 focus:ring-indigo-500 text-sm"
                          :class="statusPillClass(editingRow.status)"
                        >
                          <option value="untested">Untested</option>
                          <option value="pass">PASS</option>
                          <option value="fail">FAIL</option>
                          <option value="blocked">BLOCKED</option>
                        </select>
                      </div>

                      <div>
                        <label
                          class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1"
                          >Priority</label
                        >
                        <div
                          class="flex bg-white rounded-lg p-1 border border-slate-200"
                        >
                          <button
                            v-for="p in priorities"
                            :key="p"
                            @click="
                              editingRow.priority = p;
                              logHistory(
                                editingRow,
                                'Priority changed to ' + p,
                              );
                            "
                            class="flex-1 py-1.5 text-xs font-bold uppercase rounded-md transition-all"
                            :class="
                              editingRow.priority === p
                                ? p === 'high'
                                  ? 'bg-rose-100 text-rose-700'
                                  : p === 'medium'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-slate-100 text-slate-700'
                                : 'text-slate-400 hover:text-slate-600'
                            "
                          >
                            {{ p }}
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Assignee & Time -->
                    <div
                      class="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4"
                    >
                      <div>
                        <label
                          class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1"
                          >Assignee</label
                        >
                        <input
                          v-model="editingRow.assignee"
                          class="w-full text-sm border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="e.g. John Doe"
                        />
                      </div>
                      <div>
                        <label
                          class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1"
                          >Time Spent (min)</label
                        >
                        <input
                          type="number"
                          v-model.number="editingRow.timeSpent"
                          class="w-full text-sm border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <!-- Tags -->
                    <div>
                      <label
                        class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2"
                        >Tags</label
                      >
                      <div class="flex flex-wrap gap-2 mb-2">
                        <span
                          v-for="tag in editingRow.tags"
                          :key="tag"
                          class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 group"
                        >
                          {{ tag }}
                          <button
                            @click="removeTag(tag)"
                            class="ml-1.5 text-indigo-400 hover:text-indigo-900 focus:outline-none"
                          >
                            ×
                          </button>
                        </span>
                      </div>
                      <div class="relative">
                        <input
                          v-model="newTagInput"
                          @keydown.enter.prevent="addTag"
                          class="w-full text-sm border-slate-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                          placeholder="Add tag..."
                        />
                        <button
                          @click="addTag"
                          class="absolute right-2 top-1.5 text-indigo-600 hover:text-indigo-800"
                        >
                          <svg
                            class="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Modal Footer -->
              <div
                class="p-4 border-t border-slate-100 bg-slate-50 flex justify-end"
              >
                <button
                  @click="closeTestDetails"
                  class="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

type TestStatus = "untested" | "pass" | "fail" | "blocked";
type TestPriority = "high" | "medium" | "low";

interface ChecklistHistory {
  date: number;
  action: string;
  by: string;
}

interface ChecklistRow {
  rowId: string;
  testName: string;
  module: string;
  priority: TestPriority;
  status: TestStatus;
  bug: string;
  // Extended fields
  tags: string[];
  steps: string;
  expectedResult: string;
  actualResult: string;
  assignee: string;
  timeSpent: number; // minutes
  history: ChecklistHistory[];

  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "qa-regression-checklist-v1";

const priorities: TestPriority[] = ["low", "medium", "high"];

const rows = ref<ChecklistRow[]>([]);
const projectMeta = ref({ environment: "", build: "" });
const currentView = ref<"checklist" | "analytics">("checklist");
const query = ref("");
const moduleFilter = ref("");
const statusFilter = ref<"" | TestStatus>("");
const lastSavedAt = ref<number | null>(null);
const showClearModal = ref(false);
const showBulkDeleteModal = ref(false);
const editingRow = ref<ChecklistRow | null>(null);
const newTagInput = ref("");
const animationReady = ref(false);
const selectedIds = ref(new Set<string>());
const fileInput = ref<HTMLInputElement | null>(null);

const isAllSelected = computed(() => {
  return (
    filteredRows.value.length > 0 &&
    selectedIds.value.size === filteredRows.value.length
  );
});

function toggleSelection(id: string) {
  if (selectedIds.value.has(id)) selectedIds.value.delete(id);
  else selectedIds.value.add(id);
}

function toggleAll() {
  if (isAllSelected.value) {
    selectedIds.value.clear();
  } else {
    filteredRows.value.forEach((r) => selectedIds.value.add(r.rowId));
  }
}

function bulkStatus(status: TestStatus) {
  rows.value.forEach((r) => {
    if (selectedIds.value.has(r.rowId)) {
      r.status = status;
      r.updatedAt = Date.now();
    }
  });
  selectedIds.value.clear();
  persist();
}

function bulkDelete() {
  if (selectedIds.value.size === 0) return;
  showBulkDeleteModal.value = true;
}

function confirmBulkDelete() {
  rows.value = rows.value.filter((r) => !selectedIds.value.has(r.rowId));
  selectedIds.value.clear();
  persist();
  showBulkDeleteModal.value = false;
}

// Import / Export
function triggerImport() {
  fileInput.value?.click();
}

function handleImport(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const json = JSON.parse(evt.target?.result as string);
      if (Array.isArray(json)) {
        // Basic array import
        rows.value = json.map((r) => createRow(r));
      } else if (json.rows && Array.isArray(json.rows)) {
        // Backup format
        rows.value = json.rows.map((r: any) => createRow(r));
        if (json.meta) projectMeta.value = json.meta;
      }
      alert("Import successful!");
      persist();
    } catch (err) {
      alert("Failed to import JSON: " + err);
    }
    // value clear
    if (fileInput.value) fileInput.value.value = "";
  };
  reader.readAsText(file);
}

function exportJSON() {
  const data = {
    version: 2,
    exportedAt: Date.now(),
    meta: projectMeta.value,
    rows: rows.value,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `qa_checklist_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

watch(currentView, (val) => {
  if (val === "analytics") {
    animationReady.value = false;
    setTimeout(() => {
      animationReady.value = true;
    }, 400);
  } else {
    animationReady.value = false;
  }
});

const moduleSuggestions = ref<string[]>([
  "Login",
  "Registration",
  "Forgot Password",
  "Dashboard",
  "Profile",
  "Settings",
  "Notifications",
  "Search",
  "Cart",
  "Checkout",
  "Payments",
  "Reports",
  "Admin",
]);

function createRow(partial?: Partial<ChecklistRow>): ChecklistRow {
  const now = Date.now();
  // If preserving an existing row, use its createdAt for the default history
  const creationTime = partial?.createdAt ?? now;

  return {
    rowId: partial?.rowId ?? cryptoSafeId(),
    testName: partial?.testName ?? "",
    module: partial?.module ?? "",
    priority: partial?.priority ?? "medium",
    status: partial?.status ?? "untested",
    bug: partial?.bug ?? "",
    tags: partial?.tags ?? [],
    steps: partial?.steps ?? "",
    expectedResult: partial?.expectedResult ?? "",
    actualResult: partial?.actualResult ?? "",
    assignee: partial?.assignee ?? "",
    timeSpent: partial?.timeSpent ?? 0,
    history: partial?.history ?? [
      { date: creationTime, action: "Created", by: "System" },
    ],
    createdAt: creationTime,
    updatedAt: partial?.updatedAt ?? now,
  };
}

function cryptoSafeId(): string {
  // Prefer cryptographically strong random when available
  const c = window.crypto?.getRandomValues?.(new Uint32Array(2));
  if (c) return `row_${c[0].toString(16)}_${c[1].toString(16)}`;
  return `row_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function addRow(seed?: Partial<ChecklistRow>) {
  rows.value.push(createRow(seed));
}

function removeRow(rowId: string) {
  const idx = rows.value.findIndex((r) => r.rowId === rowId);
  if (idx >= 0) rows.value.splice(idx, 1);
}

function duplicateRow(rowId: string) {
  const idx = rows.value.findIndex((r) => r.rowId === rowId);
  if (idx < 0) return;
  const source = rows.value[idx];
  rows.value.splice(
    idx + 1,
    0,
    createRow({
      testName: source.testName ? `${source.testName} (Copy)` : "",
      module: source.module,
      priority: source.priority,
      tags: [...(source.tags || [])],
      steps: source.steps,
      expectedResult: source.expectedResult,
      status: "untested",
      bug: "",
    }),
  );
}

function clearAll() {
  if (!rows.value.length) return;
  showClearModal.value = true;
}

function confirmClear() {
  rows.value = [];
  query.value = "";
  moduleFilter.value = "";
  statusFilter.value = "";
  persist();
  showClearModal.value = false;
}

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

const uniqueModules = computed(() => {
  const set = new Set(
    rows.value
      .map((r) => r.module.trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b)),
  );
  return [...set];
});

const filteredRows = computed(() => {
  const q = normalize(query.value);
  const moduleQ = moduleFilter.value.trim();
  const statusQ = statusFilter.value;

  return rows.value.filter((r) => {
    if (moduleQ && r.module.trim() !== moduleQ) return false;
    if (statusQ && r.status !== statusQ) return false;
    if (!q) return true;
    const hay = `${r.testName} ${r.module} ${r.status} ${r.bug}`.toLowerCase();
    return hay.includes(q);
  });
});

const counts = computed(() => {
  const acc: Record<TestStatus, number> = {
    untested: 0,
    pass: 0,
    fail: 0,
    blocked: 0,
  };
  for (const r of rows.value) acc[r.status]++;
  return acc;
});

const completionPercent = computed(() => {
  const total = rows.value.length;
  if (!total) return 0;
  const tested = counts.value.pass + counts.value.fail + counts.value.blocked;
  return Math.round((tested / total) * 100);
});

const moduleStats = computed(() => {
  const stats: Record<
    string,
    { total: number; pass: number; fail: number; blocked: number }
  > = {};

  for (const r of rows.value) {
    const mod = r.module.trim() || "(No Module)";
    if (!stats[mod]) stats[mod] = { total: 0, pass: 0, fail: 0, blocked: 0 };
    stats[mod].total++;
    if (r.status !== "untested") stats[mod][r.status]++;
  }

  return Object.entries(stats)
    .map(([name, s]) => {
      const tested = s.pass + s.fail + s.blocked;
      const coverage = s.total ? Math.round((tested / s.total) * 100) : 0;
      return { name, ...s, coverage };
    })
    .sort((a, b) => b.total - a.total); // Sort by volume
});

const circumference = 2 * Math.PI * 40; // r=40

const donutSegments = computed(() => {
  const total = rows.value.length;
  if (!total) return [{ color: "#e2e8f0", length: circumference, offset: 0 }];

  const c = counts.value;
  // Order: Pass (green), Fail (red), Blocked (orange), Untested (slate)
  const segments = [
    { value: c.pass, color: "#10b981" }, // emerald-500
    { value: c.fail, color: "#f43f5e" }, // rose-500
    { value: c.blocked, color: "#f59e0b" }, // amber-500
    { value: c.untested, color: "#e2e8f0" }, // slate-200
  ];

  let accumulatedLength = 0;

  return segments.map((seg) => {
    const length = (seg.value / total) * circumference;
    const offset = -accumulatedLength;
    accumulatedLength += length;
    return { ...seg, length, offset };
  });
});

const healthScore = computed(() => {
  const total = rows.value.length;
  if (!total) return 100;

  // Pass = +1, Fail = -2, Blocked = -0.5, Untested = 0
  // Weigh by Priority: High (x2), Medium (x1), Low (x0.5)

  let score = 0;
  let maxPotential = 0;

  rows.value.forEach((r) => {
    let weight = 1;
    if (r.priority === "high") weight = 2;
    if (r.priority === "low") weight = 0.5;

    maxPotential += weight * 1; // Max score for this row is weight * 1 (pass)

    if (r.status === "pass") {
      score += weight * 1;
    } else if (r.status === "fail") {
      score -= weight * 2; // Penalty
    } else if (r.status === "blocked") {
      score -= weight * 0.5;
    }
    // untested adds 0
  });

  if (maxPotential === 0) return 100;

  // Normalize to 0-100, but allow for negative penalties to pull it down
  // Let's rely on a simpler pass ratio weighted by priority
  // Base Score: (Weighted Passes / Total Weighted Items) * 100
  // Penalty Deductions: Weighted Fails * PenaltyFactor

  // Revised Algo: Start at 100. Deduct for fails/blocks/untested.
  // This is easier for users to understand.

  let current = 100;
  const totalWeight = rows.value.reduce(
    (acc, r) =>
      acc + (r.priority === "high" ? 2 : r.priority === "low" ? 0.5 : 1),
    0,
  );

  if (totalWeight === 0) return 100;

  rows.value.forEach((r) => {
    let weight = 1;
    if (r.priority === "high") weight = 2;
    if (r.priority === "low") weight = 0.5;

    const share = (weight / totalWeight) * 100;

    if (r.status === "fail")
      current -= share * 1.5; // Fails hurt 1.5x their share
    else if (r.status === "blocked") current -= share * 0.8;
    else if (r.status === "untested") current -= share * 0.5; // Untested reduces potential
  });

  return Math.max(0, Math.min(100, Math.round(current)));
});

const bugStats = computed(() => {
  return rows.value.filter(
    (r) => r.status === "fail" || (r.status === "blocked" && r.bug),
  );
});

const isFiltered = computed(() => {
  return !!(query.value || moduleFilter.value.trim() || statusFilter.value);
});

function moveRowUp(rowId: string) {
  const index = rows.value.findIndex((r) => r.rowId === rowId);
  if (index > 0) {
    const temp = rows.value[index];
    rows.value[index] = rows.value[index - 1];
    rows.value[index - 1] = temp;
    // value assignment triggers watch -> persist, but let's be safe
  }
}

function moveRowDown(rowId: string) {
  const index = rows.value.findIndex((r) => r.rowId === rowId);
  if (index < rows.value.length - 1) {
    const temp = rows.value[index];
    rows.value[index] = rows.value[index + 1];
    rows.value[index + 1] = temp;
  }
}

function openTestDetails(row: ChecklistRow) {
  editingRow.value = row;
}

function closeTestDetails() {
  editingRow.value = null;
  persist();
}

function addTag() {
  if (!editingRow.value || !newTagInput.value.trim()) return;
  if (!editingRow.value.tags) editingRow.value.tags = [];

  const tag = newTagInput.value.trim();
  if (!editingRow.value.tags.includes(tag)) {
    editingRow.value.tags.push(tag);
    logHistory(editingRow.value, `Added tag: ${tag}`);
  }
  newTagInput.value = "";
}

function removeTag(tag: string) {
  if (!editingRow.value || !editingRow.value.tags) return;
  editingRow.value.tags = editingRow.value.tags.filter((t) => t !== tag);
  logHistory(editingRow.value, `Removed tag: ${tag}`);
}

function logHistory(row: ChecklistRow, action: string) {
  if (!row.history) row.history = [];
  row.history.push({
    date: Date.now(),
    action,
    by: "User", // Default to 'User' since we don't have auth/session
  });
  row.updatedAt = Date.now();
  persist();
}

function statusPillClass(status: TestStatus): string {
  switch (status) {
    case "pass":
      return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    case "fail":
      return "bg-rose-100 text-rose-700 border border-rose-200";
    case "blocked":
      return "bg-amber-100 text-amber-700 border border-amber-200";
    default:
      return "bg-slate-100 text-slate-600 border border-slate-200";
  }
}

const vAutoHeight = {
  mounted: (el: HTMLElement) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  },
  updated: (el: HTMLElement) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  },
};

function csvEscape(value: unknown): string {
  let str = String(value ?? "");

  // Prevent Excel from interpreting fields as formulas (fixes #NAME? errors)
  // If the cell starts with -, =, +, or @, prepend a tab or single quote to force text mode
  if (/^[=+\-@]/.test(str)) {
    str = "'" + str;
  }

  const needsQuotes = /[",\n\r]/.test(str);
  const escaped = str.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

function exportCSV() {
  const headers = [
    "Test Name",
    "Module",
    "Status",
    "Bug / Notes",
    "Created At",
    "Updated At",
  ];
  const lines = [
    headers.map(csvEscape).join(","),
    ...rows.value.map((r) =>
      [
        r.testName,
        r.module,
        r.status,
        r.bug,
        new Date(r.createdAt).toISOString(),
        new Date(r.updatedAt).toISOString(),
      ]
        .map(csvEscape)
        .join(","),
    ),
  ];

  // Add BOM for better Excel UTF-8 support
  const csvContent = "\uFEFF" + lines.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `qa_regression_checklist_${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function persist() {
  try {
    lastSavedAt.value = Date.now();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        savedAt: lastSavedAt.value,
        meta: projectMeta.value,
        rows: rows.value,
        moduleSuggestions: moduleSuggestions.value,
      }),
    );
  } catch (e) {
    console.error("Failed to save checklist:", e);
  }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as {
      version?: number;
      savedAt?: number;
      rows?: ChecklistRow[];
      meta?: { environment: string; build: string };
      moduleSuggestions?: string[];
    };

    if (parsed.meta) {
      projectMeta.value = parsed.meta;
    }

    if (Array.isArray(parsed.rows)) {
      rows.value = parsed.rows.map((r: any) =>
        createRow({
          ...r,
          testName: r.testName || r.testId || "",
        }),
      );
    }
    if (
      Array.isArray(parsed.moduleSuggestions) &&
      parsed.moduleSuggestions.length
    ) {
      moduleSuggestions.value = parsed.moduleSuggestions;
    }
    lastSavedAt.value =
      typeof parsed.savedAt === "number" ? parsed.savedAt : null;
    return true;
  } catch (e) {
    console.warn("Failed to load checklist:", e);
    return false;
  }
}

onMounted(() => {
  document.title = "QA Test Flow";
  const loaded = loadFromStorage();
  if (!loaded) {
    // Start with a single empty row for convenience
    addRow({ testName: "", module: "Login" });
  }
});

// Auto-update timestamps and persist on edit
watch(
  rows,
  (next) => {
    const now = Date.now();
    for (const r of next) r.updatedAt = now;
    persist();
  },
  { deep: true },
);
</script>
