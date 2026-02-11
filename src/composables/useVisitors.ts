import { ref, onMounted, onUnmounted } from "vue";
import { supabase } from "../supabase";

export function useVisitors() {
  const activeVisitors = ref(1); // Start with 1 (the current user)

  // Don't initialize if keys are missing or placeholders
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("your_project_url")) {
    return { activeVisitors: ref(1) };
  }

  const channel = supabase.channel("online-users", {
    config: {
      presence: {
        key: "user",
      },
    },
  });

  onMounted(() => {
    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        // Count total presence across all keys
        let count = 0;
        for (const key in state) {
          count += state[key].length;
        }
        activeVisitors.value = Math.max(1, count);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });
  });

  onUnmounted(() => {
    channel.unsubscribe();
  });

  return {
    activeVisitors,
  };
}
