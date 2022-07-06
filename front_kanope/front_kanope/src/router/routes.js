const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/", component: () => import("pages/Home.vue") },
      {
        path: "/devices",
        component: () => import("pages/Devices.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/relays",
        component: () => import("pages/Relays.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "/signinregister",
        component: () => import("pages/SignInRegister.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
