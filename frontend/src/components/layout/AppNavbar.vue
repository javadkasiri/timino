<template>
  <nav class="navbar" v-if="!isAuthPage">
    <!-- لوگو + متن -->
    <div class="left">
      <a @click.prevent="goToDashboard" class="logo" style="cursor: pointer">
        <img src="@/assets/logo-01.png" alt="Logo" class="logo-img" />
        <span class="logo-text">CNP ONE</span>
      </a>
    </div>

    <!-- دکمه‌ها فقط وقتی مهمان هست -->
    <div class="guest-buttons" v-if="!isLoggedIn">
      <router-link to="/signup" class="btn-signup">Signup</router-link>
      <router-link to="/login" class="btn-login">Login</router-link>
    </div>
  </nav>
</template>

<script>
import { auth } from "../../utils/auth";

export default {
  name: "AppNavbar",
  computed: {
    isLoggedIn() {
      return auth.isLoggedIn;
    },
    isAuthPage() {
      const path = this.$route.path;
      return path === "/login" || path === "/signup";
    },
  },
  methods: {
    goToDashboard() {
      const token = localStorage.getItem("token");
      this.$router.push(token ? "/dashboard" : "/");
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");

.navbar {
  display: flex;
  justify-content: space-between;
  height: 42px;
  align-items: center;
  background-color: #f4f7fe;
  padding: 10px 20px;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: none !important;
  border-bottom: none !important;
}

.left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0px; /* فاصله بین لوگو و متن */
  text-decoration: none;
}

.logo-img {
  height: 32px;
  width: auto;
  display: block;
  margin-right: 10px;
}

.logo-text {
  font-size: 25px;
  font-weight: bold;
  color: #2b3674;
  margin-right: 10px;
}

.btn-signup,
.btn-login {
  padding: 8px 26px;
  border: 1.5px solid #2d53da;
  border-radius: 20px;
  transition: all 0.3s ease;
  text-decoration: none;
  font-size: 14px;
}

.btn-signup {
  background-color: white;
  color: #2d53da;
}
.btn-signup:hover {
  background-color: #2d53da;
  color: white;
}

.btn-login {
  background-color: #2d53da;
  color: white;
}
.btn-login:hover {
  background-color: #2544b3;
  border-color: #2544b3;
}

.guest-buttons {
  display: flex;
  align-items: center;
  gap: 0px;
}
</style>
