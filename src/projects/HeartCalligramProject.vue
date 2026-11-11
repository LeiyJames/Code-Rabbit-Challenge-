<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import gsap from "gsap";
import {
  Heart,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Download,
  Sun,
  Moon,
  Palette,
  Search,
  SlidersHorizontal
} from "lucide-vue-next";
import {
  CALLIGRAM_PHRASES,
  POINT_COORDINATES,
  LEFT_OUTLINE_ORDER,
  RIGHT_OUTLINE_ORDER,
  type CalligramPhrase
} from "@/data/heartCalligramData";

// --- Theme Management ---
type ThemeMode = "classic" | "midnight" | "rose";
const currentTheme = ref<ThemeMode>("classic");

const themes: { id: ThemeMode; label: string; icon: typeof Sun }[] = [
  { id: "classic", label: "Classic Studio", icon: Sun },
  { id: "midnight", label: "Midnight Slate", icon: Moon },
  { id: "rose", label: "Crimson Velvet", icon: Palette }
];

const themeConfig = computed(() => {
  switch (currentTheme.value) {
    case "midnight":
      return {
        bgClass: "bg-neutral-950 text-neutral-100",
        canvasBg: "#09090b",
        textColor: "#f4f4f5",
        textSecondary: "#fda4af",
        accentColor: "#fb7185",
        cometColor: "#ffffff",
        cardBg: "bg-neutral-900/90 border-neutral-800 text-neutral-100",
        stageBg: "radial-gradient(circle at 50% 50%, #1c1917 0%, #09090b 100%)",
        tooltipBg: "bg-neutral-900/95 border-neutral-700 text-white"
      };
    case "rose":
      return {
        bgClass: "bg-rose-50/50 text-rose-950",
        canvasBg: "#fff1f2",
        textColor: "#4c0519",
        textSecondary: "#9f1239",
        accentColor: "#e11d48",
        cometColor: "#fb7185",
        cardBg: "bg-white/90 border-rose-200 text-rose-950",
        stageBg: "radial-gradient(circle at 50% 50%, #fff1f2 0%, #ffe4e6 100%)",
        tooltipBg: "bg-white/95 border-rose-200 text-rose-950"
      };
    case "classic":
    default:
      return {
        bgClass: "bg-neutral-50 text-neutral-900",
        canvasBg: "#ffffff",
        textColor: "#171717",
        textSecondary: "#525252",
        accentColor: "#e11d48",
        cometColor: "#e11d48",
        cardBg: "bg-white/95 border-neutral-200 text-neutral-900",
        stageBg: "radial-gradient(circle at 50% 50%, #ffffff 0%, #f5f5f5 100%)",
        tooltipBg: "bg-white/95 border-neutral-200 text-neutral-900"
      };
  }
});

// --- Audio Synthesizer (Web Audio API) ---
const isAudioEnabled = ref(true);
let audioCtx: AudioContext | null = null;

function initAudio() {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      audioCtx = new AudioCtx();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

function playNote(freq: number, duration = 0.5, gainLevel = 0.06) {
  if (!isAudioEnabled.value || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(gainLevel, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration);
  } catch {
    // Ignore audio playback context errors
  }
}

function playHeartbeatChime() {
  if (!isAudioEnabled.value || !audioCtx) return;
  [58, 70].forEach((freq, idx) => {
    setTimeout(() => {
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(45, audioCtx.currentTime + 0.14);
        gain.gain.setValueAtTime(0.09, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } catch {
        // Ignore audio playback context errors
      }
    }, idx * 150);
  });
}

function playCompletionFanfare() {
  if (!isAudioEnabled.value || !audioCtx) return;
  const chords = [392.0, 440.0, 523.25, 659.25, 783.99, 1046.5];
  chords.forEach((f, i) => {
    setTimeout(() => playNote(f, 1.8, 0.12), i * 85);
  });
}

function toggleAudio() {
  initAudio();
  isAudioEnabled.value = !isAudioEnabled.value;
  if (isAudioEnabled.value) {
    playNote(587.33, 0.6, 0.08);
  }
}

// --- Particle Canvas Engine ---
const particleCanvasRef = ref<HTMLCanvasElement | null>(null);
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation?: number;
  vRot?: number;
  isHeart: boolean;
}
const particles: Particle[] = [];
let animFrameId: number | null = null;

function resizeParticleCanvas() {
  if (!particleCanvasRef.value) return;
  const rect = particleCanvasRef.value.parentElement?.getBoundingClientRect();
  if (rect) {
    particleCanvasRef.value.width = rect.width;
    particleCanvasRef.value.height = rect.height;
  }
}

function spawnCometTrail(x: number, y: number, count = 2) {
  const colors = [themeConfig.value.accentColor, "#fb7185", "#fda4af", "#ffffff"];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2.0 + 0.5;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed + 0.3,
      size: Math.random() * 3 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.04 + 0.03,
      isHeart: false
    });
  }
}

function spawnBurst(x: number, y: number, count = 22, isBig = false) {
  const colors = [themeConfig.value.accentColor, "#fb7185", "#fda4af", "#e11d48", "#ffffff"];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * (isBig ? 6 : 4) + 1.0;
    const isHeart = Math.random() > 0.45;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.2,
      size: isHeart ? Math.random() * 12 + 8 : Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.02 + 0.015,
      rotation: Math.random() * Math.PI,
      vRot: (Math.random() - 0.5) * 0.1,
      isHeart
    });
  }
}

function drawMiniHeart(c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number, rot = 0) {
  c.save();
  c.translate(x, y);
  c.rotate(rot);
  c.scale(size / 30, size / 30);
  c.beginPath();
  c.moveTo(0, -5);
  c.bezierCurveTo(5, -20, 20, -20, 20, -5);
  c.bezierCurveTo(20, 10, 0, 22, 0, 30);
  c.bezierCurveTo(0, 22, -20, 10, -20, -5);
  c.bezierCurveTo(-20, -20, -5, -20, 0, -5);
  c.fillStyle = color;
  c.globalAlpha = alpha;
  c.fill();
  c.restore();
}

function renderParticles() {
  const canvas = particleCanvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.04;
    p.alpha -= p.decay;

    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }

    if (p.isHeart) {
      p.rotation = (p.rotation || 0) + (p.vRot || 0);
      drawMiniHeart(ctx, p.x, p.y, p.size, p.color, p.alpha, p.rotation);
    } else {
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.restore();
    }
  }

  animFrameId = requestAnimationFrame(renderParticles);
}

// --- SVG Nodes & Animation Orchestration ---
const svgRef = ref<SVGSVGElement | null>(null);
const cometSpark1Ref = ref<HTMLDivElement | null>(null);
const cometSpark2Ref = ref<HTMLDivElement | null>(null);
const shockwaveRef = ref<HTMLDivElement | null>(null);

interface ProcessedNode {
  el: SVGElement;
  item: CalligramPhrase;
  index: number;
  order?: number;
}

const nodeMap = new Map<string, ProcessedNode>();
const pointNodes: ProcessedNode[] = [];
const leftOutlineNodes: ProcessedNode[] = [];
const rightOutlineNodes: ProcessedNode[] = [];
const interiorNodes: ProcessedNode[] = [];

let masterTimeline: gsap.core.Timeline | null = null;
let heartbeatTl: gsap.core.Timeline | null = null;
const speedMultiplier = ref(1.0);
const isScattered = ref(false);
const animationStatus = ref<"idle" | "drawing" | "beating">("idle");

// Tooltip State
const activeTooltip = ref<{
  phrase: CalligramPhrase;
  x: number;
  y: number;
} | null>(null);

function getScreenCoordinates(svgX: number, svgY: number) {
  if (!svgRef.value) return { x: svgX, y: svgY };
  const matrix = svgRef.value.getScreenCTM();
  if (!matrix) return { x: svgX, y: svgY };
  const pt = svgRef.value.createSVGPoint();
  pt.x = svgX;
  pt.y = svgY;
  const transformed = pt.matrixTransform(matrix);
  const containerRect = svgRef.value.parentElement?.getBoundingClientRect();
  if (containerRect) {
    return {
      x: transformed.x - containerRect.left,
      y: transformed.y - containerRect.top
    };
  }
  return { x: transformed.x, y: transformed.y };
}

function handleNodeHover(item: CalligramPhrase) {
  const screenPt = getScreenCoordinates(item.x, item.y);
  activeTooltip.value = {
    phrase: item,
    x: screenPt.x,
    y: screenPt.y - 12
  };
  playNote(480 + (item.x * 0.4), 0.2, 0.035);
}

function handleNodeLeave() {
  activeTooltip.value = null;
}

function handleNodeClick(item: CalligramPhrase) {
  initAudio();
  const screenPt = getScreenCoordinates(item.x, item.y);
  spawnBurst(screenPt.x, screenPt.y, 25);
  playNote(700 + Math.random() * 220, 1.0, 0.09);
}

// Search and Highlight
const searchQuery = ref("");
const selectedLanguageId = ref<string | null>(null);

const filteredPhrases = computed(() => {
  if (!searchQuery.value.trim()) return [];
  const q = searchQuery.value.toLowerCase().trim();
  return CALLIGRAM_PHRASES.filter(
    (p) =>
      p.lang.toLowerCase().includes(q) ||
      p.text.toLowerCase().includes(q) ||
      p.countryCode.toLowerCase().includes(q) ||
      p.pron.toLowerCase().includes(q)
  ).slice(0, 12);
});

function focusPhrase(phrase: CalligramPhrase) {
  selectedLanguageId.value = phrase.id;
  const target = nodeMap.get(phrase.id);
  if (target) {
    initAudio();
    const screenPt = getScreenCoordinates(phrase.x, phrase.y);
    spawnBurst(screenPt.x, screenPt.y, 20);
    playNote(540, 0.4, 0.08);

    gsap.fromTo(
      target.el,
      { scale: 1.5, fill: themeConfig.value.accentColor },
      { scale: 1, fill: themeConfig.value.textColor, duration: 1.2, ease: "elastic.out(1, 0.3)" }
    );
  }
}

// Master Animation
function runAnimation() {
  if (!svgRef.value) return;
  animationStatus.value = "drawing";
  isScattered.value = false;

  if (masterTimeline) masterTimeline.kill();
  if (heartbeatTl) heartbeatTl.kill();

  gsap.set(svgRef.value, { scale: 1 });

  // Hide all nodes
  nodeMap.forEach(({ el }) => {
    gsap.set(el, { opacity: 0, scale: 0.1 });
  });

  const c1 = cometSpark1Ref.value;
  const c2 = cometSpark2Ref.value;

  if (c1) {
    const startPt = getScreenCoordinates(505, 888);
    c1.style.display = "block";
    c1.style.left = `${startPt.x}px`;
    c1.style.top = `${startPt.y}px`;
    gsap.set(c1, { opacity: 1, scale: 1 });
  }

  if (c2) {
    c2.style.display = "none";
    gsap.set(c2, { opacity: 0, scale: 1 });
  }

  masterTimeline = gsap.timeline({
    onComplete: onHeartComplete
  });

  // Phase 1: Bottom Point (888 down to 828)
  const pointDelay = 0.18 * speedMultiplier.value;
  pointNodes.forEach(({ el, item }, idx) => {
    masterTimeline?.to(
      el,
      {
        opacity: 1,
        scale: 1,
        duration: 0.35 * speedMultiplier.value,
        ease: "back.out(1.8)",
        onStart: () => {
          if (c1) {
            const screenPt = getScreenCoordinates(item.x, item.y);
            c1.style.left = `${screenPt.x}px`;
            c1.style.top = `${screenPt.y}px`;
            spawnCometTrail(screenPt.x, screenPt.y, 4);
            playNote(300 + idx * 60, 0.22, 0.04);
          }
        }
      },
      idx * pointDelay
    );
  });

  // Phase 2: Dual Perimeter Comets
  const outlineStartTime = pointNodes.length * pointDelay;
  const outlineDuration = 2.4 * speedMultiplier.value;

  masterTimeline.call(
    () => {
      if (c2) {
        const branchPt = getScreenCoordinates(505, 828);
        c2.style.display = "block";
        c2.style.left = `${branchPt.x}px`;
        c2.style.top = `${branchPt.y}px`;
        gsap.set(c2, { opacity: 1 });
      }
    },
    undefined,
    outlineStartTime
  );

  leftOutlineNodes.forEach(({ el, item }, idx) => {
    const time = outlineStartTime + (idx / leftOutlineNodes.length) * outlineDuration;
    masterTimeline?.to(
      el,
      {
        opacity: 1,
        scale: 1,
        duration: 0.32 * speedMultiplier.value,
        ease: "back.out(1.7)",
        onStart: () => {
          if (c1) {
            const screenPt = getScreenCoordinates(item.x, item.y);
            c1.style.left = `${screenPt.x}px`;
            c1.style.top = `${screenPt.y}px`;
            spawnCometTrail(screenPt.x, screenPt.y, 3);
            if (idx % 2 === 0) playNote(350 + idx * 10, 0.18, 0.025);
          }
        }
      },
      time
    );
  });

  rightOutlineNodes.forEach(({ el, item }, idx) => {
    const time = outlineStartTime + (idx / rightOutlineNodes.length) * outlineDuration;
    masterTimeline?.to(
      el,
      {
        opacity: 1,
        scale: 1,
        duration: 0.32 * speedMultiplier.value,
        ease: "back.out(1.7)",
        onStart: () => {
          if (c2) {
            const screenPt = getScreenCoordinates(item.x, item.y);
            c2.style.left = `${screenPt.x}px`;
            c2.style.top = `${screenPt.y}px`;
            spawnCometTrail(screenPt.x, screenPt.y, 3);
          }
        }
      },
      time
    );
  });

  // Top cleft meeting & outline closure
  const heartFormedTime = outlineStartTime + outlineDuration;
  masterTimeline.call(
    () => {
      const cleftPt = getScreenCoordinates(512, 295);
      spawnBurst(cleftPt.x, cleftPt.y, 25);
      playNote(659.25, 0.9, 0.1);

      if (c1 && c2) {
        gsap.to([c1, c2], {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            c1.style.display = "none";
            c2.style.display = "none";
          }
        });
      }
    },
    undefined,
    heartFormedTime
  );

  // Phase 3: Interior Waterfall Fill
  const fillStartTime = heartFormedTime + 0.35 * speedMultiplier.value;
  const fillDuration = 3.6 * speedMultiplier.value;

  interiorNodes.forEach(({ el, item }, idx) => {
    const time = fillStartTime + (idx / interiorNodes.length) * fillDuration;
    masterTimeline?.to(
      el,
      {
        opacity: 1,
        scale: 1,
        duration: 0.45 * speedMultiplier.value,
        ease: "back.out(1.6)",
        onStart: () => {
          const screenPt = getScreenCoordinates(item.x, item.y);
          spawnCometTrail(screenPt.x, screenPt.y, 2);

          if (item.is_center) {
            playNote(523.25, 1.8, 0.15);
            spawnBurst(screenPt.x, screenPt.y, 35);
          } else if (idx % 3 === 0) {
            playNote(400 + idx * 8, 0.2, 0.02);
          }
        }
      },
      time
    );
  });
}

function onHeartComplete() {
  animationStatus.value = "beating";
  const centerPt = getScreenCoordinates(475, 455);
  spawnBurst(centerPt.x, centerPt.y, 55, true);
  playCompletionFanfare();

  if (shockwaveRef.value) {
    gsap.fromTo(
      shockwaveRef.value,
      { opacity: 0.85, scale: 0.3 },
      { opacity: 0, scale: 2.2, duration: 1.6, ease: "power2.out" }
    );
  }

  startHeartbeat();
}

function startHeartbeat() {
  if (!svgRef.value) return;
  if (heartbeatTl) heartbeatTl.kill();

  const centerNode = nodeMap.get("phrase-47"); // "I love you" centerpiece
  heartbeatTl = gsap.timeline({ repeat: -1, repeatDelay: 1.25 });

  // Lub
  heartbeatTl.to(svgRef.value, {
    scale: 1.035,
    duration: 0.15,
    ease: "power2.out",
    onStart: () => {
      playHeartbeatChime();
    }
  });

  if (centerNode) {
    heartbeatTl.to(
      centerNode.el,
      {
        fill: themeConfig.value.accentColor,
        duration: 0.15,
        ease: "power2.out"
      },
      "<"
    );
  }

  heartbeatTl.to(svgRef.value, {
    scale: 1.0,
    duration: 0.12,
    ease: "power2.in"
  });

  if (centerNode) {
    heartbeatTl.to(
      centerNode.el,
      {
        fill: themeConfig.value.textColor,
        duration: 0.12,
        ease: "power2.in"
      },
      "<"
    );
  }

  // Dub
  heartbeatTl.to(svgRef.value, {
    scale: 1.02,
    duration: 0.14,
    ease: "power2.out"
  });

  heartbeatTl.to(svgRef.value, {
    scale: 1.0,
    duration: 0.35,
    ease: "elastic.out(1, 0.4)"
  });

  // Micro-breathing oscillation
  Array.from(nodeMap.values()).forEach(({ el }, i) => {
    gsap.to(el, {
      y: `+=${Math.sin(i) * 2.5}`,
      duration: 3 + (i % 3),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  });
}

function toggleScatter() {
  initAudio();
  isScattered.value = !isScattered.value;

  if (isScattered.value) {
    if (heartbeatTl) heartbeatTl.pause();
    nodeMap.forEach(({ el }) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 300 + Math.random() * 360;
      gsap.to(el, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        opacity: 0.4,
        duration: 1.1,
        ease: "power3.out"
      });
    });
  } else {
    nodeMap.forEach(({ el }) => {
      gsap.to(el, {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "elastic.out(1, 0.5)"
      });
    });
    if (heartbeatTl) heartbeatTl.resume();
  }
}

// Export 1600x1600 High-Res PNG
function exportHighResPoster() {
  initAudio();
  const exportCanvas = document.createElement("canvas");
  const size = 1600;
  exportCanvas.width = size;
  exportCanvas.height = size;
  const ctx = exportCanvas.getContext("2d");
  if (!ctx) return;

  const isMidnight = currentTheme.value === "midnight";
  const isRose = currentTheme.value === "rose";

  // Background
  ctx.fillStyle = isMidnight ? "#09090b" : isRose ? "#fff1f2" : "#ffffff";
  ctx.fillRect(0, 0, size, size);

  // Draw phrases
  CALLIGRAM_PHRASES.forEach((item) => {
    const x = (item.x / 1024) * size;
    const y = (item.y / 1024) * size;
    const fontSize = (item.size / 1024) * size;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (item.is_center) {
      ctx.font = `900 ${fontSize}px "Playfair Display", Georgia, serif`;
    } else if (item.font && item.font.includes("Great Vibes")) {
      ctx.font = `italic ${fontSize * 1.3}px "Great Vibes", cursive`;
    } else {
      ctx.font = `${item.bold ? "bold" : "normal"} ${fontSize}px "Inter", sans-serif`;
    }

    if (item.is_heart) {
      ctx.fillStyle = "#e11d48";
      // Draw heart path
      drawMiniHeart(ctx, x, y, fontSize * 1.6, "#e11d48", 1);
    } else {
      ctx.fillStyle = isMidnight ? "#ffffff" : isRose ? "#4c0519" : "#171717";
      ctx.fillText(item.text, x, y);
    }
    ctx.restore();
  });

  const link = document.createElement("a");
  link.download = "multilingual-heart-calligram.png";
  link.href = exportCanvas.toDataURL("image/png");
  link.click();
  playCompletionFanfare();
}

function handleStageClick(event: MouseEvent) {
  initAudio();
  const target = event.target as HTMLElement;
  if (!target.classList.contains("heart-text-node")) {
    const rect = svgRef.value?.parentElement?.getBoundingClientRect();
    if (rect) {
      spawnBurst(event.clientX - rect.left, event.clientY - rect.top, 14);
    }
  }
}

onMounted(async () => {
  await nextTick();
  resizeParticleCanvas();
  renderParticles();
  window.addEventListener("resize", resizeParticleCanvas);

  // Group phrases into buckets
  const leftOutlineMap = new Map(LEFT_OUTLINE_ORDER.map((coord, idx) => [coord, idx]));
  const rightOutlineMap = new Map(RIGHT_OUTLINE_ORDER.map((coord, idx) => [coord, idx]));

  // Index text elements
  CALLIGRAM_PHRASES.forEach((item, index) => {
    const el = document.getElementById(item.id) as SVGElement | null;
    if (!el) return;

    const nodeObj: ProcessedNode = { el, item, index };
    nodeMap.set(item.id, nodeObj);

    const key = `${item.x},${item.y}`;
    if (POINT_COORDINATES.has(key)) {
      pointNodes.push(nodeObj);
    } else if (leftOutlineMap.has(key)) {
      nodeObj.order = leftOutlineMap.get(key);
      leftOutlineNodes.push(nodeObj);
    } else if (rightOutlineMap.has(key)) {
      nodeObj.order = rightOutlineMap.get(key);
      rightOutlineNodes.push(nodeObj);
    } else {
      nodeObj.order = item.y;
      interiorNodes.push(nodeObj);
    }
  });

  pointNodes.sort((a, b) => b.item.y - a.item.y);
  leftOutlineNodes.sort((a, b) => (a.order || 0) - (b.order || 0));
  rightOutlineNodes.sort((a, b) => (a.order || 0) - (b.order || 0));
  interiorNodes.sort((a, b) => a.item.y - b.item.y);

  // Initial drawing kickoff after small delay for smooth mount
  setTimeout(() => {
    runAnimation();
  }, 350);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeParticleCanvas);
  if (animFrameId) cancelAnimationFrame(animFrameId);
  if (masterTimeline) masterTimeline.kill();
  if (heartbeatTl) heartbeatTl.kill();
  if (audioCtx) {
    audioCtx.close().catch(() => {});
  }
});
</script>

<template>
  <div
    class="relative w-full min-h-[820px] h-[calc(100vh-140px)] rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 transition-colors duration-500 flex flex-col select-none"
    :class="themeConfig.bgClass"
    :style="{ background: themeConfig.stageBg }"
    @click="handleStageClick"
  >
    <!-- Background Particle Canvas -->
    <canvas
      ref="particleCanvasRef"
      class="absolute inset-0 pointer-events-none z-10 w-full h-full"
    ></canvas>

    <!-- Comet Sparks -->
    <div
      ref="cometSpark1Ref"
      class="absolute w-4 h-4 rounded-full pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2 shadow-lg hidden"
      :style="{
        background: `radial-gradient(circle, #ffffff 20%, ${themeConfig.accentColor} 80%)`,
        boxShadow: `0 0 16px ${themeConfig.accentColor}, 0 0 30px #ffffff`
      }"
    ></div>
    <div
      ref="cometSpark2Ref"
      class="absolute w-4 h-4 rounded-full pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2 shadow-lg hidden"
      :style="{
        background: `radial-gradient(circle, #ffffff 20%, ${themeConfig.accentColor} 80%)`,
        boxShadow: `0 0 16px ${themeConfig.accentColor}, 0 0 30px #ffffff`
      }"
    ></div>

    <!-- Shockwave Expansion Ring -->
    <div
      ref="shockwaveRef"
      class="absolute top-1/2 left-1/2 w-96 h-96 rounded-full border-2 -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none z-20"
      :style="{ borderColor: themeConfig.accentColor }"
    ></div>

    <!-- Top Action Toolbar -->
    <header class="relative z-40 w-full px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200/40 dark:border-neutral-800/40 backdrop-blur-md">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-rose-500/10 text-rose-500">
          <Heart class="w-4 h-4 fill-rose-500 animate-pulse" />
        </div>
        <div>
          <h2 class="text-sm font-semibold tracking-wide text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            Multilingual Heart Calligram
            <span class="text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium">87 Languages</span>
          </h2>
          <p class="text-xs text-neutral-500 dark:text-neutral-400">
            Interactive typographic artwork sculpted into a breathing heart
          </p>
        </div>
      </div>

      <!-- Controls Right -->
      <div class="flex items-center flex-wrap gap-2">
        <!-- Theme Select -->
        <div class="flex items-center rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 p-0.5">
          <button
            v-for="t in themes"
            :key="t.id"
            @click="currentTheme = t.id"
            class="px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5"
            :class="
              currentTheme === t.id
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            "
          >
            <component :is="t.icon" class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">{{ t.label }}</span>
          </button>
        </div>

        <!-- Audio Toggle -->
        <button
          @click="toggleAudio"
          class="h-8 px-2.5 rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors flex items-center gap-1.5"
          :title="isAudioEnabled ? 'Mute synthesized audio' : 'Unmute audio'"
        >
          <Volume2 v-if="isAudioEnabled" class="w-3.5 h-3.5 text-rose-500" />
          <VolumeX v-else class="w-3.5 h-3.5 text-neutral-400" />
          <span class="hidden sm:inline">{{ isAudioEnabled ? 'Sound On' : 'Muted' }}</span>
        </button>

        <!-- Speed Dropdown -->
        <div class="relative">
          <select
            v-model.number="speedMultiplier"
            @change="runAnimation"
            class="h-8 pl-2.5 pr-6 rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 text-xs font-medium text-neutral-700 dark:text-neutral-300 appearance-none outline-none focus:border-rose-400 cursor-pointer"
          >
            <option :value="1.5">Gentle (1.5x)</option>
            <option :value="1.0">Normal (1.0x)</option>
            <option :value="0.6">Swift (0.6x)</option>
          </select>
          <SlidersHorizontal class="w-3 h-3 text-neutral-400 absolute right-2 top-2.5 pointer-events-none" />
        </div>

        <!-- Export PNG -->
        <button
          @click="exportHighResPoster"
          class="h-8 px-3 rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors flex items-center gap-1.5"
          title="Download 1600x1600 high resolution poster"
        >
          <Download class="w-3.5 h-3.5" />
          <span class="hidden md:inline">Export Poster</span>
        </button>
      </div>
    </header>

    <!-- Interactive SVG Heart Stage -->
    <main class="relative flex-1 flex items-center justify-center p-4 overflow-hidden z-20">
      <svg
        ref="svgRef"
        viewBox="0 0 1024 1024"
        preserveAspectRatio="xMidYMid meet"
        class="w-[min(84vmin,760px)] h-[min(84vmin,760px)] max-w-full max-h-full overflow-visible transition-transform duration-300 will-change-transform"
        style="transform-origin: 505px 480px"
      >
        <g id="words-group">
          <!-- Render all 89 items -->
          <template v-for="item in CALLIGRAM_PHRASES" :key="item.id">
            <!-- Center Serif "I love you" -->
            <text
              v-if="item.is_center"
              :id="item.id"
              :x="item.x"
              :y="item.y"
              text-anchor="middle"
              dominant-baseline="central"
              :font-size="item.size"
              font-family="'Playfair Display', Georgia, serif"
              font-weight="900"
              class="heart-text-node cursor-pointer transition-colors duration-200 select-none hover:fill-rose-500"
              :style="{ fill: selectedLanguageId === item.id ? themeConfig.accentColor : themeConfig.textColor }"
              @mouseenter="handleNodeHover(item)"
              @mouseleave="handleNodeLeave"
              @click="handleNodeClick(item)"
            >
              {{ item.text }}
            </text>

            <!-- Bottom Point Heart Symbol (Vector SVG glyph) -->
            <g
              v-else-if="item.is_heart"
              :id="item.id"
              :transform="`translate(${item.x}, ${item.y}) scale(${item.size / 24})`"
              class="heart-text-node cursor-pointer hover:scale-125 transition-transform duration-200"
              @mouseenter="handleNodeHover(item)"
              @mouseleave="handleNodeLeave"
              @click="handleNodeClick(item)"
            >
              <path
                d="M 0,-4 C 3,-16 16,-16 16,-4 C 16,8 0,18 0,24 C 0,18 -16,8 -16,-4 C -16,-16 -3,-16 0,-4 Z"
                :fill="themeConfig.accentColor"
              />
            </g>

            <!-- Multilingual Words -->
            <text
              v-else
              :id="item.id"
              :x="item.x"
              :y="item.y"
              text-anchor="middle"
              dominant-baseline="central"
              :font-size="item.size"
              :font-weight="item.bold ? '700' : 'normal'"
              :font-style="item.italic ? 'italic' : 'normal'"
              :font-family="item.font || '\'Inter\', sans-serif'"
              class="heart-text-node cursor-pointer transition-colors duration-200 select-none hover:fill-rose-500"
              :style="{ fill: selectedLanguageId === item.id ? themeConfig.accentColor : themeConfig.textColor }"
              @mouseenter="handleNodeHover(item)"
              @mouseleave="handleNodeLeave"
              @click="handleNodeClick(item)"
            >
              {{ item.text }}
            </text>
          </template>
        </g>
      </svg>

      <!-- Glassmorphic Word Tooltip -->
      <transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 translate-y-1 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-1 scale-95"
      >
        <div
          v-if="activeTooltip"
          class="absolute pointer-events-none z-50 -translate-x-1/2 -translate-y-full px-4 py-2.5 rounded-xl shadow-xl backdrop-blur-md border flex flex-col items-center min-w-[180px] max-w-[260px] text-center"
          :class="themeConfig.tooltipBg"
          :style="{ left: `${activeTooltip.x}px`, top: `${activeTooltip.y}px` }"
        >
          <div class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-rose-500 mb-0.5">
            <span class="font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px]">
              {{ activeTooltip.phrase.countryCode }}
            </span>
            <span>{{ activeTooltip.phrase.lang }}</span>
          </div>
          <div class="text-base font-bold text-neutral-900 dark:text-neutral-100 my-0.5">
            {{ activeTooltip.phrase.text }}
          </div>
          <div class="text-xs italic text-neutral-500 dark:text-neutral-400">
            {{ activeTooltip.phrase.pron }}
          </div>
          <div class="mt-1 text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
            Universal Expression of Love
          </div>
        </div>
      </transition>
    </main>

    <!-- Bottom Control & Search Bar -->
    <footer class="relative z-40 w-full px-5 py-3 border-t border-neutral-200/40 dark:border-neutral-800/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
      <!-- Playback Controls -->
      <div class="flex items-center gap-2">
        <button
          @click="runAnimation"
          class="h-8 px-3 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
          title="Replay drawing from bottom point"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Replay Drawing</span>
        </button>

        <button
          @click="toggleScatter"
          class="h-8 px-3 rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors flex items-center gap-1.5"
          :title="isScattered ? 'Assemble words into heart' : 'Scatter words into ambient space'"
        >
          <Sparkles class="w-3.5 h-3.5 text-rose-500" />
          <span>{{ isScattered ? 'Assemble Heart' : 'Scatter Words' }}</span>
        </button>
      </div>

      <!-- Search & Language Filter -->
      <div class="relative flex-1 max-w-xs">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search language (e.g. Japanese, French)..."
            class="w-full h-8 pl-8 pr-3 rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 text-xs text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 outline-none focus:border-rose-400 transition-colors"
          />
          <Search class="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5 pointer-events-none" />
        </div>

        <!-- Quick Search Results Dropup -->
        <div
          v-if="filteredPhrases.length > 0"
          class="absolute bottom-full mb-1.5 left-0 w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden z-50 max-h-56 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800"
        >
          <button
            v-for="p in filteredPhrases"
            :key="p.id"
            @click="focusPhrase(p)"
            class="w-full px-3 py-2 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/60 flex items-center justify-between text-xs transition-colors"
          >
            <div class="flex items-center gap-2">
              <span class="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                {{ p.countryCode }}
              </span>
              <span class="font-medium text-neutral-800 dark:text-neutral-200">{{ p.lang }}</span>
            </div>
            <span class="text-neutral-500 dark:text-neutral-400 font-mono text-[11px]">{{ p.text }}</span>
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.heart-text-node {
  transform-origin: center center;
}
</style>
