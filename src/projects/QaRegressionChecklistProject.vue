<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-violet-50 font-sans text-slate-800 relative"
  >
    <!-- Auth Overlay -->
    <div
      v-if="!user"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md"
    >
      <div
        class="bg-white/90 backdrop-blur-xl w-full max-w-md p-8 rounded-3xl shadow-2xl border border-white/50 relative overflow-hidden"
      >
        <!-- Decor -->
        <div
          class="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500 rounded-full blur-3xl opacity-20"
        ></div>
        <div
          class="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-500 rounded-full blur-3xl opacity-20"
        ></div>

        <div class="relative z-10 text-center space-y-6">
          <div class="space-y-2">
            <h2
              class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600"
            >
              QA Test Flow
            </h2>
            <p class="text-slate-500 text-sm">
              Sign in to manage your secure regression checklist
            </p>
          </div>

          <form @submit.prevent="handleAuth" class="space-y-4 text-left">
            <div>
              <label class="text-xs font-bold text-slate-500 uppercase ml-1"
                >Email</label
              >
              <input
                type="email"
                v-model="authEmail"
                required
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label class="text-xs font-bold text-slate-500 uppercase ml-1"
                >Password</label
              >
              <input
                type="password"
                v-model="authPassword"
                required
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <div
              v-if="authMessage"
              :class="
                authMessage.type === 'error'
                  ? 'text-rose-500 bg-rose-50'
                  : 'text-emerald-500 bg-emerald-50'
              "
              class="text-xs p-3 rounded-lg font-medium text-center"
            >
              {{ authMessage.text }}
            </div>

            <button
              type="submit"
              :disabled="isLoginLoading"
              class="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{
                isLoginLoading
                  ? "Processing..."
                  : authMode === "login"
                  ? "Sign In"
                  : "Create Account"
              }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <div
      class="w-full min-h-screen space-y-8 p-4 md:p-8 transition-all duration-500"
      :class="{ 'blur-md opacity-20 pointer-events-none': !user }"
    >
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

          <!-- Project Selector -->
          <div
            v-if="projectsList.length > 0"
            class="flex flex-wrap gap-4 mt-4 items-center"
          >
            <div
              class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all"
            >
              <span
                class="text-xs font-bold text-slate-400 uppercase tracking-wider"
                >Project:</span
              >
              <select
                v-model="currentProjectId"
                @change="onProjectSwitch"
                class="bg-transparent border-none p-0 text-sm font-semibold text-slate-700 focus:ring-0 min-w-[140px]"
              >
                <option v-for="p in projectsList" :key="p.id" :value="p.id">
                  {{ p.name || "Unnamed" }}
                </option>
              </select>
            </div>
            <button
              @click="
                showNewProjectModal = true;
                newProjectName = '';
              "
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
              title="Create new project"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Project
            </button>
            <button
              @click="
                showRenameProjectModal = true;
                renameProjectName =
                  projectsList.find((p) => p.id === currentProjectId)?.name ||
                  '';
              "
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              title="Rename current project"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Rename
            </button>
            <button
              v-if="projectsList.length > 1"
              @click="showDeleteProjectModal = true"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
              title="Delete current project"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete Project
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-2 items-center">
          <!-- User Profile & Logout -->
          <div
            v-if="user"
            class="flex items-center gap-2 mr-1 pr-2 border-r border-slate-200"
          >
            <div class="text-right hidden sm:block">
              <div class="text-xs font-bold text-slate-700">
                {{ user.email?.split("@")[0] }}
              </div>
              <div class="text-[10px] text-slate-400">Authenticated</div>
            </div>
            <button
              @click="showLogoutModal = true"
              class="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-lg transition-colors"
              title="Sign Out"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>

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
            class="group relative inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 hover:-translate-y-0.5"
            title="Add a new test row"
          >
            <span class="mr-2 text-lg leading-none">+</span> New Test
          </button>

          <button
            @click="triggerImport"
            class="inline-flex items-center justify-center px-3 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300"
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
            @click="exportCSV"
            class="inline-flex items-center justify-center px-3 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300"
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
            @click="exportJSON"
            class="inline-flex items-center justify-center px-3 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300"
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
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <!-- Total -->
        <button
          type="button"
          @click="filterByStatus('')"
          class="p-4 bg-white border border-indigo-100 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-1 group hover:border-indigo-200 transition-colors cursor-pointer text-left w-full min-h-[88px]"
          :class="statusFilter === '' ? 'ring-2 ring-indigo-400' : ''"
          title="Show all tests"
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
        </button>

        <!-- Pass -->
        <button
          type="button"
          @click="filterByStatus('pass')"
          class="p-4 bg-white border border-emerald-100 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-1 group hover:border-emerald-200 transition-colors cursor-pointer text-left w-full min-h-[88px]"
          :class="statusFilter === 'pass' ? 'ring-2 ring-emerald-400' : ''"
          title="Show passed tests"
        >
          <div class="text-3xl font-bold text-emerald-600">
            {{ counts.pass }}
          </div>
          <div
            class="text-xs font-semibold uppercase tracking-wider text-emerald-600/70"
          >
            Passed
          </div>
        </button>

        <!-- Fail -->
        <button
          type="button"
          @click="filterByStatus('fail')"
          class="p-4 bg-white border border-rose-100 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-1 group hover:border-rose-200 transition-colors cursor-pointer text-left w-full min-h-[88px] relative overflow-hidden"
          :class="statusFilter === 'fail' ? 'ring-2 ring-rose-400' : ''"
          title="Show failed tests"
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
        </button>

        <!-- Blocked -->
        <button
          type="button"
          @click="filterByStatus('blocked')"
          class="p-4 bg-white border border-amber-100 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-1 group hover:border-amber-200 transition-colors cursor-pointer text-left w-full min-h-[88px]"
          :class="statusFilter === 'blocked' ? 'ring-2 ring-amber-400' : ''"
          title="Show blocked tests"
        >
          <div class="text-3xl font-bold text-amber-500">
            {{ counts.blocked }}
          </div>
          <div
            class="text-xs font-semibold uppercase tracking-wider text-amber-500/70"
          >
            Blocked
          </div>
        </button>

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
        <div class="flex border-b border-indigo-50 items-center">
          <div class="flex">
          <button
            @click="currentView = 'analytics'"
            class="px-6 py-4 text-sm font-bold uppercase tracking-wide transition-all border-b-2"
            :class="
              currentView === 'analytics'
                ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                : 'border-transparent text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
            "
            title="Dashboard"
          >
            Analytics Report
          </button>
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
          </div>
          <button
            @click="showReportModal = true"
            class="ml-auto mr-4 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-all"
            title="View full report"
          >
            View Report
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
            ref="checklistTop"
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
                    v-for="row in paginatedRows"
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
                            persist();
                            logHistory(row, 'Status updated to ' + row.status);
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

            <!-- Pagination Controls -->
            <div
              v-if="totalPages > 1"
              class="px-6 py-4 border-t border-indigo-50 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div class="text-xs text-slate-500 font-medium">
                Showing
                <span class="font-bold text-indigo-600">{{
                  (currentPage - 1) * itemsPerPage + 1
                }}</span>
                to
                <span class="font-bold text-indigo-600">{{
                  Math.min(currentPage * itemsPerPage, filteredRows.length)
                }}</span>
                of
                <span class="font-bold text-indigo-600">{{
                  filteredRows.length
                }}</span>
                tests
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Prev
                </button>

                <div class="flex gap-1">
                  <!-- Simple page range logic for display -->
                  <template v-for="page in visiblePages" :key="page">
                    <span
                      v-if="page === -1"
                      class="w-8 h-8 flex items-center justify-center text-slate-400"
                      >...</span
                    >
                    <button
                      v-else
                      @click="goToPage(page)"
                      class="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all shadow-sm"
                      :class="
                        currentPage === page
                          ? 'bg-indigo-600 text-white shadow-indigo-200'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                      "
                    >
                      {{ page }}
                    </button>
                  </template>
                </div>

                <button
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <!-- Analytics Dashboard View -->
          <div v-else key="analytics" class="p-6 space-y-8 min-h-[400px]">
            <!-- Project Score & Chart -->
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
                      :stroke-dasharray="`${
                        animationReady ? seg.length : 0
                      } ${circumference}`"
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
                      Project Score
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
                  class="p-4 rounded-xl border transition-colors"
                  :class="
                    bug.status === 'blocked'
                      ? 'bg-amber-50 border-amber-100'
                      : 'bg-rose-50 border-rose-100'
                  "
                >
                  <div class="flex justify-between items-start mb-2">
                    <span
                      class="font-medium text-sm"
                      :class="
                        bug.status === 'blocked'
                          ? 'text-amber-900'
                          : 'text-rose-900'
                      "
                      >{{ bug.testName || "Untitled Test" }}</span
                    >
                    <span
                      class="text-xs font-semibold uppercase px-2 py-0.5 rounded ml-2 whitespace-nowrap"
                      :class="
                        bug.status === 'blocked'
                          ? 'text-amber-600 bg-amber-200/50'
                          : 'text-rose-600 bg-rose-200/50'
                      "
                      >{{ bug.module }}</span
                    >
                  </div>
                  <p class="text-sm text-slate-700 font-medium line-clamp-2">
                    {{
                      bug.bug ||
                      (bug.status === "blocked"
                        ? "Test blocked"
                        : "No description provided")
                    }}
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
        <!-- Sync Error Banner -->
        <div
          v-if="syncError"
          class="bg-rose-500 text-white px-4 py-2 text-center text-sm font-bold"
        >
          Sync Error: {{ syncError }}
        </div>
      </div>

      <!-- Toast (Import success/error) -->
      <Teleport to="body">
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-2"
        >
          <div
            v-if="toast"
            :class="toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'"
            class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-xl text-white text-sm font-medium shadow-lg"
          >
            {{ toast.text }}
          </div>
        </Transition>
      </Teleport>

      <!-- Initial Load Spinner -->
      <Teleport to="body">
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="isInitialLoad && user"
            class="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/20 backdrop-blur-sm"
          >
            <div class="flex flex-col items-center gap-4">
              <div
                class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"
              />
              <p class="text-sm font-medium text-slate-600">
                Loading your projects...
              </p>
            </div>
          </div>
        </Transition>
      </Teleport>

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

      <!-- New Project Modal -->
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
            v-if="showNewProjectModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
            @click.self="
              showNewProjectModal = false;
              newProjectError = null;
            "
          >
            <div
              class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 transform transition-all scale-100"
            >
              <div class="flex items-center gap-4 mb-4">
                <div class="p-3 bg-indigo-100 text-indigo-600 rounded-full">
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-slate-800">New Project</h3>
                  <p class="text-sm text-slate-500">
                    Create a separate checklist (e.g. Mobile Staging, Web
                    Production)
                  </p>
                </div>
              </div>
              <input
                v-model="newProjectName"
                type="text"
                placeholder="e.g. App - Staging"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm mb-4"
                :disabled="isCreatingProject"
                @keydown.enter="confirmCreateProject"
              />
              <p
                v-if="newProjectError"
                class="text-sm text-rose-600 bg-rose-50 px-3 py-2 rounded-lg mb-4"
              >
                {{ newProjectError }}
              </p>
              <div class="flex justify-end gap-3">
                <button
                  @click="
                    showNewProjectModal = false;
                    newProjectError = null;
                  "
                  :disabled="isCreatingProject"
                  class="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  @click="confirmCreateProject"
                  :disabled="!newProjectName.trim() || isCreatingProject"
                  class="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {{ isCreatingProject ? "Creating..." : "Create" }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Rename Project Modal -->
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
            v-if="showRenameProjectModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
            @click.self="showRenameProjectModal = false"
          >
            <div class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
              <div class="flex items-center gap-4 mb-4">
                <div class="p-3 bg-indigo-100 text-indigo-600 rounded-full">
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-slate-800">
                    Rename project
                  </h3>
                  <p class="text-sm text-slate-500">
                    Enter a new name for this project
                  </p>
                </div>
              </div>
              <input
                v-model="renameProjectName"
                type="text"
                placeholder="e.g. Mobile Staging"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm mb-6"
                @keydown.enter="confirmRenameProject"
              />
              <div class="flex justify-end gap-3">
                <button
                  @click="showRenameProjectModal = false"
                  class="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  @click="confirmRenameProject"
                  :disabled="!renameProjectName.trim()"
                  class="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Rename
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Delete Project Modal -->
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
            v-if="showDeleteProjectModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
            @click.self="
              showDeleteProjectModal = false;
              deleteProjectError = null;
            "
          >
            <div class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
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
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-slate-800">
                    Delete this project?
                  </h3>
                  <p class="text-sm text-slate-500">
                    "{{
                      projectsList.find((p) => p.id === currentProjectId)
                        ?.name || "Unnamed"
                    }}" and all its tests will be permanently removed.
                  </p>
                </div>
              </div>
              <p
                v-if="deleteProjectError"
                class="text-sm text-rose-600 bg-rose-50 px-3 py-2 rounded-lg mb-4"
              >
                {{ deleteProjectError }}
              </p>
              <div class="flex justify-end gap-3">
                <button
                  @click="
                    showDeleteProjectModal = false;
                    deleteProjectError = null;
                  "
                  class="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  @click="confirmDeleteProject"
                  class="px-4 py-2 text-white bg-rose-600 rounded-lg hover:bg-rose-700 font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Logout Confirmation Modal -->
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
            v-if="showLogoutModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
            @click.self="showLogoutModal = false"
          >
            <div
              class="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 transform transition-all scale-100"
            >
              <div class="flex items-center gap-4 mb-4">
                <div class="p-3 bg-indigo-100 text-indigo-600 rounded-full">
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-slate-800">Sign Out?</h3>
                  <p class="text-sm text-slate-500">
                    Your progress will be saved.
                  </p>
                </div>
              </div>

              <div class="flex justify-end gap-3 mt-6">
                <button
                  @click="showLogoutModal = false"
                  class="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  @click="confirmLogout"
                  class="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 transition-all hover:shadow-indigo-300 transform hover:-translate-y-0.5"
                >
                  Yes, Sign Out
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- Report Summary Modal -->
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
            v-if="showReportModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
            @click.self="showReportModal = false"
          >
            <div
              class="w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <!-- Report Header -->
              <div class="p-6 border-b border-slate-200 bg-slate-50/50 shrink-0">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h2 class="text-xl font-bold text-indigo-600">QA Regression Report</h2>
                    <p class="text-sm text-slate-500 mt-1">
                      {{ projectsList.find((p) => p.id === currentProjectId)?.name || "Checklist" }}
                      · {{ new Date().toLocaleString() }}
                    </p>
                  </div>
                  <button
                    @click="showReportModal = false"
                    class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Close"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Report Body -->
              <div class="flex-1 overflow-y-auto p-6 space-y-6">
                <!-- Summary -->
                <div class="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Summary</h3>
                  <div class="grid grid-cols-5 gap-4">
                    <div>
                      <div class="text-2xl font-bold text-slate-800">{{ rows.length }}</div>
                      <div class="text-xs text-slate-500">Total</div>
                    </div>
                    <div>
                      <div class="text-2xl font-bold text-emerald-600">{{ counts.pass }}</div>
                      <div class="text-xs text-slate-500">Passed</div>
                    </div>
                    <div>
                      <div class="text-2xl font-bold text-rose-600">{{ counts.fail }}</div>
                      <div class="text-xs text-slate-500">Failed</div>
                    </div>
                    <div>
                      <div class="text-2xl font-bold text-amber-600">{{ counts.blocked }}</div>
                      <div class="text-xs text-slate-500">Blocked</div>
                    </div>
                    <div>
                      <div class="text-2xl font-bold text-slate-400">{{ counts.untested }}</div>
                      <div class="text-xs text-slate-500">Untested</div>
                    </div>
                  </div>
                  <div class="mt-3 flex gap-6 text-sm">
                    <span><strong>Coverage:</strong> {{ completionPercent }}%</span>
                    <span><strong>Project Score:</strong> {{ healthScore }}/100</span>
                  </div>
                </div>

                <!-- Status Distribution -->
                <div>
                  <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Status Distribution</h3>
                  <table class="w-full border border-slate-200 text-sm rounded-lg overflow-hidden">
                    <thead class="bg-slate-50">
                      <tr>
                        <th class="px-4 py-2 text-left font-semibold text-slate-600">Status</th>
                        <th class="px-4 py-2 text-right font-semibold text-slate-600">Count</th>
                        <th class="px-4 py-2 text-right font-semibold text-slate-600">%</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white">
                      <tr class="border-t border-slate-100">
                        <td class="px-4 py-2">Pass</td>
                        <td class="px-4 py-2 text-right text-emerald-600 font-medium">{{ counts.pass }}</td>
                        <td class="px-4 py-2 text-right">{{ rows.length ? Math.round((counts.pass / rows.length) * 100) : 0 }}%</td>
                      </tr>
                      <tr class="border-t border-slate-100">
                        <td class="px-4 py-2">Fail</td>
                        <td class="px-4 py-2 text-right text-rose-600 font-medium">{{ counts.fail }}</td>
                        <td class="px-4 py-2 text-right">{{ rows.length ? Math.round((counts.fail / rows.length) * 100) : 0 }}%</td>
                      </tr>
                      <tr class="border-t border-slate-100">
                        <td class="px-4 py-2">Blocked</td>
                        <td class="px-4 py-2 text-right text-amber-600 font-medium">{{ counts.blocked }}</td>
                        <td class="px-4 py-2 text-right">{{ rows.length ? Math.round((counts.blocked / rows.length) * 100) : 0 }}%</td>
                      </tr>
                      <tr class="border-t border-slate-100">
                        <td class="px-4 py-2">Untested</td>
                        <td class="px-4 py-2 text-right text-slate-500">{{ counts.untested }}</td>
                        <td class="px-4 py-2 text-right">{{ rows.length ? Math.round((counts.untested / rows.length) * 100) : 0 }}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Module Performance -->
                <div>
                  <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Module Performance</h3>
                  <div class="overflow-x-auto rounded-lg border border-slate-200">
                    <table class="w-full text-sm">
                      <thead class="bg-slate-50">
                        <tr>
                          <th class="px-4 py-2 text-left font-semibold text-slate-600">Module</th>
                          <th class="px-4 py-2 text-center font-semibold text-slate-600">Coverage</th>
                          <th class="px-4 py-2 text-right font-semibold text-slate-600">Pass</th>
                          <th class="px-4 py-2 text-right font-semibold text-slate-600">Fail</th>
                          <th class="px-4 py-2 text-right font-semibold text-slate-600">Blocked</th>
                          <th class="px-4 py-2 text-right font-semibold text-slate-600">Total</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-slate-100">
                        <tr v-for="mod in moduleStats" :key="mod.name">
                          <td class="px-4 py-2 font-medium text-slate-800">{{ mod.name }}</td>
                          <td class="px-4 py-2 text-center">{{ mod.coverage }}%</td>
                          <td class="px-4 py-2 text-right text-emerald-600">{{ mod.pass }}</td>
                          <td class="px-4 py-2 text-right text-rose-600">{{ mod.fail }}</td>
                          <td class="px-4 py-2 text-right text-amber-600">{{ mod.blocked }}</td>
                          <td class="px-4 py-2 text-right font-bold text-slate-800">{{ mod.total }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
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
                              'Status changed to ' + editingRow.status
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
                                'Priority changed to ' + p
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
                          v-for="tag in editingRow.tags || []"
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
import {
  computed,
  nextTick,
  onMounted,
  onBeforeUnmount,
  ref,
  watch,
} from "vue";

import { onBeforeRouteLeave, useRouter } from "vue-router";
import { supabase } from "../supabase";
import type { User } from "@supabase/supabase-js";

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

const priorities: TestPriority[] = ["low", "medium", "high"];

const rows = ref<ChecklistRow[]>([]);
const projectMeta = ref({ environment: "", build: "" });
const currentView = ref<"checklist" | "analytics">("analytics");
const query = ref("");
const moduleFilter = ref("");
const statusFilter = ref<"" | TestStatus>("");
const lastSavedAt = ref<number | null>(null);
const showBulkDeleteModal = ref(false);
const showLogoutModal = ref(false);
const editingRow = ref<ChecklistRow | null>(null);
const newTagInput = ref("");
const animationReady = ref(false);
const selectedIds = ref(new Set<string>());
const fileInput = ref<HTMLInputElement | null>(null);
const checklistTop = ref<HTMLElement | null>(null);
const showReportModal = ref(false);

// -- Supabase Auth State --
const user = ref<User | null>(null);
const authEmail = ref("");
const authPassword = ref("");
const isLoginLoading = ref(false);
const authMode = ref<"login" | "signup">("login");
const authMessage = ref<{
  type: "success" | "error";
  text: string;
} | null>(null);
const syncError = ref<string | null>(null);
const currentProjectId = ref<string | undefined>(undefined);
const projectsList = ref<{ id: string; name: string }[]>([]);
const showNewProjectModal = ref(false);
const newProjectError = ref<string | null>(null);
const isCreatingProject = ref(false);
const showDeleteProjectModal = ref(false);
const showRenameProjectModal = ref(false);
const renameProjectName = ref("");
const deleteProjectError = ref<string | null>(null);
const newProjectName = ref("");
const previousProjectId = ref<string | undefined>(undefined);
const toast = ref<{ type: "success" | "error"; text: string } | null>(null);
const isInitialLoad = ref(true);

let toastTimeout: ReturnType<typeof setTimeout> | null = null;
function showToast(type: "success" | "error", text: string) {
  if (toastTimeout) clearTimeout(toastTimeout);
  toast.value = { type, text };
  toastTimeout = setTimeout(() => {
    toast.value = null;
    toastTimeout = null;
  }, 3000);
}

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

async function confirmBulkDelete() {
  rows.value = rows.value.filter((r) => !selectedIds.value.has(r.rowId));
  selectedIds.value.clear();
  showBulkDeleteModal.value = false;
  lastSavedAt.value = Date.now();
  await saveToSupabase(); // Await so delete is persisted before any navigation
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
      showToast("success", "Import successful!");
      persist();
    } catch (err) {
      showToast("error", "Failed to import JSON: " + (err as Error)?.message);
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
  a.download = `qa_checklist_backup_${new Date()
    .toISOString()
    .slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

watch(
  currentView,
  (val) => {
    if (val === "analytics") {
      animationReady.value = false;
      setTimeout(() => {
        animationReady.value = true;
      }, 400);
    } else {
      animationReady.value = false;
    }
  },
  { immediate: true }
);

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
  return `row_${Math.random().toString(16).slice(2)}_${Date.now().toString(
    16
  )}`;
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
    })
  );
}

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

const uniqueModules = computed(() => {
  const set = new Set(
    rows.value
      .map((r) => r.module.trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
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

// -- Pagination Logic --
const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() => {
  return Math.ceil(filteredRows.value.length / itemsPerPage);
});

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredRows.value.slice(start, end);
});

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const delta = 2; // Number of pages to show on each side of current
  const range: number[] = [];
  const rangeWithDots: number[] = [];

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  let l: number | null = null;
  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push(-1); // -1 indicates dots
      }
    }
    rangeWithDots.push(i);
    l = i;
  }
  return rangeWithDots;
});

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    checklistTop.value?.scrollIntoView({ behavior: "smooth" });
  }
}

function filterByStatus(status: "" | TestStatus) {
  statusFilter.value = status;
  currentView.value = "checklist";
  currentPage.value = 1;
  nextTick(() => checklistTop.value?.scrollIntoView({ behavior: "smooth" }));
}

watch(filteredRows, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = Math.max(1, totalPages.value);
  }
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
    0
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
    (r) => r.status === "fail" || r.status === "blocked"
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
        .join(",")
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

let persistTimeout: ReturnType<typeof setTimeout> | null = null;
const PERSIST_DEBOUNCE_MS = 800;

function persist() {
  lastSavedAt.value = Date.now();
  if (!user.value) return;
  if (!currentProjectId.value) return;

  if (persistTimeout) clearTimeout(persistTimeout);
  persistTimeout = setTimeout(() => {
    persistTimeout = null;
    saveToSupabase();
  }, PERSIST_DEBOUNCE_MS);
}

async function saveToSupabase() {
  if (!user.value) return;

  try {
    const payload = {
      version: 1,
      savedAt: lastSavedAt.value,
      meta: projectMeta.value,
      rows: rows.value,
      moduleSuggestions: moduleSuggestions.value,
    };

    const updateData: any = {
      user_id: user.value.id,
      content: payload,
      updated_at: new Date().toISOString(), // Critical: must set so ORDER BY updated_at returns correct project
    };

    // If we have an ID, update it. If not, Supabase inserts a new row.
    if (currentProjectId.value) {
      updateData.id = currentProjectId.value;
    }

    let data: any = null;
    let error: any = null;
    if (currentProjectId.value) {
      const res = await supabase
        .from("qa_projects")
        .update({
          content: updateData.content,
          updated_at: updateData.updated_at,
        })
        .eq("id", currentProjectId.value)
        .eq("user_id", user.value.id)
        .select()
        .single();
      data = res.data;
      error = res.error;
    } else {
      const res = await supabase
        .from("qa_projects")
        .insert({
          ...updateData,
          name: projectMeta.value.environment || "QA Checklist Project",
        })
        .select()
        .single();
      data = res.data;
      error = res.error;
    }
    if (error) throw error;
    if (data) currentProjectId.value = data.id;
  } catch (e: any) {
    console.error("Failed to sync with Supabase:", e);
    syncError.value = e.message || "Sync failed";
    // Auto-hide after 5s
    setTimeout(() => (syncError.value = null), 5000);
  }
}

async function fetchProjectsList() {
  if (!user.value) return;
  const { data, error } = await supabase
    .from("qa_projects")
    .select("id, name")
    .eq("user_id", user.value.id)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  projectsList.value = (data || []).map((p: any) => ({
    id: p.id,
    name: p.name || "Unnamed",
  }));
}

function applyProjectData(data: any) {
  if (!data) return;
  currentProjectId.value = data.id;
  previousProjectId.value = data.id;
  if (data.content) {
    const parsed = data.content;
    if (parsed.meta) projectMeta.value = parsed.meta;
    rows.value = Array.isArray(parsed.rows)
      ? parsed.rows.map((r: any) =>
          createRow({ ...r, testName: r.testName || r.testId || "" })
        )
      : [];
    if (
      Array.isArray(parsed.moduleSuggestions) &&
      parsed.moduleSuggestions.length
    ) {
      moduleSuggestions.value = parsed.moduleSuggestions;
    }
    lastSavedAt.value =
      typeof parsed.savedAt === "number" ? parsed.savedAt : null;
  }
}

async function loadProject(projectId: string) {
  if (!user.value) return;
  const { data, error } = await supabase
    .from("qa_projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", user.value.id)
    .maybeSingle();
  if (error) throw error;
  applyProjectData(data);
}

async function onProjectSwitch() {
  const newId = currentProjectId.value;
  const oldId = previousProjectId.value;
  if (newId === oldId || !newId || !oldId) return;
  currentProjectId.value = oldId;
  await saveToSupabase();
  currentProjectId.value = newId;
  previousProjectId.value = newId;
  await loadProject(newId);
}

async function confirmRenameProject() {
  const id = currentProjectId.value;
  const name = renameProjectName.value.trim();
  if (!id || !name || !user.value) return;
  showRenameProjectModal.value = false;
  try {
    const { error } = await supabase
      .from("qa_projects")
      .update({ name })
      .eq("id", id)
      .eq("user_id", user.value.id);
    if (error) throw error;
    projectsList.value = projectsList.value.map((p) =>
      p.id === id ? { ...p, name } : p
    );
  } catch (e: any) {
    console.error("Failed to rename project:", e);
    syncError.value = e.message || "Failed to rename project";
    setTimeout(() => (syncError.value = null), 5000);
  }
}

async function confirmDeleteProject() {
  const id = currentProjectId.value;
  if (!id || !user.value) return;
  deleteProjectError.value = null;
  try {
    const { data, error } = await supabase
      .from("qa_projects")
      .delete()
      .eq("id", id)
      .select("id");
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error(
        "Project not found or delete was blocked. Ensure you have the delete RLS policy."
      );
    }
    showDeleteProjectModal.value = false;
    projectsList.value = projectsList.value.filter((p) => p.id !== id);
    const next = projectsList.value[0];
    if (next) {
      await loadProject(next.id);
    } else {
      currentProjectId.value = undefined;
      previousProjectId.value = undefined;
      rows.value = [];
      newProjectName.value = "Default Project";
      await confirmCreateProject();
    }
  } catch (e: any) {
    console.error("Failed to delete project:", e);
    deleteProjectError.value = e.message || "Failed to delete project";
    syncError.value = e.message || "Failed to delete project";
    setTimeout(() => {
      syncError.value = null;
      deleteProjectError.value = null;
    }, 5000);
  }
}

async function confirmCreateProject() {
  const name = newProjectName.value.trim();
  if (!name || !user.value) return;
  newProjectError.value = null;
  isCreatingProject.value = true;
  try {
    const payload = {
      version: 1,
      savedAt: Date.now(),
      meta: projectMeta.value,
      rows: [],
      moduleSuggestions: moduleSuggestions.value,
    };
    const { data, error } = await supabase
      .from("qa_projects")
      .insert({
        user_id: user.value.id,
        name,
        content: payload,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    projectsList.value = [...projectsList.value, { id: data.id, name }];
    currentProjectId.value = data.id;
    previousProjectId.value = data.id;
    rows.value = [];
    projectMeta.value = { environment: "", build: "" };
    addRow({ testName: "", module: "Login" });
    await saveToSupabase();
    showNewProjectModal.value = false;
    newProjectName.value = "";
  } catch (e: any) {
    console.error("Failed to create project:", e);
    newProjectError.value = e.message || "Failed to create project";
    syncError.value = e.message || "Failed to create project";
    setTimeout(() => {
      syncError.value = null;
      newProjectError.value = null;
    }, 5000);
  } finally {
    isCreatingProject.value = false;
  }
}

async function loadFromSupabase() {
  if (!user.value) return;

  try {
    const { data: projects, error } = await supabase
      .from("qa_projects")
      .select("*")
      .eq("user_id", user.value.id)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    projectsList.value = (projects || []).map((p: any) => ({
      id: p.id,
      name: p.name || "Unnamed",
    }));

    if (!projects || projects.length === 0) {
      const localRaw = localStorage.getItem("qa-regression-checklist-v1");
      if (localRaw) {
        try {
          const parsed = JSON.parse(localRaw);
          if (parsed.rows)
            rows.value = parsed.rows.map((r: any) => createRow(r));
          if (parsed.meta) projectMeta.value = parsed.meta;
          await saveToSupabase();
          localStorage.removeItem("qa-regression-checklist-v1");
          await fetchProjectsList();
        } catch (e) {
          console.error("Migration failed", e);
        }
      }
      if (projectsList.value.length === 0) {
        newProjectName.value = "Default Project";
        await confirmCreateProject();
      } else {
        await loadProject(projectsList.value[0].id);
      }
    } else {
      const best = projects.reduce((a, p) => {
        const aRows = (a?.content as any)?.rows?.length ?? 0;
        const pRows = (p.content as any)?.rows?.length ?? 0;
        return pRows > aRows ? p : a;
      });
      currentProjectId.value = best.id;
      applyProjectData(best);
    }
    localStorage.removeItem("qa-regression-checklist-v1");
  } catch (e: any) {
    console.error("Failed to load from Supabase:", e);
  } finally {
    isInitialLoad.value = false;
  }
}

// Auth Handlers
async function handleAuth() {
  if (!authEmail.value || !authPassword.value) return;
  isLoginLoading.value = true;
  authMessage.value = null;

  try {
    if (authMode.value === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail.value,
        password: authPassword.value,
      });
      if (error) throw error;
      user.value = data.user;
      authMessage.value = { type: "success", text: "Welcome back!" };
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: authEmail.value,
        password: authPassword.value,
      });
      if (error) throw error;
      if (data.user) {
        user.value = data.user;
        authMessage.value = {
          type: "success",
          text: "Account created successfully!",
        };
      } else {
        authMessage.value = {
          type: "success",
          text: "Check your email for the confirmation link.",
        };
      }
    }
  } catch (e: any) {
    authMessage.value = {
      type: "error",
      text: e.message || "Authentication failed",
    };
  } finally {
    isLoginLoading.value = false;
  }
}

const router = useRouter();

async function confirmLogout() {
  // Auto-save before signing out
  await saveToSupabase();

  await supabase.auth.signOut();
  user.value = null;
  rows.value = []; // Clear data for security
  authEmail.value = "";
  authPassword.value = "";
  showLogoutModal.value = false;
  router.push("/");
}

onMounted(async () => {
  document.title = "QA Test Flow";

  // Check initial session
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    user.value = data.session.user;
    isInitialLoad.value = true;
    await loadFromSupabase();
  } else {
    isInitialLoad.value = false;
  }

  // Auth Listener (only load on actual sign-in, not on tab focus / TOKEN_REFRESHED)
  supabase.auth.onAuthStateChange(async (event, session) => {
    const hadUser = !!user.value;
    user.value = session?.user || null;
    if (event === "SIGNED_IN" && user.value && !hadUser) {
      isInitialLoad.value = true;
      await loadFromSupabase();
    } else if (event === "SIGNED_OUT") {
      isInitialLoad.value = false;
      rows.value = [];
      currentProjectId.value = undefined;
    }
  });

  // If no user, maybe start with empty? The template handles the blur/block.
  if (!rows.value.length && user.value) {
    addRow({ testName: "", module: "Login" });
  }

  // Prevent accidental back navigation / tab close
  window.addEventListener("beforeunload", handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});

function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (user.value && persistTimeout) {
    e.preventDefault();
    e.returnValue = ""; // Only block when there's a pending save
  }
}

// Intercept in-app navigation: flush pending save then allow
onBeforeRouteLeave(async (_to, _from, next) => {
  if (persistTimeout && user.value) {
    clearTimeout(persistTimeout);
    persistTimeout = null;
    await saveToSupabase();
  }
  next();
});

// Auto-update timestamps and persist on edit
watch(
  rows,
  () => {
    persist();
  },
  { deep: true }
);
</script>
