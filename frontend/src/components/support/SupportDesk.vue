<template>
  <div class="support-desk">
    <div class="recent-list">
      <RecentList
        :selectedConversationId="selectedConversationId"
        @select="handleSelectUser"
      />
    </div>
    <div class="conversation-panel">
      <ConversationPanel
        v-if="selectedConversationId"
        :customerId="selectedCustomerId"
        :agentId="selectedAgentId"
        :conversationId="selectedConversationId"
        :draft="draftMessages[selectedConversationId] || ''"
        @update-draft="handleUpdateDraft"
      />
      <div v-else class="placeholder">
        No conversation is selected from the list
      </div>
    </div>
    <div class="contact-panel">
      <ContactPanel
        v-if="selectedCustomerId"
        :customerId="selectedCustomerId"
        :agentId="selectedAgentId"
        :sender="selectedSender"
        :conversationId="selectedConversationId"
        :formResetKey="formResetKey"
        @select-conversation="selectedConversationId = $event"
      />
    </div>
  </div>
</template>

<script>
import RecentList from "./recent-list/RecentList.vue";
import ConversationPanel from "./conversation-panel/ConversationPanel.vue";
import ContactPanel from "./contact-panel/ContactPanel.vue";

export default {
  components: { RecentList, ConversationPanel, ContactPanel },
  data() {
    return {
      selectedCustomerId: null,
      selectedAgentId: null,
      selectedSender: "",
      selectedConversationId: null,
      formResetKey: 0,
      draftMessages: {},
    };
  },
  methods: {
    handleSelectUser({ customerId, agentId, sender, conversationId }) {
      this.selectedCustomerId = customerId;
      this.selectedAgentId = agentId;
      this.selectedSender = sender;
      this.selectedConversationId = conversationId;
      this.formResetKey++;
    },
    handleUpdateDraft({ conversationId, message }) {
      this.draftMessages[conversationId] = message;
    },
  },
};
</script>

<style scoped>
.support-desk {
  display: flex;
  height: calc(93%); /* حذف چسبندگی پایین */
  margin: 0px;
  background-color: #f0f2f5;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
  overflow: hidden;
}

.recent-list {
  width: 20%;
  background: #ffffff;
  overflow-y: auto;
  padding: 0;
  margin: 0;
}

.conversation-panel {
  flex: 1;
  height: 100%;
  padding: 0;
  margin: 0;
}

.contact-panel {
  width: 20%;
  background: #ffffff;
  padding: 0;
  margin: 0;
}
</style>
