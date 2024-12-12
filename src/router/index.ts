import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
import { NO_RESET_WHITE_LIST } from '@/constants'

const { t } = useI18n()

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    // redirect: '/dashboard/analysis',
    redirect: '/materialIssuance/todo',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    // redirect: '/gearPlacement/index',
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/personal',
    component: Layout,
    redirect: '/personal/personal-center',
    name: 'Personal',
    meta: {
      title: t('router.personal'),
      hidden: true,
      canTo: true
    },
    children: [
      {
        path: 'personal-center',
        component: () => import('@/views/Personal/PersonalCenter/PersonalCenter.vue'),
        name: 'PersonalCenter',
        meta: {
          title: t('router.personalCenter'),
          hidden: true,
          canTo: true
        }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/dashboardPicture',
    name: 'DashboardPicture',
    meta: {
      title: t('router.allPciture'),
      icon: 'vi-cib:telegram-plane',
      url: 'http://192.168.115.26/jsc/jsc.php' // 指定外部网址
    }
  },
  {
    path: '/storageManage',
    component: Layout,
    redirect: '/storageManage/storageNow',
    name: 'StorageManage',
    meta: {
      title: t('router.storageManage'),
      icon: 'vi-ant-design:dashboard-filled',
      alwaysShow: true
    },
    children: [
      {
        path: 'storageNow',
        component: () => import('@/views/storageManage/storageNow.vue'),
        name: 'StorageNow',
        meta: {
          title: t('router.storageNow'),
          noCache: true
        }
      },
      {
        path: 'storageHistory',
        component: () => import('@/views/storageManage/storageHistory.vue'),
        name: 'StorageHistory',
        meta: {
          title: t('router.storageHistory'),
          noCache: true
        }
      },
      {
        path: 'storageDistribution',
        component: () => import('@/views/storageManage/storageDistribution.vue'),
        name: 'StorageDistribution',
        meta: {
          title: t('router.storageDistribution'),
          noCache: true
        }
      }
    ]
  },
  {
    path: '/materialIssuance',
    component: Layout,
    redirect: '/materialIssuance/demandForecast',
    name: 'MaterialIssuance',
    meta: {
      title: t('router.materialIssuance'),
      icon: 'vi-cib:telegram-plane',
      alwaysShow: true
    },
    children: [
      {
        path: 'todo',
        component: () => import('@/views/materialIssuance/todo.vue'),
        name: 'Todo',
        meta: {
          title: t('router.todo'),
          noCache: true
        }
      },
      {
        path: 'done',
        component: () => import('@/views/materialIssuance/done.vue'),
        name: 'Done',
        meta: {
          title: t('router.done'),
          noCache: true
        }
      },
      {
        path: 'demandForecast',
        component: () => import('@/views/materialIssuance/demandForecast.vue'),
        name: 'DemandForecast',
        meta: {
          title: t('router.demandForecast'),
          noCache: true
        }
      },
      {
        path: 'demandForecastApprove',
        component: () => import('@/views/materialIssuance/demandForecastApprove.vue'),
        name: 'DemandForecastApprove',
        meta: {
          title: t('router.demandForecast_approve'),
          hidden: true
        }
      },
      {
        path: 'demandForecastTotal',
        component: () => import('@/views/materialIssuance/demandForecastTotal.vue'),
        name: 'demandForecastTotal',
        meta: {
          title: t('router.demandForecastTotal'),
          noCache: true
        }
      },
      {
        path: 'review',
        component: () => import('@/views/materialIssuance/review.vue'),
        name: 'Review',
        meta: {
          title: t('router.review'),
          noCache: true
        }
      },
      {
        path: 'reviewApprove',
        component: () => import('@/views/materialIssuance/reviewApprove.vue'),
        name: 'ReviewApprove',
        meta: {
          title: t('router.review_approve'),
          hidden: true
        }
      },
      {
        path: 'issuanceProgress',
        component: () => import('@/views/materialIssuance/issuanceProgress.vue'),
        name: 'IssuanceProgress',
        meta: {
          title: t('router.issuanceProgress'),
          noCache: true
        }
      },
      {
        path: 'historicalIssuance',
        component: () => import('@/views/materialIssuance/historicalIssuance.vue'),
        name: 'HistoricalIssuance',
        meta: {
          title: t('router.historicalIssuance'),
          noCache: true
        }
      }
    ]
  },
  {
    path: '/materialSupervision',
    component: Layout,
    redirect: '/materialSupervision/gpsInformation',
    name: 'MaterialSupervision',
    meta: {
      title: t('router.materialSupervision'),
      icon: 'vi-bx:bxs-component',
      alwaysShow: true
    },
    children: [
      {
        path: 'gpsInformation',
        component: () => import('@/views/materialSupervision/gpsInformation.vue'),
        name: 'GpsInformation',
        meta: {
          title: t('router.gpsInformation'),
          noCache: true
        }
      },
      {
        path: 'verification',
        component: () => import('@/views/materialSupervision/verification.vue'),
        name: 'Verification',
        meta: {
          title: t('router.verification'),
          noCache: true
        }
      }
    ]
  },
  {
    path: '/gearPlacement',
    component: Layout,
    name: 'GearPlacement',
    meta: {},
    children: [
      {
        path: 'index',
        component: () => import('@/views/gearPlacement/gearPlacements.vue'),
        name: 'GearPlacementDemo',
        meta: {
          title: t('router.gearPlacement'),
          icon: 'vi-cib:telegram-plane',
          alwaysShow: true,
          noCache: true
        }
      }
    ]
  },
  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: '/error/404',
  //   name: 'Error',
  //   meta: {
  //     title: t('router.errorPage'),
  //     icon: 'vi-ci:error',
  //     alwaysShow: true
  //   },
  //   children: [
  //     {
  //       path: '404-demo',
  //       component: () => import('@/views/Error/404.vue'),
  //       name: '404Demo',
  //       meta: {
  //         title: '404'
  //       }
  //     },
  //     {
  //       path: '403-demo',
  //       component: () => import('@/views/Error/403.vue'),
  //       name: '403Demo',
  //       meta: {
  //         title: '403'
  //       }
  //     },
  //     {
  //       path: '500-demo',
  //       component: () => import('@/views/Error/500.vue'),
  //       name: '500Demo',
  //       meta: {
  //         title: '500'
  //       }
  //     }
  //   ]
  // },
  {
    path: '/authorization',
    component: Layout,
    redirect: '/authorization/user',
    name: 'Authorization',
    meta: {
      title: t('router.authorization'),
      icon: 'vi-eos-icons:role-binding',
      alwaysShow: true
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/Authorization/User/User.vue'),
        name: 'User',
        meta: {
          title: t('router.user')
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})
export const resetRouter = (): void => {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !NO_RESET_WHITE_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}
router.beforeEach((to, _, next) => {
  if (to.meta.url) {
    window.open(to.meta.url as string, '_blank') // 跳转到指定网址
  } else {
    next() // 继续正常导航
  }
  if (to.name === 'Login') {
    const redirectParam = '/materialIssuance/todo'
    to.query.redirect = redirectParam
  }
})
export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
