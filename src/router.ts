import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from './pages/Home.vue'
import Post from './pages/Post.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/post/:dir/:id',
    name: 'Post',
    component: Post,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

