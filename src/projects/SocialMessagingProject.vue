<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from "vue";

// --- Types ---

type MessageStatus = "sent" | "delivered" | "read";

type Message = {
  id: string;
  text: string;
  senderId: string; // 'me' or contactId
  timestamp: number;
  status: MessageStatus;
  type: "text" | "image";
};

type Contact = {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
  typing: boolean;
};

type Conversation = {
  contactId: string;
  messages: Message[];
  lastMessage?: string;
  lastMessageTime?: number;
  unreadCount: number;
};

// --- Mock Data ---

const INITIAL_CONTACTS: Contact[] = [
  {
    id: "alice",
    name: "Alice Cooper",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    isOnline: true,
    lastSeen: "Now",
    typing: false,
  },
  {
    id: "bob",
    name: "Bob Smith",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80",
    isOnline: false,
    lastSeen: "10m ago",
    typing: false,
  },
  {
    id: "charlie",
    name: "Charlie Brown",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    isOnline: true,
    lastSeen: "Now",
    typing: false,
  },
];

const MOCK_REPLIES = [
  "That's interesting! Tell me more.",
  "I was thinking the same thing.",
  "Can we discuss this later?",
  "Haha, totally!",
  "Sure, sounds good.",
  "I'm not sure about that.",
  "Let's catch up tomorrow.",
  "Have you seen the latest update?",
  "Cool.",
  "Sent you the file.",
];

// --- State ---

const contacts = ref<Contact[]>(INITIAL_CONTACTS);
const conversations = ref<Record<string, Conversation>>({});
const selectedContactId = ref<string | null>(null);
const searchQuery = ref("");
const newMessageText = ref("");
const chatContainer = ref<HTMLElement | null>(null);

// --- Computed ---

const filteredContacts = computed(() => {
  if (!searchQuery.value) return contacts.value;
  return contacts.value.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const currentConversation = computed(() => {
  if (!selectedContactId.value) return null;
  return conversations.value[selectedContactId.value];
});

const currentContact = computed(() => {
  return contacts.value.find((c) => c.id === selectedContactId.value);
});

const sortedContacts = computed(() => {
  // Sort contacts by last message time (descending)
  return [...filteredContacts.value].sort((a, b) => {
    const timeA = conversations.value[a.id]?.lastMessageTime || 0;
    const timeB = conversations.value[b.id]?.lastMessageTime || 0;
    return timeB - timeA;
  });
});

// --- Logic ---

function initConversations() {
  // Load from LS or Init
  const stored = localStorage.getItem("social-messaging-conversations");
  if (stored) {
    conversations.value = JSON.parse(stored);
  } else {
    // Init empty conversations for contacts if truly new
    contacts.value.forEach((c) => {
      conversations.value[c.id] = {
        contactId: c.id,
        messages: [],
        unreadCount: 0,
      };
    });

    // Seed a welcome message for Alice
    addMessage(
      "alice",
      "Hey! Welcome to the secure chat app.",
      "alice",
      "read",
    );
  }
}

function selectContact(id: string) {
  selectedContactId.value = id;
  if (conversations.value[id]) {
    conversations.value[id].unreadCount = 0;
    saveState();
  }
  scrollToBottom();

  // Mobile UI handling could go here (e.g., switching view mode)
}

function formatTime(timestamp: number) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
}

function addMessage(
  contactId: string,
  text: string,
  senderId: "me" | string,
  status: MessageStatus = "sent",
) {
  if (!conversations.value[contactId]) {
    conversations.value[contactId] = {
      contactId,
      messages: [],
      unreadCount: 0,
    };
  }

  const msg: Message = {
    id: Date.now().toString() + Math.random(),
    text,
    senderId,
    timestamp: Date.now(),
    status,
    type: "text",
  };

  conversations.value[contactId].messages.push(msg);
  conversations.value[contactId].lastMessage = text;
  conversations.value[contactId].lastMessageTime = msg.timestamp;

  if (senderId !== "me" && selectedContactId.value !== contactId) {
    conversations.value[contactId].unreadCount++;
  }

  saveState();
  if (selectedContactId.value === contactId) {
    scrollToBottom();
  }
}

async function sendMessage() {
  if (!newMessageText.value.trim() || !selectedContactId.value) return;

  const text = newMessageText.value;
  const receiverId = selectedContactId.value;
  newMessageText.value = "";

  // 1. Add user message
  addMessage(receiverId, text, "me", "sent");

  // 2. Simulate network delay -> Delivered
  setTimeout(() => {
    const chat = conversations.value[receiverId];
    const myMsg = chat.messages.find(
      (m) => m.text === text && m.senderId === "me",
    );
    if (myMsg) myMsg.status = "delivered";
  }, 1000);

  // 3. Simulate Reply Typing
  setTimeout(
    () => {
      const contact = contacts.value.find((c) => c.id === receiverId);
      if (contact) {
        contact.typing = true;

        // 4. Simulate Read status right before typing or during
        const chat = conversations.value[receiverId];
        chat.messages.forEach((m) => {
          if (m.senderId === "me" && m.status !== "read") m.status = "read";
        });
      }
    },
    1500 + Math.random() * 1000,
  );

  // 5. Receive Reply
  setTimeout(
    () => {
      const contact = contacts.value.find((c) => c.id === receiverId);
      if (contact) contact.typing = false;

      const replyText =
        MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
      addMessage(receiverId, replyText, receiverId, "sent"); // Sent from them
    },
    4000 + Math.random() * 2000,
  );
}

function saveState() {
  localStorage.setItem(
    "social-messaging-conversations",
    JSON.stringify(conversations.value),
  );
}

onMounted(() => {
  initConversations();

  // Persist contacts simply for typing state resets on reload if we wanted,
  // but contacts are mostly static mock data here besides 'typing'.
});

// Focus input when chatting
const inputField = ref<HTMLInputElement | null>(null);
watch(selectedContactId, () => {
  nextTick(() => inputField.value?.focus());
});
</script>

<template>
  <div
    class="max-w-6xl mx-auto h-[800px] bg-white rounded-3xl shadow-2xl overflow-hidden flex border border-neutral-200"
  >
    <!-- Sidebar (Left) -->
    <div class="w-80 border-r border-neutral-100 flex flex-col bg-neutral-50">
      <!-- Search Header -->
      <div class="p-4 border-b border-neutral-100 bg-white">
        <h2 class="text-xl font-bold mb-4">Messages</h2>
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search messages..."
            class="w-full pl-10 pr-4 py-2 bg-neutral-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 absolute left-3 top-3 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <!-- Contact List -->
      <div class="flex-1 overflow-y-auto">
        <button
          v-for="contact in sortedContacts"
          :key="contact.id"
          @click="selectContact(contact.id)"
          class="w-full p-4 flex items-center gap-3 hover:bg-white hover:shadow-sm transition-all border-b border-transparent hover:border-neutral-100"
          :class="
            selectedContactId === contact.id
              ? 'bg-white shadow border-r-4 border-r-primary-500'
              : ''
          "
        >
          <div class="relative">
            <img
              :src="contact.avatar"
              class="w-12 h-12 rounded-full object-cover border border-neutral-200"
              alt="Avatar"
            />
            <div
              v-if="contact.isOnline"
              class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
            ></div>
          </div>

          <div class="flex-1 text-left min-w-0">
            <div class="flex justify-between items-baseline mb-0.5">
              <span class="font-bold text-neutral-900 truncate">{{
                contact.name
              }}</span>
              <span
                class="text-xs text-neutral-400 flex-shrink-0"
                v-if="conversations[contact.id]?.lastMessageTime"
              >
                {{ formatTime(conversations[contact.id]!.lastMessageTime!) }}
              </span>
            </div>

            <div class="flex justify-between items-center">
              <p
                class="text-sm truncate pr-2"
                :class="
                  conversations[contact.id]?.unreadCount
                    ? 'font-semibold text-neutral-800'
                    : 'text-neutral-500'
                "
              >
                <span v-if="contact.typing" class="text-primary-500 italic"
                  >Typing...</span
                >
                <span v-else>{{
                  conversations[contact.id]?.lastMessage ||
                  "Start a conversation"
                }}</span>
              </p>

              <div
                v-if="conversations[contact.id]?.unreadCount"
                class="bg-primary-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center"
              >
                {{ conversations[contact.id]?.unreadCount }}
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Chat Area (Right) -->
    <div class="flex-1 flex flex-col bg-white">
      <!-- 1. Chat Header -->
      <div
        v-if="currentContact"
        class="p-4 border-b border-neutral-100 flex items-center justify-between bg-white/80 backdrop-blur sticky top-0 z-10"
      >
        <div class="flex items-center gap-3">
          <img
            :src="currentContact.avatar"
            class="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 class="font-bold text-neutral-900 leading-none mb-1">
              {{ currentContact.name }}
            </h3>
            <p class="text-xs text-neutral-500 flex items-center gap-1">
              <span
                v-if="currentContact.isOnline"
                class="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"
              ></span>
              {{
                currentContact.typing
                  ? "Typing..."
                  : currentContact.isOnline
                    ? "Online"
                    : `Last seen ${currentContact.lastSeen}`
              }}
            </p>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            class="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-full transition-colors"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <button
            class="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-full transition-colors"
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- 2. Messages List -->
      <div
        ref="chatContainer"
        class="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-50/50 scroll-smooth"
      >
        <div
          v-if="!currentContact"
          class="h-full flex items-center justify-center text-neutral-400 flex-col"
        >
          <div
            class="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-neutral-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <p>Select a conversation to start chatting</p>
        </div>

        <template v-else>
          <!-- Date Divider logic could go here -->

          <div
            v-for="(msg, index) in currentConversation?.messages || []"
            :key="msg.id"
            class="flex flex-col"
            :class="msg.senderId === 'me' ? 'items-end' : 'items-start'"
          >
            <!-- Message Bubble -->
            <div
              class="max-w-[70%] px-4 py-3 rounded-2xl text-sm shadow-sm relative group"
              :class="[
                msg.senderId === 'me'
                  ? 'bg-primary-600 text-white rounded-br-none'
                  : 'bg-white text-neutral-800 rounded-bl-none border border-neutral-100',
              ]"
            >
              {{ msg.text }}

              <!-- Timestamp & Status Tooltip -->
              <div
                class="mt-1 flex items-center justify-end gap-1 opacity-70 text-[10px]"
              >
                {{ formatTime(msg.timestamp) }}

                <!-- Checks for Sent Messages -->
                <span v-if="msg.senderId === 'me'" class="ml-1">
                  <svg
                    v-if="msg.status === 'sent'"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <svg
                    v-else-if="msg.status === 'delivered'"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span v-else-if="msg.status === 'read'" class="flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-3 w-3 text-blue-200"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path
                        fill-rule="evenodd"
                        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <!-- Simplification: Read icon usually double blue tick. Just simulating logic here -->
                    <span class="text-[9px] font-bold text-blue-100">Read</span>
                  </span>
                </span>
              </div>
            </div>
          </div>

          <!-- Live Typing Indicator in Chat -->
          <div
            v-if="currentContact?.typing"
            class="flex items-center gap-2 animate-pulse"
          >
            <img
              :src="currentContact.avatar"
              class="w-8 h-8 rounded-full opacity-50"
            />
            <div class="bg-neutral-200 px-4 py-3 rounded-2xl rounded-bl-none">
              <div class="flex gap-1">
                <div
                  class="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"
                ></div>
                <div
                  class="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-100"
                ></div>
                <div
                  class="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-200"
                ></div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- 3. Message Input -->
      <div
        v-if="currentContact"
        class="p-4 bg-white border-t border-neutral-100"
      >
        <form @submit.prevent="sendMessage" class="flex items-end gap-3">
          <div
            class="flex-1 bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary-100 focus-within:border-primary-500 transition-all flex items-center gap-2"
          >
            <input
              ref="inputField"
              v-model="newMessageText"
              type="text"
              placeholder="Type a message..."
              class="flex-1 bg-transparent border-none focus:ring-0 p-0 text-neutral-900 placeholder-neutral-400"
            />

            <button
              type="button"
              class="text-neutral-400 hover:text-neutral-600 transition-colors"
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>

          <button
            type="submit"
            :disabled="!newMessageText.trim()"
            class="p-4 bg-primary-600 text-white rounded-full hover:bg-primary-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-primary-500/30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 translate-x-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for webkit */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e5e5e5;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #d4d4d4;
}
</style>
