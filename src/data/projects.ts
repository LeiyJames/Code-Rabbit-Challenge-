import type { Project } from "@/types/project";
import CalculatorProject from "@/projects/CalculatorProject.vue";
import CounterProject from "@/projects/CounterProject.vue";
import LoremIpsumProject from "@/projects/LoremIpsumProject.vue";
import PasswordGeneratorProject from "@/projects/PasswordGeneratorProject.vue";
import FormValidatorProject from "@/projects/FormValidatorProject.vue";
import UnitConverterProject from "@/projects/UnitConverterProject.vue";
import StopwatchTimerProject from "@/projects/StopwatchTimerProject.vue";
import ChartPlaygroundProject from "@/projects/ChartPlaygroundProject.vue";
import BasketballScoreboardProject from "@/projects/BasketballScoreboardProject.vue";
import BugReportGeneratorProject from "@/projects/BugReportGeneratorProject.vue";
import QaRegressionChecklistProject from "@/projects/QaRegressionChecklistProject.vue";
import TestCaseBuilderProject from "@/projects/TestCaseBuilderProject.vue";
import ApiSimulatorProject from "@/projects/ApiSimulatorProject.vue";
import PhishingDetectorProject from "@/projects/PhishingDetectorProject.vue";
import QuizEngineProject from "@/projects/QuizEngineProject.vue";
import SecureVotingProject from "@/projects/SecureVotingProject.vue";
import SocialMessagingProject from "@/projects/SocialMessagingProject.vue";
import WordScrambleProject from "@/projects/WordScrambleProject.vue";

export const projects: Project[] = [
  {
    slug: "word-scramble",
    name: "Word Scramble Game",
    description:
      "Unscramble coding terms against the clock with streak multipliers",
    techStack: ["Vue 3", "Algorithms", "Tailwind", "Game Loop"],
    component: WordScrambleProject,
    category: "game",
    difficulty: "Beginner",
    concepts: [
      "String Manipulation",
      "Game Loop Logic",
      "Input Validation",
      "Scoring Algorithms",
    ],
    whatThisDemonstrates: [
      "Fisher-Yates shuffle algorithm for randomizing letters",
      "Real-time input validation and feedback loops",
      "Managing game states (Idle -> Playing -> Game Over)",
      "Implementing score multipliers based on user streaks",
      "Countdown timer logic with penalty mechanisms",
    ],
    whatILearned: [
      "Building engaging game loops in Vue",
      "Handling keyboard events for better UX",
      "Creating dynamic visual feedback for game actions",
    ],
    codePreview: [
      {
        title: "Shuffle Logic",
        language: "typescript",
        code: `function shuffleString(str: string): string {
  const arr = str.split('')
  // Fisher-Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.join('')
}`,
      },
      {
        title: "Scoring Multiplier",
        language: "typescript",
        code: `const multiplier = computed(() => {
  if (streak.value >= 5) return 3
  if (streak.value >= 2) return 2
  return 1
})

function checkAnswer() {
  if (guess === target) {
    const points = 10 * multiplier.value
    score.value += points
    streak.value++
  } else {
    streak.value = 0 // Reset streak on error
  }
}`,
      },
    ],
  },
  {
    slug: "social-messaging",
    name: "Social Messaging Interface",
    description:
      "Simulated direct messaging experience with real-time state management",
    techStack: ["Vue 3", "LocalStorage", "Tailwind", "Async Timers"],
    component: SocialMessagingProject,
    category: "tool",
    difficulty: "Advanced",
    concepts: [
      "Complex State Management",
      "Asynchronous UX",
      "Event Simulation",
      "Auto-Scrolling",
    ],
    whatThisDemonstrates: [
      "Managing nested state (Conversations -> Messages)",
      "Simulating network events (Sent -> Delivered -> Read -> Typing -> Reply)",
      "Auto-scrolling to bottom on new message insertion",
      "Real-time filtering and sorting of contact lists",
      "Persisting complex chat history to LocalStorage",
    ],
    whatILearned: [
      "Structuring data for chat applications",
      "Handling asynchronous state updates for realistic UX",
      "Implementing polished scroll behaviors",
    ],
    codePreview: [
      {
        title: "Simulation Logic",
        language: "typescript",
        code: `async function sendMessage() {
  // 1. Add user message
  addMessage(receiverId, text, 'me', 'sent')
  
  // 2. Simulate network delay -> Delivered
  setTimeout(() => {
    updateStatus('delivered')
  }, 1000)

  // 3. Simulate Reply Typing
  setTimeout(() => {
    contact.typing = true
    updateStatus('read')
  }, 2000)

  // 4. Receive Reply
  setTimeout(() => {
    contact.typing = false
    addMessage(receiverId, 'Reply...', receiverId, 'sent')
  }, 4000)
}`,
      },
      {
        title: "Sorted Contacts",
        language: "typescript",
        code: `const sortedContacts = computed(() => {
  return [...filteredContacts.value].sort((a, b) => {
    const timeA = conversations.value[a.id]?.lastMessageTime || 0
    const timeB = conversations.value[b.id]?.lastMessageTime || 0
    return timeB - timeA // Most recent first
  })
})`,
      },
    ],
  },
  {
    slug: "secure-voting",
    name: "Secure Voting Interface",
    description:
      "Client-side voting simulation with integrity checks and visualization",
    techStack: ["Vue 3", "LocalStorage", "Tailwind", "Intl API"],
    component: SecureVotingProject,
    category: "tool",
    difficulty: "Advanced",
    concepts: [
      "Data Persistence",
      "Optimistic UI",
      "State Visualization",
      "Time Constraints",
    ],
    whatThisDemonstrates: [
      "Client-side integrity checks using LocalStorage",
      "Real-time countdown logic for deadline-based actions",
      "Visualizing datasets with animated percentage bars",
      "Handling multiple active states (polls) simultaneously",
      "Optimistic UI updates for instant feedback before persistence",
    ],
    whatILearned: [
      "Designing secure-feeling UX without a backend",
      "Managing complex list/detail views in a single component",
      "Implementing share capabilities with navigator.share",
    ],
    codePreview: [
      {
        title: "Integrity Logic",
        language: "typescript",
        code: `const hasVotedCurrent = computed(() => {
  if (!selectedPollId.value) return false
  return !!userVotes.value[selectedPollId.value]
})

function submitVote() {
  if (hasVotedCurrent.value || isPollClosed.value) return
  
  // Persist strict vote record
  userVotes.value = { ...userVotes.value, [poll.id]: selectedOption.value! }
  localStorage.setItem('secure-voting-history', JSON.stringify(userVotes.value))
}`,
      },
      {
        title: "Dynamic Results",
        language: "typescript",
        code: `const activePollResults = computed(() => {
  const total = poll.options.reduce((sum, opt) => sum + opt.votes, 0)
  
  return poll.options.map(opt => {
    const isWinner = Math.max(...poll.options.map(o => o.votes)) === opt.votes
    const percent = Math.round((opt.votes / total) * 100)
    
    return { ...opt, percent, isWinner }
  }).sort((a, b) => b.votes - a.votes)
})`,
      },
    ],
  },
  {
    slug: "quiz-engine",
    name: "Interactive Quiz Engine",
    description: "Test your knowledge with timed quizzes and instant feedback",
    techStack: ["Vue 3", "TypeScript", "Tailwind", "Web Share API"],
    component: QuizEngineProject,
    category: "game",
    difficulty: "Intermediate",
    concepts: [
      "State Management",
      "Array Handling",
      "Timer Logic",
      "Web Share API",
    ],
    whatThisDemonstrates: [
      "Managing complex quiz state (questions, answers, scoring)",
      "Real-time timer implementation with performance.now()",
      "Computed properties for dynamic scoring and progress tracking",
      "Mobile-first responsive design with touch-friendly targets",
      "Web Share API integration for social sharing",
    ],
    whatILearned: [
      "Structuring data for quiz applications",
      "Implementing timed workflows",
      "Handling browser share capabilities",
    ],
    codePreview: [
      {
        title: "Quiz State",
        language: "typescript",
        code: `const currentScreen = ref<Screen>('selection')
const selectedQuiz = ref<Quiz | null>(null)
const currentQuestionIndex = ref(0)
const answers = ref<number[]>([])
const startTime = ref(0)
const endTime = ref(0)`,
      },
      {
        title: "Scoring Logic",
        language: "typescript",
        code: `const results = computed(() => {
  if (!selectedQuiz.value) return { correct: 0, total: 0, percentage: 0, passed: false }
  
  let correct = 0
  answers.value.forEach((answer, index) => {
    if (answer === selectedQuiz.value!.questions[index].correctAnswer) {
      correct++
    }
  })
  
  const percentage = Math.round((correct / selectedQuiz.value.questions.length) * 100)
  return { 
    correct, 
    percentage, 
    passed: percentage >= selectedQuiz.value.passingScore 
  }
})`,
      },
      {
        title: "Web Share API",
        language: "typescript",
        code: `async function shareResults() {
  const text = \`I scored \${results.value.correct}/\${results.value.total} on \${selectedQuiz.value.title}!\`
  
  if (navigator.share) {
    await navigator.share({
      title: 'Quiz Results',
      text: text,
    })
  } else {
    // Fallback copy to clipboard
    await navigator.clipboard.writeText(text)
  }
}`,
      },
    ],
  },
  {
    slug: "calculator",
    name: "Calculator",
    description:
      "A fully functional calculator with basic arithmetic operations",
    techStack: ["Vue 3", "TypeScript", "Tailwind"],
    component: CalculatorProject,
    category: "calculator",
    difficulty: "Intermediate",
    concepts: [
      "State Management",
      "Event Handling",
      "Computed Properties",
      "UI Feedback",
    ],
    whatThisDemonstrates: [
      "Complex state management with multiple refs working together",
      "Proper handling of calculator edge cases (division by zero, decimal points)",
      "Clean separation between display state and operation state",
      "Responsive grid layout with consistent button sizing",
      "Visual feedback for user interactions with hover and active states",
    ],
    whatILearned: [
      "State management with Vue 3 refs",
      "Handling complex user interactions",
      "Building responsive grid layouts",
      "Implementing calculator logic and edge cases",
    ],
    codePreview: [
      {
        title: "State Management",
        language: "typescript",
        code: `const currentValue = ref('0')
const previousValue = ref('')
const operator = ref('')
const waitingForOperand = ref(false)

const display = computed(() => currentValue.value)`,
      },
      {
        title: "Calculator Logic",
        language: "typescript",
        code: `function calculate() {
  if (!operator.value || !previousValue.value) return
  
  const prev = parseFloat(previousValue.value)
  const current = parseFloat(currentValue.value)
  let result = 0
  
  switch (operator.value) {
    case '+': result = prev + current; break
    case '-': result = prev - current; break
    case '*': result = prev * current; break
    case '/': result = prev / current; break
  }
  
  currentValue.value = String(result)
}`,
      },
      {
        title: "Tailwind Styling",
        language: "tailwind",
        code: `<!-- Display -->
<div class="bg-neutral-900 text-white text-right p-6 rounded-xl">
  <div class="text-4xl font-bold font-mono">{{ display }}</div>
</div>

<!-- Button Grid -->
<div class="grid grid-cols-4 gap-3">
  <button class="h-16 rounded-xl font-semibold
                 bg-primary-500 text-white
                 hover:bg-primary-600
                 transition-all hover:scale-105">
  </button>
</div>`,
      },
    ],
  },
  {
    slug: "counter",
    name: "Counter",
    description:
      "Simple counter with increment, decrement, and reset functionality",
    techStack: ["Vue 3", "TypeScript", "Tailwind"],
    component: CounterProject,
    category: "utility",
    difficulty: "Beginner",
    concepts: ["Reactive State", "Event Handlers", "UI Design", "Transitions"],
    whatThisDemonstrates: [
      "Vue 3 Composition API fundamentals with ref() for reactive state",
      "Clean function composition pattern for reusable increment/decrement logic",
      "Intuitive UI with visual feedback using Tailwind utility classes",
      "Accessibility with proper button semantics and keyboard support",
      "Gradient text effects and modern design patterns",
    ],
    whatILearned: [
      "Vue 3 Composition API basics",
      "Reactive state with ref()",
      "Function composition patterns",
      "Clean UI design with Tailwind",
    ],
    codePreview: [
      {
        title: "Component Logic",
        language: "typescript",
        code: `const count = ref(0)

const increment = () => count.value++
const decrement = () => count.value--
const reset = () => count.value = 0
const incrementByTen = () => count.value += 10
const decrementByTen = () => count.value -= 10`,
      },
      {
        title: "Tailwind Styling",
        language: "tailwind",
        code: `<!-- Display -->
<div class="text-8xl font-bold text-gradient font-mono">
  {{ count }}
</div>

<!-- Buttons -->
<button class="flex-1 h-14 
               bg-green-500 text-white 
               rounded-xl font-semibold
               hover:bg-green-600 hover:scale-105
               active:scale-95 transition-all">
  +
</button>`,
      },
      {
        title: "Custom CSS",
        language: "css",
        code: `.text-gradient {
  @apply bg-gradient-to-r from-primary-600 to-primary-400 
         bg-clip-text text-transparent;
}`,
      },
    ],
  },
  {
    slug: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text for your design mockups",
    techStack: ["Vue 3", "TypeScript", "Tailwind"],
    component: LoremIpsumProject,
    category: "generator",
    difficulty: "Intermediate",
    concepts: [
      "Algorithms",
      "Browser APIs",
      "Form Controls",
      "State Management",
    ],
    whatThisDemonstrates: [
      "Text generation algorithm with randomized sentence construction",
      "Modern Clipboard API integration with async/await error handling",
      "Dynamic content generation based on user-selected parameters",
      "Range input control with reactive two-way binding",
      "User feedback patterns (copy confirmation, visual state changes)",
    ],
    whatILearned: [
      "Text generation algorithms",
      "Clipboard API integration",
      "Dynamic content generation",
      "Range slider controls in Vue",
    ],
    codePreview: [
      {
        title: "Text Generation",
        language: "typescript",
        code: `function generateParagraph(): string {
  const sentences = []
  const numSentences = Math.floor(Math.random() * 4) + 3
  
  for (let i = 0; i < numSentences; i++) {
    sentences.push(generateSentence())
  }
  return sentences.join(' ')
}

function generateSentence(): string {
  const length = Math.floor(Math.random() * 10) + 5
  const sentence = generateWords(length)
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
}`,
      },
      {
        title: "Clipboard API",
        language: "typescript",
        code: `async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}`,
      },
      {
        title: "Tailwind Styling",
        language: "tailwind",
        code: `<!-- Range Slider -->
<input v-model.number="count" type="range" 
       min="1" max="10"
       class="w-full h-2 bg-neutral-200 rounded-lg
              appearance-none cursor-pointer
              accent-primary-500" />

<!-- Output Area -->
<div class="bg-neutral-50 rounded-xl p-6 
            min-h-[200px] max-h-[400px] 
            overflow-y-auto">
  <p class="text-neutral-700 leading-relaxed 
            whitespace-pre-wrap">
    {{ output }}
  </p>
</div>`,
      },
    ],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    description: "Create secure passwords with customizable options",
    techStack: ["Vue 3", "TypeScript", "Tailwind"],
    component: PasswordGeneratorProject,
    category: "generator",
    difficulty: "Advanced",
    concepts: [
      "Security",
      "Validation",
      "Computed Properties",
      "UX Feedback",
      "Cryptography",
    ],
    whatThisDemonstrates: [
      "Secure random password generation using Math.random() with proper character sets",
      "Real-time password strength calculation with computed properties",
      "Form validation ensuring at least one character type is selected",
      "Visual strength indicator with dynamic color coding and progress bar",
      "User-friendly security features with clear feedback and copy functionality",
      "Regex pattern matching for character type detection",
    ],
    whatILearned: [
      "Security best practices for password generation",
      "Computed properties for reactive strength calculation",
      "Form controls and validation",
      "User-friendly security features",
    ],
    codePreview: [
      {
        title: "Password Generation",
        language: "typescript",
        code: `function generatePassword() {
  let charset = ''
  
  if (includeUppercase.value) charset += uppercase
  if (includeLowercase.value) charset += lowercase
  if (includeNumbers.value) charset += numbers
  if (includeSymbols.value) charset += symbols
  
  let result = ''
  const charsetLength = charset.length
  
  for (let i = 0; i < length.value; i++) {
    const randomIndex = Math.floor(Math.random() * charsetLength)
    result += charset[randomIndex]
  }
  
  password.value = result
}`,
      },
      {
        title: "Strength Calculation",
        language: "typescript",
        code: `const strength = computed(() => {
  if (!password.value) return 'None'
  
  const len = password.value.length
  const hasUpper = /[A-Z]/.test(password.value)
  const hasLower = /[a-z]/.test(password.value)
  const hasNum = /[0-9]/.test(password.value)
  const hasSym = /[!@#$%^&*()]/.test(password.value)
  
  const varietyCount = [hasUpper, hasLower, hasNum, hasSym]
    .filter(Boolean).length
  
  if (len < 8 || varietyCount < 2) return 'Weak'
  if (len < 12 || varietyCount < 3) return 'Medium'
  if (len >= 16 && varietyCount >= 3) return 'Strong'
  return 'Medium'
})`,
      },
      {
        title: "Tailwind Styling",
        language: "tailwind",
        code: `<!-- Strength Indicator -->
<div class="h-2 bg-neutral-200 rounded-full overflow-hidden">
  <div :class="[strengthColor, 'h-full transition-all duration-300']"
       :style="{ width: strengthPercentage + '%' }">
  </div>
</div>

<!-- Checkboxes -->
<label class="flex items-center gap-3 cursor-pointer">
  <input v-model="includeUppercase" type="checkbox"
         class="w-5 h-5 text-primary-500 rounded
                focus:ring-2 focus:ring-primary-500" />
  <span class="text-neutral-700 font-medium">
    Uppercase Letters (A-Z)
  </span>
</label>`,
      },
    ],
  },
  {
    slug: "form-validator",
    name: "Form Validator Playground",
    description:
      "Interactive form with comprehensive validation, error handling, and UX feedback",
    techStack: ["Vue 3", "TypeScript", "Tailwind"],
    component: FormValidatorProject,
    category: "utility",
    difficulty: "Advanced",
    concepts: [
      "Input Validation",
      "Error Handling",
      "UX Feedback",
      "Form State",
      "Edge Cases",
    ],
    whatThisDemonstrates: [
      "Comprehensive input validation with multiple rules per field",
      "Inline error messages with clear, actionable feedback",
      "Real-time validation on blur with immediate visual feedback",
      "Password strength checking with granular requirement display",
      "Disabled submit button state until all validations pass",
      "Edge case handling (empty values, mismatched passwords, invalid formats)",
      "QA mindset with attention to user behavior and error scenarios",
      "Success/error state management with animated feedback",
    ],
    whatILearned: [
      "Form validation patterns and best practices",
      "UX feedback loops with visual indicators",
      "Regex patterns for email and password validation",
      "Reactive form state management with Vue",
      "Error handling and user-friendly messaging",
    ],
    codePreview: [
      {
        title: "Validation Logic",
        language: "typescript",
        code: `function validateField(field: keyof typeof formData) {
  touched[field] = true
  
  switch (field) {
    case 'email':
      if (!formData.email) {
        errors.email = 'Email is required'
      } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address'
      } else {
        errors.email = ''
      }
      break
      
    case 'password':
      if (!passwordChecks.value.length) {
        errors.password = 'Password must be at least 8 characters'
      } else if (!passwordChecks.value.uppercase) {
        errors.password = 'Must contain uppercase letter'
      }
      // ... more checks
      break
  }
}`,
      },
      {
        title: "Password Requirements",
        language: "typescript",
        code: `const passwordChecks = computed(() => ({
  length: formData.password.length >= 8,
  uppercase: /[A-Z]/.test(formData.password),
  number: /[0-9]/.test(formData.password),
  special: /[!@#$%^&*]/.test(formData.password)
}))

const isFormValid = computed(() => {
  return formData.username &&
         formData.email &&
         formData.password &&
         formData.acceptTerms &&
         !errors.username &&
         !errors.email &&
         !errors.password
})`,
      },
      {
        title: "Dynamic Styling",
        language: "tailwind",
        code: `<input
  :class="[
    'w-full px-4 py-3 rounded-lg border-2',
    errors.email
      ? 'border-red-500 focus:ring-red-200'
      : touched.email && !errors.email
      ? 'border-green-500 focus:ring-green-200'
      : 'border-neutral-300 focus:ring-primary-200'
  ]"
/>

<!-- Error Message -->
<p v-if="errors.email" class="text-red-600">
  {{ errors.email }}
</p>

<!-- Success Message -->
<p v-else-if="touched.email" class="text-green-600">
  Valid email format
</p>`,
      },
    ],
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    description:
      "Convert between common units of length, weight, and temperature",
    techStack: ["Vue 3", "TypeScript", "Tailwind"],
    component: UnitConverterProject,
    category: "utility",
    difficulty: "Intermediate",
    concepts: [
      "Computed Properties",
      "Watchers",
      "Reactive State",
      "Math Logic",
    ],
    whatThisDemonstrates: [
      "Real-time conversion using computed properties",
      "Dynamic unit swapping and category processing",
      "Clean UI with conditional rendering and active states",
      "Complex logic encapsulation for unit conversion formulas",
      "Responsive design with Tailwind CSS",
    ],
    whatILearned: [
      "Handling multiple conversion categories",
      "Managing derived state with computed",
      "Watch effects for resetting state on category change",
      "Formatting floating point numbers for UI",
    ],
    codePreview: [
      {
        title: "Conversion Logic",
        language: "typescript",
        code: `function convert(val: number, from: string, to: string, type: string): number {
  if (from === to) return val

  if (type === 'length') {
    let meters = val
    if (from === 'cm') meters = val / 100
    if (from === 'km') meters = val * 1000
    
    if (to === 'cm') return meters * 100
    if (to === 'm') return meters
    if (to === 'km') return meters / 1000
  }
  // ... other types
  return val
}`,
      },
      {
        title: "State & Watcher",
        language: "typescript",
        code: `const currentCategory = ref('length')
const fromUnit = ref('cm')
const toUnit = ref('m')

// Watch category change to reset units
watch(currentCategory, (newCat) => {
  const catUnits = units[newCat]
  fromUnit.value = catUnits[0].value
  toUnit.value = catUnits[1].value
  handleInput()
})`,
      },
      {
        title: "Formatted Formula",
        language: "typescript",
        code: `const formatFormula = computed(() => {
   if (currentCategory.value === 'temp') {
     // Special formula logic
       if (fromUnit.value === 'c') return \`(\${val}°C × 9/5) + 32 = \${result.value}°F\`
   }
   return \`\${val} \${fromUnit.value} = \${result.value} \${toUnit.value}\`
})`,
      },
    ],
  },
  {
    slug: "stopwatch-timer",
    name: "Stopwatch & Timer",
    description: "Precision timing tools with countdown and lap capabilities",
    techStack: ["Vue 3", "TypeScript", "Tailwind", "SVG"],
    component: StopwatchTimerProject,
    category: "utility",
    difficulty: "Intermediate",
    concepts: [
      "Performance API",
      "requestAnimationFrame",
      "SVG Animations",
      "State Management",
    ],
    whatThisDemonstrates: [
      "High-precision timing using performance.now() to prevent drift",
      "Smooth UI updates with requestAnimationFrame instead of setInterval",
      "SVG dash-offset animation for circular progress indicators",
      "Complex dual-mode state management (Stopwatch vs Timer)",
      "Backdrop blur and modern dark UI aesthetics",
    ],
    whatILearned: [
      "The difference between Date.now() and performance.now()",
      "Creating performant animation loops",
      "Controlling SVG strokes with CSS and JS",
      "Managing complex component states",
    ],
    codePreview: [
      {
        title: "Precision Loop",
        language: "typescript",
        code: `function animate() {
  const now = performance.now()
  const delta = now - lastFrameTime.value
  lastFrameTime.value = now

  if (currentMode.value === 'stopwatch') {
    accumulatedTime.value += delta
  } else {
    timerRemaining.value -= delta
    if (timerRemaining.value <= 0) finishTimer()
  }

  if (isRunning.value) {
    animationFrameId.value = requestAnimationFrame(animate)
  }
}`,
      },
      {
        title: "SVG Ring Animation",
        language: "typescript",
        code: `const dashOffset = computed(() => {
  if (currentMode.value !== 'timer') return 0
  const progress = currentTimeValue.value / timerDuration.value
  return circumference * (1 - progress)
})

// CSS classes used:
// transition-[stroke-dashoffset] duration-300 ease-linear`,
      },
      {
        title: "Formatted Display",
        language: "typescript",
        code: `const formattedTime = computed(() => {
  const ms = currentTimeValue.value
  const totalSeconds = Math.floor(ms / 1000)
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  // Pad with leading zeros
  return \`\${pad(m)}:\${pad(s)}\`
})`,
      },
    ],
  },
  {
    slug: "chart-playground",
    name: "Chart Playground",
    description: "Interactive data visualization using pure SVG and Vue",
    techStack: ["Vue 3", "TypeScript", "SVG", "Tailwind"],
    component: ChartPlaygroundProject,
    category: "creative",
    difficulty: "Advanced",
    concepts: [
      "SVG Paths",
      "Data Visualization",
      "Computed Scaling",
      "Math Logic",
    ],
    whatThisDemonstrates: [
      "Building charts from scratch without heavy libraries",
      "Complex SVG path generation using computed properties",
      "Data normalization and coordinate mapping",
      "Smooth CSS transitions for SVG elements (bars and paths)",
      "Interactive tooltips and hover states using coordinate overlays",
    ],
    whatILearned: [
      "How to map data values to SVG coordinate space",
      "Creating smooth area charts with path commands",
      "Handling responsiveness with SVG viewBox and preserveAspectRatio",
      "Optimizing render performance for data viz",
    ],
    codePreview: [
      {
        title: "Line Path Generation",
        language: "typescript",
        code: `const linePath = computed(() => {
  const points = normalizedData.value.map((d, i) => {
    const x = i * (100 / (dataCount - 1))
    const y = 100 - d.percent
    return \`\${x},\${y}\`
  })
  return \`M \${points.join(' L ')}\`
})`,
      },
      {
        title: "Data Normalization",
        language: "typescript",
        code: `const normalizedData = computed(() => {
  const max = Math.max(...data.value.map(d => d.value)) * 1.2
  return data.value.map(d => ({
    ...d,
    percent: (d.value / max) * 100
  }))
})`,
      },
      {
        title: "SVG Bar Render",
        language: "tailwind",
        code: `<rect
  v-for="(point, index) in normalizedData"
  :x="index * (100 / dataCount)"
  :y="100 - point.percent"
  :width="(100 / dataCount) * 0.7"
  :height="point.percent"
  class="transition-all duration-500"
/>`,
      },
    ],
  },
  {
    slug: "basketball-scoreboard",
    name: "Basketball Scoreboard",
    description:
      "Digital scoreboard with real-time game controls and shot clock",
    techStack: ["Vue 3", "TypeScript", "Tailwind", "CSS Animations"],
    component: BasketballScoreboardProject,
    category: "game",
    difficulty: "Intermediate",
    concepts: [
      "Game State Management",
      "Keyboard Events",
      "CSS Keyframes",
      "Timer Logic",
    ],
    whatThisDemonstrates: [
      "Managing complex game state (teams, scores, clocks, periods)",
      "Handling keyboard interaction for rapid data entry",
      "CSS animations for visual feedback on score changes",
      "Interval-based timer logic for shot clock implementation",
      "Conditional styling for leading team highlighting",
    ],
    whatILearned: [
      "Event delegation and preventing default behavior for keyboard shortcuts",
      "Using CSS keyframes for performant micro-interactions",
      "Structuring component state for game applications",
    ],
    codePreview: [
      {
        title: "Score Logic",
        language: "typescript",
        code: `function score(team: 'home' | 'guest', points: number) {
  teams.value[team].score += points
}

const leadingTeam = computed(() => {
  if (teams.value.home.score > teams.value.guest.score) return 'home'
  if (teams.value.guest.score > teams.value.home.score) return 'guest'
  return null
})`,
      },
      {
        title: "Shot Clock Timer",
        language: "typescript",
        code: `function startShotClock() {
  if (timerInterval) return
  isShotClockRunning.value = true
  timerInterval = window.setInterval(() => {
    if (shotClock.value > 0) {
      shotClock.value--
    } else {
      pauseShotClock()
    }
  }, 1000)
}`,
      },
      {
        title: "Keyboard Controls",
        language: "typescript",
        code: `function handleKeydown(e: KeyboardEvent) {
  if ((e.target as HTMLElement).tagName === 'INPUT') return

  switch(e.key) {
    case '1': score('home', 1); break;
    case '!': score('guest', 1); break; // Shift + 1
    case ' ': toggleShotClock(); break;
  }
}`,
      },
    ],
  },
  {
    slug: "bug-report-generator",
    name: "Bug Report Generator",
    description:
      "Standardize your QA process with this markdown report generator",
    techStack: ["Vue 3", "TypeScript", "Tailwind", "Clipboard API"],
    component: BugReportGeneratorProject,
    category: "tool",
    difficulty: "Intermediate",
    concepts: [
      "Form Handling",
      "Reactive State",
      "String Manipulation",
      "Clipboard Integration",
    ],
    whatThisDemonstrates: [
      "Two-way data binding with complex nested objects/arrays",
      "Real-time markdown generation using computed properties",
      "Dynamic form fields (add/remove steps)",
      "Clipboard API integration with user feedback",
      "Split-pane layout for immediate visual verification",
    ],
    whatILearned: [
      "Handling dynamic arrays in reactive forms",
      "Designing useful productivity tools with Vue",
      "Formatting strings template literals for export",
    ],
    codePreview: [
      {
        title: "Markdown Computation",
        language: "typescript",
        code: `const reportMarkdown = computed(() => {
  const stepsList = form.steps
    .filter(s => s.trim())
    .map((s, i) => \`\${i + 1}. \${s}\`)
    .join('\\n')

  return \`### \${form.severity}: \${form.title}

**Steps to Reproduce**
\${stepsList}

**Expected Result**
\${form.expected}\`
})`,
      },
      {
        title: "Dynamic Form Array",
        language: "typescript",
        code: `function addStep() {
  form.steps.push('')
}

function removeStep(index: number) {
  if (form.steps.length > 1) {
    form.steps.splice(index, 1)
  }
}`,
      },
    ],
  },
  {
    slug: "test-case-builder",
    name: "Test Case Builder",
    description: "Design, organize, and export structured test case suites",
    techStack: ["Vue 3", "TypeScript", "Tailwind", "File API"],
    component: TestCaseBuilderProject,
    category: "tool",
    difficulty: "Intermediate",
    concepts: [
      "CRUD Operations",
      "File Export",
      "Master-Detail UI",
      "Complex State",
    ],
    whatThisDemonstrates: [
      "Building a Master-Detail interface for managing complex lists",
      "Implementing full CRUD (Create, Read, Update, Delete) in memory",
      "Generating and downloading JSON files dynamically from client-side data",
      "Formatting complex nested data for clipboard export",
      "Managing reactive state for a multi-field editor",
    ],
    whatILearned: [
      "Creating downloadable files using the DOM anchor element trick",
      "Structuring data for test management applications",
      "Handling deep reactivity in Vue 3 with nested arrays",
    ],
    codePreview: [
      {
        title: "JSON Export Logic",
        language: "typescript",
        code: `function exportJSON() {
  const dataStr = "data:text/json;charset=utf-8," + 
    encodeURIComponent(JSON.stringify(testCases.value, null, 2))
  const node = document.createElement('a')
  node.setAttribute("href", dataStr)
  node.setAttribute("download", "test_cases.json")
  document.body.appendChild(node)
  node.click()
  node.remove()
}`,
      },
      {
        title: "Text Summary Generation",
        language: "typescript",
        code: `function copyTextSummary() {
  const text = testCases.value.map(tc => {
    return \`[\${tc.id}] \${tc.title} (\${tc.status.toUpperCase()})
Pre: \${tc.preConditions}
Steps:
\${tc.steps.map((s, i) => \`  \${i+1}. \${s}\`).join('\\n')}
Expected: \${tc.expectedResult}\`
  }).join('\\n\\n')
  // ... clipboard write
}`,
      },
    ],
  },
  {
    slug: "api-simulator",
    name: "API Request Simulator",
    description:
      "Mock REST API client to simulate latency, errors, and JSON responses",
    techStack: ["Vue 3", "TypeScript", "Tailwind", "Async/Await"],
    component: ApiSimulatorProject,
    category: "tool",
    difficulty: "Intermediate",
    concepts: [
      "Asynchronous Operations",
      "State Management",
      "JSON Parsing",
      "Conditional Rendering",
    ],
    whatThisDemonstrates: [
      "Simulating network latency using setTimeout and Promises",
      "Handling different HTTP methods (GET, POST, etc.) in a frontend mock",
      "Parsing and validating user-inputted JSON",
      "Managing complex loading, success, and error UI states",
      "Building a developer-tool interface with dark mode styling",
    ],
    whatILearned: [
      "Designing technical dashboards with high information density",
      "Mocking backend logic on the client side for prototyping",
      "Visualizing API response metadata (status codes, timing, size)",
    ],
    codePreview: [
      {
        title: "Simulation Logic",
        language: "typescript",
        code: `function sendRequest() {
  isLoading.value = true
  const startTime = performance.now()

  setTimeout(() => {
    // ... logic to prepare data ...
    
    // Simulate Error switch
    if (settings.value.simulateError) {
       response.value = { status: 500, error: "Internal Server Error" }
       return
    }

    const duration = Math.round(performance.now() - startTime)
    response.value = {
      status: 200,
      time: duration,
      data: mockData
    }
  }, settings.value.delay)
}`,
      },
      {
        title: "Dynamic Method Styling",
        language: "typescript",
        code: `const methodColor = computed(() => {
  switch(method.value) {
    case 'GET': return 'text-purple-400'
    case 'POST': return 'text-green-400'
    case 'DELETE': return 'text-red-400'
    default: return 'text-slate-200'
  }
})`,
      },
    ],
  },
  {
    slug: "phishing-detector",
    name: "Phishing Detection Simulator",
    description:
      "Educational tool to train users in identifying security threats in emails, SMS, and websites",
    techStack: ["Vue 3", "TypeScript", "Tailwind", "HTML Rendering"],
    component: PhishingDetectorProject,
    category: "education",
    difficulty: "Beginner",
    concepts: [
      "Security Awareness",
      "Conditional Logic",
      "Interactive Learning",
      "String Manipulation",
    ],
    whatThisDemonstrates: [
      "Gamified learning experience with immediate feedback loops",
      "Rendering safe HTML content dynamically across multiple view modes (Email, SMS, Chat, Browser)",
      "Complex state management for quiz/progress tracking",
      "Visualizing security concepts (Red Flags) in a user-friendly way",
    ],
    whatILearned: [
      "Structuring educational content for engagement",
      "Simulating real-world software (Email Client, Phone OS, Browser) boundaries",
      "Handling HTML injection safely in Vue",
    ],
    codePreview: [
      {
        title: "Scenario Data Structure",
        language: "typescript",
        code: `interface Scenario {
  id: string
  type: 'email' | 'sms' | 'chat' | 'url'
  senderHandle: string  // Email, Phone, or URL
  content: string       // HTML payload
  isPhishing: boolean
  flags: string[]       // Educational indicators
  verdict: boolean | null
}`,
      },
    ],
  },
  {
    slug: "qa-regression-checklist",
    name: "QA Test Flow",
    description:
      "Orchestrate regression testing with precision. Manage priorities, track real-time coverage, and visualize project health.",
    techStack: [
      "Vue 3",
      "TypeScript",
      "LocalStorage",
      "Priority Logic",
      "Analytics",
    ],
    component: QaRegressionChecklistProject,
    category: "tool",
    difficulty: "Intermediate",
    concepts: [
      "Regression Testing",
      "Test Flow Management",
      "Data Visualization",
      "Priority Logic",
      "Bulk Actions",
    ],
    whatThisDemonstrates: [
      "A practical QA workflow tool: track per-module coverage and bug notes",
      "Local-first persistence for quick iteration without a backend",
      "Exporting structured data to spreadsheet-friendly CSV",
      "Search + filters for large regression suites",
      "Mobile-friendly touch targets (min 44px) and fast editing",
    ],
    codePreview: [
      {
        title: "LocalStorage Persistence",
        language: "typescript",
        code: `const STORAGE_KEY = 'qa-regression-checklist-v1'

function persist(state: unknown) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function load(): unknown | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : null
}`,
      },
      {
        title: "CSV Export",
        language: "typescript",
        code: `function csvEscape(value: unknown): string {
  const str = String(value ?? '')
  const needsQuotes = /[",\\n\\r]/.test(str)
  const escaped = str.replace(/"/g, '""')
  return needsQuotes ? \`"\${escaped}"\` : escaped
}

function exportCSV(headers: string[], rows: unknown[][]) {
  const lines = [
    headers.map(csvEscape).join(','),
    ...rows.map(r => r.map(csvEscape).join(',')),
  ]
  const blob = new Blob(['\\uFEFF' + lines.join('\\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'qa_checklist.csv'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}`,
      },
      {
        title: "Touch-Friendly Table UI",
        language: "tailwind",
        code: `<!-- Inputs with minimum touch target -->
<input class="min-h-[44px] px-3 py-2 rounded-lg border" />
<select class="min-h-[44px] px-3 py-2 rounded-lg border" />`,
      },
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
