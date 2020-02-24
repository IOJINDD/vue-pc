import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [{
      path: '/',
      redirect: '/demo'
    },
    {
      path: '/',
      component: () => import('../components/common/Home.vue'),
      meta: {
        title: '系统首页'
      },
      children: [{
        path: '/demo',
        component: () => import('../views/demo/index.vue'),
        meta: {
          title: '系统首页'
        }
      }]
    },
    {
      path: '/login',
      component: () => import('../views/login/index.vue')
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
});
