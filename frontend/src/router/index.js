//ایمپورت توابع مربوط به ساختن روت و استفاده از history mode
import { createRouter, createWebHistory } from "vue-router";

//ایمپورت کامپوننت‌هایی که در مسیرهای مختلف قرار می‌گیرند.
import Home from "../views/Home.vue";
import Signup from "../views/Signup.vue";
import Login from "../views/Login.vue";
import Dashboard from "../views/dashboard/Dashboard.vue";
import DashboardHome from "../views/dashboard/DashboardHome.vue";
import DashboardManagement from "../views/dashboard/DashboardManagement.vue";
import DashboardSupport from "../views/dashboard/DashboardSupport.vue";
import DashboardWorkspace from "../views/dashboard/DashboardWorkspace.vue";
import DashboardIntegration from "../views/dashboard/DashboardIntegration.vue";

//تعریف مسیرها
const routes = [
  { path: "/", component: Home },

  { path: "/signup", component: Signup, meta: { hideNavbar: true } },
  { path: "/login", component: Login, meta: { hideNavbar: true } },

  {
    path: "/dashboard", //مسیر /dashboard فقط برای کاربران لاگین شده است
    component: Dashboard,
    meta: { requiresAuth: true, hideNavbar: true },
    children: [
      { path: "", component: DashboardHome },
      { path: "management", component: DashboardManagement },
      { path: "support", component: DashboardSupport },
      { path: "workspace", component: DashboardWorkspace },
      { path: "integration", component: DashboardIntegration },
    ],
  },
];

//استفاده از تاریخچه‌ی مرورگر به جای hash mode.
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// گارد برای بررسی اعتبار توکن از طریق کوکی
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      const res = await fetch("http://localhost:3000/api/dashboard", {
        method: "GET",
        credentials: "include", // برای ارسال کوکی HttpOnly
      });
      if (res.ok) {
        next(); // دسترسی آزاد است
      } else {
        next("/login"); // توکن معتبر نیست
      }
    } catch (err) {
      console.error("Error validating session:", err);
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
