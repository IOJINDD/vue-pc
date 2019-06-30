import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [{
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/',
      component: resolve => require(['@/views/home/index.vue'], resolve),
      meta: {
        title: '管理系统'
      },
      children: [{
          path: '/dashboard',
          component: resolve => require(['@/views/dashboard/index.vue'], resolve),
          meta: {
            title: '系统首页'
          }
        },
        {
          path: '/404',
          component: resolve => require(['@/views/404.vue'], resolve),
          meta: {
            title: '404'
          }
        },
      ]
    },
    {
      path: '/login',
      component: resolve => require(['@/views/login/index.vue'], resolve)
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
