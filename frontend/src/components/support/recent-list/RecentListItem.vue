<template>
  <div
    class="recent-list-item"
    :class="{ active: isActive }"
    @click="selectItem"
  >
    <div class="avatar">
      <span class="material-symbols-outlined">person</span>
    </div>
    <div class="content">
      <div class="top-row">
        <span class="sender">{{ sender }}</span>
        <span class="time">{{ time }}</span>
      </div>
      <div class="text">{{ text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "sender",
    "customerId",
    "agentId",
    "text",
    "time",
    "isActive",
    "conversationId",
  ],
  methods: {
    selectItem() {
      this.$emit("select", {
        customerId: this.customerId,
        agentId: this.agentId,
        sender: this.sender,
        conversationId: this.conversationId,
      });
    },
  },
};
</script>

<style scoped>
.recent-list-item {
  display: flex;
  background-color: #f8f8f8;
  padding: 12px 16px;
  margin: 0px 15px;
  margin-bottom: 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.recent-list-item:last-child {
  margin-bottom: 0;
}

.recent-list-item:hover {
  background-color: #eef1f5;
}
.recent-list-item.active {
  background-color: #e3f2fd; /* آبی روشن */
}

.avatar {
  width: 40px;
  height: 40px;
  background-color: #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 12px;
  flex-shrink: 0;
}
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
  min-width: 0;
}
.top-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-weight: bold;
  font-size: 14px;
  color: #2c3e50;
  margin-bottom: 4px;
}
.sender {
  font-weight: bold;
  font-size: 14px;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
}
.time {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  margin-left: 8px;
}
.text {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
