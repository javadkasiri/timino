<template>
  <div>
    <div class="labels-wrapper">
      <LabelList />
    </div>
  </div>
</template>

<script>
import LabelList from "./LabelList.vue";

export default {
  name: "ManagementLabels",
  components: {
    LabelList,
  },
};
</script>

<style scoped>
.labels-wrapper {
  margin: 0px;
}
</style>
