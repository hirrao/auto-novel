<script lang="ts" setup>
import { useBlacklistStore } from '@/stores';

const blacklistStore = useBlacklistStore();
const { blacklist } = storeToRefs(blacklistStore);
</script>

<template>
  <c-block-button
    title="用户黑名单"
    item-name="用户名"
    v-model:items="blacklist.usernames"
  />
  <c-block-button
    title="标签黑名单"
    item-name="标签"
    v-model:items="blacklist.tags"
  />
</template>
