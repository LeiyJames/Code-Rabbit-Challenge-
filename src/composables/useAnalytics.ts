import { ref } from "vue";
import { supabase } from "../supabase";

export function useAnalytics() {
  const totalViews = ref(0);
  const projectClicks = ref<Record<string, number>>({});

  const isConfigured = !!(
    import.meta.env.VITE_SUPABASE_URL &&
    !import.meta.env.VITE_SUPABASE_URL.includes("your_project_url")
  );

  async function trackPageView() {
    // 1. Local Tracking
    const localViews =
      Number(localStorage.getItem("debug_total_views") || 0) + 1;
    localStorage.setItem("debug_total_views", localViews.toString());
    totalViews.value = localViews;

    // 2. Database Tracking
    if (!isConfigured) return;
    try {
      await supabase.rpc("increment_counter", { row_id: "total_views" });
    } catch (e) {
      // Fail silently if DB not ready
    }
  }

  async function trackProjectClick(slug: string) {
    // 1. Local Tracking
    const storageKey = `debug_click_${slug}`;
    const localClicks = Number(localStorage.getItem(storageKey) || 0) + 1;
    localStorage.setItem(storageKey, localClicks.toString());
    projectClicks.value[slug] = localClicks;

    // 2. Database Tracking
    if (!isConfigured) return;
    try {
      await supabase.rpc("increment_counter", { row_id: `project_${slug}` });
    } catch (e) {
      // Fail silently if DB not ready
    }
  }

  async function fetchStats() {
    // Load local stats first as baseline
    totalViews.value = Number(localStorage.getItem("debug_total_views") || 0);

    // Load all project clicks from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("debug_click_")) {
        const slug = key.replace("debug_click_", "");
        projectClicks.value[slug] = Number(localStorage.getItem(key));
      }
    }

    if (!isConfigured) return;

    // Attempt to merge with global DB stats
    const { data, error } = await supabase
      .from("analytics_counters")
      .select("*");

    if (!error && data) {
      data.forEach((item) => {
        if (item.id === "total_views") {
          // Use DB count if it's higher than local
          totalViews.value = Math.max(totalViews.value, item.count);
        } else if (item.id.startsWith("project_")) {
          const slug = item.id.replace("project_", "");
          projectClicks.value[slug] = Math.max(
            projectClicks.value[slug] || 0,
            item.count,
          );
        }
      });
    }

    console.log("[Analytics] Current Summary:", {
      totalViews: totalViews.value,
      projectPopularity: projectClicks.value,
    });
  }

  return {
    totalViews,
    projectClicks,
    trackPageView,
    trackProjectClick,
    fetchStats,
  };
}
