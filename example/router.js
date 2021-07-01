import Vue from 'vue';
import Router from 'vue-router';
import febAlive from '../src/index';
import Home from './components/Home.vue';
import Page from './components/Page.vue';
import Article from './components/Article.vue';
import A from './components/A.vue';
import B from './components/B.vue';
import Parent from './components/Parent.vue';
import ParentPage from './components/ParentPage.vue';
import ParentFoo from './components/ParentFoo.vue';
import ParentBar from './components/ParentBar.vue';

import TreeAncestor from './components/TreeAncestor.vue';
import TreeParent from './components/TreeParent.vue';
import TreeSon from './components/TreeSon.vue';

febAlive.resetHistory();

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL || '/',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return {
        x: 0,
        y: 0,
      };
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        title: 'FEB',
      },
      component: Home,
    },
    {
      path: '/tree-ancestor',
      name: 'tree-ancestor',
      meta: {},
      component: TreeAncestor,
      children: [
        {
          path: '/tree-ancestor/tree-parent',
          name: 'tree-parent',
          component: TreeParent,
          children: [
            {
              path: '/tree-ancestor/tree-parent/tree-son',
              name: 'tree-son',
              component: TreeSon,
            }
          ]
        },
      ]
    },
    {
      path: '/a',
      name: 'a',
      meta: {
        title: '我是A页面',
      },
      component: A,
    },
    {
      path: '/b',
      name: 'b',
      meta: {
        title: '我是B页面',
      },
      component: B,
    },
    {
      path: '/page/:id',
      name: 'page',
      meta: {
        title: '文章列表',
      },
      component: Page,
    },
    {
      path: '/article/:id',
      name: 'article',
      meta: {
        title: '文章详情',
      },
      component: Article,
    },
    {
      path: '/parent',
      name: 'parent',
      component: Parent,
      children: [
        {
          path: 'page/:id',
          component: ParentPage,
        },
        {
          path: 'foo',
          component: ParentFoo,
        },
        {
          path: 'bar',
          component: ParentBar,
        },
      ],
    },
  ],
});
