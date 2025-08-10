<template>
  <div class="dashboard-body">
    <div class="wall-section">
      <DashboardWall />
    </div>
    <div class="event-section">
      <DashboardEvent />
    </div>
  </div>
</template>

<script>
import DashboardWall from "@/components/dashboard/DashboardWall.vue";
import DashboardEvent from "@/components/dashboard/DashboardEvent.vue";

export default {
  name: "DashboardHome",
  components: {
    DashboardWall,
    DashboardEvent,
  },
};
</script>

<style scoped>
.dashboard-body {
  display: flex;
  flex-direction: row;
  gap: 20px;
  height: 95vh;
  margin: auto 0;
}

.wall-section {
  flex: 2;
  height: 100%;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  padding: 10px;
  box-sizing: border-box;
}

.event-section {
  flex: 1;
  height: 100%;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  padding: 10px;
  box-sizing: border-box;
}
</style>
