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

    <!-- Readme Section -->
    <div class="readme-section" ref="readmeSectionRef">
      <div
        v-if="readmeHtml"
        ref="readmeResizableRef"
        class="readme-resizable"
        :class="{ resizing: isReadmeResizing }"
        :style="readmeResizableStyle"
      >
        <div class="readme-content" v-html="readmeHtml"></div>
        <div class="readme-resizer" @mousedown="startReadmeResize"></div>
      </div>
      <div v-else class="empty-state">
        <div class="empty-icon">📄</div>
        <p class="empty-text">
          <span class="comment">// Выберите файл из списка ниже</span>
        </p>
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
      class="category-section hidden"
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
import { computed, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { groupByDirectory, createLinkRenderer } from '../utils/load-content'
import { Marked } from 'marked'

const grouped = groupByDirectory()
const directories = computed(() => Array.from(grouped.keys()).sort())

const readmeHtml = ref<string>('')
const readmeSectionRef = ref<HTMLElement | null>(null)
const readmeResizableRef = ref<HTMLElement | null>(null)
const readmeWidth = ref<number | null>(null)
const isReadmeResizing = ref(false)
const readmeStorageKey = 'readme-content-width'
const minReadmeWidth = 360

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

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max)
}

const getReadmeMaxWidth = () => {
  const containerWidth = readmeSectionRef.value?.clientWidth
  return containerWidth && containerWidth > 0 ? containerWidth : 1200
}

const normalizeReadmeWidth = (value: number) => {
  return clamp(value, minReadmeWidth, getReadmeMaxWidth())
}

const readmeResizableStyle = computed(() => {
  if (!readmeWidth.value) {
    return { width: '100%', maxWidth: '100%' }
  }
  return { width: `${readmeWidth.value}px`, maxWidth: '100%' }
})

const loadStoredReadmeWidth = () => {
  try {
    const storedValue = localStorage.getItem(readmeStorageKey)
    if (!storedValue) {
      return
    }
    const parsed = Number(storedValue)
    if (!Number.isNaN(parsed) && parsed > 0) {
      readmeWidth.value = normalizeReadmeWidth(parsed)
    }
  } catch {
    // ignore storage errors
  }
}

const saveReadmeWidth = () => {
  if (!readmeWidth.value) {
    return
  }
  try {
    localStorage.setItem(readmeStorageKey, String(readmeWidth.value))
  } catch {
    // ignore storage errors
  }
}

const startReadmeResize = (event: MouseEvent) => {
  if (!readmeResizableRef.value) {
    return
  }

  isReadmeResizing.value = true
  document.body.classList.add('readme-resizing')

  const readmeLeft = readmeResizableRef.value.getBoundingClientRect().left

  const handleMouseMove = (moveEvent: MouseEvent) => {
    const nextWidth = normalizeReadmeWidth(moveEvent.clientX - readmeLeft)
    readmeWidth.value = nextWidth
  }

  const stopResize = () => {
    isReadmeResizing.value = false
    document.body.classList.remove('readme-resizing')
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', stopResize)
    saveReadmeWidth()
  }

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', stopResize)
}

// Загружаем README.md при монтировании компонента
onMounted(async () => {
  loadStoredReadmeWidth()
  try {
    // Пытаемся загрузить README.md из корня content/
    // @ts-ignore - Vite's import.meta.glob is available at runtime
    const readmeModule = import.meta.glob<string>('/content/README.md', { as: 'raw' })
    const readmeLoader = readmeModule['/content/README.md']
    
    if (readmeLoader) {
      const readmeContent = await (readmeLoader as unknown as () => Promise<string>)()
      
      // Парсим frontmatter если есть
      const match = readmeContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
      const markdown = match ? match[2] : readmeContent
      
      // Создаем новый экземпляр Marked с кастомным рендерером
      const markedInstance = new Marked()
      markedInstance.use({ renderer: createLinkRenderer('') })
      
      // Конвертируем в HTML
      readmeHtml.value = await markedInstance.parse(markdown)
    }
  } catch (error) {
    console.log('README.md не найден в корневой директории content/')
  }
})

watch(readmeHtml, async (value) => {
  if (!value) {
    return
  }

  await nextTick()

  if (!readmeWidth.value) {
    const defaultWidth = getReadmeMaxWidth()
    readmeWidth.value = normalizeReadmeWidth(Math.min(defaultWidth, 900))
  } else {
    readmeWidth.value = normalizeReadmeWidth(readmeWidth.value)
  }
})

onBeforeUnmount(() => {
  document.body.classList.remove('readme-resizing')
})
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
  margin-bottom: 2rem;
  animation: fadeIn 0.5s ease-out;
}

/* README Section */
.readme-section {
  margin-bottom: 3rem;
  animation: fadeIn 0.5s ease-out 0.2s;
  animation-fill-mode: both;
}

.readme-resizable {
  position: relative;
  max-width: 100%;
  transition: width 0.2s ease;
}

.readme-resizable.resizing {
  transition: none;
}

.readme-content {
  background: var(--monokai-bg-light);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 2rem;
  line-height: 1.6;
}

.readme-resizer {
  position: absolute;
  top: 0;
  bottom: 0;
  right: -4px;
  width: 8px;
  cursor: col-resize;
}

.readme-resizer::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 3px;
  width: 2px;
  background: transparent;
  transition: background 0.15s ease;
}

.readme-resizer:hover::before {
  background: var(--border-color);
}

.readme-content :deep(h1),
.readme-content :deep(h2),
.readme-content :deep(h3) {
  color: var(--monokai-cyan);
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.readme-content :deep(h1) {
  font-size: 1.8rem;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.readme-content :deep(h2) {
  font-size: 1.4rem;
}

.readme-content :deep(h3) {
  font-size: 1.1rem;
}

.readme-content :deep(p) {
  margin-bottom: 1rem;
  color: var(--monokai-fg);
}

.readme-content :deep(ul),
.readme-content :deep(ol) {
  margin: 1rem 0;
  padding-left: 2rem;
}

.readme-content :deep(li) {
  margin-bottom: 0.5rem;
}

.readme-content :deep(code) {
  background: var(--monokai-bg);
  color: var(--monokai-yellow);
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'Fira Code', monospace;
}

.readme-content :deep(pre) {
  background: var(--monokai-bg);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.readme-content :deep(pre code) {
  background: none;
  padding: 0;
}

.readme-content :deep(a) {
  color: var(--monokai-blue);
  text-decoration: none;
}

.readme-content :deep(a:hover) {
  color: var(--monokai-cyan);
  text-decoration: underline;
}

.readme-content :deep(blockquote) {
  border-left: 4px solid var(--monokai-purple);
  margin: 1rem 0;
  padding-left: 1rem;
  color: var(--monokai-comment);
  font-style: italic;
}

.readme-content :deep(.internal-link) {
  color: var(--monokai-green);
  text-decoration: none;
  border-bottom: 1px dashed var(--monokai-green);
}

.readme-content :deep(.internal-link:hover) {
  color: var(--monokai-yellow);
  border-bottom-color: var(--monokai-yellow);
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

  .readme-resizer {
    display: none;
  }
}

:global(body.readme-resizing) {
  cursor: col-resize;
  user-select: none;
}
</style>

