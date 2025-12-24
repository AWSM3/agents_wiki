<template>
  <div id="app" class="ide-container">
    <!-- Sidebar -->
    <aside class="ide-sidebar" v-if="sidebarVisible">
      <div class="sidebar-header">
        <span class="sidebar-title">EXPLORER</span>
      </div>
      
      <nav class="sidebar-content">
        <!-- Home Link -->
        <router-link 
          to="/" 
          class="file-item"
          :class="{ active: $route.path === '/' }"
          @click="openTab({ title: 'Home', path: '/', type: 'home' })"
        >
          <span class="icon">🏠</span>
          <span>Home</span>
        </router-link>
        
        <!-- Directories -->
        <div 
          v-for="dir in directories" 
          :key="dir"
          class="folder-section"
        >
          <div 
            class="folder-header"
            @click="toggleFolder(dir)"
          >
            <span class="chevron">{{ expandedFolders.has(dir) ? '▼' : '▶' }}</span>
            <span class="icon">📁</span>
            <span>{{ dir }}/</span>
          </div>
          
          <div v-if="expandedFolders.has(dir)" class="folder-items">
            <router-link
              v-for="post in getPostsByDir(dir)"
              :key="`${post.dir}/${post.id}`"
              :to="{ name: 'Post', params: { dir: post.dir, id: post.id } }"
              class="file-item nested"
              :class="{ active: isActivePost(post.dir, post.id) }"
              @click="openTab({ 
                title: `${post.id}.md`, 
                path: `/post/${post.dir}/${post.id}`,
                dir: post.dir,
                id: post.id,
                type: 'post'
              })"
            >
              <span class="icon">📄</span>
              <span>{{ post.id }}.md</span>
            </router-link>
          </div>
        </div>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <main class="ide-main">
      <!-- Tab Bar -->
      <div class="tab-bar" v-if="openTabs.length > 0">
        <div 
          v-for="tab in openTabs"
          :key="tab.path"
          class="tab"
          :class="{ active: isActiveTab(tab) }"
          @click="navigateToTab(tab)"
        >
          <span class="tab-icon">{{ tab.type === 'home' ? '🏠' : '📝' }}</span>
          <span class="tab-title">{{ tab.title }}</span>
          <span 
            class="tab-close"
            @click.stop="closeTab(tab)"
            v-if="openTabs.length > 1"
          >×</span>
        </div>
      </div>

      <!-- Editor Area -->
      <div class="editor-area">
        <router-view />
      </div>

      <!-- Status Bar -->
      <div class="status-bar">
        <div class="status-left">
          <button 
            class="status-item clickable"
            @click="toggleSidebar"
          >
            <span>☰</span>
            <span class="ml-1">{{ sidebarVisible ? 'Hide' : 'Show' }} Explorer</span>
          </button>
          <span class="status-item">
            <span class="text-monokai-green">●</span>
            <span class="ml-1">Markdown</span>
          </span>
        </div>
        <div class="status-right">
          <span class="status-item">
            <span class="text-monokai-cyan">{{ openTabs.length }} tab{{ openTabs.length !== 1 ? 's' : '' }}</span>
          </span>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { groupByDirectory } from './utils/load-content'

const route = useRoute()
const router = useRouter()

// Sidebar state
const sidebarVisible = ref(true)
const expandedFolders = ref(new Set<string>())

// Tabs state
interface Tab {
  title: string
  path: string
  type: 'home' | 'post'
  dir?: string
  id?: string
}

const openTabs = ref<Tab[]>([
  { title: 'Home', path: '/', type: 'home' }
])

// Directory data
const grouped = groupByDirectory()
const directories = computed(() => Array.from(grouped.keys()).sort())

const getPostsByDir = (dir: string) => grouped.get(dir) || []

// Functions
const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

const toggleFolder = (dir: string) => {
  if (expandedFolders.value.has(dir)) {
    expandedFolders.value.delete(dir)
  } else {
    expandedFolders.value.add(dir)
  }
}

const isActivePost = (dir: string, id: string) => {
  return route.name === 'Post' && 
         route.params.dir === dir && 
         route.params.id === id
}

const isActiveTab = (tab: Tab) => {
  if (tab.type === 'home') {
    return route.path === '/'
  }
  return route.name === 'Post' && 
         route.params.dir === tab.dir && 
         route.params.id === tab.id
}

const openTab = (tab: Tab) => {
  const existingTab = openTabs.value.find(t => t.path === tab.path)
  if (!existingTab) {
    openTabs.value.push(tab)
  }
}

const closeTab = (tab: Tab) => {
  const index = openTabs.value.findIndex(t => t.path === tab.path)
  if (index > -1) {
    openTabs.value.splice(index, 1)
    
    // Navigate to another tab if closing active tab
    if (isActiveTab(tab) && openTabs.value.length > 0) {
      const newTab = openTabs.value[Math.max(0, index - 1)]
      navigateToTab(newTab)
    }
  }
}

const navigateToTab = (tab: Tab) => {
  if (tab.type === 'home') {
    router.push('/')
  } else {
    router.push({ name: 'Post', params: { dir: tab.dir, id: tab.id } })
  }
}

// Auto-open current route tab
watch(() => route.path, (newPath) => {
  if (route.name === 'Post') {
    const dir = route.params.dir as string
    const id = route.params.id as string
    openTab({
      title: `${id}.md`,
      path: newPath,
      dir,
      id,
      type: 'post'
    })
    // Auto-expand folder
    expandedFolders.value.add(dir)
  }
}, { immediate: true })
</script>

<style scoped>
.ide-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--monokai-bg);
}

/* Sidebar */
.ide-sidebar {
  width: 240px;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.3s ease, margin-left 0.3s ease;
}

.sidebar-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--monokai-comment);
  letter-spacing: 0.5px;
}

.sidebar-title {
  text-transform: uppercase;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
}

/* Folder Section */
.folder-section {
  margin: 0.25rem 0;
}

.folder-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
  color: var(--monokai-fg);
  cursor: pointer;
  transition: background 0.15s ease;
  user-select: none;
}

.folder-header:hover {
  background: var(--sidebar-hover);
}

.chevron {
  font-size: 0.7rem;
  color: var(--monokai-comment);
  transition: transform 0.2s ease;
  width: 12px;
  display: inline-block;
}

.icon {
  font-size: 1rem;
}

.folder-items {
  animation: slideDown 0.2s ease-out;
}

/* File Item */
.file-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
  color: var(--monokai-fg);
  cursor: pointer;
  transition: all 0.15s ease;
  text-decoration: none;
  border-left: 2px solid transparent;
}

.file-item.nested {
  padding-left: 3rem;
  margin-left: 0.5rem;
  border-left: 1px solid var(--border-color);
}

.file-item:hover {
  background: var(--sidebar-hover);
}

.file-item.active {
  background: var(--monokai-bg-light);
  border-left-color: var(--monokai-green);
  color: var(--monokai-green);
}

/* Main Content */
.ide-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Tab Bar */
.tab-bar {
  display: flex;
  background: var(--tab-inactive);
  border-bottom: 1px solid var(--border-color);
  overflow-x: auto;
  scrollbar-width: thin;
}

.tab-bar::-webkit-scrollbar {
  height: 4px;
}

.tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--tab-inactive);
  border-right: 1px solid var(--border-color);
  font-size: 0.8rem;
  color: var(--monokai-comment);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  min-width: 120px;
  max-width: 200px;
}

.tab.active {
  background: var(--tab-active);
  color: var(--monokai-fg);
}

.tab:hover {
  background: var(--monokai-bg-light);
  color: var(--monokai-fg);
}

.tab-icon {
  font-size: 0.9rem;
  flex-shrink: 0;
}

.tab-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tab-close {
  opacity: 0;
  font-size: 1.1rem;
  line-height: 1;
  transition: opacity 0.15s ease;
  flex-shrink: 0;
  padding: 0 0.25rem;
}

.tab:hover .tab-close {
  opacity: 0.7;
}

.tab-close:hover {
  opacity: 1 !important;
  color: var(--monokai-red);
}

/* Editor Area */
.editor-area {
  flex: 1;
  overflow-y: auto;
  background: var(--monokai-bg);
}

/* Status Bar */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background: var(--statusbar-bg);
  border-top: 1px solid var(--border-color);
  font-size: 0.7rem;
  color: var(--monokai-comment);
}

.status-left,
.status-right {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.35rem;
  border-radius: 2px;
  transition: background 0.15s ease;
}

.status-item.clickable {
  cursor: pointer;
  background: transparent;
  border: none;
  color: var(--monokai-comment);
  font-family: inherit;
  font-size: inherit;
}

.status-item.clickable:hover {
  background: var(--monokai-bg-light);
  color: var(--monokai-fg);
}

/* Utility classes */
.ml-1 {
  margin-left: 0.25rem;
}

/* Animations */
@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 500px;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .ide-sidebar {
    position: absolute;
    height: 100%;
    z-index: 100;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
  }
  
  .tab {
    min-width: 100px;
    max-width: 150px;
  }
}
</style>

