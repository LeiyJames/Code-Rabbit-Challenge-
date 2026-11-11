import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/HomePage.vue"),
  },
  {
    path: "/ui-library",
    name: "UiLibrary",
    component: () => import("@/views/UiLibraryPage.vue"),
  },
  {
    path: "/playground/:slug",
    name: "Playground",
    component: () => import("@/views/PlaygroundPage.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: "smooth" };
    } else if (from?.name === "Playground" && to.name === "Home") {
      return { el: "#projects", behavior: "smooth" };
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: "smooth" };
    }
  },
});

export default router;
