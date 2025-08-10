<template>
  <div class="file-modal-overlay" @click.self="close">
    <div class="file-modal-content">
      <span class="close-btn" @click="close">×</span>

      <!-- ✅ هدر ثابت -->
      <div class="file-header">
        <span class="header-cell-name">File Name</span>
        <span class="header-cell-type">Type</span>
        <span class="header-cell-size">Size</span>
        <span class="header-cell-download">DL</span>
      </div>

      <!-- ✅ لیست اسکرول‌پذیر -->
      <div class="file-list">
        <div v-for="(file, index) in files" :key="index" class="file-item">
          <span class="file-name">{{ getFileName(file) }}</span>
          <span class="file-type">{{ getFileType(file) }}</span>
          <span class="file-size">{{ getFileSize(file) }}</span>
          <a
            :href="getFileUrl(file)"
            download
            class="material-symbols-outlined download-icon"
            >arrow_circle_down</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    files: Array,
  },
  methods: {
    close() {
      this.$emit("close");
    },
    getFileUrl(file) {
      return `/label-files/${file}`; // از public فراخوانی میشه
    },
    getFileName(file) {
      const parts = file.split(".");
      parts.pop(); // حذف پسوند
      return parts.join("."); // ترکیب مجدد نام فایل بدون پسوند
    },
    getFileType(file) {
      const parts = file.split(".");
      return parts.length > 1 ? parts.pop().toUpperCase() : "-";
    },
    getFileSize() {
      // تستی فقط نمایش عدد فرضی - چون حجم واقعی رو سمت کلاینت نداریم
      return "320KB";
    },
  },
};
</script>

<style scoped>
.file-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-modal-content {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  width: 50vmin;
  max-height: 50vmin;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 25px;
  overflow: hidden;
}

/* هدر ثابت */
.file-header {
  display: grid;
  grid-template-columns: 50% 20% 20% 10%;
  font-weight: bold;
  background-color: #1976d2;
  color: #fff;
  padding: 12px 15px;
  border-radius: 4px;
  margin-bottom: 8px;
}
.header-cell-name {
  text-align: left;
}
.header-cell-download {
  text-align: right;
}

/* لیست اسکرول‌شونده */
.file-list {
  overflow-y: auto;
  max-height: 45vmin;
  width: 100%;
}
.file-list::-webkit-scrollbar {
  width: 0;
}

.file-item {
  display: grid;
  grid-template-columns: 50% 20% 20% 10%;
  background-color: #f5f5f5;
  padding: 8px 15px;
  margin-bottom: 8px;
  align-items: center;
  border-radius: 4px;
}
.file-item:last-child {
  margin-bottom: 0;
}

.file-name {
  text-align: left;
}

.file-name,
.file-type,
.file-size {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.download-icon {
  text-align: right;
  cursor: pointer;
  font-size: 22px;
  color: #1976d2;
  text-decoration: none;
}

.close-btn {
  position: absolute;
  top: 2px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
  color: #f5f5f5;
  z-index: 10;
}
.close-btn:hover {
  color: #e74c3c;
}
</style>
