<template>
  <main class="post-content">
    <article v-if="post" class="article">
      <!-- Header -->
      <header class="article-header">
        <div class="breadcrumb">
          <router-link to="/" class="breadcrumb-link">
            <span>← Back to Home</span>
          </router-link>
        </div>

        <div class="meta-info">
          <span class="comment">// {{ dir }}/{{ id }}.md</span>
          <span v-if="post.meta.date" class="meta-date">
            <span class="operator"> • </span>
            <span>{{ formatDate(post.meta.date as string) }}</span>
          </span>
        </div>

        <h1 class="article-title">
          {{ post.title }}
        </h1>
      </header>

      <!-- Content -->
      <div class="article-body" v-html="post.html" />
    </article>

    <div v-else class="error-state">
      <div class="error-icon">⚠️</div>
      <p class="error-message">
        <span class="keyword">throw new</span>
        <span class="class-name"> Error</span>
        <span class="brace">(</span>
        <span class="string">"Post not found"</span>
        <span class="brace">)</span>
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { findPost } from '../utils/load-content'

const route = useRoute()

const dir = computed(() => route.params.dir as string)
const id = computed(() => route.params.id as string)
const post = computed(() => findPost(dir.value, id.value))

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style scoped>
.post-content {
  height: 100%;
  overflow-y: auto;
  background: var(--monokai-bg);
  color: var(--monokai-fg);
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
}

/* Article */
.article {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 3rem;
  animation: fadeIn 0.5s ease-out;
}

/* Header */
.article-header {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.breadcrumb {
  margin-bottom: 1.5rem;
}

.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--monokai-comment);
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  padding: 0.5rem 0;
}

.breadcrumb-link:hover {
  color: var(--monokai-cyan);
}

.meta-info {
  font-size: 0.8rem;
  color: var(--monokai-comment);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.article-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--monokai-green);
  line-height: 1.2;
  margin: 0;
}

/* Article Body */
.article-body {
  line-height: 1.7;
  font-size: 1rem;
}

.article-body :deep(h1) {
  color: var(--monokai-green);
  font-size: 2rem;
  font-weight: 700;
  margin: 2rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border-color);
}

.article-body :deep(h2) {
  color: var(--monokai-cyan);
  font-size: 1.6rem;
  font-weight: 600;
  margin: 1.8rem 0 1rem;
}

.article-body :deep(h3) {
  color: var(--monokai-purple);
  font-size: 1.3rem;
  font-weight: 600;
  margin: 1.5rem 0 0.8rem;
}

.article-body :deep(h4) {
  color: var(--monokai-orange);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 1.2rem 0 0.6rem;
}

.article-body :deep(p) {
  color: var(--monokai-fg);
  margin: 1rem 0;
  line-height: 1.8;
}

.article-body :deep(a) {
  color: var(--monokai-cyan);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
}

.article-body :deep(a:hover) {
  color: var(--monokai-yellow);
  border-bottom-color: var(--monokai-yellow);
}

.article-body :deep(code) {
  background: var(--monokai-bg-lighter);
  color: var(--monokai-pink);
  padding: 0.2em 0.5em;
  border-radius: 3px;
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
}

.article-body :deep(pre) {
  background: var(--monokai-bg-light);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 1.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.article-body :deep(pre code) {
  background: none;
  color: var(--monokai-fg);
  padding: 0;
  font-size: 0.9em;
}

.article-body :deep(blockquote) {
  border-left: 4px solid var(--monokai-orange);
  background: var(--monokai-bg-light);
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: var(--monokai-comment);
  border-radius: 4px;
}

.article-body :deep(ul),
.article-body :deep(ol) {
  margin: 1rem 0;
  padding-left: 2rem;
}

.article-body :deep(li) {
  margin: 0.5rem 0;
  color: var(--monokai-fg);
}

.article-body :deep(li::marker) {
  color: var(--monokai-green);
}

.article-body :deep(strong) {
  color: var(--monokai-orange);
  font-weight: 600;
}

.article-body :deep(em) {
  color: var(--monokai-purple);
  font-style: italic;
}

.article-body :deep(hr) {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 2rem 0;
}

.article-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  background: var(--monokai-bg-light);
  border-radius: 6px;
  overflow: hidden;
}

.article-body :deep(th) {
  background: var(--monokai-bg-lighter);
  color: var(--monokai-green);
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid var(--border-color);
}

.article-body :deep(td) {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--monokai-fg);
}

.article-body :deep(tr:hover) {
  background: var(--monokai-bg-lighter);
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-message {
  font-size: 1.1rem;
}

/* Syntax Highlighting */
.comment {
  color: var(--monokai-comment);
  font-style: italic;
}

.keyword {
  color: var(--monokai-pink);
  font-weight: 500;
}

.string {
  color: var(--monokai-yellow);
}

.class-name {
  color: var(--monokai-green);
  font-weight: 600;
}

.operator {
  color: var(--monokai-pink);
}

.brace {
  color: var(--monokai-fg);
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .article {
    padding: 1.5rem;
  }

  .article-title {
    font-size: 2rem;
  }

  .article-body :deep(h1) {
    font-size: 1.6rem;
  }

  .article-body :deep(h2) {
    font-size: 1.4rem;
  }
}
</style>

