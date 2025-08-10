<template>
  <div id="app">
    <!-- فقط وقتی لاگین نیست navbar نمایش داده بشه -->
    <AppNavbar v-if="!isLoggedIn" />
    <router-view />
  </div>
</template>

<script>
import AppNavbar from "./components/layout/AppNavbar.vue";
import { auth } from "./utils/auth";

export default {
  name: "App",
  components: {
    AppNavbar,
  },
  computed: {
    isLoggedIn() {
      return auth.isLoggedIn;
    },
  },
  async mounted() {
    const token = localStorage.getItem("token");
    if (auth.isLoggedIn || token) {
      try {
        const res = await fetch("http://localhost:3000/api/check-session", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Session invalid");
        }

        auth.isLoggedIn = true;
      } catch (err) {
        console.warn("Session expired or failed:", err);
        auth.isLoggedIn = false;
        localStorage.removeItem("token");
        this.$router.push("/");
      }
    }
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  font-family: "Inter", sans-serif;
}

#app {
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 20px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ddd;
}

nav a {
  color: #2c3e50;
  margin: 0 5px;
  text-decoration: none;
}

.dashboard-layout {
  display: flex;
  align-items: stretch;
}
</style>
