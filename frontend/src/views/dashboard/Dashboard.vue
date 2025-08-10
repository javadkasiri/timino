<template>
  <div class="dashboard-layout">
    <SidebarMenu ref="sidebarRef" />
    <div class="main-content">
      <!-- topbar گوشه راست بالا -->
      <div class="user-topbar-wrapper">
        <UserTopbar @logout="handleLogout" />
      </div>

      <!-- محتوا -->
      <div class="page-content">
        <h2 v-if="$route.path === '/dashboard'">Welcome to your Dashboard</h2>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import SidebarMenu from "../../components/layout/SidebarMenu.vue";
import UserTopbar from "@/components/layout/UserTopbar.vue";

export default {
  name: "DashboardLayout",
  components: {
    SidebarMenu,
    UserTopbar,
  },
  methods: {
    handleLogout() {
      // اگر ref موجود بود و متد resetToAuto داشت، آن را اجرا کن
      this.$refs.sidebarRef?.resetToAuto?.();
    },
  },
};
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  background-color: #f4f7fe; /* یا رنگ دلخواه پس‌زمینه کلی */
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: transparent; /* این مهم است */
}

/* فقط topbar گوشه راست بالا */
.user-topbar-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 20px 30px;
  background-color: #f4f7fe;
  /*border-bottom: 1px solid #e0e0e0;*/
}
.user-topbar-wrapper > * {
  max-width: fit-content;
}

/* صفحه محتوای پایین topbar */
.page-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

h2 {
  text-align: center;
  margin: 0;
  color: #2c3e50;
}
</style>
