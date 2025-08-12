<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <!-- لوگو + فلش -->
    <div class="logo-area">
      <router-link to="/dashboard" class="logo-link">
        <img src="@/assets/logo-01.png" alt="Logo" />
        <span v-if="!isCollapsed" class="logo-text">CNP ONE</span>
      </router-link>
      <button class="toggle-btn" @click="toggleSidebar">
        <span class="material-icons">
          {{ isCollapsed ? "chevron_right" : "chevron_left" }}
        </span>
      </button>
    </div>

    <!-- منو -->
    <nav class="menu">
      <div class="menu-inner">
        <router-link
          to="/dashboard"
          class="menu-item"
          exact-active-class="router-link-exact-active"
        >
          <div class="icon-wrapper">
            <span class="material-icons">dashboard</span>
          </div>
          <span class="item-label" :class="{ hidden: isCollapsed }"
            >Dashboard</span
          >
          <span v-if="isCollapsed" class="tooltip-text">Dashboard</span>
        </router-link>

        <router-link to="/dashboard/management" class="menu-item">
          <div class="icon-wrapper">
            <span class="material-icons">editdocument</span>
          </div>
          <span class="item-label" :class="{ hidden: isCollapsed }"
            >Management</span
          >
          <span v-if="isCollapsed" class="tooltip-text">Management</span>
        </router-link>

        <router-link to="/dashboard/support" class="menu-item">
          <div class="icon-wrapper">
            <span class="material-icons">forum</span>
          </div>
          <span class="item-label" :class="{ hidden: isCollapsed }"
            >Support</span
          >
          <span v-if="isCollapsed" class="tooltip-text">Chat / Ticket</span>
        </router-link>

        <router-link to="/dashboard/workspace" class="menu-item">
          <div class="icon-wrapper">
            <span class="material-icons">trending_up</span>
          </div>
          <span class="item-label" :class="{ hidden: isCollapsed }"
            >Workspace</span
          >
          <span v-if="isCollapsed" class="tooltip-text">Marketing</span>
        </router-link>

        <router-link to="/dashboard/integration" class="menu-item">
          <div class="icon-wrapper">
            <span class="material-icons">cloud_download</span>
          </div>
          <span class="item-label" :class="{ hidden: isCollapsed }"
            >Integration</span
          >
          <span v-if="isCollapsed" class="tooltip-text">Data Grabber</span>
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<script>
export default {
  name: "SidebarMenu",
  data() {
    return {
      isCollapsed: false, // وضعیت فعلی سایدبار (باز یا بسته)
      userToggled: false, // آیا کاربر دستی تغییر داده؟
    };
  },
  mounted() {
    // مقدار ذخیره‌شده را از localStorage بخوان
    const storedCollapsed = localStorage.getItem("sidebar-collapsed");
    const storedUserToggle = localStorage.getItem("sidebar-user-toggle");

    this.userToggled = storedUserToggle === "true";

    if (this.userToggled && storedCollapsed !== null) {
      // اگر کاربر دستی تنظیم کرده، از همون استفاده کن
      this.isCollapsed = storedCollapsed === "true";
    } else {
      // اگر دستی نبود، خودکار بر اساس اندازه صفحه تنظیم کن
      this.isCollapsed = window.innerWidth <= 768;
    }

    // گوش دادن به تغییر اندازه صفحه
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
      this.userToggled = true;

      // ذخیره وضعیت جدید در localStorage
      localStorage.setItem("sidebar-collapsed", this.isCollapsed);
      localStorage.setItem("sidebar-user-toggle", "true");
    },
    handleResize() {
      // فقط زمانی سایدبار بر اساس سایز جمع/باز شود که کاربر دستی تغییر نداده باشد
      if (!this.userToggled) {
        this.isCollapsed = window.innerWidth <= 768;
      }
    },
    resetToAuto() {
      // پاک‌سازی حالت دستی کاربر (مثلاً بعد از logout)
      this.userToggled = false;
      localStorage.removeItem("sidebar-collapsed");
      localStorage.removeItem("sidebar-user-toggle");

      // بازتنظیم خودکار سایدبار بر اساس اندازه صفحه
      this.isCollapsed = window.innerWidth <= 768;
    },
  },
};
</script>

<style scoped>
.sidebar > nav {
  border: none;
  margin: 0;
  padding: 0;
}
.sidebar {
  width: 220px;
  transition: width 0.3s ease;
  height: 100vh;
  background-color: #202b3d;
  padding: 40px 5px 40px 15px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: visible;
}

.sidebar.collapsed {
  width: 70px;
}

.logo-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /*gap: 10px;*/
  margin-left: 9px;
  margin-bottom: 50px;
  position: relative;
  overflow: visible;
  text-decoration: none;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.logo-area img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  white-space: nowrap;
}

.toggle-btn {
  position: absolute;
  right: -60px; /* از منو بیرون بزنه */
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: transparent;
  border: none;
  color: #202b3d; /* فلش مشکی */
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

/* حالت hover: دایره سفید، فلش مشکی */
.toggle-btn:hover {
  background-color: #e5e5e5;
}

.menu {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 15px;
  background-color: transparent;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-right: 11px;
  width: 100%;
  height: 60px;
  padding: 0 20px;
  gap: 28px;
  box-sizing: border-box;
  color: #ffffff;
  background-color: transparent;
  font-size: 16px;
  border-radius: 8px;
  position: relative;
  text-decoration: none;
}

.menu-inner {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 15px;
  padding-right: 5px; /* 👈 فاصله از لبه راست */
}

.icon-wrapper {
  width: 24px;
  min-width: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sidebar.collapsed .menu-item {
  position: relative;
}

.material-icons {
  min-width: 24px;
  text-align: center;
  font-size: 20px;
}

.menu-item .material-icons {
  font-size: 20px;
  color: #ffffff;
}

.menu-item:hover {
  background-color: #2b3953;
  color: #ffffff;
}

.menu-item:hover .material-icons {
  color: #ffffff;
}

.item-label {
  width: 100px;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  opacity: 1;
  visibility: visible;
  width: auto;
}

.menu-item.router-link-exact-active {
  background-color: #337efe;
  color: #ffffff;
  font-weight: bold;
}
.menu-item.router-link-exact-active .material-icons {
  color: #ffffff;
}

.item-label.hidden {
  opacity: 0;
  width: 0;
  padding: 0;
  margin: 0;
  transition: none;
}

.tooltip-text {
  position: absolute;
  left: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%);
  background-color: #2b3953;
  color: #ffffff;
  padding: 6px 10px;
  font-size: 13px;
  white-space: nowrap;
  border-radius: 4px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  margin-left: 8px;
  z-index: 9999;
}

/* فقط زمانی که سایدبار جمع شده و موس روی menu-item هست */
.sidebar.collapsed .menu-item:hover .tooltip-text {
  opacity: 1;
}

@media (max-width: 768px) {
  .toggle-btn {
    right: -40px;
  }
}
</style>
