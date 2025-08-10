<template>
  <div class="history-list-wrapper">
    <div class="header">History</div>
    <div class="history-list" ref="historyListContainer">
      <p v-if="contactMessages.length === 0">No history was found</p>
      <HistoryListItem
        v-for="msg in contactMessages"
        :key="msg._id"
        :sender="msg.sender"
        :text="msg.text"
        :time="msg.time"
        :conversationId="msg.conversationId"
        :isActive="msg.conversationId === selectedConversationId"
        @select="handleSelect"
      />
    </div>
  </div>
</template>

<script>
import HistoryListItem from "./HistoryListItem.vue";

export default {
  name: "ContactMessages",
  components: { HistoryListItem },
  props: ["customerId", "selectedConversationId"],
  data() {
    return {
      contactMessages: [],
      activeConversationId: null,
    };
  },
  watch: {
    customerId(newVal) {
      if (newVal) this.fetchContactMessages();
    },
  },
  mounted() {
    if (this.customerId) this.fetchContactMessages();
  },
  methods: {
    async fetchContactMessages() {
      try {
        const res = await fetch(
          "http://localhost:3000/api/dumdb/vueapp/chats",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "get",
              filter: { senderId: this.customerId },
            }),
          }
        );

        const json = await res.json();
        const chats = json.result || [];

        const map = {};
        chats.forEach((chat) => {
          const cid = chat.conversationId;
          if (!map[cid] || new Date(chat.time) > new Date(map[cid].time)) {
            map[cid] = chat;
          }
        });

        this.contactMessages = Object.values(map).sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        );
        this.scrollToBottom();
      } catch (err) {
        console.error("[ContactMessages] Error fetching messages:", err);
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.historyListContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },

    handleSelect({ conversationId }) {
      this.activeConversationId = conversationId;
      this.$emit("select-conversation", conversationId);
    },
  },
};
</script>

<style scoped>
.history-list-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}

.header {
  font-size: 18px;
  font-weight: bold;
  padding: 12px 16px 6px;
  border-bottom: 2px solid #2196f3;
  width: fit-content;
  margin-left: 16px;
  margin-bottom: 10px;
}

.history-list {
  overflow-y: auto;
  box-sizing: border-box;
  max-height: 375px;
  display: flex;
  flex-direction: column;
  padding: 0 12px;
  width: 100%;
  max-width: 100%;
}

.history-list::-webkit-scrollbar {
  width: 4px;
}
.history-list::-webkit-scrollbar-track {
  background: transparent;
}
.history-list::-webkit-scrollbar-thumb {
  background-color: #999;
  border-radius: 4px;
}
</style>
