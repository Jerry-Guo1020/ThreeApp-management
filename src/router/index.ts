import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'

import { appState } from '@/stores/app'
import { currentUser } from '@/stores/user'

const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/index.vue'),
    meta: { title: '管理员登录', public: true },
  },
  {
    path: '/',
    component: () => import('@/components/layout/AppShell.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: { title: '工作台', description: '商品、评论、问答和内容配置的运营概览。' },
      },
      {
        path: 'products/wine',
        name: 'wine-products',
        component: () => import('@/views/ProductManagement/WineProduct/index.vue'),
        meta: { title: '酒水商品', description: '维护酒水商品资料、详情图和小程序展示配置。' },
      },
      {
        path: 'products/specialty',
        name: 'specialty-products',
        component: () => import('@/views/ProductManagement/SpecialtyProduct/index.vue'),
        meta: { title: '特产商品', description: '维护特产商品分类、产地、详情图和上下架状态。' },
      },
      {
        path: 'updates',
        name: 'product-updates',
        component: () => import('@/views/ProductUpdates/index.vue'),
        meta: { title: '商品更新', description: '管理商品详情页、热销榜和场景页的更新动态。' },
      },
      {
        path: 'comments/:type(wine|specialty)',
        name: 'comment-products',
        component: () => import('@/views/CommentManagement/ProductList.vue'),
        props: (route: RouteLocationNormalized) => ({ type: route.params.type }),
        meta: { title: '评论管理', description: '按商品查看评论概况，再进入详情处理回复、置顶和删除。' },
      },
      {
        path: 'comments/:type(wine|specialty)/:productId',
        name: 'comment-detail',
        component: () => import('@/views/CommentManagement/CommentDetail.vue'),
        props: true,
        meta: { title: '评论详情', description: '查看全部评论与二级回复，执行后台管理操作。' },
      },
      {
        path: 'questions',
        name: 'questions',
        component: () => import('@/views/QuestionManagement/index.vue'),
        meta: { title: '问答管理', description: '集中处理用户咨询、商品问题和待回复内容。' },
      },
      {
        path: 'questions/:id',
        name: 'question-detail',
        component: () => import('@/views/QuestionManagement/QuestionDetail.vue'),
        props: true,
        meta: { title: '问答详情', description: '查看问答上下文并提交商家回复。' },
      },
      {
        path: 'content/banner',
        name: 'content-banner',
        component: () => import('@/views/ContentConfiguration/HomeBanner.vue'),
        meta: { title: '首页 Banner', description: '配置首页轮播图、跳转目标、排序和上下架状态。' },
      },
      {
        path: 'content/specialty',
        name: 'content-specialty',
        component: () => import('@/views/ContentConfiguration/SpecialtyConfig.vue'),
        meta: { title: '特产模块配置', description: '配置品牌故事、核心亮点、地区特产和分类入口。' },
      },
      {
        path: 'content/wine',
        name: 'content-wine',
        component: () => import('@/views/ContentConfiguration/WineConfig.vue'),
        meta: { title: '酒水模块配置', description: '配置热门酒水、场景推荐、详情卖点和联系入口。' },
      },
      {
        path: 'content/cold-storage',
        name: 'content-cold-storage',
        component: () => import('@/views/ContentConfiguration/ColdStorageConfig.vue'),
        meta: { title: '冷库项目内容', description: '配置服务场景、流程步骤、项目介绍和咨询按钮。' },
      },
      {
        path: 'materials',
        name: 'materials',
        component: () => import('@/views/MaterialManagement/index.vue'),
        meta: { title: '素材管理', description: '管理商品封面、Banner、详情图、评价图和地区图片。' },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/Settings/index.vue'),
        meta: { title: '系统设置', description: '管理员维护用户账号、角色权限和可用状态。' },
      },
      {
        path: 'design-review',
        redirect: '/dashboard',
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const canEnter = appState.isAuthenticated && Boolean(currentUser.value)

  if (!to.meta.public && !canEnter) {
    return { path: '/login' }
  }

  if (to.path === '/login' && canEnter) {
    return { path: '/dashboard' }
  }

  return true
})

export default router
