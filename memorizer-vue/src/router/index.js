import Vue from 'vue'
import VueRouter from 'vue-router'
import TestView from '../views/TestView.vue'
import SettingsView from '../views/SettingsView.vue'

Vue.use(VueRouter)

  const routes = [
  {
      path: '/',
      name: 'Home',
      component: TestView
  },
  {
     path: '/test',
     name: 'Test',
     component: TestView
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView
 },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
