<template>
  <div class="topbar">
    <!-- نوار جستجو با حالت باز و بسته -->
    <div
      class="search-container"
      :class="{ expanded: showSearch }"
      @click.stop="expandSearch"
    >
      <span class="material-icons search-icon">search</span>
      <input
        type="text"
        placeholder="Search"
        :class="{ visible: showSearch }"
        @blur="collapseSearch"
        ref="searchInput"
      />
    </div>

    <!-- خروج از حساب -->
    <button class="icon-button logout-button" @click="logout">
      <span class="material-icons">power_settings_new</span>
    </button>

    <!-- اعلان با badge -->
    <div class="notification-wrapper">
      <button class="icon-button" @click="$emit('notification-click')">
        <span class="material-icons">notifications_none</span>
        <span v-if="hasNotifications" class="notification-badge"></span>
      </button>
    </div>

    <!-- صدا -->
    <button class="icon-button" @click="toggleVolume">
      <span class="material-icons">
        {{ isMuted ? "volume_off" : "volume_up" }}
      </span>
    </button>

    <!-- حالت شب -->
    <button class="icon-button" @click="$emit('toggle-dark')">
      <span class="material-icons">dark_mode</span>
    </button>

    <!-- تنظیمات -->
    <router-link to="/dashboard/settings" class="icon-button">
      <span class="material-icons">settings</span>
    </router-link>

    <!-- آیکون حساب کاربری -->
    <router-link to="/dashboard/profile" class="icon-button">
      <span class="material-icons account-icon">account_circle</span>
    </router-link>
  </div>
</template>

<script>
import { auth } from "@/utils/auth";

export default {
  name: "UserTopbar",
  props: {
    hasNotifications: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isMuted: false,
      showSearch: false,
    };
  },
  methods: {
    toggleVolume() {
      this.isMuted = !this.isMuted;
    },
    expandSearch() {
      this.showSearch = true;
      this.$nextTick(() => {
        this.$refs.searchInput?.focus();
      });
    },
    collapseSearch() {
      this.showSearch = false;
    },
    async logout() {
      try {
        const res = await fetch("http://localhost:3000/api/logout", {
          method: "POST",
          credentials: "include",
        });
        localStorage.removeItem("token");
        auth.isLoggedIn = false;
        this.$emit("logout");
        if (res.ok) {
          this.$router.push("/");
        } else {
          console.error("Logout failed");
        }
      } catch (err) {
        console.error("Logout error:", err);
      }
    },
  },
};
</script>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #ffffff;
  padding: 8px 10px;
  border-radius: 40px;
  width: fit-content;
  max-width: 100%;
}

/* نوار جستجو */
.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  border-radius: 30px;
  background-color: #dfe5f1;
  overflow: hidden;
  cursor: pointer;
  width: 30px;
  padding-left: 0;
  transition: width 0.4s ease;
}

.search-container.expanded {
  width: 220px;
  padding-left: 8px;
  cursor: text;
}

.search-container input {
  border: none;
  outline: none;
  background: transparent;
  padding-left: 6px;
  font-size: 14px;
  width: 100%;
  transition: opacity 0.4s ease;
  opacity: 0;
  pointer-events: none;
}

.search-container input[v-show="false"] {
  opacity: 0;
  pointer-events: none;
}

.search-container input.visible {
  opacity: 1;
  pointer-events: auto;
}

/* آیکون سرچ */
.search-icon {
  margin-left: 10px;
  font-size: 20px;
  color: #576d97;
  flex-shrink: 0;
  transition: color 0.3s ease;
}

.search-container.expanded .search-icon {
  color: #9ca3af;
    margin-left: 0px;

}

.search-container:not(.expanded):hover .search-icon {
  color: #202b3d;
}

.search-container:not(.expanded):hover {
  background-color: #dfe5f1;
}

/* دکمه‌های عمومی */
.icon-button {
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.icon-button .material-icons {
  font-size: 22px;
  color: #576d97;
  transition: color 0.2s ease;
}

.icon-button:hover {
  background-color: #dfe5f1;
}

.icon-button:hover .material-icons {
  color: #202b3d;
}

/* نوتیفیکیشن */
.notification-wrapper {
  position: relative;
  display: flex;
}

.notification-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
  border: 1px solid #ffffff;
}

/* آیکون اکانت */
.account-icon {
  font-size: 32px;
}

/* دکمه خروج */
.logout-button .material-icons {
  color: #576d97;
  transition: color 0.2s ease;
}

.logout-button:hover .material-icons {
  color: #e53935;
}
</style>
