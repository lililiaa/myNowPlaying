import { ElMessage } from 'element-plus';
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { tagList } from '../dicts/tags';

// 定义路由
const routes = [
  {
    path: '/',
    component: () => import('../layout/index.vue'),
    redirect: '/home',
    meta: {
      isPage: false,
    },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('../pages/Home.vue'),
        meta: {
          isPage: false,
          title: '组件预览',
        },
      },
    ],
  },
  {
    path: '/cover1',
    name: 'Cover1',
    component: () => import('../pages/uncombined/cover.vue'),
    meta: {
      isPage: true,
      title: '歌曲封面',
      tags: [tagList.custom],
      type: 'uncombined',
    },
  },
  {
    path: '/cover2',
    name: '/Cover2',
    component: () => import('../pages/uncombined/coverRound.vue'),
    meta: {
      isPage: true,
      title: '歌曲封面(圆)',
      tags: [tagList.custom],
      type: 'uncombined',
    },
  },
  {
    path: '/lyric',
    name: 'Lyric',
    component: () => import('../pages/uncombined/lyric.vue'),
    meta: {
      isPage: true,
      title: '歌词',
      tags: [tagList.custom],
      type: 'uncombined',
    },
  },
  {
    path: '/home1',
    name: 'Home1',
    component: () => import('../pages/combined/Home1.vue'),
    meta: {
      isPage: true,
      title: '歌曲组件1',
      tags: [tagList.custom],
      type: 'combined',
    },
  },
  {
    path: '/home2',
    name: 'Home2',
    component: () => import('../pages/combined/Home2.vue'),
    meta: {
      isPage: true,
      title: '歌曲组件2',
      tags: [tagList.custom],
      type: 'combined',
    },
  },
  {
    path: '/home3',
    name: 'Home3',
    component: () => import('../pages/combined/Home3.vue'),
    meta: {
      isPage: true,
      title: '歌曲组件3',
      tags: [tagList.custom],
      type: 'combined',
    },
  },
  {
    path: '/home4',
    name: 'Home4',
    component: () => import('../pages/combined/Home4.vue'),
    meta: {
      isPage: true,
      title: '歌曲组件4',
      tags: [tagList.custom],
      type: 'combined',
    },
  },
  {
    path: '/citiesSkylines1',
    name: '都市天际线1',
    component: () => import('../pages/combined/citiesSkylines1.vue'),
    meta: {
      isPage: true,
      title: '都市天际线1',
      tags: [tagList.fixed, tagList.csl1],
      type: 'combined',
    },
  },
  {
    path: '/card1',
    name: 'card1',
    component: () => import('../pages/combined/card1.vue'),
    meta: {
      isPage: true,
      title: '卡片',
      tags: [tagList.custom],
      type: 'combined',
    },
  },
  {
    path: '/rain',
    name: 'rain',
    component: () => import('../pages/combined/rain.vue'),
    meta: {
      isPage: true,
      title: 'rain',
      tags: [tagList.custom],
      type: 'combined',
    },
  },
  {
    path: '/stardewValley',
    name: '星露谷物语',
    component: () => import('../pages/combined/stardewValley.vue'),
    meta: {
      isPage: true,
      title: '星露谷物语',
      tags: [tagList.fixed, tagList.stardewValley],
      type: 'combined',
    },
  },
  {
    path: '/card2',
    name: '卡片2',
    component: () => import('../pages/combined/card2.vue'),
    meta: {
      isPage: true,
      title: '卡片2',
      tags: [tagList.fixed],
      type: 'combined',
    }
  },
  {
    path: '/simple',
    name: '简约',
    component: () => import('../pages/combined/simple.vue'),
    meta: {
      isPage: true,
      title: '简约',
      tags: [tagList.fixed],
      type: 'combined',
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue'),
    meta: {
      isPage: false,
      title: '404',
    }
  }
];

// 创建路由实例
const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 可以在这里添加登录验证等逻辑
  if (to.meta.title) {
    document.title = "自定义歌曲组件 - " + to.meta.title;
  }
  if (from.path === '/home' && to.path !== '/home') {
    ElMessage.info('单击鼠标右键可以跳转到其他页面');
  }
  next();
});

export default router;
