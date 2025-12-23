<template>
  <main class="editor-content">
    <div class="code-editor">
      <!-- Line Numbers Column -->
      <div class="line-numbers">
        <div 
          v-for="n in totalLines" 
          :key="n" 
          class="line-number"
        >
          {{ n }}
        </div>
      </div>

      <!-- Content Column -->
      <div class="content-area">
        <div class="code-block">
          <span class="comment">// index.md</span>
          <br>
          <span class="comment">// ============================================</span>
          <br><br>
          
          <span class="keyword">import</span> 
          <span class="brace"> { </span>
          <span class="variable">MarkdownPosts</span>
          <span class="brace"> } </span>
          <span class="keyword">from</span> 
          <span class="string">'./content'</span>
          <br><br>
        </div>

        <div
          v-if="directories.length === 0"
          class="warning-block"
        >
          <span class="keyword">console</span><span class="operator">.</span><span class="function">warn</span><span class="brace">(</span><span class="string">"No posts found. Add files to content/ directory"</span><span class="brace">)</span>
        </div>

        <div
          v-for="(dir, dirIndex) in directories"
          v-else
          :key="dir"
          class="directory-section"
        >
          <div class="section-header">
            <span class="keyword">export</span>
            <span class="keyword"> const </span>
            <span class="class-name">{{ formatDirName(dir) }}</span>
            <span class="operator"> = </span>
            <span class="brace">[</span>
          </div>

          <div class="posts-list">
            <router-link
              v-for="(post, postIndex) in getPostsByDir(dir)"
              :key="`${post.dir}/${post.id}`"
              :to="{ name: 'Post', params: { dir: post.dir, id: post.id } }"
              class="post-item"
            >
              <span class="indent">  </span>
              <span class="brace">{</span>
              <br>
              <span class="indent">    </span>
              <span class="property">title</span>
              <span class="operator">: </span>
              <span class="string">"{{ post.title }}"</span>
              <span class="operator">,</span>
              <br>
              <span class="indent">    </span>
              <span class="property">file</span>
              <span class="operator">: </span>
              <span class="string">"{{ post.dir }}/{{ post.id }}.md"</span>
              <span class="operator">,</span>
              <br>
              <span v-if="post.meta.date">
                <span class="indent">    </span>
                <span class="property">date</span>
                <span class="operator">: </span>
                <span class="number">"{{ formatDate(post.meta.date as string) }}"</span>
                <span class="operator">,</span>
                <br>
              </span>
              <span v-if="post.meta.description">
                <span class="indent">    </span>
                <span class="property">description</span>
                <span class="operator">: </span>
                <span class="string">"{{ post.meta.description }}"</span>
                <br>
              </span>
              <span class="indent">  </span>
              <span class="brace">}</span>
              <span v-if="postIndex < getPostsByDir(dir).length - 1" class="operator">,</span>
              <br>
            </router-link>
          </div>

          <span class="brace">]</span>
          <br><br>
        </div>
      </div>
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
    month: 'long',
    day: 'numeric',
  })
}

// Calculate total lines for line numbers
const totalLines = computed(() => {
  let lines = 10 // Base lines for header
  directories.value.forEach(dir => {
    lines += 3 // Section header
    const posts = getPostsByDir(dir)
    lines += posts.length * 8 // Each post takes ~8 lines
    lines += 2 // Section footer
  })
  return Math.max(lines, 30)
})
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

.code-block {
  margin-bottom: 1.5rem;
}

/* Syntax Highlighting - Monokai Style */
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

.number {
  color: var(--monokai-purple);
}

.function {
  color: var(--monokai-green);
  font-style: italic;
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

.indent {
  display: inline-block;
}

/* Warning Block */
.warning-block {
  background: rgba(253, 151, 31, 0.1);
  border-left: 3px solid var(--monokai-orange);
  padding: 1rem 1.5rem;
  margin: 1rem 0;
  border-radius: 4px;
}

/* Directory Section */
.directory-section {
  margin: 2rem 0;
  animation: fadeIn 0.3s ease-out;
}

.section-header {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.posts-list {
  margin-left: 1rem;
}

/* Post Item */
.post-item {
  display: block;
  margin: 0.5rem 0;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  border-left: 2px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
  text-decoration: none;
}

.post-item:hover {
  background: var(--monokai-bg-light);
  border-left-color: var(--monokai-green);
  transform: translateX(4px);
}

.post-item:hover .string {
  color: var(--monokai-orange);
}

.post-item:hover .property {
  color: var(--monokai-green);
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Cursor blink effect */
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.section-header::after {
  content: '▊';
  color: var(--monokai-fg);
  animation: blink 1s infinite;
  margin-left: 2px;
}
</style>

