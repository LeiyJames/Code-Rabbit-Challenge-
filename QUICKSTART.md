# 🚀 Quick Start Guide

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**

## Installation

1. **Navigate to project directory:**
```bash
cd CodeRabbit
```

2. **Install dependencies:**
```bash
npm install
```

## Development

**Start the development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build for Production

**Create production build:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

## Project Structure

```
CodeRabbit/
├── src/
│   ├── assets/           # Static assets
│   ├── components/       # Reusable UI components
│   │   ├── ProjectCard.vue
│   │   └── TechBadge.vue
│   ├── data/             # Data/configuration files
│   │   └── projects.ts   # Projects registry
│   ├── projects/         # Individual project implementations
│   │   ├── CalculatorProject.vue
│   │   ├── CounterProject.vue
│   │   ├── LoremIpsumProject.vue
│   │   └── PasswordGeneratorProject.vue
│   ├── router/           # Vue Router configuration
│   │   └── index.ts
│   ├── types/            # TypeScript type definitions
│   │   └── project.ts
│   ├── views/            # Page components
│   │   ├── HomePage.vue
│   │   └── PlaygroundPage.vue
│   ├── App.vue           # Root component
│   ├── main.ts           # Application entry
│   └── style.css         # Global styles
├── public/               # Public static files
├── index.html            # HTML entry point
├── package.json          # Dependencies
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
└── tsconfig.json         # TypeScript configuration
```

## Adding a New Project

1. **Create project component** in `src/projects/`:

```vue
<!-- src/projects/YourProject.vue -->
<template>
  <div class="w-full max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6">Your Project</h2>
    <!-- Your project UI here -->
  </div>
</template>

<script setup lang="ts">
// Your logic here
</script>
```

2. **Register in projects registry** (`src/data/projects.ts`):

```typescript
import YourProject from '@/projects/YourProject.vue'

export const projects: Project[] = [
  // ... existing projects
  {
    slug: 'your-project',
    name: 'Your Project',
    description: 'Description of your project',
    techStack: ['Vue 3', 'TypeScript', 'Tailwind'],
    component: YourProject
  }
]
```

3. **Done!** Your project will automatically appear on the homepage.

## Customization

### Change Theme Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### Modify Homepage Content

Edit `src/views/HomePage.vue` to change hero text, layout, etc.

### Update Projects

Edit individual project files in `src/projects/` to modify functionality.

## Need Help?

- Check `README.md` for detailed documentation
- See `DEPLOYMENT.md` for deployment instructions
- Review Vue 3 docs: [vuejs.org](https://vuejs.org)
- Review Tailwind docs: [tailwindcss.com](https://tailwindcss.com)
