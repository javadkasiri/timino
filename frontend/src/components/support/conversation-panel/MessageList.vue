<template>
  <div class="messages" ref="messagesContainer">
    <div class="inner-messages">
      <MessageCard
        v-for="msg in messages"
        :key="msg._id"
        :sender="msg.sender"
        :text="msg.text"
        :time="msg.time"
        :side="msg.side"
      />
    </div>
  </div>
</template>

<script>
import MessageCard from "./MessageCard.vue";

export default {
  components: { MessageCard },
  props: ["customerId", "agentId", "conversationId"],
  data() {
    return { messages: [] };
  },
  watch: {
    conversationId: "fetchMessages",
  },
  methods: {
    async fetchMessages() {
      if (!this.conversationId) return;
      try {
        const res = await fetch(
          "http://localhost:3000/api/dumdb/vueapp/chats",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "get",
              filter: {
                conversationId: this.conversationId,
              },
            }),
          }
        );
        const data = await res.json();
        this.messages = data.result || [];
      } catch (e) {
        console.error("[MessageList] fetch error:", e);
      }
    },
  },
  mounted() {
    this.fetchMessages();
  },
};
</script>

<style scoped>
.messages {
  flex: 1;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column-reverse; /* ✅ نمایش از پایین */
  padding: 10px;
  scroll-behavior: smooth;
}

.inner-messages {
  display: flex;
  flex-direction: column;
}

.messages::-webkit-scrollbar {
  width: 4px;
}

.messages::-webkit-scrollbar-track {
  background: transparent;
}

.messages::-webkit-scrollbar-thumb {
  background-color: #999;
  border-radius: 4px;
}
</style>
