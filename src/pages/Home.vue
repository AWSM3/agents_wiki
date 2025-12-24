<template>
  <main class="home-content">
    <div class="welcome-section">
      <h1 class="title">
        <span class="keyword">const</span>
        <span class="variable"> Content </span>
        <span class="operator">= </span>
        <span class="brace">{</span>
      </h1>
      
      <div class="subtitle">
        <span class="comment">// Про Агентов, методы и практики</span>
      </div>
    </div>

    <div
      v-if="directories.length === 0"
      class="empty-state"
    >
      <div class="empty-icon">📭</div>
      <p class="empty-text">
        <span class="keyword">throw new</span>
        <span class="class-name"> Error</span>
        <span class="brace">(</span>
        <span class="string">"No content found"</span>
        <span class="brace">)</span>
      </p>
    </div>

    <div
      v-for="dir in directories"
      v-else
      :key="dir"
      class="category-section"
    >
      <h2 class="category-title">
        <span class="property">{{ formatDirName(dir) }}</span>
        <span class="operator">:</span>
        <span class="brace"> [</span>
      </h2>

      <div class="posts-grid">
        <router-link
          v-for="post in getPostsByDir(dir)"
          :key="`${post.dir}/${post.id}`"
          :to="{ name: 'Post', params: { dir: post.dir, id: post.id } }"
          class="post-card"
        >
          <div class="post-header">
            <span class="post-icon">📄</span>
            <span class="post-title">{{ post.title }}</span>
          </div>
          
          <div class="post-meta">
            <span class="meta-item" v-if="post.meta.date">
              <span class="property">date</span>
              <span class="operator">: </span>
              <span class="string">{{ formatDate(post.meta.date as string) }}</span>
            </span>
          </div>
          
          <p v-if="post.meta.description" class="post-description">
            {{ post.meta.description }}
          </p>
        </router-link>
      </div>

      <div class="category-footer">
        <span class="brace">]</span>
      </div>
    </div>

    <div class="closing-brace">
      <span class="brace">}</span>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { groupByDirectory } from '../utils/load-content'

const grouped = groupByDirectory()
const directories = computed(() => Array.from(grouped.keys()).sort())

const getPostsByDir = (dir: string) => grouped.get(dir) || []

const formatDirName = (dir: string) => {
  return dir.charAt(0).toUpperCase() + dir.slice(1)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style scoped>
.home-content {
  height: 100%;
  overflow-y: auto;
  background: var(--monokai-bg);
  color: var(--monokai-fg);
  padding: 2rem 3rem;
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
}

/* Welcome Section */
.welcome-section {
  margin-bottom: 3rem;
  animation: fadeIn 0.5s ease-out;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.subtitle {
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  animation: fadeIn 0.5s ease-out;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.1rem;
}

/* Category Section */
.category-section {
  margin: 2.5rem 0;
  padding-left: 2rem;
  animation: fadeIn 0.5s ease-out;
}

.category-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.category-footer {
  margin-top: 1rem;
  font-size: 1.3rem;
  padding-left: 0;
}

/* Posts Grid */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
  padding-left: 2rem;
}

/* Post Card */
.post-card {
  background: var(--monokai-bg-light);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
}

.post-card:hover {
  background: var(--monokai-bg-lighter);
  border-color: var(--monokai-green);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.post-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.post-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.post-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--monokai-fg);
  line-height: 1.3;
}

.post-card:hover .post-title {
  color: var(--monokai-green);
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.post-description {
  color: var(--monokai-comment);
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0;
}

.post-card:hover .post-description {
  color: var(--monokai-fg);
}

/* Closing Brace */
.closing-brace {
  margin-top: 3rem;
  font-size: 2rem;
  animation: fadeIn 0.5s ease-out;
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

.variable {
  color: var(--monokai-fg);
}

.property {
  color: var(--monokai-cyan);
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
  .home-content {
    padding: 1.5rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>

