<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import confetti from "canvas-confetti";

const isAccepted = ref(false);
const rejectionCount = ref(0);
const noButtonPosition = ref({ top: "0", left: "0" });
const isNoButtonMoved = ref(false);
const showBeggingModal = ref(false);
const isNoButtonVisible = computed(() => rejectionCount.value < 7);
const displayedLoveText = ref("");
const showSignature = ref(false);
const fullLoveLetter =
  "You just made me the happiest person in the world! I promise to always make you smile and love you more every day. 💖";

const phrases = [
  "No",
  "Are you sure?",
  "Think again!",
  "Last chance!",
  "You're breaking my heart",
  "I'm gonna cry...",
  "pretty please?",
  "Okay, I'll leave...",
];

// Direct GIF URLs (Tenor)
// 1. Cute Sticker (Initial) - Bubu Dudu Bear/Panda
const stickerCute = "https://media1.tenor.com/m/tXJsHJmrkIcAAAAC/bubu-dudu.gif";

// Rejection Stickers List
// Rejection Stickers List
const rejectionStickers = [
  "https://media1.tenor.com/m/FkhHW_OewrcAAAAC/bubu-thinking-new-bubu-sad.gif", // Bubu Thinking
  "https://media1.tenor.com/m/Wcu9oaorv8kAAAAC/tramell-tillman.gif", // Tramell Tillman
  "https://media1.tenor.com/m/mxFUB2neXSQAAAAC/rabbits.gif", // Rabbits (Crying/Dancing)
  "https://media1.tenor.com/m/MTQr74ANvmAAAAAC/tkthao219-peach.gif", // Peach Goma Sad
  "https://media1.tenor.com/m/hFWtw7c5Z4QAAAAC/sad-cat-crying-cat.gif", // Sad Cat Crying
].sort(() => Math.random() - 0.5);

// Success Sticker - Bear Kiss
const stickerHappy =
  "https://media1.tenor.com/m/gUiu1zyxfzYAAAAC/bear-kiss-bear-kisses.gif";

onMounted(() => {
  // Inject Tenor Script (Wait, we removed this earlier, but check if we need anything on mount)
  // No modal on mount as per request "modal is not shown"
});

// Computes current Sticker URL
const currentStickerUrl = computed(() => {
  if (isAccepted.value) return stickerHappy;
  if (rejectionCount.value === 0) return stickerCute;

  // Cycle through rejection stickers
  const index = (rejectionCount.value - 1) % rejectionStickers.length;
  return rejectionStickers[index];
});

// Current No Text
const currentNoText = computed(() => {
  return phrases[Math.min(rejectionCount.value, phrases.length - 1)];
});

// Main Message
const mainMessage = computed(() => {
  if (isAccepted.value) return "Yay! Happy Valentine's Day!\u00A0💘";
  if (rejectionCount.value === 0) return "Will you be my Valentine?💖";

  const sadMessages = [
    "Pleaseee 😭",
    "Don't break my heart 💔",
    "I'm gonna cry...",
    "Pretty please?",
    "You're being mean...",
    "I'll be sad forever...",
    "Don't do this to me :(",
  ];
  // clamp index to array length
  return sadMessages[
    Math.min(rejectionCount.value - 1, sadMessages.length - 1)
  ];
});

const yesButtonScale = computed(() => {
  return 1 + rejectionCount.value * 0.2;
});

function handleNoInteraction() {
  rejectionCount.value++;

  if (rejectionCount.value >= 7) {
    setTimeout(() => {
      showBeggingModal.value = true;
    }, 5000); // 5s delay
    return; // Button disappears immediately
  }

  // Random pos (Extreme Edges to avoid growing Yes button)
  // X: 5-15% or 85-95%
  // Y: 5-15% or 85-95%
  const randomX =
    Math.random() < 0.5
      ? Math.floor(Math.random() * 10) + 5
      : Math.floor(Math.random() * 10) + 85;
  const randomY =
    Math.random() < 0.5
      ? Math.floor(Math.random() * 10) + 5
      : Math.floor(Math.random() * 10) + 85;

  noButtonPosition.value = {
    top: `${randomY}%`,
    left: `${randomX}%`,
  };
  isNoButtonMoved.value = true;
}

function handleHeckYes() {
  isAccepted.value = true;
  showBeggingModal.value = false;
  triggerConfetti();
  startTypewriter();
}

function startTypewriter() {
  let i = 0;
  displayedLoveText.value = "";
  showSignature.value = false;

  const interval = setInterval(() => {
    if (i < fullLoveLetter.length) {
      displayedLoveText.value += fullLoveLetter.charAt(i);
      i++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        showSignature.value = true;
      }, 500);
    }
  }, 50); // Speed of typing
}

function handleModalClose() {
  showBeggingModal.value = false;
}

function triggerConfetti() {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

  const random = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    // Side cannons (regular confetti + hearts)
    confetti({
      ...defaults,
      particleCount,
      origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 },
      // @ts-ignore
      shapes: ["circle", "square", "heart"],
      colors: ["#ff0000", "#ff69b4", "#ffd700"],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 },
      // @ts-ignore
      shapes: ["circle", "square", "heart"],
      colors: ["#ff0000", "#ff69b4", "#ffd700"],
    });

    // Falling Hearts from Top
    confetti({
      particleCount: 5,
      angle: 270,
      spread: 180,
      origin: { x: 0.5, y: -0.1 }, // Top center
      colors: ["#ff69b4", "#ff0000"],
      // @ts-ignore
      shapes: ["heart"],
      scalar: 2, // Bigger hearts
      drift: 0,
      gravity: 1,
      zIndex: 200,
    });
  }, 250);
}

// Floating Hearts Logic
let lastHeartTime = 0;
function handleMouseMove(e: MouseEvent | TouchEvent) {
  const now = Date.now();
  if (now - lastHeartTime < 50) return; // Limit to 1 heart every 50ms
  lastHeartTime = now;

  const x = "touches" in e ? e.touches[0].clientX : e.clientX;
  const y = "touches" in e ? e.touches[0].clientY : e.clientY;

  const heart = document.createElement("div");
  heart.innerHTML = "❤️";
  heart.className =
    "fixed pointer-events-none text-xl z-[100] animate-float-up";
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;

  // Random slight variation
  const randomX = (Math.random() - 0.5) * 20;
  heart.style.transform = `translateX(${randomX}px)`;

  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 1000);
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 bg-pink-50 flex flex-col items-center justify-center p-4 overflow-hidden"
    @mousemove="handleMouseMove"
    @touchmove="handleMouseMove"
  >
    <!-- Go Back Button (since we're full screen) -->
    <button
      @click="$router.back()"
      class="absolute top-4 left-4 text-pink-400 hover:text-pink-600 font-semibold flex items-center gap-2 z-50 bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm transition-colors"
    >
      ← Back
    </button>

    <!-- Begging Modal -->
    <div
      v-if="showBeggingModal && !isAccepted"
      class="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        class="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl transform scale-100 animate-bounce-in relative"
      >
        <button
          @click="handleModalClose"
          class="absolute top-2 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          &times;
        </button>
        <h2 class="text-2xl font-bold text-pink-600 mb-4">Wait! 🥺</h2>
        <p class="text-gray-600 mb-6">
          I know you clicked No a lot... but surely you don't mean it? Please
          give me one more chance!
        </p>
        <div class="flex justify-center gap-4">
          <button
            @click="handleHeckYes"
            class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105"
          >
            Okay, Yes! 💖
          </button>
        </div>
      </div>
    </div>

    <!-- Success State -->
    <div
      v-if="isAccepted"
      class="animate-bounce-in flex flex-col items-center gap-6 z-20 w-full max-w-md"
    >
      <img
        :src="currentStickerUrl"
        alt="Happy Sticker"
        class="w-full max-w-[280px] h-auto object-contain mx-auto"
      />

      <h1
        class="text-4xl md:text-6xl font-bold text-pink-600 drop-shadow-sm text-center px-4 leading-tight whitespace-nowrap"
      >
        {{ mainMessage }}
      </h1>
      <div
        class="text-pink-500 mt-4 font-medium max-w-lg text-center leading-relaxed"
      >
        <p class="text-xl md:text-2xl min-h-[60px]">
          "{{ displayedLoveText }}"
        </p>
        <p
          v-if="showSignature"
          class="text-lg md:text-xl mt-4 font-bold text-pink-600 animate-fade-in"
        >
          - Leigh
        </p>
      </div>
    </div>

    <!-- Proposal State -->
    <div
      v-else
      class="flex flex-col items-center gap-6 w-full max-w-2xl z-10 relative h-full justify-center"
    >
      <!-- GIF Container -->
      <div
        class="w-full max-w-[250px] md:max-w-[300px] aspect-square transition-all duration-300 transform hover:scale-105 cursor-pointer mx-auto"
      >
        <img
          :src="currentStickerUrl"
          alt="Reaction Sticker"
          class="w-full h-full object-contain"
        />
      </div>

      <h1
        class="text-xl md:text-5xl font-bold text-pink-600 transition-all duration-300 drop-shadow-sm min-h-[80px] flex items-center justify-center px-4 text-center leading-tight whitespace-nowrap"
      >
        {{ mainMessage }}
      </h1>

      <div
        class="flex flex-wrap gap-4 md:gap-8 justify-center items-center mt-4 w-full relative min-h-[150px]"
      >
        <!-- Yes Button (Grows) -->
        <button
          @click="handleHeckYes"
          class="bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg transition-all duration-300 z-10 flex items-center justify-center gap-2"
          :style="{
            transform: `scale(${yesButtonScale})`,
            padding: isAccepted ? '1rem 3rem' : '1rem 2.5rem',
            fontSize: isAccepted ? '1.5rem' : '1.2rem',
            minWidth: '160px',
          }"
        >
          Yes 💖
        </button>

        <!-- No Button (Runs away) -->
        <button
          v-if="isNoButtonVisible"
          @mouseenter="handleNoInteraction"
          @click="handleNoInteraction"
          class="bg-red-500 hover:bg-red-600 text-white font-bold py-3 md:py-4 px-8 md:px-10 rounded-full shadow-lg transition-all duration-200 ease-out whitespace-nowrap"
          :class="{ absolute: isNoButtonMoved }"
          :style="
            isNoButtonMoved
              ? {
                  top: noButtonPosition.top,
                  left: noButtonPosition.left,
                  transform: 'translate(-50%, -50%)',
                }
              : {}
          "
        >
          {{ currentNoText }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-bounce-in {
  animation: bounceIn 1s cubic-bezier(0.215, 0.61, 0.355, 1) both;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }
  40% {
    transform: scale3d(0.9, 0.9, 0.9);
  }
  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }
  80% {
    transform: scale3d(0.97, 0.97, 0.97);
  }
  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes floatUp {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-50px) scale(1.5);
    opacity: 0;
  }
}

.animate-float-up {
  animation: floatUp 1s ease-out forwards;
}
</style>
