<script setup lang="ts">
import { computed, ref } from 'vue'
import { Save, Snowflake, Star } from '@lucide/vue'

import AppToast from '@/components/common/AppToast.vue'
import PageToolbar from '@/components/common/PageToolbar.vue'
import UploadGrid from '@/components/common/UploadGrid.vue'

interface ColdProjectEditor {
  id: number
  slug: string
  title: string
  tag: string
  summary: string
  award: string
  detailSummary: string
  temperatureCondition: string
  constructionPeriod: string
  coldStorageArea: string
  description: string
  coverUrl: string
  galleryUrls: string[]
  sort: number
  enabled: boolean
  featuredOnColdPage: boolean
}

const pageConfig = {
  title: '冷库项目配置',
  description: '统一维护首页案例卡片、详情页介绍、项目图集和冷库页主推项目。',
  buttonLabel: '保存冷库项目配置',
}

const projects = ref<ColdProjectEditor[]>([
  {
    id: 1,
    slug: 'shenzhen-wine-cellar',
    title: '深港恒温酒窖整体建设工程',
    tag: '经典案例一',
    summary: '融合智能温控与美学支架，为 5000 支珍稀年份红酒提供稳定、避光、恒湿的储藏环境。',
    award: '2024 年度卓越工程',
    detailSummary: '恒温恒湿 · 智能监控 · 5000 支容量',
    temperatureCondition: '12-18℃',
    constructionPeriod: '45 天',
    coldStorageArea: '1200 平方米',
    description:
      '本项目位于深圳市南山区，是为高端私人会所定制的恒温酒窖工程。项目融合进口温控系统、橡木酒架和智能监控平台，打造稳定、可视、可维护的酒类存储环境。',
    coverUrl: '/static/home/Banner/banner1.png',
    galleryUrls: ['/static/home/Banner/banner1.png', '/static/home/Banner/banner1.png', '/static/home/Banner/banner1.png'],
    sort: 10,
    enabled: true,
    featuredOnColdPage: true,
  },
  {
    id: 2,
    slug: 'lingnan-wine-culture-center',
    title: '岭南酒文化展示中心',
    tag: '经典案例二',
    summary: '集酒文化展示、品鉴体验、文化交流于一体，适合作为品牌体验与空间陈列样板。',
    award: '2024 年度设计案例',
    detailSummary: '展示陈列 · 品鉴体验 · 文化交流',
    temperatureCondition: '14-18℃',
    constructionPeriod: '30 天',
    coldStorageArea: '860 平方米',
    description:
      '围绕酒文化内容展示、产品陈列和客户接待动线进行整体规划，形成兼具体验感和实用性的展示中心。',
    coverUrl: '/static/home/Banner/banner1.png',
    galleryUrls: ['/static/home/Banner/banner1.png', '/static/home/Banner/banner1.png'],
    sort: 20,
    enabled: true,
    featuredOnColdPage: false,
  },
  {
    id: 3,
    slug: 'south-china-fresh-cold-hub',
    title: '华南生鲜冷链中转冷库',
    tag: '经典案例三',
    summary: '覆盖分拣、预冷、周转和配送节点，适配生鲜履约类客户的高频出入库需求。',
    award: '冷链物流样板项目',
    detailSummary: '快速周转 · 分区储存 · 全链监测',
    temperatureCondition: '-2-4℃',
    constructionPeriod: '55 天',
    coldStorageArea: '1800 平方米',
    description:
      '项目面向生鲜食品企业和区域配送中心，采用分区温控与智能监测方案，提升周转效率并降低损耗。',
    coverUrl: '/static/home/Banner/banner1.png',
    galleryUrls: ['/static/home/Banner/banner1.png'],
    sort: 30,
    enabled: false,
    featuredOnColdPage: false,
  },
])

const selectedProjectId = ref(projects.value[0]?.id ?? 1)

const selectedProject = computed(() => projects.value.find((item) => item.id === selectedProjectId.value) ?? projects.value[0])
const featuredProject = computed(() => projects.value.find((item) => item.featuredOnColdPage) ?? projects.value[0])
const homeProjects = computed(() => [...projects.value].filter((item) => item.enabled).sort((a, b) => a.sort - b.sort).slice(0, 3))

const toastOpen = ref(false)
const toastTone = ref<'success' | 'error'>('success')
const toastTitle = ref('')
const toastMessage = ref('')

function openToast(tone: 'success' | 'error', title: string, message: string) {
  toastTone.value = tone
  toastTitle.value = title
  toastMessage.value = message
  toastOpen.value = true
}

function selectProject(projectId: number) {
  selectedProjectId.value = projectId
}

function setFeaturedProject(projectId: number) {
  projects.value = projects.value.map((item) => ({
    ...item,
    featuredOnColdPage: item.id === projectId,
  }))
  selectedProjectId.value = projectId
}

function updateGalleryUrl(index: number, value: string) {
  selectedProject.value.galleryUrls[index] = value
}

function handleGalleryInput(index: number, event: Event) {
  const target = event.target as HTMLInputElement | null
  updateGalleryUrl(index, target?.value ?? '')
}

function addGalleryImage() {
  selectedProject.value.galleryUrls.push('')
}

function removeGalleryImage(index: number) {
  if (selectedProject.value.galleryUrls.length === 1) {
    openToast('error', '至少保留一张项目图', '项目图集需要至少一张图片，便于详情页和图集模块展示。')
    return
  }
  selectedProject.value.galleryUrls.splice(index, 1)
}

function handleCoverSelected(fileNames: string[]) {
  if (!fileNames.length) {
    return
  }
  selectedProject.value.coverUrl = `/uploads/cold/${fileNames[0]}`
}

function handleGallerySelected(fileNames: string[]) {
  if (!fileNames.length) {
    return
  }
  selectedProject.value.galleryUrls.push(...fileNames.map((fileName) => `/uploads/cold/${fileName}`))
}

function saveProjects() {
  const hasFeaturedProject = projects.value.some((item) => item.featuredOnColdPage)
  const enabledProjects = projects.value.filter((item) => item.enabled)

  if (!hasFeaturedProject) {
    openToast('error', '缺少冷库页主推项目', '请至少指定 1 个项目用于冷库页面的项目概况展示。')
    return
  }

  if (enabledProjects.length === 0) {
    openToast('error', '请至少启用一个项目', '首页案例卡片和冷库详情都需要至少 1 个可展示项目。')
    return
  }

  openToast(
    'success',
    '冷库配置已整理',
    '当前页面已经按“首页卡片、详情页、项目图集、冷库页主推项目”的结构整理完毕，后续接入接口即可直接落库。',
  )
}
</script>

<template>
  <div class="space-y-6">
    <PageToolbar :title="pageConfig.title" :description="pageConfig.description" search-placeholder="搜索冷库项目或案例标题">
      <template #actions>
        <button class="btn-primary shrink-0 sm:w-auto" type="button" @click="saveProjects">
          <Save class="size-4" />
          {{ pageConfig.buttonLabel }}
        </button>
      </template>
    </PageToolbar>

    <section class="grid gap-4 xl:grid-cols-3">
      <article class="card p-5">
        <div class="flex items-center gap-3">
          <div class="flex size-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
            <Snowflake class="size-5" />
          </div>
          <div>
            <h2 class="text-base font-extrabold text-slate-950">首页案例卡片</h2>
            <p class="mt-1 text-sm leading-6 text-slate-500">按排序展示前 3 个已启用项目。</p>
          </div>
        </div>
        <div class="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
          左上角标签、封面图、大标题、说明文案和右下角自定义标签都从项目主表统一维护。
        </div>
      </article>

      <article class="card p-5">
        <div class="flex items-center gap-3">
          <div class="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
            <Star class="size-5" />
          </div>
          <div>
            <h2 class="text-base font-extrabold text-slate-950">详情页固定结构</h2>
            <p class="mt-1 text-sm leading-6 text-slate-500">按钮文案由前端写死为“案例介绍”。</p>
          </div>
        </div>
        <div class="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
          标题同步首页案例标题，详情说明、达到温度条件、建设周期、冷库面积、项目介绍和图集都由后台配置。
        </div>
      </article>

      <article class="card p-5">
        <div class="flex items-center gap-3">
          <div class="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
            <Snowflake class="size-5" />
          </div>
          <div>
            <h2 class="text-base font-extrabold text-slate-950">冷库页主推项目</h2>
            <p class="mt-1 text-sm leading-6 text-slate-500">冷库页的项目概况只引用 1 个主推项目。</p>
          </div>
        </div>
        <div class="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
          主推项目复用同一套封面、三项指标和项目介绍，不再重复维护第二套冷库内容字段。
        </div>
      </article>
    </section>

    <section class="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside class="space-y-4">
        <div class="card p-5">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-lg font-extrabold text-slate-950">项目列表</h2>
              <p class="mt-1 text-sm leading-6 text-slate-500">冷库展示项目最多维护 3 个，排序越小越靠前。</p>
            </div>
            <div class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{{ homeProjects.length }}/3 启用</div>
          </div>
        </div>

        <button
          v-for="project in [...projects].sort((a, b) => a.sort - b.sort)"
          :key="project.id"
          type="button"
          class="card w-full p-5 text-left transition"
          :class="project.id === selectedProject.id ? 'border-teal-300 shadow-lg shadow-teal-100/70' : 'hover:border-slate-300 hover:shadow-md'"
          @click="selectProject(project.id)"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">项目 {{ project.id }}</p>
              <h3 class="mt-2 text-base font-extrabold text-slate-950">{{ project.title }}</h3>
            </div>
            <div class="flex flex-col items-end gap-2">
              <span class="rounded-full px-2.5 py-1 text-xs font-bold" :class="project.enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'">
                {{ project.enabled ? '已启用' : '未启用' }}
              </span>
              <span v-if="project.featuredOnColdPage" class="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">冷库页主推</span>
            </div>
          </div>

          <p class="mt-3 text-sm leading-6 text-slate-600">{{ project.summary }}</p>

          <div class="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">达到温度条件</p>
              <p class="mt-1 text-sm font-extrabold text-slate-900">{{ project.temperatureCondition }}</p>
            </div>
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">建设周期</p>
              <p class="mt-1 text-sm font-extrabold text-slate-900">{{ project.constructionPeriod }}</p>
            </div>
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">冷库面积</p>
              <p class="mt-1 text-sm font-extrabold text-slate-900">{{ project.coldStorageArea }}</p>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between text-sm text-slate-500">
            <span>排序 {{ project.sort }}</span>
            <span>{{ project.galleryUrls.length }} 张图集</span>
          </div>
        </button>
      </aside>

      <div class="space-y-6">
        <section class="card p-6">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 class="text-lg font-extrabold text-slate-950">项目内容编辑</h2>
              <p class="mt-1 text-sm leading-6 text-slate-500">当前编辑：{{ selectedProject.title }}</p>
            </div>
            <button class="btn-secondary sm:w-auto" type="button" @click="setFeaturedProject(selectedProject.id)">
              <Star class="size-4" />
              设为冷库页主推
            </button>
          </div>

          <div class="mt-6 space-y-6">
            <section class="space-y-4">
              <div>
                <h3 class="text-sm font-extrabold uppercase tracking-[0.22em] text-slate-400">基础信息</h3>
                <p class="mt-1 text-sm leading-6 text-slate-500">控制排序、启用状态和冷库页主推项目归属。</p>
              </div>

              <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <label class="block">
                  <span class="mb-2 block text-sm font-bold text-slate-700">项目标题</span>
                  <input v-model="selectedProject.title" class="input-field" placeholder="请输入冷库项目标题" />
                </label>
                <label class="block">
                  <span class="mb-2 block text-sm font-bold text-slate-700">Slug</span>
                  <input v-model="selectedProject.slug" class="input-field" placeholder="用于接口或跳转的唯一标识" />
                </label>
                <label class="block">
                  <span class="mb-2 block text-sm font-bold text-slate-700">排序</span>
                  <input v-model.number="selectedProject.sort" class="input-field" type="number" min="1" />
                </label>
                <label class="block">
                  <span class="mb-2 block text-sm font-bold text-slate-700">启用状态</span>
                  <select v-model="selectedProject.enabled" class="input-field">
                    <option :value="true">已启用</option>
                    <option :value="false">未启用</option>
                  </select>
                </label>
              </div>
            </section>

            <section class="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
              <div>
                <h3 class="text-sm font-extrabold uppercase tracking-[0.22em] text-slate-400">首页卡片字段</h3>
                <p class="mt-1 text-sm leading-6 text-slate-500">左上角标签、封面、大标题说明和右下角自定义标签都在这里维护。</p>
              </div>

              <div class="grid gap-4 md:grid-cols-2">
                <label class="block">
                  <span class="mb-2 block text-sm font-bold text-slate-700">左上角标签</span>
                  <input v-model="selectedProject.tag" class="input-field" placeholder="例如：经典案例一" />
                </label>
                <label class="block">
                  <span class="mb-2 block text-sm font-bold text-slate-700">右下角自定义标签</span>
                  <input v-model="selectedProject.award" class="input-field" placeholder="例如：2024 年度卓越工程" />
                </label>
              </div>

              <label class="block">
                <span class="mb-2 block text-sm font-bold text-slate-700">首页说明文案</span>
                <textarea v-model="selectedProject.summary" class="input-field min-h-28 resize-none" placeholder="用于首页案例卡片的大标题下方解释文案"></textarea>
              </label>

              <div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
                <label class="block">
                  <span class="mb-2 block text-sm font-bold text-slate-700">封面图地址</span>
                  <input v-model="selectedProject.coverUrl" class="input-field" placeholder="请输入封面图片 URL" />
                </label>
                <UploadGrid
                  compact
                  title="上传案例封面"
                  hint="接入上传接口后可自动回填封面地址"
                  :current-label="selectedProject.coverUrl"
                  :multiple="false"
                  @selected="handleCoverSelected"
                />
              </div>
            </section>

            <section class="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
              <div>
                <h3 class="text-sm font-extrabold uppercase tracking-[0.22em] text-slate-400">详情页字段</h3>
                <p class="mt-1 text-sm leading-6 text-slate-500">黄色按钮文案由前端固定为“案例介绍”，这里只维护标题下说明、3 项指标和项目介绍。</p>
              </div>

              <label class="block">
                <span class="mb-2 block text-sm font-bold text-slate-700">标题下说明文案</span>
                <input v-model="selectedProject.detailSummary" class="input-field" placeholder="例如：恒温恒湿 · 智能监控 · 5000 支容量" />
              </label>

              <div class="grid gap-4 md:grid-cols-3">
                <label class="block">
                  <span class="mb-2 block text-sm font-bold text-slate-700">达到温度条件</span>
                  <input v-model="selectedProject.temperatureCondition" class="input-field" placeholder="例如：12-18℃" />
                </label>
                <label class="block">
                  <span class="mb-2 block text-sm font-bold text-slate-700">建设周期</span>
                  <input v-model="selectedProject.constructionPeriod" class="input-field" placeholder="例如：45 天" />
                </label>
                <label class="block">
                  <span class="mb-2 block text-sm font-bold text-slate-700">冷库面积</span>
                  <input v-model="selectedProject.coldStorageArea" class="input-field" placeholder="例如：1200 平方米" />
                </label>
              </div>

              <label class="block">
                <span class="mb-2 block text-sm font-bold text-slate-700">项目介绍正文</span>
                <textarea v-model="selectedProject.description" class="input-field min-h-36 resize-none" placeholder="用于详情页“项目介绍”正文与冷库页项目概况正文"></textarea>
              </label>
            </section>

            <section class="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
              <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 class="text-sm font-extrabold uppercase tracking-[0.22em] text-slate-400">项目图集</h3>
                  <p class="mt-1 text-sm leading-6 text-slate-500">项目图集会用于详情页“项目图集”模块，建议维护 3-6 张图片。</p>
                </div>
                <button class="btn-secondary sm:w-auto" type="button" @click="addGalleryImage">新增图片地址</button>
              </div>

              <div class="space-y-3">
                <div v-for="(imageUrl, index) in selectedProject.galleryUrls" :key="`${selectedProject.id}-${index}`" class="grid gap-3 md:grid-cols-[minmax(0,1fr)_120px]">
                  <input :value="imageUrl" class="input-field" placeholder="请输入图集图片 URL" @input="handleGalleryInput(index, $event)" />
                  <button class="btn-secondary sm:w-auto" type="button" @click="removeGalleryImage(index)">删除图片</button>
                </div>
              </div>

              <UploadGrid
                compact
                title="批量补充图集"
                hint="当前为结构演示，选择文件后会生成模拟路径"
                :current-label="`${selectedProject.galleryUrls.length} 张图`"
                @selected="handleGallerySelected"
              />
            </section>
          </div>
        </section>

        <section class="card p-6">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-extrabold text-slate-950">字段映射预览</h2>
              <p class="mt-1 text-sm leading-6 text-slate-500">方便运营确认后台字段和小程序展示内容是一一对应的。</p>
            </div>
            <span class="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">主推项目：{{ featuredProject.title }}</span>
          </div>

          <div class="mt-6 grid gap-4 xl:grid-cols-3">
            <article class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p class="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-400">首页卡片</p>
              <h3 class="mt-3 text-base font-extrabold text-slate-950">{{ selectedProject.title }}</h3>
              <p class="mt-3 text-sm leading-6 text-slate-600">左上角标签：{{ selectedProject.tag || '未填写' }}</p>
              <p class="mt-2 text-sm leading-6 text-slate-600">解释文案：{{ selectedProject.summary || '未填写' }}</p>
              <p class="mt-2 text-sm leading-6 text-slate-600">右下角标签：{{ selectedProject.award || '未填写' }}</p>
            </article>

            <article class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p class="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-400">详情页</p>
              <h3 class="mt-3 text-base font-extrabold text-slate-950">{{ selectedProject.title }}</h3>
              <p class="mt-3 text-sm leading-6 text-slate-600">按钮文案：案例介绍（前端固定）</p>
              <p class="mt-2 text-sm leading-6 text-slate-600">标题下说明：{{ selectedProject.detailSummary || '未填写' }}</p>
              <p class="mt-2 text-sm leading-6 text-slate-600">三项指标：{{ selectedProject.temperatureCondition }} / {{ selectedProject.constructionPeriod }} / {{ selectedProject.coldStorageArea }}</p>
            </article>

            <article class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p class="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-400">冷库页项目概况</p>
              <h3 class="mt-3 text-base font-extrabold text-slate-950">{{ featuredProject.title }}</h3>
              <p class="mt-3 text-sm leading-6 text-slate-600">复用封面图、三项指标和项目介绍，不再维护第二份冷库概况文案。</p>
              <p class="mt-2 text-sm leading-6 text-slate-600">当前图集数量：{{ selectedProject.galleryUrls.length }} 张</p>
            </article>
          </div>
        </section>
      </div>
    </section>

    <AppToast :open="toastOpen" :tone="toastTone" :title="toastTitle" :message="toastMessage" @close="toastOpen = false" />
  </div>
</template>
