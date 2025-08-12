<template>
  <div class="management">
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="{ active: currentTab === tab }"
        @click="currentTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <div class="tab-content">
      <ManagementLabels v-if="currentTab === 'Labels'" />
      <ManagementReports v-if="currentTab === 'Reports'" />
      <ManagementActivities v-if="currentTab === 'Activities'" />
      <ManagementSchedules v-if="currentTab === 'Schedules'" />
    </div>
  </div>
</template>

<script>
import ManagementLabels from "@/components/management/management-labels/ManagementLabels.vue";
import ManagementReports from "@/components/management/ManagementReports.vue";
import ManagementActivities from "@/components/management/ManagementActivities.vue";
import ManagementSchedules from "@/components/management/ManagementSchedules.vue";

export default {
  components: {
    ManagementLabels,
    ManagementReports,
    ManagementActivities,
    ManagementSchedules,
  },
  data() {
    return {
      tabs: ["Labels", "Reports", "Activities", "Schedules"],
      currentTab: "Labels",
    };
  },
};
</script>

<style scoped>
.management {
  padding: 20px;
}

.tabs {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.tabs button {
  background: none;
  border: none;
  padding: 10px 30px;
  font-weight: bold;
  cursor: pointer;
  color: #555;
  border-bottom: 2px solid transparent;
  transition: 0.3s;
  font-size: 15px;
}

.tabs button.active {
  color: black;
  border-color: #337efe;
}

.tab-content {
  background: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  margin: 0 !important;
}
</style>
