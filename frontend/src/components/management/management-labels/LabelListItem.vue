<template>
  <div>
    <div :class="['label-row', { expanded: isExpanded }]">
      <!-- سایر ستون‌ها -->
      <div class="cell customer-id">{{ label.customerId }}</div>
      <div class="cell title">{{ label.title }}</div>

      <div class="cell description" @mouseenter="checkTruncation">
        <!-- حالت نمایش معمول -->
        <template v-if="!isEditingDescription">
          <span ref="descRef" class="description-text">
            {{ editableDescription }}
          </span>
          <div
            v-if="isTruncatable"
            class="description-expand-toggle"
            @click.stop="isExpanded = !isExpanded"
          >
            <span class="material-symbols-outlined">
              {{ isExpanded ? "expand_less" : "expand_more" }}
            </span>
          </div>
        </template>

        <!-- حالت ویرایش Description -->
        <template v-else>
          <div class="description-edit-wrapper">
            <textarea
              v-model="editableDescription"
              class="description-input"
              rows="2"
              @input="autoResizeDesc"
              ref="descTextarea"
            ></textarea>

            <!-- دکمه تأیید برای خروج از حالت ادیت -->
            <span
              class="material-symbols-outlined confirm-icon"
              @click="isEditingDescription = false"
            >
              check
            </span>
          </div>
        </template>
      </div>

      <div class="cell created-by">{{ label.createdBy }}</div>
      <div class="cell created-at">{{ formatDate(label.createdAt) }}</div>

      <div class="cell status">
        <span :class="['status-badge', label.status]">
          {{ label.status }}
        </span>
      </div>

      <div class="cell icons">
        <div class="file-icon-wrapper">
          <span
            class="material-symbols-outlined icon-button"
            @click.stop="openFileModal(label.labelFiles)"
          >
            description
          </span>
          <span
            v-if="
              Array.isArray(label.labelFiles) && label.labelFiles.length > 0
            "
            class="file-count-badge"
          >
            {{ label.labelFiles.length }}
          </span>
        </div>

        <div class="image-icon-wrapper">
          <span
            class="material-symbols-outlined icon-button"
            @click.stop="openImageModal(label.labelImages)"
          >
            image
          </span>

          <!-- اگر عکس داشت، تعداد را نمایش بده -->
          <span
            v-if="
              Array.isArray(label.labelImages) && label.labelImages.length > 0
            "
            class="image-count-badge"
          >
            {{ label.labelImages.length }}
          </span>
        </div>

        <!-- آیکون ویرایش برای Description -->
        <span
          v-if="!isEditingDescription"
          class="material-symbols-outlined icon-button"
          @click="isEditingDescription = true"
        >
          edit
        </span>
        <span v-else class="material-symbols-outlined icon-button">
          <label for="labelFileInput" style="cursor: pointer; margin: 0">
            attach_file
          </label>
        </span>

        <input
          id="labelFileInput"
          type="file"
          style="display: none"
          @change="handleDescFile"
        />

        <span class="material-symbols-outlined icon-button"> delete </span>
      </div>

      <div class="cell response-toggle">
        <button class="view-button" @click.stop="toggleResponse">
          View
          <span class="material-symbols-outlined">
            {{ isOpen ? "expand_less" : "expand_more" }}
          </span>
        </button>
      </div>
    </div>

    <!-- پاسخ -->
    <div v-if="isOpen" class="response-box">
      <!-- وضعیت Pending -->
      <template v-if="label.status === 'Pending'">
        <div class="note-pending-box">
          <label class="note-label"><strong>Note:</strong></label>
          <textarea
            v-model="editableNote"
            class="note-input"
            ref="noteInput"
            @input="autoResize"
            rows="1"
          />

          <label
            for="noteFileInput"
            class="material-symbols-outlined attach-icon"
            style="cursor: pointer"
          >
            attach_file
          </label>
          <input
            id="noteFileInput"
            type="file"
            style="display: none"
            @change="handleNoteFile"
          />

          <div class="pending-buttons">
            <button class="btn-resolved" @click="markAsResolved">
              Resolved
            </button>

            <button class="btn-reviewing" @click="markAsReviewing">
              Reviewing
            </button>
          </div>
        </div>
      </template>

      <!-- وضعیت Reviewing و Resolved -->
      <template v-else>
        <div class="note-resolved-box">
          <!-- حالت نمایش فقط متن -->
          <div v-if="!isEditingNote" class="note-display">
            {{ editableNote }}
          </div>

          <!-- حالت ویرایش Note -->
          <textarea
            v-else
            v-model="editableNote"
            class="note-display editable"
            @input="autoResize"
            ref="noteInput"
            rows="1"
          ></textarea>

          <div class="note-bottom-row">
            <div class="review-meta">
              <span><strong>Reviewed By:</strong> {{ label.reviewedBy }}</span>
              <span
                ><strong>Reviewed At:</strong>
                {{ formatDate(label.reviewedAt) }}</span
              >
            </div>

            <!-- دکمه‌ها -->
            <div class="resolved-buttons">
              <div class="file-icon-wrapper">
                <span
                  class="material-symbols-outlined icon-button"
                  @click.stop="openFileModal(label.noteFiles)"
                >
                  description
                </span>
                <span
                  v-if="
                    Array.isArray(label.noteFiles) && label.noteFiles.length > 0
                  "
                  class="file-count-badge"
                >
                  {{ label.noteFiles.length }}
                </span>
              </div>

              <div class="image-icon-wrapper">
                <span
                  class="material-symbols-outlined icon-button"
                  @click.stop="openImageModal(label.noteImages)"
                >
                  image
                </span>

                <!-- اگر عکس داشت، تعداد را نمایش بده -->
                <span
                  v-if="
                    Array.isArray(label.noteImages) &&
                    label.noteImages.length > 0
                  "
                  class="image-count-badge"
                >
                  {{ label.noteImages.length }}
                </span>
              </div>

              <span
                v-if="!isEditingNote"
                class="material-symbols-outlined icon-button"
                @click="startNoteEdit"
              >
                edit
              </span>

              <span v-else class="material-symbols-outlined icon-button">
                <label
                  for="noteFileInputResolved"
                  style="cursor: pointer; margin: 0"
                >
                  attach_file
                </label>
              </span>

              <input
                id="noteFileInputResolved"
                type="file"
                style="display: none"
                @change="handleNoteFile"
              />

              <button class="btn-resolved" @click="markAsResolved">
                Resolved
              </button>

              <button class="btn-reviewing" @click="markAsReviewing">
                Reviewing
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>

    <ImageModal
      :images="selectedImages"
      :visible="showImageModal"
      @close="showImageModal = false"
    />

    <FileModal
      v-if="showFileModal"
      :files="selectedFiles"
      :visible="showFileModal"
      @close="showFileModal = false"
    />
  </div>
</template>

<script>
import ImageModal from "../../layout/modals/ImageModal.vue";
import FileModal from "../../layout/modals/FileModal.vue";

export default {
  components: { ImageModal, FileModal },
  props: {
    label: Object,
  },
  data() {
    return {
      isOpen: false,
      isExpanded: false,
      isTruncatable: false,

      isEditingDescription: false,
      isEditingNote: false,

      editableDescription: this.label.description,
      editableNote: this.label.note || "",

      showImageModal: false,
      selectedImages: [],

      showFileModal: false,
      selectedFiles: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.checkTruncation();
      this.autoResize();
    });
  },

  methods: {
    toggleResponse() {
      this.isOpen = !this.isOpen;
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString(undefined, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    },
    checkTruncation() {
      this.$nextTick(() => {
        const el = this.$refs.descRef;
        if (!el) return;
        if (!this.isExpanded) {
          this.isTruncatable = el.scrollHeight > el.offsetHeight;
        } else {
          this.isTruncatable = true;
        }
      });
    },
    autoResize() {
      this.$nextTick(() => {
        const textarea = this.$refs.noteInput;
        if (textarea) {
          textarea.style.height = "auto";
          textarea.style.height = textarea.scrollHeight + "px";
        }
      });
    },
    autoResizeDesc() {
      const el = this.$refs.descTextarea;
      if (el) {
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
      }
    },
    handleLabelFile(e) {
      const file = e.target.files[0];
      console.log("description file:", file);
    },
    handleNoteFile(e) {
      const file = e.target.files[0];
      console.log("note file:", file);
    },
    startNoteEdit() {
      this.isEditingNote = true;
      this.$nextTick(() => this.autoResize());
    },
    markAsResolved() {
      this.isEditingNote = false;
      this.isOpen = false;
      this.updateLabelStatus("Resolved");
    },

    markAsReviewing() {
      this.isEditingNote = false;
      this.isOpen = false;
      this.updateLabelStatus("Reviewing");
    },
    async updateLabelStatus(status) {
      const updatedLabel = {
        _id: this.label._id,
        note: this.editableNote,
        status,
        reviewedBy: "user",
        reviewedAt: new Date().toISOString(),
      };

      console.log("ارسال:", updatedLabel);

      try {
        const res = await fetch(
          "http://localhost:3000/api/dumdb/vueapp/labels",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "update",
              data: updatedLabel,
            }),
          }
        );

        const result = await res.json();
        console.log("پاسخ:", result);
        this.$emit("update-label", result);
      } catch (e) {
        console.error("خطا:", e.message);
      }
    },
    openImageModal(images) {
      if (!images || images.length === 0) {
        return;
      }
      this.selectedImages = images;
      this.showImageModal = true;
    },
    closeImageModal() {
      this.showImageModal = false;
      this.selectedImages = [];
    },
    openFileModal(files) {
      if (Array.isArray(files) && files.length > 0) {
        this.selectedFiles = files;
        this.showFileModal = true;
      }
    },
    closeFileModal() {
      this.showFileModal = false;
    },
  },
};
</script>

<style scoped>
.label-row {
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
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 10px 6px 10px 10px;
  column-gap: 8px;
}

/* اصلاح مهم: حذف width از .cell */
.cell {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 4px;
  box-sizing: border-box;
  min-height: 50px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  position: relative;
}

/* مخصوص description برای چپ‌چینی محتوا */
.cell.description {
  justify-content: flex-start;
  align-items: flex-start;
  padding-left: 12px;
  padding-right: 28px; /* فضا برای فلش */
  text-align: left;
}
.cell.description.clickable {
  cursor: pointer;
}

.description-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-height: 1.4;
  word-break: break-word;
  width: 100%;
  text-align: justify;
}
.description-edit-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  margin-top: 4px;
  width: 100%;
  position: relative;
}
.description-input {
  width: 100%;
  padding: 8px 12px;
  padding-right: 30px;
  font-size: 16px;
  border-radius: 6px;
  border: 1px solid #ccc;
  line-height: 1.4;
  resize: none;
  font-family: "Vazirmatn", sans-serif;
  background: #fff;
  box-sizing: border-box;
  min-height: 80px;
  max-height: 150px;
  overflow-y: auto;
  scrollbar-width: none;
}
.description-input::-webkit-scrollbar {
  display: none;
}

.confirm-icon {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: transparent;
  color: #007bff;
  padding: 0px;
  font-size: 24px;
  cursor: pointer;
  z-index: 1;
}

.cell.icons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
}
.icon-button {
  cursor: pointer;
  color: #333;
  font-size: 24px;
  transition: color 0.2s ease;
}

/* حالت باز شده */
.label-row.expanded .description-text {
  -webkit-line-clamp: unset;
  display: block;
}
.description-expand-toggle {
  position: absolute;
  top: 0;
  right: 8px;
  width: 6px;
  height: 100%;
  background-color: #2196f3;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 0;
}

.description-expand-toggle .material-symbols-outlined {
  color: #ffffff;
  font-size: 22px;
  pointer-events: none;
}

.view-button {
  background-color: transparent;
  border: none;
  font-weight: bold;
  color: #007bff;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* وضعیت‌ها */
.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: #ffffff;
}
.status-badge.Pending {
  background: #ffc107;
}
.status-badge.Reviewing {
  background: #42a5f5;
}
.status-badge.Resolved {
  background: #4caf50;
}

/* جعبه پاسخ */
.response-box {
  display: flex;
  align-items: center;
  background-color: #e5e5e5;
  padding: 10px 26px;
  border-top: 1px solid #ddd;
  box-sizing: border-box;
  gap: 12px; /* فاصله بین آیتم‌ها */
}
/* pending*/
.note-pending-box {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
}
.note-label {
  white-space: nowrap;
  padding-top: 8px;
}
.note-container {
  display: flex;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
}
.note-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 6px;
}
.note-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.note-input {
  flex: 1;
  max-width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #aaa;
  min-height: 32px;
  max-height: 150px;
  resize: none;
  line-height: 20px;
  font-family: "Vazirmatn", sans-serif;
  overflow-y: auto; /* 👈 فعال کردن اسکرول */
  box-sizing: border-box;
  scrollbar-width: none; /* Firefox */
}
.note-input::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.attach-icon {
  font-size: 22px;
  color: #555;
  cursor: pointer;
  user-select: none;
  margin-left: -3px; /* نزدیک‌تر به دکمه‌ها */
  padding-top: 7px;
}
.pending-buttons {
  display: flex;
  gap: 8px;
  margin-top: 4px;
  margin-left: auto;
}

/* resolved*/
.note-resolved-box {
  width: 100%;
  background: #e5e5e5;
  padding: 10px 0px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.note-display {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid #fff;
  background-color: #fff;
  box-sizing: border-box;
  line-height: 20px;
  font-family: "Vazirmatn", sans-serif;
  white-space: pre-wrap;
  word-break: break-word;
  text-align: left;
}

/* در حالت فعال شدن ادیت */
.note-display.editable {
  border: 1px solid #aaa;
  resize: none;
  outline: none;
  overflow-y: auto;
  cursor: text;
  max-height: 150px; /* 👈 محدودیت رشد */
  scrollbar-width: none;
}
.note-display.editable::-webkit-scrollbar {
  display: none;
}

/* در فوکوس فقط در صورت فعال بودن ادیت */
.note-display.editable:focus {
  border: 2px solid #333;
}

/* اگر فوکوس گرفت ولی ادیت فعال نبود، دوباره سفید باشه */
.note-display:not(.editable):focus {
  border: 1px solid #fff;
  outline: none;
}

.note-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.review-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #333;
  flex-wrap: wrap;
}
.review-meta span strong {
  color: #000;
}
.resolved-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  cursor: pointer;
}

.review-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #333;
  flex-wrap: wrap;
}
.review-meta span strong {
  color: #000;
}

.btn-reviewing,
.btn-resolved {
  padding: 6px 12px;
  font-weight: bold;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-resolved {
  background-color: #4caf50;
}
.btn-reviewing {
  background-color: #42a5f5;
}

.image-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.image-modal-content {
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  max-width: 80vw;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}
.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}
.image-list img {
  max-width: 200px;
  max-height: 200px;
  object-fit: contain;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.image-icon-wrapper {
  position: relative;
  display: inline-block;
}

.image-count-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: #888; /* خاکستری */
  color: #ffffff;
  font-size: 10px;
  font-weight: bold;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.file-icon-wrapper {
  position: relative;
  display: inline-block;
}

.file-count-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: #888; /* خاکستری */
  color: #ffffff;
  font-size: 10px;
  font-weight: bold;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
</style>
