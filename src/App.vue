<template>
  <div id="app" class="ide-container">
    <!-- Sidebar -->
    <aside class="ide-sidebar">
      <div class="sidebar-header">
        <div class="flex items-center gap-2 px-4 py-3">
          <span class="text-monokai-green text-lg">▶</span>
          <span class="text-monokai-fg font-semibold">EXPLORER</span>
        </div>
      </div>
      
      <nav class="sidebar-content">
        <div class="folder-section">
          <div class="folder-header">
            <span class="text-monokai-orange">📁</span>
            <span class="text-monokai-cyan ml-2">content/</span>
          </div>
          
          <div class="folder-items">
            <router-link 
              to="/" 
              class="file-item"
              :class="{ active: $route.path === '/' }"
            >
              <span class="text-monokai-comment">📄</span>
              <span class="ml-2">index.md</span>
            </router-link>
            
            <div class="subfolder">
              <div class="subfolder-header">
                <span class="text-monokai-yellow">📂</span>
                <span class="text-monokai-purple ml-2">blog/</span>
              </div>
            </div>
            
            <div class="subfolder">
              <div class="subfolder-header">
                <span class="text-monokai-yellow">📂</span>
                <span class="text-monokai-purple ml-2">docs/</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <main class="ide-main">
      <!-- Tab Bar -->
      <div class="tab-bar">
        <div class="tab active">
          <span class="tab-icon">📝</span>
          <span class="tab-title">{{ currentTabTitle }}</span>
          <span class="tab-close">×</span>
        </div>
      </div>

      <!-- Editor Area -->
      <div class="editor-area">
        <router-view />
      </div>

      <!-- Status Bar -->
      <div class="status-bar">
        <div class="status-left">
          <span class="status-item">
            <span class="text-monokai-green">●</span>
            <span class="ml-1">Markdown</span>
          </span>
          <span class="status-item">
            <span class="text-monokai-cyan">UTF-8</span>
          </span>
          <span class="status-item">
            <span class="text-monokai-purple">LF</span>
          </span>
        </div>
        <div class="status-right">
          <span class="status-item">
            <span class="text-monokai-orange">Vue 3</span>
          </span>
          <span class="status-item">
            <span class="text-monokai-yellow">⚡ Vite</span>
          </span>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentTabTitle = computed(() => {
  if (route.name === 'Post') {
    return `${route.params.dir}/${route.params.id}.md`
  }
  return 'index.md'
})
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
  width: 280px;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  border-bottom: 1px solid var(--border-color);
  background: var(--sidebar-bg);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
}

.folder-section {
  padding: 0.5rem 0;
}

.folder-header {
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.folder-items {
  padding-left: 1rem;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  color: var(--monokai-fg);
  cursor: pointer;
  transition: all 0.15s ease;
  border-left: 2px solid transparent;
}

.file-item:hover {
  background: var(--sidebar-hover);
  color: var(--monokai-cyan);
}

.file-item.active {
  background: var(--monokai-bg-light);
  border-left-color: var(--monokai-green);
  color: var(--monokai-green);
}

.subfolder {
  margin: 0.25rem 0;
}

.subfolder-header {
  display: flex;
  align-items: center;
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s ease;
}

.subfolder-header:hover {
  background: var(--sidebar-hover);
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
}

.tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: var(--tab-inactive);
  border-right: 1px solid var(--border-color);
  font-size: 0.85rem;
  color: var(--monokai-comment);
  cursor: pointer;
  transition: all 0.15s ease;
  min-width: 150px;
}

.tab.active {
  background: var(--tab-active);
  color: var(--monokai-fg);
  border-bottom: 2px solid var(--monokai-green);
}

.tab:hover {
  background: var(--monokai-bg-light);
}

.tab-icon {
  font-size: 1rem;
}

.tab-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tab-close {
  opacity: 0;
  font-size: 1.2rem;
  line-height: 1;
  transition: opacity 0.15s ease;
}

.tab:hover .tab-close {
  opacity: 1;
}

.tab-close:hover {
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
  padding: 0.3rem 1rem;
  background: var(--statusbar-bg);
  border-top: 1px solid var(--border-color);
  font-size: 0.75rem;
  color: var(--monokai-fg);
}

.status-left,
.status-right {
  display: flex;
  gap: 1rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.file-item,
.subfolder-header {
  animation: slideIn 0.2s ease-out;
}
</style>

