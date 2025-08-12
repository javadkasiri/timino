<template>
  <div class="message-input">
    <div class="input-container">
      <span class="material-symbols-outlined icon">mood</span>

      <textarea
        v-model="message"
        class="message-textarea"
        ref="input"
        rows="1"
        @input="handleInput"
        @keydown="handleKeydown"
      ></textarea>

      <span class="material-symbols-outlined icon">attach_file</span>
    </div>

    <button class="send-btn" @click="sendMessage">
      <span class="material-symbols-outlined">send</span>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    draft: {
      type: String,
      default: "",
    },
    conversationId: String,
    updateDraft: Function,
  },
  data() {
    return {
      message: this.draft,
    };
  },
  watch: {
    conversationId() {
      this.message = this.draft || "";

      this.$nextTick(() => {
        const textarea = this.$refs.input;
        if (textarea) {
          textarea.style.height = "auto";
          this.autoResize();
        }
      });
    },
    draft(newVal) {
      this.message = newVal;
      this.$nextTick(() => this.autoResize());
    },
    message(newVal) {
      if (this.updateDraft && this.conversationId) {
        this.updateDraft(this.conversationId, newVal);
      }
    },
  },
  methods: {
    sendMessage() {
      if (this.message.trim()) {
        console.log("Message sent:", this.message);
        this.message = "";
        this.emitDraft();

        this.$nextTick(() => {
          const textarea = this.$refs.input;
          if (textarea) {
            textarea.style.height = "auto";
          }
        });
      }
    },
    autoResize() {
      const textarea = this.$refs.input;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      }
    },
    handleKeydown(e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    },
    handleInput() {
      this.autoResize();
      this.emitDraft();
    },
    emitDraft() {
      this.$emit("update-draft", this.message);
    },
  },
  mounted() {
    this.autoResize();
  },
};
</script>

<style scoped>
.message-input {
  display: flex;
  align-items: flex-end;
  background-color: #e4e5e8;
  padding: 10px 16px;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  scrollbar-width: none;
}

.input-container {
  display: flex;
  align-items: flex-end;
  background-color: #fff;
  border-radius: 20px;
  flex: 1;
  padding: 6px 12px;
  box-sizing: border-box;
  gap: 8px;
}

.message-textarea {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 6px 0;
  resize: none;
  overflow: hidden;
  line-height: 1.4;
  background-color: transparent;
  box-sizing: border-box;
  min-height: 20px;
  max-height: 150px;
  overflow-y: auto;
  scrollbar-width: none; /* برای Firefox */
}
/* برای Chrome و Safari */
.chat-textarea::-webkit-scrollbar {
  display: none;
}

.icon {
  font-size: 20px;
  color: #555;
  cursor: pointer;
  display: flex;
  align-items: flex-end;
  padding: 6px 0;
}

.send-btn {
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 50%;
  padding: 10px;
  width: 44px;
  height: 44px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.send-btn:hover {
  background-color: #006ae1;
}

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
  user-select: none;
}
</style>
