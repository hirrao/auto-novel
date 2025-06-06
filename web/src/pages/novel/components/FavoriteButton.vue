<script lang="ts" setup>
import { FavoriteBorderOutlined, FavoriteOutlined } from '@vicons/material';

import { Locator } from '@/data';

import { doAction } from '@/pages/util';

const props = defineProps<{
  favored: string | undefined;
  novel:
    | { type: 'web'; providerId: string; novelId: string }
    | { type: 'wenku'; novelId: string };
}>();
const emit = defineEmits<{
  'update:favored': [string | undefined];
}>();

const message = useMessage();

const { whoami } = Locator.authRepository();
const favoredRepository = Locator.favoredRepository();

onMounted(async () => {
  if (whoami.value.isSignedIn) {
    try {
      await favoredRepository.loadRemoteFavoreds();
    } catch (e) {
      message.error(`获取收藏列表失败：${e}`);
    }
  }
});

const favoreds = computed(
  () => favoredRepository.favoreds.value[props.novel.type],
);
const favoredTitle = computed(
  () => favoreds.value.find((it) => it.id === props.favored)?.title,
);

const favoriteNovel = (favoredId: string) =>
  doAction(
    favoredRepository.favoriteNovel(favoredId, props.novel).then(() => {
      emit('update:favored', favoredId);
      showFavoredModal.value = false;
    }),
    '收藏',
    message,
  );

const unfavoriteNovel = async () => {
  if (props.favored === undefined) return;
  await doAction(
    favoredRepository.unfavoriteNovel(props.favored, props.novel).then(() => {
      emit('update:favored', undefined);
      showFavoredModal.value = false;
    }),
    '取消收藏',
    message,
  );
};

const showFavoredModal = ref(false);
const selectedFavoredId = ref(props.favored ?? 'default');
</script>

<template>
  <template v-if="favoreds.length <= 1">
    <c-button
      v-if="favored && favoredTitle"
      label="已收藏"
      :icon="FavoriteOutlined"
      require-login
      @action="unfavoriteNovel"
    />
    <c-button
      v-else
      label="收藏"
      :icon="FavoriteBorderOutlined"
      require-login
      @action="favoriteNovel(favoreds[0].id)"
    />
  </template>

  <template v-else>
    <c-button
      :label="favored && favoredTitle ? '已收藏:' + favoredTitle : '收藏'"
      :icon="favored ? FavoriteOutlined : FavoriteBorderOutlined"
      require-login
      @action="showFavoredModal = true"
    />
  </template>

  <c-modal v-model:show="showFavoredModal" title="收藏到...">
    <n-radio-group v-model:value="selectedFavoredId">
      <n-flex vertical size="large">
        <n-radio
          v-for="favoredItem in favoreds"
          :key="favoredItem.id"
          :value="favoredItem.id"
        >
          {{ favoredItem.title }}
        </n-radio>
        <n-radio key="deleted" value="deleted">取消收藏</n-radio>
      </n-flex>
    </n-radio-group>
    <template #action>
      <c-button
        label="确定"
        require-login
        type="primary"
        @action="
          selectedFavoredId === 'deleted'
            ? unfavoriteNovel()
            : favoriteNovel(selectedFavoredId)
        "
      />
    </template>
  </c-modal>
</template>
