<script lang="ts" setup>
import { DeleteOutlineOutlined } from '@vicons/material';

import { copyToClipBoard } from '@/pages/util';

const props = defineProps<{
  title: string;
  itemName: string;
}>();

const model = defineModel<string[]>('items', {
  required: true,
});

const items = ref(model.value);

const message = useMessage();

const itemToAdd = ref('');

const importListRaw = ref('');

const showModal = ref(false);

const label = `管理${props.title}`;

const toggleModal = () => {
  showModal.value = !showModal.value;
};

const addItem = () => {
  if (items.value.includes(itemToAdd.value.trim())) {
    return;
  }
  items.value = [itemToAdd.value.trim(), ...items.value];
  itemToAdd.value = '';
};

const deleteItem = (str: string) => {
  items.value = items.value.filter((item) => item !== str);
};

const submitTable = () => {
  model.value = [...items.value];
  showModal.value = false;
  message.success(`${props.title}更新成功`);
};

const exportList = async (ev: MouseEvent) => {
  const isSuccess = await copyToClipBoard(
    JSON.stringify(items.value, null, 0),
    ev.target as HTMLElement,
  );
  if (isSuccess) {
    message.success('导出成功：已复制到剪贴板');
  } else {
    message.success('导出失败');
  }
};

const importList = () => {
  const fromJson = (json: string): string[] | undefined => {
    const obj = JSON.parse(json);
    if (!Array.isArray(obj)) {
      return;
    }
    const lists: string[] = [];
    for (const item of obj) {
      if (typeof item !== 'string') {
        return;
      }
      lists.push(item.trim());
    }
    return lists;
  };
  const imported = fromJson(importListRaw.value);
  if (imported === undefined) {
    return;
  }
  const set = new Set([...items.value, ...imported]);
  items.value = Array.from(set);
  importListRaw.value = '';
};
</script>

<template>
  <c-button @label="label" size="small" @action="toggleModal" />
  <c-modal @title="title" v-model:show="showModal" :extraheight="120">
    <template #header-extra>
      <n-flex
        vertical
        size="large"
        style="max-width: 400px; margin-bottom: 16px"
      >
        <n-input-group>
          <n-input
            v-model:value="itemToAdd"
            size="small"
            @placeholder="itemName"
            :input-props="{ spellcheck: false }"
          />
          <c-button
            label="添加"
            :round="false"
            size="small"
            @action="addItem"
          />
        </n-input-group>
        <n-input
          v-model:value="importListRaw"
          type="textarea"
          size="small"
          placeholder="批量导入"
          :input-props="{ spellcheck: false }"
          :rows="1"
        />

        <n-flex align="center" :wrap="false">
          <c-button
            label="导出"
            :round="false"
            size="small"
            @action="exportList"
          />
          <c-button
            label="导入"
            :round="false"
            size="small"
            @action="importList"
          />
        </n-flex>
      </n-flex>
    </template>
    <n-table
      v-if="items.length !== 0"
      striped
      size="small"
      style="font-size: 12px; max-width: 400px"
    >
      <tr v-for="item in items" :key="item">
        <td>{{ item }}</td>
        <td>
          <c-button
            :icon="DeleteOutlineOutlined"
            text
            type="error"
            size="small"
            @action="deleteItem(item)"
          />
        </td>
      </tr>
    </n-table>
    <template #action>
      <c-button label="提交" type="primary" @action="submitTable()" />
    </template>
  </c-modal>
</template>
