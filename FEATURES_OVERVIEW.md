# 🎯 Dev Playground - Features Overview

Quick reference for all features and capabilities.

---

## 🏠 Homepage Features

### Search & Discovery
- **Search Bar** - Filter projects by name/description
- **Category Filters** - utility, calculator, generator, tool, game
- **Results Counter** - Shows number of filtered projects
- **No Results Message** - Helpful feedback when nothing matches

### Project Cards
- **Category Badge** - Color-coded tag for each project
- **Tech Stack Badges** - Vue 3, TypeScript, Tailwind
- **Description** - Clear project purpose
- **Run Button** - One-click project launch
- **Hover Effects** - Smooth scale animations

---

## 🎮 Playground Features

### Header Controls
| Button | Shortcut | Action |
|--------|----------|--------|
| Back | `Esc` | Return to homepage |
| Show Code | `C` | Toggle code preview |
| Reset | `R` | Reset project state |
| Fullscreen | `F` | Toggle fullscreen mode |

### Code Preview
- **Syntax Highlighting** - Green on dark background
- **Copy Button** - One-click clipboard copy
- **Key Logic Display** - Shows implementation snippets
- **Toggle On/Off** - Show/hide as needed

### Fullscreen Mode
- **Immersive View** - Uses full viewport
- **Minimal Chrome** - Only essential UI
- **Exit Button** - Clear exit path
- **Keyboard Exit** - Press `Esc` to exit

### Reset Functionality
- **Instant Reset** - No page reload
- **Fresh State** - Component remounts
- **Keyboard Shortcut** - Press `R`
- **Orange Button** - Visual distinction

### Error Handling
- **Error Boundary** - Catches runtime errors
- **Friendly Message** - User-facing error display
- **Try Again Button** - Quick recovery
- **Console Logging** - Debug information

---

## 💡 Educational Features

### "What I Learned" Section
Each project includes:
- ✅ State management techniques
- ✅ API usage examples
- ✅ Algorithm explanations
- ✅ UI/UX patterns
- ✅ Vue 3 features demonstrated

**Example (Calculator)**:
- State management with Vue 3 refs
- Handling complex user interactions
- Building responsive grid layouts
- Implementing calculator logic

---

## ⌨️ Keyboard Shortcuts

### Global
| Key | Action | Context |
|-----|--------|---------|
| `Esc` | Go Back | Playground → Home |
| `Esc` | Exit Fullscreen | Fullscreen → Normal |

### Playground Only
| Key | Action |
|-----|--------|
| `F` | Toggle Fullscreen |
| `R` | Reset Project |
| `C` | Toggle Code Preview |

**Shortcuts Help**: Visible in bottom-right corner

---

## 🎨 Visual Design

### Color System
- **Primary**: Blue (#0ea5e9) - Actions, links
- **Utility**: Blue - Category badge
- **Calculator**: Purple - Category badge
- **Generator**: Green - Category badge
- **Tool**: Orange - Category badge
- **Game**: Pink - Category badge

### Typography
- **Headings**: Inter (bold)
- **Body**: Inter (regular)
- **Code**: JetBrains Mono

### Animations
- **Route Transitions**: 300ms fade
- **Hover Effects**: Scale transform
- **Button Press**: Active scale
- **Smooth Scrolling**: Between routes

---

## 🔍 Search & Filter

### Search Behavior
- **Real-time** - Instant results
- **Case-insensitive** - Flexible matching
- **Searches**: Name + Description
- **Clear Results** - Easy to understand

### Filter Options
1. **All** - Show everything
2. **Utility** - Basic tools
3. **Calculator** - Math operations
4. **Generator** - Content creation
5. **Tool** - Developer utilities
6. **Game** - Interactive fun

### Combined Filtering
- Search AND category work together
- Filters applied simultaneously
- Results update instantly

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: Default (375px+)
- **Tablet**: md (768px+)
- **Desktop**: lg (1024px+)

### Adaptive Features
- Tech badges hide on small screens
- Grid columns adjust (1 → 2 → 3)
- Header wraps on mobile
- Keyboard shortcuts panel responsive

---

## ⚡ Performance

### Optimizations
- **Lazy Loading** - Routes loaded on demand
- **Code Splitting** - Smaller initial bundle
- **Font Preloading** - Faster text rendering
- **Smooth Scroll** - Hardware accelerated
- **Efficient Rendering** - Computed properties

### Bundle Size
- **Gzipped**: ~50KB
- **Load Time**: <1 second
- **Interactive**: Immediately

---

## 🎯 SEO Features

### Meta Tags
- ✅ Title with keywords
- ✅ Description (155 chars)
- ✅ Author information
- ✅ Open Graph tags
- ✅ Twitter cards
- ✅ Theme color
- ✅ Viewport settings

### Content
- ✅ Semantic HTML
- ✅ Descriptive headings
- ✅ Alt text (where applicable)
- ✅ Clear navigation
- ✅ Mobile-friendly

---

## 🛠️ Developer Features

### Type Safety
- Full TypeScript coverage
- Project interface
- Category types
- Component props

### Composables
- `useKeyboard.ts` - Keyboard handling
- Reusable across components
- Clean separation of concerns

### Components
- `SearchFilter.vue` - Search & filter UI
- `CategoryBadge.vue` - Category display
- `ErrorBoundary.vue` - Error handling
- `ProjectCard.vue` - Project display
- `TechBadge.vue` - Technology tags

---

## 📊 Project Metadata

Each project includes:
```typescript
{
  slug: string           // URL identifier
  name: string           // Display name
  description: string    // Brief description
  techStack: string[]    // Technologies used
  component: Component   // Vue component
  category: string       // Project category
  whatILearned: string[] // Learning outcomes
  codePreview: string    // Code snippet
}
```

---

## 🚀 Quick Start Guide

1. **Browse**: View all projects on homepage
2. **Search**: Type to filter projects
3. **Filter**: Click category to narrow down
4. **Run**: Click "Run Project" button
5. **Explore**: Use keyboard shortcuts
6. **Learn**: Scroll to "What I Learned"
7. **Code**: Toggle code preview
8. **Fullscreen**: Press `F` for focus mode
9. **Reset**: Press `R` to restart
10. **Back**: Press `Esc` to return home

---

## 💎 Pro Tips

- **Keyboard First**: Learn shortcuts for faster navigation
- **Fullscreen Demos**: Use `F` for presentations
- **Code Learning**: Toggle code to see implementations
- **Error Recovery**: Don't panic - just click "Try Again"
- **Filter Combo**: Combine search + category for precision
- **Reset Often**: Press `R` to test from fresh state

---

## 🎓 For Recruiters

This project demonstrates:
- ✅ Modern Vue 3 expertise
- ✅ TypeScript proficiency
- ✅ Advanced UX patterns
- ✅ Performance optimization
- ✅ Error handling
- ✅ Accessibility awareness
- ✅ SEO knowledge
- ✅ Clean code architecture

---

**Built with Vue 3, TypeScript & Tailwind CSS by Leigh**
