<template>
  <div class="contact-panel">
    <div class="half-box">
      <ContactInfo
        :key="customerId"
        :customerId="customerId"
        :sender="sender"
        :resetFormTrigger="formResetKey"
      />
    </div>
    <div class="half-box">
      <HistoryList
        :customerId="customerId"
        :selectedConversationId="conversationId"
        @select-conversation="handleConversationSelect"
      />
    </div>
  </div>
</template>

<script>
import ContactInfo from "./ContactInfo.vue";
import HistoryList from "./HistoryList.vue";

export default {
  components: {
    ContactInfo,
    HistoryList,
  },
  props: {
    customerId: String,
    agentId: String,
    sender: String,
    conversationId: String,
    formResetKey: Number,
  },
  data() {
    return {
      activeConversationId: null,
    };
  },
  methods: {
    handleConversationSelect(cid) {
      this.activeConversationId = cid;
      this.$emit("select-conversation", cid);
    },
  },
};
</script>

<style scoped>
.contact-panel {
  flex-direction: column;
  box-sizing: border-box;
}

.half-box {
  width: 100%;
  display: flex;
}
</style>
