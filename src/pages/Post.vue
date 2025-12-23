<template>
  <main class="editor-content">
    <div class="code-editor">
      <!-- Line Numbers Column -->
      <div class="line-numbers">
        <div 
          v-for="n in 100" 
          :key="n" 
          class="line-number"
        >
          {{ n }}
        </div>
      </div>

      <!-- Content Column -->
      <div class="content-area">
        <!-- Breadcrumb Navigation -->
        <div class="breadcrumb">
          <router-link to="/" class="breadcrumb-link">
            <span class="keyword">import</span>
            <span class="brace"> { </span>
            <span class="function">Home</span>
            <span class="brace"> } </span>
            <span class="keyword">from</span>
            <span class="string"> './index'</span>
          </router-link>
        </div>

        <article v-if="post" class="markdown-content">
          <!-- File Header -->
          <div class="file-header">
            <span class="comment">/**</span>
            <br>
            <span class="comment"> * File: {{ dir }}/{{ id }}.md</span>
            <br>
            <span class="comment" v-if="post.meta.date"> * Date: {{ formatDate(post.meta.date as string) }}</span>
            <br v-if="post.meta.date">
            <span class="comment"> * Title: {{ post.title }}</span>
            <br>
            <span class="comment"> */</span>
          </div>

          <!-- Title -->
          <div class="post-title">
            <span class="keyword">export</span>
            <span class="keyword"> const </span>
            <span class="class-name">{{ post.title }}</span>
            <span class="operator"> = </span>
            <span class="brace">{</span>
          </div>

          <!-- Content -->
          <div class="post-content" v-html="post.html" />

          <div class="post-footer">
            <span class="brace">}</span>
          </div>
        </article>

        <div v-else class="error-block">
          <span class="keyword">throw new</span>
          <span class="class-name"> Error</span>
          <span class="brace">(</span>
          <span class="string">"Post not found: {{ dir }}/{{ id }}.md"</span>
          <span class="brace">)</span>
        </div>
      </div>
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
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
.editor-content {
  height: 100%;
  overflow-y: auto;
  background: var(--monokai-bg);
  color: var(--monokai-fg);
}

.code-editor {
  display: flex;
  min-height: 100%;
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
}

.line-numbers {
  background: var(--monokai-bg);
  color: var(--monokai-comment);
  padding: 1.5rem 0.5rem;
  text-align: right;
  user-select: none;
  border-right: 1px solid var(--border-color);
  min-width: 50px;
  font-size: 13px;
}

.line-number {
  padding: 0 0.75rem;
  height: 1.6em;
  transition: color 0.15s ease;
}

.line-number:hover {
  color: var(--monokai-fg);
}

.content-area {
  flex: 1;
  padding: 1.5rem 2rem;
  overflow-x: auto;
}

/* Breadcrumb */
.breadcrumb {
  margin-bottom: 2rem;
  padding: 0.75rem 1rem;
  background: var(--monokai-bg-light);
  border-radius: 4px;
  border-left: 3px solid var(--monokai-cyan);
}

.breadcrumb-link {
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-block;
}

.breadcrumb-link:hover {
  transform: translateX(-4px);
}

.breadcrumb-link:hover .function {
  color: var(--monokai-orange);
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

.function {
  color: var(--monokai-green);
  font-style: italic;
}

.class-name {
  color: var(--monokai-green);
  font-weight: 600;
  font-size: 1.1em;
}

.operator {
  color: var(--monokai-pink);
}

.brace {
  color: var(--monokai-fg);
}

/* Article Sections */
.markdown-content {
  animation: fadeIn 0.4s ease-out;
}

.file-header {
  margin-bottom: 2rem;
  padding: 1rem 1.5rem;
  background: var(--monokai-bg-light);
  border-radius: 4px;
  line-height: 1.8;
}

.post-title {
  margin: 2rem 0 1.5rem;
  font-size: 1.2em;
  font-weight: 600;
}

.post-content {
  margin-left: 2rem;
  padding: 1.5rem 0;
}

.post-footer {
  margin-top: 2rem;
  font-size: 1.2em;
}

/* Error Block */
.error-block {
  background: rgba(249, 38, 114, 0.1);
  border-left: 3px solid var(--monokai-red);
  padding: 1.5rem 2rem;
  margin: 2rem 0;
  border-radius: 4px;
  font-size: 1.1em;
}

/* Markdown Content Styling */
.post-content :deep(h1) {
  color: var(--monokai-green);
  font-size: 2em;
  font-weight: 700;
  margin: 1.5rem 0 1rem;
  border-bottom: 2px solid var(--monokai-bg-lighter);
  padding-bottom: 0.5rem;
}

.post-content :deep(h2) {
  color: var(--monokai-cyan);
  font-size: 1.6em;
  font-weight: 600;
  margin: 1.3rem 0 0.8rem;
}

.post-content :deep(h3) {
  color: var(--monokai-purple);
  font-size: 1.3em;
  font-weight: 600;
  margin: 1.2rem 0 0.7rem;
}

.post-content :deep(h4) {
  color: var(--monokai-orange);
  font-size: 1.1em;
  font-weight: 600;
  margin: 1rem 0 0.6rem;
}

.post-content :deep(p) {
  color: var(--monokai-fg);
  line-height: 1.8;
  margin: 1rem 0;
}

.post-content :deep(a) {
  color: var(--monokai-cyan);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
}

.post-content :deep(a:hover) {
  color: var(--monokai-yellow);
  border-bottom-color: var(--monokai-yellow);
}

.post-content :deep(code) {
  background: var(--monokai-bg-lighter);
  color: var(--monokai-pink);
  padding: 0.2em 0.5em;
  border-radius: 3px;
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
}

.post-content :deep(pre) {
  background: var(--monokai-bg-light);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 1.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.post-content :deep(pre code) {
  background: none;
  color: var(--monokai-fg);
  padding: 0;
  border-radius: 0;
  font-size: 0.95em;
}

.post-content :deep(blockquote) {
  border-left: 4px solid var(--monokai-orange);
  background: var(--monokai-bg-light);
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: var(--monokai-comment);
  border-radius: 4px;
}

.post-content :deep(ul),
.post-content :deep(ol) {
  margin: 1rem 0;
  padding-left: 2rem;
}

.post-content :deep(li) {
  margin: 0.5rem 0;
  color: var(--monokai-fg);
}

.post-content :deep(li::marker) {
  color: var(--monokai-green);
}

.post-content :deep(strong) {
  color: var(--monokai-orange);
  font-weight: 600;
}

.post-content :deep(em) {
  color: var(--monokai-purple);
  font-style: italic;
}

.post-content :deep(hr) {
  border: none;
  border-top: 2px solid var(--monokai-bg-lighter);
  margin: 2rem 0;
}

.post-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  background: var(--monokai-bg-light);
  border-radius: 6px;
  overflow: hidden;
}

.post-content :deep(th) {
  background: var(--monokai-bg-lighter);
  color: var(--monokai-green);
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid var(--border-color);
}

.post-content :deep(td) {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--monokai-fg);
}

.post-content :deep(tr:hover) {
  background: var(--monokai-bg-lighter);
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

/* Smooth transitions for interactive elements */
.post-content :deep(*) {
  transition: color 0.15s ease, background-color 0.15s ease;
}
</style>

