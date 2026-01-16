<template>
  <div class="folder-section">
    <div
      class="folder-header"
      :style="headerStyle"
      @click="toggleFolder(node.path)"
    >
      <span class="chevron">{{ expandedFolders.has(node.path) ? '▼' : '▶' }}</span>
      <span class="icon">📁</span>
      <span>{{ node.name }}</span>
    </div>

    <div v-if="expandedFolders.has(node.path)" class="folder-items">
      <FolderTree
        v-for="child in node.children"
        :key="child.path"
        :node="child"
        :depth="depth + 0.5"
        :expanded-folders="expandedFolders"
        :toggle-folder="toggleFolder"
        :is-active-post="isActivePost"
        :open-tab="openTab"
      />

      <router-link
        v-for="post in node.posts"
        :key="`${post.dir}/${post.id}`"
        :to="{ name: 'Post', params: { dir: post.dir, id: post.id } }"
        class="file-item"
        :style="fileStyle"
        :class="{ active: isActivePost(post.dir, post.id) }"
        @click="openTab({
          title: `${post.id}.md`,
          path: `/post/${post.dir}/${post.id}`,
          dir: post.dir,
          id: post.id,
          type: 'post',
        })"
      >
        <span class="icon">📄</span>
        <span>{{ post.id }}.md</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import type { DirectoryNode } from '../utils/load-content'

type OpenTabPayload = {
  title: string
  path: string
  type: 'post'
  dir: string
  id: string
}

const props = defineProps({
  node: {
    type: Object as PropType<DirectoryNode>,
    required: true,
  },
  depth: {
    type: Number,
    default: 0,
  },
  expandedFolders: {
    type: Object as PropType<Set<string>>,
    required: true,
  },
  toggleFolder: {
    type: Function as PropType<(path: string) => void>,
    required: true,
  },
  isActivePost: {
    type: Function as PropType<(dir: string, id: string) => boolean>,
    required: true,
  },
  openTab: {
    type: Function as PropType<(tab: OpenTabPayload) => void>,
    required: true,
  },
})

const indentBase = 0.75
const indentStep = 1.25

const headerStyle = computed(() => ({
  paddingLeft: `${indentBase + props.depth * indentStep}rem`,
}))

const fileStyle = computed(() => ({
  paddingLeft: `${indentBase + (props.depth + 1.45) * indentStep}rem`,
}))
</script>
