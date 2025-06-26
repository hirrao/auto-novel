<script lang="ts" setup>
import { Locator } from '@/data';

import { useArticleStore } from './ForumArticleStore';
import { ArticleCategory } from '@/model/Article';

const { articleId } = defineProps<{ articleId: string }>();

const { whoami } = Locator.authRepository();

const store = useArticleStore(articleId);
const { articleResult } = storeToRefs(store);

const getSubCategory = (category: ArticleCategory) => {
  if (category === 'Glossary' || category === 'ReadList') {
    return category;
  }
  return 'All';
};

const getCategory = (category: ArticleCategory) => {
  if (category === 'Glossary' || category === 'ReadList') {
    return 'General';
  }
  return category;
};

store.loadArticle().then((result) => {
  if (result?.ok) {
    document.title = result.value.title;
  }
});
</script>

<template>
  <div class="layout-content">
    <c-result :result="articleResult" v-slot="{ value: article }">
      <n-h1 prefix="bar">{{ article.title }}</n-h1>
      <n-text v-if="article.hidden" depth="3">[隐藏]</n-text>
      <n-p>
        {{ article.updateAt === article.createAt ? '发布' : '更新' }}于
        <n-time :time="article.updateAt * 1000" type="relative" />
        by {{ article.user.username }}
        <template
          v-if="whoami.isMe(article.user.username) || whoami.asMaintainer"
        >
          /
          <c-a
            :to="`/forum-edit/${article.id}?category=${getCategory(article.category)}&subCategory=${getSubCategory(article.category)}`"
          >
            编辑
          </c-a>
        </template>
      </n-p>
      <n-divider />

      <MarkdownView mode="article" :source="article.content" />

      <comment-list :site="`article-${articleId}`" :locked="article.locked" />
    </c-result>
  </div>
</template>
