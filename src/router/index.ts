import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Import page components
import Home from '@/pages/Home.vue'
import GamesLibrary from '@/pages/GamesLibrary.vue'
import BooksLibrary from '@/pages/BooksLibrary.vue'
import Activities from '@/pages/Activities.vue'
import UserProfile from '@/pages/UserProfile.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'MiniGames Portal'
    }
  },
  {
    path: '/games',
    name: 'GamesLibrary',
    component: GamesLibrary,
    meta: {
      title: 'Games Library'
    }
  },
  {
    path: '/books',
    name: 'BooksLibrary',
    component: BooksLibrary,
    meta: {
      title: 'Books Library'
    }
  },
  {
    path: '/activities',
    name: 'Activities',
    component: Activities,
    meta: {
      title: 'Activities'
    }
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: {
      title: 'My Profile'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

// Update page title on navigation
router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - MiniGames Portal`
  }
  next()
})

export default router
