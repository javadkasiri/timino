<template>
  <div class="label-list">
    <div v-if="isModal" class="modal-close" @click="$emit('close')">×</div>

    <div class="label-header">
      <div>Customer ID</div>
      <div>Title</div>
      <div>Description</div>
      <div>Created By</div>
      <div>Created At</div>
      <div>Status</div>
      <div>Options</div>
      <div>Response</div>
    </div>

    <div class="label-items">
      <LabelListItem
        v-for="label in labels"
        :key="label._id"
        :label="label"
        @update-label="handleUpdatedLabel"
      />
    </div>
  </div>
</template>

<script>
import LabelListItem from "./LabelListItem.vue";

export default {
  components: { LabelListItem },
  props: {
    customerId: {
      type: String,
      default: null,
    },
    isModal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      labels: [],
    };
  },
  async mounted() {
    const filter = this.customerId ? { customerId: this.customerId } : {};

    const res = await fetch("http://localhost:3000/api/dumdb/vueapp/labels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "get", filter }),
    });

    const json = await res.json();
    this.labels = json.result || [];
  },
  methods: {
    handleUpdatedLabel(updatedLabel) {
      const index = this.labels.findIndex((p) => p._id === updatedLabel._id);
      if (index !== -1) {
        // آپدیت اطلاعات در آرایه
        this.labels[index] = updatedLabel;
      }
    },
  },
};
</script>

<style scoped>
.label-list {
  width: 100%;
  min-width: 1200px;
  max-width: 100%;
  background: #fff;
  border-radius: 10px;
  overflow: visible;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: auto;
}
.modal-close {
  position: absolute;
  top: -10px;
  right: 2px;
  font-size: 24px;
  font-weight: bold;
  color: #888;
  cursor: pointer;
  z-index: 10;
  transition: 0.2s;
}
.modal-close:hover {
  color: #e74c3c;
}
.label-header {
  display: grid;
  grid-template-columns:
    1fr /* Customer ID */
    1fr /* Title */
    3fr /* Description */
    1fr /* Created By */
    1.2fr /* Created At */
    0.8fr /* Status */
    0.8fr /* Options */
    0.8fr; /* Response */
  font-weight: bold;
  color: #666;
  padding: 10px 10px 10px 5px;
  border-bottom: 2px solid #eee;
  text-align: center;
}

.label-header div {
  padding: 10px 8px;
  box-sizing: border-box;
}
.label-items {
  max-height: 630px; /* ارتفاع دلخواه */
  overflow-y: auto;
}
.label-items::-webkit-scrollbar {
  width: 4px;
}

.label-items::-webkit-scrollbar-track {
  background: transparent;
}

.label-items::-webkit-scrollbar-thumb {
  background-color: #999;
  border-radius: 4px;
}
</style>
