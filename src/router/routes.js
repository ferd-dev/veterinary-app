import { useAuthStore } from "../modules/auth/store/authStore";

const requireAuth = (to, from, next) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated()) {
    next("/login");
  } else {
    next();
  }
};

const requireNoAuth = (to, from, next) => {
  const authStore = useAuthStore();
  if (authStore.isAuthenticated()) {
    next("/dashboard");
  } else {
    next();
  }
};

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("../modules/dashboard/pages/DashboardPage.vue"),
        beforeEnter: requireAuth,
      },
      {
        path: "/dashboard",
        component: () => import("../modules/dashboard/pages/DashboardPage.vue"),
        beforeEnter: requireAuth,
      },
      {
        path: "/roles-permisos",
        component: () =>
          import("../modules/roles-permissions/pages/RolesPermissionsPage.vue"),
        beforeEnter: requireAuth,
      },
    ],
  },
  {
    path: "/login",
    component: () => import("layouts/BlankLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("../modules/auth/pages/LoginPage.vue"),
        beforeEnter: requireNoAuth,
      },
    ],
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
