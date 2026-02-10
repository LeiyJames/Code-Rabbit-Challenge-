<script setup lang="ts">
import { ref } from "vue";
import {
  Download,
  Upload,
  Image as ImageIcon,
  Settings,
  RefreshCw,
  Type,
} from "lucide-vue-next";

const fileInput = ref<HTMLInputElement | null>(null);
const imagePreview = ref<string | null>(null);
const originalImage = ref<HTMLImageElement | null>(null);
const portraitHtml = ref<string>("");
const isProcessing = ref(false);
const progress = ref(0);
const isExporting = ref(false);

// Settings
const resolution = ref(80); // characters across
const charset = ref("HTMLPORTRAIT");
const fontSize = ref(6);
const isGrayscale = ref(false);
const useBackgroundColor = ref(true);
const selectedFont = ref(
  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
);

// Advanced Adjustment State
const brightness = ref(100);
const contrast = ref(100);
const useBrightnessMapping = ref(false);
const isSequential = ref(false);
const selectedPalette = ref("original");

const densityChars = "@%#*+=-:. ";

const fonts = [
  {
    name: "System Mono (Tight)",
    value: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  { name: "Courier New (Wide)", value: "'Courier New', Courier, monospace" },
  { name: "Inter (Sans)", value: "'Inter', sans-serif" },
  { name: "Georgia (Serif)", value: "Georgia, serif" },
  { name: "Impact (Bold)", value: "Impact, charcoal, sans-serif" },
];

const palettes = [
  { name: "Original Colors", id: "original" },
  { name: "Matrix (Green)", id: "matrix" },
  { name: "Amber Terminal", id: "amber" },
  { name: "Vaporwave (Pink/Blue)", id: "vaporwave" },
  { name: "Royal Gold", id: "gold" },
  { name: "Midnight (Deep Blue)", id: "midnight" },
];

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        originalImage.value = img;
        generatePortrait();
      };
      img.src = imagePreview.value;
    };
    reader.readAsDataURL(file);
  }
};

const generatePortrait = async () => {
  if (!originalImage.value) return;

  isProcessing.value = true;
  progress.value = 0;

  // Give UI time to update
  await new Promise((resolve) => setTimeout(resolve, 100));

  const img = originalImage.value;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  if (!ctx) return;

  // Calculate dimensions based on resolution
  const aspect = img.height / img.width;
  const width = resolution.value;
  const height = Math.floor(width * aspect * 0.5); // 0.5 because characters are taller than wide

  canvas.width = width;
  canvas.width = width;
  canvas.height = height;

  // Apply Brightness/Contrast to the thumbnail canvas
  ctx.filter = `brightness(${brightness.value}%) contrast(${contrast.value}%)`;
  ctx.drawImage(img, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height).data;

  let html = `<div style="display: inline-block; background: ${useBackgroundColor.value ? "#000" : "transparent"}; padding: 20px; font-family: ${selectedFont.value}; line-height: 0.85; letter-spacing: -0.5px; font-size: ${fontSize.value}px; white-space: pre; border-radius: 8px;">`;

  let charIndex = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = imageData[idx];
      const g = imageData[idx + 1];
      const b = imageData[idx + 2];
      const a = imageData[idx + 3];

      const avg = (r + g + b) / 3;

      let char;
      if (useBrightnessMapping.value) {
        const charIdx = Math.floor((avg / 255) * (densityChars.length - 1));
        char = densityChars[densityChars.length - 1 - charIdx];
      } else if (isSequential.value) {
        char = charset.value[charIndex % charset.value.length];
        charIndex++;
      } else {
        char = charset.value[Math.floor(Math.random() * charset.value.length)];
      }

      let color;
      if (selectedPalette.value === "matrix") {
        color = `rgb(0, ${avg}, 0)`;
      } else if (selectedPalette.value === "amber") {
        color = `rgb(${avg}, ${avg * 0.7}, 0)`;
      } else if (selectedPalette.value === "gold") {
        color = `rgb(${avg}, ${avg * 0.8}, ${avg * 0.3})`;
      } else if (selectedPalette.value === "vaporwave") {
        color =
          x % 2 === 0 ? `rgb(${avg}, 0, ${avg})` : `rgb(0, ${avg}, ${avg})`;
      } else if (selectedPalette.value === "midnight") {
        color = `rgb(0, ${avg * 0.3}, ${avg})`;
      } else if (isGrayscale.value) {
        color = `rgb(${avg}, ${avg}, ${avg})`;
      } else {
        color = `rgb(${r}, ${g}, ${b})`;
      }

      if (a === 0) {
        html += " ";
      } else {
        html += `<span style="color: ${color}">${char}</span>`;
      }
    }
    html += "\n";

    // Update progress occasionally
    if (y % 10 === 0) {
      progress.value = Math.floor((y / height) * 100);
    }
  }

  html += "</div>";
  portraitHtml.value = html;
  isProcessing.value = false;
  progress.value = 100;
};

const downloadHtml = () => {
  if (!portraitHtml.value) return;

  const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Portrait</title>
    <style>
        body { margin: 0; background: #111; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    </style>
</head>
<body>
    ${portraitHtml.value}
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "html-portrait.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(portraitHtml.value);
    alert("HTML copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

const downloadAsImage = async () => {
  if (!portraitHtml.value || !originalImage.value) return;

  isExporting.value = true;

  // Create a high-res canvas for the final export
  const exportCanvas = document.createElement("canvas");
  const exportCtx = exportCanvas.getContext("2d");
  if (!exportCtx) return;

  const charDensity = resolution.value;
  const aspect = originalImage.value.height / originalImage.value.width;
  const h = Math.floor(charDensity * aspect * 0.5);

  // High resolution multiplier
  const scale = 4;
  const charWidth = fontSize.value * scale * 0.6;
  const charHeight = fontSize.value * scale * 0.85;

  exportCanvas.width = charDensity * charWidth;
  exportCanvas.height = h * charHeight;

  // Fill background
  exportCtx.fillStyle = useBackgroundColor.value ? "#000" : "#fff";
  exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

  // Draw the characters to the canvas directly
  // We need to re-read the thumbnail data
  const thumbCanvas = document.createElement("canvas");
  thumbCanvas.width = charDensity;
  thumbCanvas.height = h;
  const thumbCtx = thumbCanvas.getContext("2d");
  if (thumbCtx) {
    thumbCtx.filter = `brightness(${brightness.value}%) contrast(${contrast.value}%)`;
    thumbCtx.drawImage(originalImage.value, 0, 0, charDensity, h);
    const data = thumbCtx.getImageData(0, 0, charDensity, h).data;

    exportCtx.font = `${fontSize.value * scale}px ${selectedFont.value.split(",")[0]}`;
    exportCtx.textAlign = "center";

    let charIdx = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < charDensity; x++) {
        const idx = (y * charDensity + x) * 4;
        const r = data[idx],
          g = data[idx + 1],
          b = data[idx + 2];
        const avg = (r + g + b) / 3;

        let char;
        if (useBrightnessMapping.value) {
          const dIdx = Math.floor((avg / 255) * (densityChars.length - 1));
          char = densityChars[densityChars.length - 1 - dIdx];
        } else if (isSequential.value) {
          char = charset.value[charIdx % charset.value.length];
          charIdx++;
        } else {
          char =
            charset.value[Math.floor(Math.random() * charset.value.length)];
        }

        // Color Palette
        let color;
        if (selectedPalette.value === "matrix") color = `rgb(0, ${avg}, 0)`;
        else if (selectedPalette.value === "amber")
          color = `rgb(${avg}, ${avg * 0.7}, 0)`;
        else if (selectedPalette.value === "gold")
          color = `rgb(${avg}, ${avg * 0.8}, ${avg * 0.3})`;
        else if (selectedPalette.value === "vaporwave")
          color =
            x % 2 === 0 ? `rgb(${avg}, 0, ${avg})` : `rgb(0, ${avg}, ${avg})`;
        else if (selectedPalette.value === "midnight")
          color = `rgb(0, ${avg * 0.3}, ${avg})`;
        else if (isGrayscale.value) color = `rgb(${avg}, ${avg}, ${avg})`;
        else color = `rgb(${r}, ${g}, ${b})`;

        exportCtx.fillStyle = color;
        exportCtx.fillText(
          char,
          x * charWidth + charWidth / 2,
          y * charHeight + charHeight * 0.8,
        );
      }
    }
  }

  const link = document.createElement("a");
  link.download = "html-portrait-hq.png";
  link.href = exportCanvas.toDataURL("image/png");
  link.click();

  isExporting.value = false;
};
</script>

<template>
  <div class="w-full min-h-screen bg-neutral-50 px-6 py-12 lg:px-12">
    <!-- Header -->
    <div class="mb-12 text-center">
      <h1
        class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent"
      >
        HTML Portrait Generator
      </h1>
      <p class="text-neutral-600 text-lg max-w-2xl mx-auto">
        Transform your favorite photos into beautiful, code-based masterpieces.
        Each pixel is reimagined as an HTML element.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Controls Panel -->
      <div class="lg:col-span-1 space-y-6">
        <div
          class="bg-white rounded-2xl shadow-xl shadow-neutral-200/50 border border-neutral-100 p-6"
        >
          <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
            <Settings class="w-5 h-5 text-primary-500" />
            Configuration
          </h2>

          <div class="space-y-6">
            <!-- Upload Area -->
            <div>
              <label class="block text-sm font-semibold text-neutral-700 mb-2"
                >Source Image</label
              >
              <div
                @click="triggerFileInput"
                class="relative group cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-neutral-200 hover:border-primary-400 transition-all aspect-video flex flex-col items-center justify-center bg-neutral-50"
              >
                <div v-if="imagePreview" class="absolute inset-0">
                  <img :src="imagePreview" class="w-full h-full object-cover" />
                  <div
                    class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <span
                      class="text-white font-medium flex items-center gap-2"
                    >
                      <Upload class="w-5 h-5" /> Change Image
                    </span>
                  </div>
                </div>
                <div v-else class="text-center p-4">
                  <div
                    class="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-3"
                  >
                    <Upload class="w-6 h-6" />
                  </div>
                  <p class="text-sm font-medium text-neutral-600">
                    Click to upload or drag & drop
                  </p>
                  <p class="text-xs text-neutral-400 mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </div>
                <input
                  ref="fileInput"
                  type="file"
                  @change="handleFileUpload"
                  class="hidden"
                  accept="image/*"
                />
              </div>
            </div>

            <!-- Resolution & Size -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="flex justify-between items-center mb-2">
                  <label class="text-sm font-semibold text-neutral-700"
                    >Resolution</label
                  >
                  <span
                    class="text-xs font-mono text-primary-600 font-bold bg-primary-50 px-2 py-0.5 rounded"
                    >{{ resolution }}</span
                  >
                </div>
                <input
                  v-model.number="resolution"
                  type="range"
                  min="20"
                  max="180"
                  step="10"
                  @change="generatePortrait"
                  class="w-full h-2 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
              </div>
              <div>
                <div class="flex justify-between items-center mb-2">
                  <label class="text-sm font-semibold text-neutral-700"
                    >Font Size</label
                  >
                  <span
                    class="text-xs font-mono text-primary-600 font-bold bg-primary-50 px-2 py-0.5 rounded"
                    >{{ fontSize }}px</span
                  >
                </div>
                <input
                  v-model.number="fontSize"
                  type="range"
                  min="2"
                  max="12"
                  step="1"
                  @change="generatePortrait"
                  class="w-full h-2 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
              </div>
            </div>

            <!-- Image Adjustments -->
            <div class="p-4 bg-neutral-50 rounded-xl space-y-4">
              <h3
                class="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2"
              >
                Image Adjustments
              </h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <div class="flex justify-between items-center mb-1">
                    <label class="block text-xs font-medium text-neutral-500"
                      >Brightness: {{ brightness }}%</label
                    >
                    <button
                      @click="
                        brightness = 100;
                        generatePortrait();
                      "
                      class="text-[10px] text-primary-500 hover:text-primary-600 font-bold uppercase tracking-tighter"
                    >
                      Reset
                    </button>
                  </div>
                  <div class="relative flex items-center h-4">
                    <div
                      class="absolute left-1/2 w-0.5 h-2 bg-neutral-300 -translate-x-1/2 rounded-full z-0"
                    ></div>
                    <input
                      v-model.number="brightness"
                      type="range"
                      min="0"
                      max="200"
                      @change="generatePortrait"
                      class="w-full h-1 bg-neutral-200 rounded-full appearance-none cursor-pointer accent-primary-600 z-10 relative"
                    />
                  </div>
                </div>
                <div>
                  <div class="flex justify-between items-center mb-1">
                    <label class="block text-xs font-medium text-neutral-500"
                      >Contrast: {{ contrast }}%</label
                    >
                    <button
                      @click="
                        contrast = 100;
                        generatePortrait();
                      "
                      class="text-[10px] text-primary-500 hover:text-primary-600 font-bold uppercase tracking-tighter"
                    >
                      Reset
                    </button>
                  </div>
                  <div class="relative flex items-center h-4">
                    <div
                      class="absolute left-1/2 w-0.5 h-2 bg-neutral-300 -translate-x-1/2 rounded-full z-0"
                    ></div>
                    <input
                      v-model.number="contrast"
                      type="range"
                      min="0"
                      max="200"
                      @change="generatePortrait"
                      class="w-full h-1 bg-neutral-200 rounded-full appearance-none cursor-pointer accent-primary-600 z-10 relative"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Typography & Colors -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-neutral-700 mb-2"
                  >Font Family</label
                >
                <select
                  v-model="selectedFont"
                  @change="generatePortrait"
                  class="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-xs font-medium"
                >
                  <option
                    v-for="font in fonts"
                    :key="font.value"
                    :value="font.value"
                  >
                    {{ font.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-neutral-700 mb-2"
                  >Color Palette</label
                >
                <select
                  v-model="selectedPalette"
                  @change="generatePortrait"
                  class="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-xs font-medium"
                >
                  <option
                    v-for="palette in palettes"
                    :key="palette.id"
                    :value="palette.id"
                  >
                    {{ palette.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Charset -->
            <div>
              <label
                class="block text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2"
              >
                <Type class="w-4 h-4" /> Character Set
              </label>
              <textarea
                v-model="charset"
                @input="generatePortrait"
                placeholder="e.g. HTMLPORTRAIT"
                rows="1"
                class="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none font-mono resize-none overflow-hidden min-h-[42px]"
                @input.passive="
                  (e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }
                "
              ></textarea>
              <p class="text-[10px] text-neutral-400 mt-1 italic">
                The portrait will use these characters sequentially or randomly
                to form the image.
              </p>
            </div>

            <!-- Toggles & Modes -->
            <div class="space-y-3 p-4 bg-neutral-50 rounded-xl">
              <h3
                class="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2"
              >
                Advanced Mapping
              </h3>

              <label class="flex items-center gap-3 cursor-pointer group">
                <div class="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    v-model="useBrightnessMapping"
                    @change="generatePortrait"
                    class="sr-only peer"
                  />
                  <div
                    class="w-9 h-5 bg-neutral-200 rounded-full peer peer-checked:bg-primary-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"
                  ></div>
                </div>
                <span class="text-xs font-semibold text-neutral-600"
                  >Density Mapping (ASCII)</span
                >
              </label>

              <label class="flex items-center gap-3 cursor-pointer group">
                <div class="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    v-model="isSequential"
                    @change="generatePortrait"
                    class="sr-only peer"
                  />
                  <div
                    class="w-9 h-5 bg-neutral-200 rounded-full peer peer-checked:bg-indigo-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"
                  ></div>
                </div>
                <span class="text-xs font-semibold text-neutral-600"
                  >Sequential Character Map</span
                >
              </label>

              <div class="pt-2 border-t border-neutral-200 space-y-3">
                <label class="flex items-center gap-3 cursor-pointer group">
                  <div class="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      v-model="isGrayscale"
                      @change="generatePortrait"
                      class="sr-only peer"
                    />
                    <div
                      class="w-9 h-5 bg-neutral-200 rounded-full peer peer-checked:bg-neutral-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"
                    ></div>
                  </div>
                  <span class="text-xs font-semibold text-neutral-600"
                    >Grayscale Mode</span
                  >
                </label>

                <label class="flex items-center gap-3 cursor-pointer group">
                  <div class="relative inline-flex items-center">
                    <input
                      type="checkbox"
                      v-model="useBackgroundColor"
                      @change="generatePortrait"
                      class="sr-only peer"
                    />
                    <div
                      class="w-9 h-5 bg-neutral-200 rounded-full peer peer-checked:bg-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"
                    ></div>
                  </div>
                  <span class="text-xs font-semibold text-neutral-600"
                    >Dark Canvas Template</span
                  >
                </label>
              </div>
            </div>

            <!-- Actions -->
            <div class="pt-4 space-y-3">
              <button
                @click="generatePortrait"
                :disabled="isProcessing || !imagePreview"
                class="w-full py-3 bg-primary-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-primary-500/20"
              >
                <RefreshCw
                  class="w-5 h-5"
                  :class="{ 'animate-spin': isProcessing }"
                />
                {{
                  isProcessing ? "Processing Pixels..." : "Generate Masterpiece"
                }}
              </button>

              <div class="grid grid-cols-2 gap-3">
                <button
                  @click="downloadAsImage"
                  :disabled="!portraitHtml || isExporting"
                  class="py-2.5 bg-neutral-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 disabled:opacity-50 transition-all text-xs"
                >
                  <Download class="w-4 h-4" />
                  {{ isExporting ? "Exporting..." : "Save PNG" }}
                </button>
                <button
                  @click="downloadHtml"
                  :disabled="!portraitHtml"
                  class="py-2.5 bg-neutral-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-neutral-700 disabled:opacity-50 transition-all text-xs"
                >
                  <Type class="w-4 h-4" /> Get HTML
                </button>
              </div>

              <button
                @click="copyToClipboard"
                :disabled="!portraitHtml"
                class="w-full py-2.5 bg-neutral-100 text-neutral-700 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-neutral-200 disabled:opacity-50 transition-all text-xs border border-neutral-200"
              >
                Copy SVG Code
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview Panel -->
      <div class="lg:col-span-2 space-y-6">
        <div
          class="bg-white rounded-2xl shadow-xl shadow-neutral-200/50 border border-neutral-100 p-6 h-full flex flex-col"
        >
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold flex items-center gap-2">
              <ImageIcon class="w-5 h-5 text-indigo-500" />
              Portrait Preview
            </h2>
            <div v-if="isProcessing" class="flex items-center gap-3">
              <span class="text-xs font-semibold text-neutral-400"
                >{{ progress }}%</span
              >
              <div
                class="w-32 h-1.5 bg-neutral-100 rounded-full overflow-hidden"
              >
                <div
                  class="h-full bg-primary-500 transition-all duration-300"
                  :style="{ width: progress + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <div
            class="flex-1 bg-neutral-950 rounded-xl overflow-hidden relative flex items-center justify-center min-h-[500px]"
          >
            <div v-if="!portraitHtml && !isProcessing" class="text-center p-8">
              <div
                class="w-16 h-16 bg-neutral-900 text-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <ImageIcon class="w-8 h-8" />
              </div>
              <h3 class="text-neutral-500 font-medium">
                No Portrait Generated Yet
              </h3>
              <p class="text-neutral-600 text-sm mt-1">
                Upload an image to see the magic happen
              </p>
            </div>

            <div v-else-if="isProcessing" class="text-center animate-pulse">
              <RefreshCw
                class="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4"
              />
              <p class="text-neutral-400 font-mono">Processing pixels...</p>
            </div>

            <div
              v-else
              class="w-full h-full p-4 overflow-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent"
            >
              <div
                v-html="portraitHtml"
                class="flex justify-center origin-center transform transition-transform duration-500"
              ></div>
            </div>
          </div>

          <div
            class="mt-4 flex items-center gap-4 text-xs text-neutral-400 font-medium px-2"
          >
            <span class="flex items-center gap-1.5"
              ><div class="w-2 h-2 rounded-full bg-green-500"></div>
              Interactive Render</span
            >
            <span class="flex items-center gap-1.5"
              ><div class="w-2 h-2 rounded-full bg-blue-500"></div>
              Semantic HTML Tags</span
            >
            <span class="flex items-center gap-1.5"
              ><div class="w-2 h-2 rounded-full bg-purple-500"></div>
              Responsive SVG Core</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
        <h4 class="font-bold text-indigo-900 mb-2">High Definition</h4>
        <p class="text-sm text-indigo-700/80">
          Adjust character resolution up to 200 units for incredibly detailed
          text-based renderings of your images.
        </p>
      </div>
      <div class="bg-primary-50 p-6 rounded-2xl border border-primary-100">
        <h4 class="font-bold text-primary-900 mb-2">Custom Typography</h4>
        <p class="text-sm text-primary-700/80">
          Use your own character sets to theme your portraits. Perfect for
          creative ASCII-style art and unique web layouts.
        </p>
      </div>
      <div class="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
        <h4 class="font-bold text-emerald-900 mb-2">Standalone Export</h4>
        <p class="text-sm text-emerald-700/80">
          Download your creation as a single, lightweight HTML file that works
          anywhere without dependencies.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #444;
}

/* Range input styling */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #3b82f6;
  cursor: pointer;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #3b82f6;
  cursor: pointer;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>
