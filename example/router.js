import Vue from 'vue'
import Router from 'vue-router'
import febAlive from '../src/index'
import Home from './components/Home.vue'
import Page from './components/Page.vue'
import Article from './components/Article.vue'
import A from './components/A.vue'
import B from './components/B.vue'
import Parent from './components/Parent.vue'
import ParentPage from './components/ParentPage.vue'
import ParentFoo from './components/ParentFoo.vue'
import ParentBar from './components/ParentBar.vue'

febAlive.resetHistory()

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL || '/',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  },
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
    },
    {
      path: '/parent',
      name: 'parent',
      component: Parent,
      children: [
        {
          path: 'page/:id',
          component: ParentPage
        },
        {
          path: 'foo',
          component: ParentFoo
        },
        {
          path: 'bar',
          component: ParentBar
        }
      ]
    }
  ]
})
