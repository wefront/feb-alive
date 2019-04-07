import Vue from 'vue'
import Router from 'vue-router'
import febAlive from '../src/index'
import Home from './components/Home.vue'
import Page from './components/Page.vue'
import Article from './components/Article.vue'
import A from './components/A.vue'
import B from './components/B.vue'

febAlive.resetHistory()
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL || '/',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/a',
      name: 'a',
      component: A
    },
    {
      path: '/b',
      name: 'b',
      component: B
    },
    {
      path: '/page/:id',
      name: 'page',
      component: Page
    },
    {
      path: '/article/:id',
      name: 'article',
      component: Article
    }
  ]
})
