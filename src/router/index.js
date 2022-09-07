import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/Sites.vue"),
    },
    {
      path: "/site/:code",
      name: "site",
      component: () => import("../views/Site.vue"),
    },
    {
      path: "/create-site",
      name: "create-site",
      component: () => import("../views/Site.vue"),
    },
    {
      path: "/site",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/Sites.vue"),
    },
  ],
});

export default router;
