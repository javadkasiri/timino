<template>
  <div class="conversation-panel">
    <MessageList
      :customerId="customerId"
      :agentId="agentId"
      :conversationId="conversationId"
    />
    <MessageInput :draft="draft" @update-draft="handleUpdateDraft" />
  </div>
</template>

<script>
import MessageList from "./MessageList.vue";
import MessageInput from "./MessageInput.vue";

export default {
  components: { MessageList, MessageInput },
  props: {
    customerId: String,
    agentId: String,
    conversationId: String,
    draft: {
      type: String,
      default: "",
    },
  },
  methods: {
    handleUpdateDraft(message) {
      this.$emit("update-draft", {
        conversationId: this.conversationId,
        message,
      });
    },
  },
};
</script>

<style scoped>
.conversation-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: 0;
  margin: 0;
}
</style>
