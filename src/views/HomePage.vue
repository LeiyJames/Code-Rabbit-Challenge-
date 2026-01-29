<template>
  <div class="min-h-screen bg-neutral-50">
    <!-- Hero Section -->
    <section
      class="relative overflow-hidden bg-neutral-900 text-white min-h-[90vh] flex items-center"
    >
      <!-- Background Patterns -->
      <div class="absolute inset-0 z-0 opacity-20">
        <div
          class="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-blue-500 rounded-full blur-[120px] animate-pulse-slow"
        ></div>
        <div
          class="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-purple-500 rounded-full blur-[120px] animate-pulse-slow delay-1000"
        ></div>
      </div>

      <div class="max-w-7xl mx-auto px-6 py-20 lg:py-32 relative z-10 w-full">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <!-- Left: Content -->
          <div class="space-y-8 text-center lg:text-left">
            <div
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs font-semibold tracking-wider text-green-400 uppercase mb-4 animate-fade-in"
            >
              <span
                class="w-2 h-2 rounded-full bg-green-500 animate-pulse"
              ></span>
              Available for hire
            </div>

            <h1
              class="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight"
            >
              I build frontend
              <span
                class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 block mt-2"
              >
                projects + tools
              </span>
            </h1>

            <p class="text-xl lg:text-2xl text-neutral-400 h-8 font-mono">
              <span class="text-white">></span> {{ typewriterText
              }}<span class="animate-blink">|</span>
            </p>

            <p
              class="text-lg text-neutral-400 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Explore my interactive playground featuring full-stack
              simulations, games, and security tools built with modern web
              technologies.
            </p>

            <div
              class="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4"
            >
              <button
                @click="scrollToProjects"
                class="px-8 py-4 bg-white text-neutral-900 rounded-xl font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-white/20 flex items-center gap-2"
              >
                View Projects
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              <a
                href="https://github.com/LeiyJames"
                target="_blank"
                class="px-8 py-4 bg-neutral-800 text-white rounded-xl font-bold text-lg hover:bg-neutral-700 transition-all border border-neutral-700 flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <svg
                  fill="currentColor"
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                GitHub
              </a>
            </div>
          </div>

          <!-- Right: Visual -->
          <div class="relative hidden lg:block perspective-500">
            <!-- Floating Cards Stack -->
            <div class="relative w-full aspect-square max-w-lg mx-auto">
              <!-- Code Editor Card -->
              <div
                class="absolute inset-x-0 top-10 bg-neutral-900/90 backdrop-blur-xl border border-neutral-700 rounded-2xl shadow-2xl p-6 transform -rotate-6 hover:rotate-0 transition-transform duration-500 z-10"
              >
                <div class="flex gap-2 mb-4">
                  <div class="w-3 h-3 rounded-full bg-red-500"></div>
                  <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div class="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div class="space-y-2 font-mono text-xs">
                  <div class="flex">
                    <span class="text-purple-400">const</span>
                    <span class="text-blue-400 ml-2">developer</span>
                    <span class="text-white mx-2">=</span>
                    <span class="text-white">{</span>
                  </div>
                  <div class="pl-4 text-white">
                    name: <span class="text-green-400">'Leigh James'</span>,
                  </div>
                  <div class="pl-4 text-white">
                    skills: [
                    <span class="text-green-400">'Vue'</span>,
                    <span class="text-green-400">'TS'</span>,
                    <span class="text-green-400">'Flutter'</span>,
                    <span class="text-green-400">'Dart'</span>,
                    <span class="text-green-400">'etc.'</span>
                    ],
                  </div>
                  <div class="pl-4 text-white">
                    passion: <span class="text-yellow-400">true</span>
                  </div>
                  <div class="text-white">}</div>
                </div>
              </div>

              <!-- Project Preview Card 1 -->
              <div
                class="absolute right-0 bottom-20 w-3/4 bg-white rounded-2xl shadow-xl overflow-hidden transform rotate-3 hover:rotate-6 transition-transform duration-500 z-20 border border-neutral-200"
              >
                <div
                  class="bg-blue-600 p-4 flex items-center justify-between text-white"
                >
                  <span class="font-bold text-sm">Secure Chat</span>
                  <div
                    class="w-2 h-2 rounded-full bg-green-400 animate-pulse"
                  ></div>
                </div>
                <div class="p-4 space-y-3 bg-neutral-50">
                  <div class="flex items-start gap-3">
                    <div
                      class="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0"
                    ></div>
                    <div
                      class="bg-white p-2 rounded-lg rounded-tl-none shadow-sm text-xs text-neutral-600 w-full"
                    >
                      Hey! Check out this new update.
                    </div>
                  </div>
                  <div class="flex items-start gap-3 flex-row-reverse">
                    <div
                      class="w-8 h-8 rounded-full bg-purple-100 flex-shrink-0"
                    ></div>
                    <div
                      class="bg-purple-600 text-white p-2 rounded-lg rounded-tr-none shadow-sm text-xs w-2/3"
                    >
                      Looks amazing! 🚀
                    </div>
                  </div>
                </div>
              </div>

              <!-- Floating Badge -->
              <div
                class="absolute -right-4 top-1/2 bg-white rounded-xl shadow-lg p-3 flex items-center gap-3 animate-float z-30"
              >
                <div class="bg-orange-100 p-2 rounded-lg text-orange-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <div class="text-xs text-neutral-500 font-bold uppercase">
                    Speed
                  </div>
                  <div class="text-sm font-bold text-neutral-900">
                    Optimized
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div
        class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden lg:block"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-neutral-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="max-w-7xl mx-auto px-6 py-12 mt-6 relative z-20">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Stat Card 1: Total Projects -->
        <div
          class="bg-white p-6 rounded-2xl shadow-xl border border-neutral-100 transform hover:-translate-y-1 transition-transform duration-300"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <span
              class="text-xs font-bold text-neutral-400 uppercase tracking-wider"
              >Portfolio</span
            >
          </div>
          <div class="text-4xl font-extrabold text-neutral-900 mb-1">
            <CountUp :to="totalProjects" />
          </div>
          <div class="text-sm text-neutral-500 font-medium">
            Completed Projects
          </div>
        </div>

        <!-- Stat Card 2: Hours Coded -->
        <div
          class="bg-white p-6 rounded-2xl shadow-xl border border-neutral-100 transform hover:-translate-y-1 transition-transform duration-300"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span
              class="text-xs font-bold text-neutral-400 uppercase tracking-wider"
              >Effort</span
            >
          </div>
          <div class="text-4xl font-extrabold text-neutral-900 mb-1">
            <CountUp :to="totalLinesOfCode" suffix="+" />
          </div>
          <div class="text-sm text-neutral-500 font-medium">Lines of Code</div>
        </div>

        <!-- Stat Card 3: Tech Stack (Bar Chart) -->
        <div
          class="bg-white p-6 rounded-2xl shadow-xl border border-neutral-100 col-span-1 md:col-span-2 lg:col-span-2"
        >
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-neutral-900">Tech Stack Usage</h3>
            <span class="text-xs text-neutral-400 font-medium"
              >Top tools used</span
            >
          </div>

          <div class="space-y-4">
            <div v-for="tech in topTechStack" :key="tech.name" class="group">
              <div class="flex justify-between text-xs font-bold mb-1">
                <span class="text-neutral-700">{{ tech.name }}</span>
                <span class="text-neutral-400">{{ tech.count }} projects</span>
              </div>
              <div
                class="w-full bg-neutral-100 rounded-full h-2 overflow-hidden"
              >
                <div
                  class="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-[2000ms] ease-out group-hover:from-blue-400 group-hover:to-purple-400"
                  :style="{ width: showCharts ? `${tech.percent}%` : '0%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stat Card 4: Categories -->
        <div
          class="bg-white p-6 rounded-2xl shadow-xl border border-neutral-100 md:col-span-2 lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          <div
            v-for="cat in categoryDistribution"
            :key="cat.name"
            class="text-center p-4 bg-neutral-50 rounded-xl"
          >
            <div class="text-2xl font-bold text-neutral-900 mb-1">
              {{ cat.count }}
            </div>
            <div
              class="text-xs font-bold text-neutral-400 uppercase tracking-wider"
            >
              {{ cat.name }}s
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Grid -->
    <section
      ref="projectsSection"
      class="max-w-7xl mx-auto px-6 py-16 lg:py-24"
    >
      <div class="mb-12 text-center lg:text-left">
        <h2 class="text-3xl lg:text-4xl font-bold text-neutral-900 mb-3">
          Projects
        </h2>
        <p class="text-lg text-neutral-600 mb-6">
          Click "Run Project" to launch any experiment
        </p>

        <!-- Search & Filter -->
        <SearchFilter
          :filtered-count="filteredProjects.length"
          @search="handleSearch"
          @filter-category="handleCategoryFilter"
          @filter-difficulty="handleDifficultyFilter"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectCard
          v-for="project in paginatedProjects"
          :key="project.slug"
          :project="project"
          @run="runProject"
        />
      </div>

      <!-- Pagination Controls -->
      <div
        v-if="totalPages > 1"
        class="flex justify-center items-center gap-4 mt-12"
      >
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <span class="text-sm font-medium text-neutral-600">
          Page {{ currentPage }} of {{ totalPages }}
        </span>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <!-- No Results -->
      <div v-if="filteredProjects.length === 0" class="text-center py-12">
        <p class="text-neutral-600 text-lg">
          No projects found. Try adjusting your filters.
        </p>
      </div>
    </section>

    <!-- About / Profile Section -->
    <section
      class="max-w-7xl mx-auto px-6 py-16 lg:py-24 border-t border-neutral-200"
    >
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <!-- Avatar & Visuals -->
        <div class="relative flex justify-center md:justify-end md:pr-12">
          <div class="relative w-64 h-64 lg:w-80 lg:h-80 group">
            <!-- Animate blob background -->
            <div
              class="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 animate-pulse-slow"
            ></div>

            <!-- Image Container -->
            <div
              class="relative w-full h-full rounded-3xl overflow-hidden border-4 border-white shadow-2xl transform rotate-3 transition-transform duration-500 group-hover:rotate-0"
              style="-webkit-mask-image: -webkit-radial-gradient(white, black)"
            >
              <img
                src="/profile.png"
                alt="Leigh James"
                class="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
              />

              <!-- Floating Badge -->
              <div
                class="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg flex items-center gap-2"
              >
                <div
                  class="w-2 h-2 rounded-full bg-green-500 animate-pulse"
                ></div>
                <span class="text-xs font-bold text-neutral-800"
                  >Open to Work</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="space-y-6 text-center md:text-left">
          <div class="space-y-2">
            <h2 class="text-3xl lg:text-4xl font-bold text-neutral-900">
              About Me
            </h2>
            <p class="text-lg text-neutral-600 leading-relaxed">
              I'm a passionate
              <span class="text-blue-600 font-bold">Frontend Developer</span> &
              <span class="text-purple-600 font-bold">QA Enthusiast</span>
              building polished, user-centric web tools.
            </p>
            <p class="text-neutral-500">
              With a focus on Vue.js and modern UI ecosystems, I turn complex
              requirements into clean, interactive experiences. This playground
              serves as a living laboratory for my experiments with algorithms,
              security simulations, and gamified interfaces.
            </p>
          </div>

          <!-- Quick Facts -->
          <div class="grid grid-cols-2 gap-4 pt-4">
            <div class="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
              <div class="text-2xl font-bold text-neutral-900 mb-1">
                2+ Years
              </div>
              <div
                class="text-xs text-neutral-500 font-bold uppercase tracking-wide"
              >
                Experience
              </div>
            </div>
            <div class="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
              <div class="text-2xl font-bold text-neutral-900 mb-1">
                Vue / React
              </div>
              <div
                class="text-xs text-neutral-500 font-bold uppercase tracking-wide"
              >
                Main Stack
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div
            class="pt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <a
              href="/Leigh_James_Resume.pdf"
              download
              class="px-8 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 hover:shadow-lg active:scale-95"
            >
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer
      class="bg-neutral-900 text-neutral-400 py-12 border-t border-neutral-800"
    >
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid md:grid-cols-2 gap-8 items-center mb-12">
          <!-- Brand & Socials -->
          <div class="text-center md:text-left space-y-4">
            <h3 class="text-2xl font-bold text-white">Let's Connect</h3>
            <p class="text-neutral-500 max-w-md mx-auto md:mx-0">
              Open for collaboration, freelance opportunities, or just a
              friendly chat about tech.
            </p>

            <div class="flex justify-center md:justify-start gap-4 pt-2">
              <a
                href="https://github.com/LeiyJames"
                target="_blank"
                class="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 hover:text-white transition-colors"
              >
                <span class="sr-only">GitHub</span>
                <svg
                  class="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/leigh-james-presno-591468333/"
                target="_blank"
                class="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 hover:text-white transition-colors"
              >
                <span class="sr-only">LinkedIn</span>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                  />
                </svg>
              </a>
              <a
                href="mailto:leighpresno114@gmail.com"
                class="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 hover:text-white transition-colors"
              >
                <span class="sr-only">Email</span>
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </a>
            </div>
          </div>

          <!-- Stack Info -->
          <div class="text-center md:text-right">
            <p class="text-sm font-medium text-neutral-500 mb-2">
              Designed & Built with
            </p>
            <div class="flex justify-center md:justify-end gap-3 text-2xl">
              <span
                title="Vue.js"
                class="hover:text-green-500 transition-colors cursor-help"
              >
                <svg
                  class="w-8 h-8"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24.4 3.925H30l-14 24.15L2 3.925h3.634L16 21.909l10.366-17.984h-1.966z"
                    fill="#41B883"
                  />
                  <path
                    d="M16 3.925L2.001 28.075h3.635L16 10.091l10.365 17.984h3.634L16 3.925z"
                    fill="#35495E"
                  />
                </svg>
              </span>
              <span
                title="TypeScript"
                class="hover:text-blue-500 transition-colors cursor-help"
              >
                <svg
                  class="w-8 h-8 rounded-sm"
                  viewBox="0 0 128 128"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.5 64A62.505 62.505 0 0 0 64 126.5a62.505 62.505 0 0 0 62.5-62.5A62.505 62.505 0 0 0 64 1.5 62.505 62.505 0 0 0 1.5 64z"
                    fill="#007acc"
                  />
                  <path
                    d="M56.8 77.5h-4.9V99h-9.5V77.5H37.5v-8h19.2v8zm21.3 22h-8.6c-4.9-.4-7.8-2.6-9-6.9H69c1 8.2 6.6 13.9 16.1 13.9 9.9 0 16-5.8 16-14.4 0-9.8-7-12-12.7-14.1-3.6-1.4-4.8-2.5-4.8-5 0-2.8 2.2-4.5 5.8-4.5 3.9 0 6.1 1.9 6.8 6.4h8.3C93.4 59.8 88 55 79.2 55c-8.8 0-14.7 5.6-14.7 13.7 0 9.1 5.9 12.5 12.8 14.8 4.2 1.4 5.3 2.8 5.3 5.3.1 3-2.6 5.2-6.5 5.2z"
                    fill="#fff"
                  />
                </svg>
              </span>
              <!-- More icons as needed -->
            </div>
          </div>
        </div>

        <div
          class="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm"
        >
          <p>
            © {{ new Date().getFullYear() }} Leigh James. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
    <!-- Back to Top Button -->
    <button
      @click="scrollToTop"
      class="fixed bottom-8 right-8 bg-neutral-900 text-white p-4 rounded-full shadow-2xl transition-all duration-300 z-50 hover:scale-110 hover:bg-black focus:outline-none focus:ring-4 focus:ring-neutral-200"
      :class="
        showBackToTop
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10 pointer-events-none'
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import ProjectCard from "@/components/ProjectCard.vue";
import SearchFilter from "@/components/SearchFilter.vue";
import CountUp from "@/components/CountUp.vue";
import { projects } from "@/data/projects";
import type { ProjectCategory, DifficultyLevel } from "@/types/project";

// --- Hero Logic ---
const typewriterText = ref("");
const typingPhrases = [
  "you can actually use",
  "that solve real problems",
  "with clean code",
  "for the modern web",
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingInterval: number | null = null;

function typeLoop() {
  const currentPhrase = typingPhrases[phraseIndex];

  if (isDeleting) {
    typewriterText.value = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriterText.value = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = 100;

  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    delay = 2000; // Pause at end
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % typingPhrases.length;
    delay = 500;
  } else if (isDeleting) {
    delay = 50;
  }

  typingInterval = window.setTimeout(typeLoop, delay);
}

const projectsSection = ref<HTMLElement | null>(null);

// Custom Smooth Scroll Helper
function smoothScrollTo(targetPosition: number, duration = 800) {
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t: number, b: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

function scrollToProjects() {
  if (projectsSection.value) {
    // Offset for header/padding if needed, currently just top of section
    const top =
      projectsSection.value.getBoundingClientRect().top + window.scrollY;
    smoothScrollTo(top);
  }
}

// --- Back to Top Logic ---
const showBackToTop = ref(false);

function handleScroll() {
  showBackToTop.value = window.scrollY > 500;
}

function scrollToTop() {
  smoothScrollTo(0);
}

// --- Projects Logic ---
const router = useRouter();
const searchQuery = ref("");
const selectedCategory = ref<ProjectCategory | null>(null);
const selectedDifficulty = ref<DifficultyLevel | null>(null);

const filteredProjects = computed(() => {
  const difficultyWeight = {
    Beginner: 0,
    Intermediate: 1,
    Advanced: 2,
  };

  const result = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      project.description
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());
    const matchesCategory =
      selectedCategory.value === null ||
      project.category === selectedCategory.value;
    const matchesDifficulty =
      selectedDifficulty.value === null ||
      project.difficulty === selectedDifficulty.value;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return result.sort((a, b) => {
    return (
      (difficultyWeight[a.difficulty] || 0) -
      (difficultyWeight[b.difficulty] || 0)
    );
  });
});

// --- Pagination Logic ---
const ITEMS_PER_PAGE = 9;
const currentPage = ref(1);

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  return filteredProjects.value.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(filteredProjects.value.length / ITEMS_PER_PAGE),
);

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    scrollToProjects();
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    scrollToProjects();
  }
}

function handleSearch(query: string) {
  searchQuery.value = query;
  currentPage.value = 1;
}

function handleCategoryFilter(category: ProjectCategory | null) {
  selectedCategory.value = category;
  currentPage.value = 1;
}

function handleDifficultyFilter(difficulty: DifficultyLevel | null) {
  selectedDifficulty.value = difficulty;
  currentPage.value = 1;
}

function runProject(slug: string) {
  router.push(`/playground/${slug}`);
}

// --- Stats Logic ---
const totalProjects = computed(() => projects.length);
// Mock estimation: avg 400 loc per project
const totalLinesOfCode = computed(() => projects.length * 450 + 1200);

const categoryDistribution = computed(() => {
  const counts: Record<string, number> = {};
  projects.forEach((p) => {
    // Capitalize first letter
    const name = p.category.charAt(0).toUpperCase() + p.category.slice(1);
    counts[name] = (counts[name] || 0) + 1;
  });
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
});

const topTechStack = computed(() => {
  const counts: Record<string, number> = {};
  projects.forEach((p) => {
    p.techStack.forEach((t) => {
      counts[t] = (counts[t] || 0) + 1;
    });
  });

  // Sort by count desc
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return sorted.map(([name, count]) => ({
    name,
    count,
    percent: (count / projects.length) * 100, // Percent relative to total projects for bar width visual
  }));
});

const showCharts = ref(false);

// --- Lifecycle ---
onMounted(() => {
  typeLoop();
  window.addEventListener("scroll", handleScroll);
  setTimeout(() => {
    showCharts.value = true;
  }, 500);
});

onUnmounted(() => {
  if (typingInterval) clearTimeout(typingInterval);
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.3;
  }
}

.animate-blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.perspective-500 {
  perspective: 500px;
}
</style>
