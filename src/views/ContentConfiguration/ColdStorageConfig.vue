<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  Pencil,
  Plus,
  Save,
  ShieldCheck,
  Snowflake,
  Star,
  Trash2,
  Upload,
  X,
} from '@lucide/vue'

import ActionIconButton from '@/components/common/ActionIconButton.vue'
import AppToast from '@/components/common/AppToast.vue'
import DataTable from '@/components/common/DataTable.vue'
import PageToolbar from '@/components/common/PageToolbar.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import UploadGrid from '@/components/common/UploadGrid.vue'
import { mockUpload } from '@/api/upload'

interface ColdProjectGalleryItem {
  id: string
  fileName: string
  storageUrl: string
  databaseUrl: string
  sort: number
  persisted: boolean
}

interface ColdProjectEditor {
  id: number
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
  gallery: ColdProjectGalleryItem[]
  sort: number
  publishStatus: 'published' | 'draft'
  featuredOnColdPage: boolean
}

interface ColdProjectFormState {
  id: number | null
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
  gallery: ColdProjectGalleryItem[]
  sort: number
  publishStatus: 'published' | 'draft'
  featuredOnColdPage: boolean
}

const pageConfig = {
  title: '冷库项目配置',
  description: '统一维护首页案例卡片、详情页介绍、项目图集和冷库页主推项目。',
  buttonLabel: '保存冷库项目配置',
}

const caseOrderLabels = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
const maxProjects = 6
const miniProgramVisibleLimit = 3
const nextProjectId = ref(7)
const editOpen = ref(false)
const editMode = ref<'create' | 'edit'>('edit')
const keyword = ref('')

const projects = ref<ColdProjectEditor[]>([
  {
    id: 1,
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
    coverUrl: 'https://minio.example.com/threevine/cold/project-1-cover.jpg',
    gallery: [
      createGalleryItem(1, 'project-1-gallery-1.jpg', 1),
      createGalleryItem(2, 'project-1-gallery-2.jpg', 2),
      createGalleryItem(3, 'project-1-gallery-3.jpg', 3),
    ],
    sort: 1,
    publishStatus: 'published',
    featuredOnColdPage: true,
  },
  {
    id: 2,
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
    coverUrl: 'https://minio.example.com/threevine/cold/project-2-cover.jpg',
    gallery: [
      createGalleryItem(4, 'project-2-gallery-1.jpg', 1),
      createGalleryItem(5, 'project-2-gallery-2.jpg', 2),
    ],
    sort: 2,
    publishStatus: 'published',
    featuredOnColdPage: false,
  },
  {
    id: 3,
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
    coverUrl: 'https://minio.example.com/threevine/cold/project-3-cover.jpg',
    gallery: [createGalleryItem(6, 'project-3-gallery-1.jpg', 1)],
    sort: 3,
    publishStatus: 'published',
    featuredOnColdPage: false,
  },
  {
    id: 4,
    title: '粤港跨境预冷仓储项目',
    tag: '经典案例四',
    summary: '适配跨境果蔬预冷、短驳周转与装柜前缓存，强调速度和批次稳定性。',
    award: '跨境履约方案',
    detailSummary: '预冷分区 · 快速装卸 · 到港衔接',
    temperatureCondition: '0-5℃',
    constructionPeriod: '26 天',
    coldStorageArea: '780 平方米',
    description: '服务跨境果蔬运输场景，配置快速预冷区、短时缓存区和装柜待发区，提升高峰时段周转效率。',
    coverUrl: 'https://minio.example.com/threevine/cold/project-4-cover.jpg',
    gallery: [createGalleryItem(7, 'project-4-gallery-1.jpg', 1)],
    sort: 4,
    publishStatus: 'draft',
    featuredOnColdPage: false,
  },
])

const projectForm = ref<ColdProjectFormState>(createEmptyForm())
const projectFormCaseLabel = computed(() => getProjectCaseLabel(projectForm.value.sort))

const filteredProjects = computed(() => {
  const normalizedKeyword = keyword.value.trim().toLowerCase()
  return [...projects.value]
    .filter((item) => {
      if (!normalizedKeyword) {
        return true
      }
      return [item.title, getProjectCaseLabel(item.sort), item.summary, item.award, item.detailSummary].join(' ').toLowerCase().includes(normalizedKeyword)
    })
    .sort((a, b) => a.sort - b.sort || a.id - b.id)
})

const publishedProjects = computed(() => [...projects.value].filter((item) => item.publishStatus === 'published').sort((a, b) => a.sort - b.sort || a.id - b.id))
const visibleProjects = computed(() => publishedProjects.value.slice(0, miniProgramVisibleLimit))
const draftProjects = computed(() => projects.value.filter((item) => item.publishStatus === 'draft').sort((a, b) => a.sort - b.sort || a.id - b.id))
const featuredProject = computed(() => projects.value.find((item) => item.featuredOnColdPage) ?? null)
const projectLimitReached = computed(() => projects.value.length >= maxProjects)
const isEditing = computed(() => editMode.value === 'edit')
const dialogTitle = computed(() => `${isEditing.value ? '编辑' : '新增'}冷库项目`)
const selectedPreviewProject = computed(() => {
  if (projectForm.value.id != null) {
    return projects.value.find((item) => item.id === projectForm.value.id) ?? null
  }
  return visibleProjects.value[0] ?? featuredProject.value ?? filteredProjects.value[0] ?? null
})

const toastOpen = ref(false)
const toastTone = ref<'success' | 'error'>('success')
const toastTitle = ref('')
const toastMessage = ref('')

function createGalleryItem(seed: number, fileName: string, sort: number): ColdProjectGalleryItem {
  const storageUrl = `https://minio.example.com/threevine/cold/${fileName}`
  return {
    id: `gallery-${seed}`,
    fileName,
    storageUrl,
    databaseUrl: storageUrl,
    sort,
    persisted: true,
  }
}

function getProjectCaseLabel(sort: number) {
  const normalizedSort = Number.isFinite(sort) && sort > 0 ? Math.floor(sort) : 1
  const labelSuffix = caseOrderLabels[normalizedSort - 1] ?? String(normalizedSort)
  return `项目案例${labelSuffix}`
}

function createEmptyForm(): ColdProjectFormState {
  return {
    id: null,
    title: '',
    tag: '',
    summary: '',
    award: '',
    detailSummary: '',
    temperatureCondition: '',
    constructionPeriod: '',
    coldStorageArea: '',
    description: '',
    coverUrl: '',
    gallery: [],
    sort: projects.value.length + 1,
    publishStatus: 'draft',
    featuredOnColdPage: false,
  }
}

function cloneProjectToForm(project: ColdProjectEditor): ColdProjectFormState {
  return {
    id: project.id,
    title: project.title,
    tag: project.tag,
    summary: project.summary,
    award: project.award,
    detailSummary: project.detailSummary,
    temperatureCondition: project.temperatureCondition,
    constructionPeriod: project.constructionPeriod,
    coldStorageArea: project.coldStorageArea,
    description: project.description,
    coverUrl: project.coverUrl,
    gallery: project.gallery.map((item) => ({ ...item })),
    sort: project.sort,
    publishStatus: project.publishStatus,
    featuredOnColdPage: project.featuredOnColdPage,
  }
}

function openToast(tone: 'success' | 'error', title: string, message: string) {
  toastTone.value = tone
  toastTitle.value = title
  toastMessage.value = message
  toastOpen.value = true
}

function openCreateDialog() {
  if (projectLimitReached.value) {
    openToast('error', '项目数量已达上限', `冷库项目最多允许维护 ${maxProjects} 个，请先删除或归档旧项目。`)
    return
  }

  editMode.value = 'create'
  projectForm.value = createEmptyForm()
  editOpen.value = true
}

function openEditDialog(project: ColdProjectEditor) {
  editMode.value = 'edit'
  projectForm.value = cloneProjectToForm(project)
  editOpen.value = true
}

function closeDialog() {
  editOpen.value = false
}

function normalizeProjectSorts() {
  projects.value = [...projects.value]
    .sort((a, b) => a.sort - b.sort || a.id - b.id)
    .map((item, index) => ({
      ...item,
      sort: index + 1,
      tag: getProjectCaseLabel(index + 1),
      gallery: [...item.gallery]
        .sort((a, b) => a.sort - b.sort || a.fileName.localeCompare(b.fileName))
        .map((galleryItem, galleryIndex) => ({
          ...galleryItem,
          sort: galleryIndex + 1,
        })),
    }))
}

normalizeProjectSorts()

function saveProject() {
  if (!projectForm.value.title.trim()) {
    openToast('error', '项目标题未填写', '请先补充项目标题，再保存冷库项目。')
    return
  }

  if (!projectForm.value.coverUrl.trim()) {
    openToast('error', '封面图未配置', '请先上传案例封面，确保首页和详情页都有可展示的图片。')
    return
  }

  if (projectForm.value.gallery.length === 0) {
    openToast('error', '项目图集为空', '请至少上传 1 张项目图，便于详情页展示完整图集。')
    return
  }

  if (projectForm.value.id == null) {
    projects.value.push({
      id: nextProjectId.value,
      title: projectForm.value.title.trim(),
      tag: getProjectCaseLabel(projectForm.value.sort),
      summary: projectForm.value.summary.trim(),
      award: projectForm.value.award.trim(),
      detailSummary: projectForm.value.detailSummary.trim(),
      temperatureCondition: projectForm.value.temperatureCondition.trim(),
      constructionPeriod: projectForm.value.constructionPeriod.trim(),
      coldStorageArea: projectForm.value.coldStorageArea.trim(),
      description: projectForm.value.description.trim(),
      coverUrl: projectForm.value.coverUrl.trim(),
      gallery: projectForm.value.gallery.map((galleryItem) => ({ ...galleryItem })),
      sort: projectForm.value.sort,
      publishStatus: projectForm.value.publishStatus,
      featuredOnColdPage: false,
    })
    nextProjectId.value += 1
  } else {
    projects.value = projects.value.map((item) => {
      if (item.id !== projectForm.value.id) {
        return item
      }
      return {
        id: item.id,
        title: projectForm.value.title.trim(),
        tag: getProjectCaseLabel(projectForm.value.sort),
        summary: projectForm.value.summary.trim(),
        award: projectForm.value.award.trim(),
        detailSummary: projectForm.value.detailSummary.trim(),
        temperatureCondition: projectForm.value.temperatureCondition.trim(),
        constructionPeriod: projectForm.value.constructionPeriod.trim(),
        coldStorageArea: projectForm.value.coldStorageArea.trim(),
        description: projectForm.value.description.trim(),
        coverUrl: projectForm.value.coverUrl.trim(),
        gallery: projectForm.value.gallery.map((galleryItem) => ({ ...galleryItem })),
        sort: projectForm.value.sort,
        publishStatus: projectForm.value.publishStatus,
        featuredOnColdPage: item.featuredOnColdPage,
      }
    })
  }

  normalizeProjectSorts()

  if (projectForm.value.featuredOnColdPage && projectForm.value.id != null) {
    setFeaturedProject(projectForm.value.id, false)
  }

  closeDialog()
  openToast('success', '项目已保存', '冷库项目内容已更新，项目列表、字段映射预览和小程序展示顺序都会按新的数据刷新。')
}

function setFeaturedProject(projectId: number, notify = true) {
  projects.value = projects.value.map((item) => ({
    ...item,
    featuredOnColdPage: item.id === projectId,
  }))

  if (projectForm.value.id === projectId) {
    projectForm.value.featuredOnColdPage = true
  }

  if (notify) {
    openToast('success', '已设置冷库页主推项目', '冷库页项目概况会优先复用这个项目的封面、三项指标和项目介绍。')
  }
}

function toggleDraft(projectId: number) {
  projects.value = projects.value.map((item) => {
    if (item.id !== projectId) {
      return item
    }
    return {
      ...item,
      publishStatus: item.publishStatus === 'draft' ? 'published' : 'draft',
    }
  })
  normalizeProjectSorts()
}

function removeProject(projectId: number) {
  const target = projects.value.find((item) => item.id === projectId)
  if (!target) {
    return
  }

  projects.value = projects.value.filter((item) => item.id !== projectId)

  if (target.featuredOnColdPage && projects.value.length > 0) {
    projects.value = projects.value.map((item, index) => ({
      ...item,
      featuredOnColdPage: index === 0,
    }))
  }

  normalizeProjectSorts()
  openToast('success', '项目已移除', '该冷库项目已从管理列表中移除，展示排序也已自动重排。')
}

function moveProject(projectId: number, direction: 'up' | 'down') {
  const orderedProjects = [...projects.value].sort((a, b) => a.sort - b.sort || a.id - b.id)
  const currentIndex = orderedProjects.findIndex((item) => item.id === projectId)
  if (currentIndex === -1) {
    return
  }

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
  if (targetIndex < 0 || targetIndex >= orderedProjects.length) {
    return
  }

  ;[orderedProjects[currentIndex], orderedProjects[targetIndex]] = [orderedProjects[targetIndex], orderedProjects[currentIndex]]
  projects.value = orderedProjects.map((item, index) => ({
    ...item,
    sort: index + 1,
    tag: getProjectCaseLabel(index + 1),
  }))
}

function handleCoverSelected(fileNames: string[]) {
  const [fileName] = fileNames
  if (!fileName) {
    return
  }

  const uploadResult = mockUpload(fileName)
  projectForm.value.coverUrl = `https://minio.example.com/threevine/cold/${uploadResult.fileName}`
  openToast('success', '封面已写入模拟存储', '当前为前端联调阶段：已模拟上传到 MinIO，并将回填地址作为后续写入 MySQL 的值。')
}

function handleGallerySelected(fileNames: string[]) {
  if (!fileNames.length) {
    return
  }

  const nextGallery = fileNames.map((fileName, index) => {
    const uploadResult = mockUpload(fileName)
    const sort = projectForm.value.gallery.length + index + 1
    const storageUrl = `https://minio.example.com/threevine/cold/${uploadResult.fileName}`
    return {
      id: `gallery-upload-${Date.now()}-${index}`,
      fileName: uploadResult.fileName,
      storageUrl,
      databaseUrl: storageUrl,
      sort,
      persisted: true,
    } satisfies ColdProjectGalleryItem
  })

  projectForm.value.gallery.push(...nextGallery)
  openToast('success', '图集地址已生成', '当前会先模拟 MinIO 地址回填，真实联调时这里会改为“上传 MinIO -> 获取 URL -> 落 MySQL”。')
}

function removeGalleryImage(galleryId: string) {
  projectForm.value.gallery = projectForm.value.gallery.filter((item) => item.id !== galleryId).map((item, index) => ({
    ...item,
    sort: index + 1,
  }))
}

function updateGalleryDatabaseUrl(galleryId: string, value: string) {
  projectForm.value.gallery = projectForm.value.gallery.map((item) => {
    if (item.id !== galleryId) {
      return item
    }
    return {
      ...item,
      databaseUrl: value,
    }
  })
}

function saveProjects() {
  const hasFeaturedProject = projects.value.some((item) => item.featuredOnColdPage)
  const enabledProjects = projects.value.filter((item) => item.publishStatus === 'published')

  if (!hasFeaturedProject) {
    openToast('error', '缺少冷库页主推项目', '请至少指定 1 个项目用于冷库页面的项目概况展示。')
    return
  }

  if (enabledProjects.length === 0) {
    openToast('error', '暂无可展示项目', '请至少发布 1 个冷库项目，首页案例卡片和详情页才能正常取数。')
    return
  }

  normalizeProjectSorts()
  openToast('success', '冷库配置已保存', '当前页面已收窄项目列表列宽，并把详细字段统一收回弹窗和下方映射预览。')
}
</script>

<template>
  <div class="space-y-6">
    <PageToolbar :title="pageConfig.title" :description="pageConfig.description" :show-search="false" :show-filter="false">
      <template #actions>
        <label class="block min-w-0 sm:w-80">
          <input v-model="keyword" class="input-field" placeholder="搜索冷库项目标题、案例标签或说明文案" />
        </label>
        <button class="btn-secondary shrink-0 sm:w-auto" type="button" @click="openCreateDialog">
          <Plus class="size-4" />
          新增冷库项目
        </button>
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
            <p class="mt-1 text-sm leading-6 text-slate-500">按排序展示前 3 个已发布项目。</p>
          </div>
        </div>
        <div class="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
          左上角标签会按列表排序自动生成，封面图、大标题、说明文案和右下角自定义标签仍从项目主表统一维护。
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
            <ShieldCheck class="size-5" />
          </div>
          <div>
            <h2 class="text-base font-extrabold text-slate-950">冷库业主对象</h2>
            <p class="mt-1 text-sm leading-6 text-slate-500">冷库页项目概况只引用 1 个主推项目。</p>
          </div>
        </div>
        <div class="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
          主推项目复用同一套封面、三项指标和项目介绍，不再重复维护第二套冷库内容字段。
        </div>
      </article>
    </section>

    <section class="grid gap-6 2xl:grid-cols-[minmax(0,1.45fr)_380px]">
      <div class="space-y-6">
        <section class="card p-5">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 class="text-lg font-extrabold text-slate-950">项目列表</h2>
              <p class="mt-1 text-sm leading-6 text-slate-500">最多维护 {{ maxProjects }} 个冷库项目，实际在小程序前台固定展示排序最靠前的 {{ miniProgramVisibleLimit }} 个已发布项目。</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">总项目 {{ projects.length }}/{{ maxProjects }}</span>
              <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">已发布 {{ publishedProjects.length }}</span>
              <span class="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">小程序展示 {{ visibleProjects.length }}/{{ miniProgramVisibleLimit }}</span>
            </div>
          </div>

          <div class="mt-4 grid gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4 lg:grid-cols-3">
            <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <div class="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <CheckCircle2 class="size-4 text-emerald-600" />
                排序规则
              </div>
              <p class="mt-2 text-sm leading-6 text-slate-500">排序固定用 1、2、3 递增维护，不再使用 10、20、30 这种易混淆写法。</p>
            </div>
            <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <div class="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <AlertCircle class="size-4 text-amber-600" />
                展示规则
              </div>
              <p class="mt-2 text-sm leading-6 text-slate-500">前台只取“已发布”状态里排序最靠前的 3 个项目，草稿不会进入小程序展示。</p>
            </div>
            <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <div class="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                <ShieldCheck class="size-4 text-sky-600" />
                Slug 说明
              </div>
              <p class="mt-2 text-sm leading-6 text-slate-500">Slug 常用于生成稳定链接或接口别名，但当前这套冷库页前后端都按数字 ID 取数，所以这里已移除，避免无效字段增加维护成本。</p>
            </div>
          </div>

          <div class="mt-5">
            <DataTable :columns="['排序', '项目', '状态', '操作']">
              <tr v-for="project in filteredProjects" :key="project.id" class="hover:bg-slate-50">
                <td class="whitespace-nowrap px-4 py-4 align-top">
                  <div class="flex items-center gap-2">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-black text-slate-700">
                      {{ project.sort }}
                    </div>
                    <div class="flex flex-col gap-1">
                      <button class="text-xs font-bold text-slate-500 transition hover:text-teal-700 disabled:cursor-not-allowed disabled:text-slate-300" type="button" :disabled="project.sort === 1" @click="moveProject(project.id, 'up')">上移</button>
                      <button class="text-xs font-bold text-slate-500 transition hover:text-teal-700 disabled:cursor-not-allowed disabled:text-slate-300" type="button" :disabled="project.sort === projects.length" @click="moveProject(project.id, 'down')">下移</button>
                    </div>
                  </div>
                </td>
                <td class="min-w-0 px-4 py-4 align-top">
                  <div class="flex items-start gap-3">
                    <div class="hidden size-12 rounded-xl bg-gradient-to-br from-sky-100 via-cyan-50 to-emerald-100 ring-1 ring-sky-100 sm:block" />
                    <div class="min-w-0">
                      <button class="block w-full text-left text-sm font-extrabold text-slate-950 transition hover:text-teal-700" type="button" @click="openEditDialog(project)">
                        <span class="line-clamp-2">{{ project.title }}</span>
                      </button>
                      <p class="mt-1 text-xs text-slate-500">图集 {{ project.gallery.length }} 张</p>
                      <div class="mt-2 flex flex-wrap gap-2">
                        <span class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{{ getProjectCaseLabel(project.sort) }}</span>
                        <span v-if="project.featuredOnColdPage" class="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">冷库页主推</span>
                        <span v-if="visibleProjects.some((item) => item.id === project.id)" class="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">前台展示中</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="whitespace-nowrap px-4 py-4 align-top">
                  <StatusBadge :status="project.publishStatus" :label="project.publishStatus === 'published' ? '已发布' : '草稿箱'" />
                </td>
                <td class="px-4 py-4 align-top">
                  <div class="flex flex-wrap justify-end gap-2 sm:flex-nowrap">
                    <ActionIconButton :icon="Pencil" label="编辑" title="弹窗编辑项目内容" @click="openEditDialog(project)" />
                    <ActionIconButton :icon="Star" label="主推" title="设为冷库页主推项目" @click="setFeaturedProject(project.id)" />
                    <ActionIconButton :icon="project.publishStatus === 'draft' ? Upload : Eye" :label="project.publishStatus === 'draft' ? '发布' : '草稿'" :title="project.publishStatus === 'draft' ? '从草稿发布到前台候选列表' : '移入草稿箱'" @click="toggleDraft(project.id)" />
                    <ActionIconButton :icon="Trash2" label="删除" title="移除当前项目" danger @click="removeProject(project.id)" />
                  </div>
                </td>
              </tr>
            </DataTable>
          </div>
        </section>

        <section class="card p-6">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 class="text-lg font-extrabold text-slate-950">字段映射预览</h2>
              <p class="mt-1 text-sm leading-6 text-slate-500">保留在项目列表下方，方便运营确认后台字段和小程序展示内容是一一对应的。</p>
            </div>
            <span v-if="featuredProject" class="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">主推项目：{{ featuredProject.title }}</span>
          </div>

          <div class="mt-6 grid gap-4 xl:grid-cols-3">
            <article class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p class="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-400">首页卡片</p>
              <h3 class="mt-3 text-base font-extrabold text-slate-950">{{ selectedPreviewProject?.title ?? '暂无项目' }}</h3>
              <p class="mt-3 text-sm leading-6 text-slate-600">左上角标签：{{ selectedPreviewProject ? getProjectCaseLabel(selectedPreviewProject.sort) : '未生成' }}</p>
              <p class="mt-2 text-sm leading-6 text-slate-600">解释文案：{{ selectedPreviewProject?.summary || '未填写' }}</p>
              <p class="mt-2 text-sm leading-6 text-slate-600">右下角标签：{{ selectedPreviewProject?.award || '未填写' }}</p>
            </article>

            <article class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p class="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-400">详情页</p>
              <h3 class="mt-3 text-base font-extrabold text-slate-950">{{ selectedPreviewProject?.title ?? '暂无项目' }}</h3>
              <p class="mt-3 text-sm leading-6 text-slate-600">按钮文案：案例介绍（前端固定）</p>
              <p class="mt-2 text-sm leading-6 text-slate-600">标题下说明：{{ selectedPreviewProject?.detailSummary || '未填写' }}</p>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                三项指标：{{ selectedPreviewProject?.temperatureCondition || '未填写' }} / {{ selectedPreviewProject?.constructionPeriod || '未填写' }} / {{ selectedPreviewProject?.coldStorageArea || '未填写' }}
              </p>
            </article>

            <article class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p class="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-400">冷库页项目概况</p>
              <h3 class="mt-3 text-base font-extrabold text-slate-950">{{ featuredProject?.title ?? '未设置主推项目' }}</h3>
              <p class="mt-3 text-sm leading-6 text-slate-600">复用封面图、三项指标和项目介绍，不再维护第二份冷库概况文案。</p>
              <p class="mt-2 text-sm leading-6 text-slate-600">当前图集数量：{{ featuredProject?.gallery.length ?? 0 }} 张</p>
            </article>
          </div>
        </section>
      </div>

      <aside class="space-y-6">
        <section class="card p-5">
          <div class="flex items-center gap-3">
            <div class="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
              <Star class="size-5" />
            </div>
            <div>
              <h2 class="text-base font-extrabold text-slate-950">独立控制区</h2>
              <p class="mt-1 text-sm leading-6 text-slate-500">把草稿箱、主推项目和展示摘要从主列表里抽出来单独展示。</p>
            </div>
          </div>

          <div class="mt-5 space-y-4">
            <article class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p class="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">冷库页主推项目</p>
              <h3 class="mt-2 text-base font-extrabold text-slate-950">{{ featuredProject?.title ?? '尚未设置' }}</h3>
              <p class="mt-2 text-sm leading-6 text-slate-600">点击列表中的星标按钮即可切换，不与主项目编辑表格混排。</p>
            </article>

            <article class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p class="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">草稿箱</p>
              <div class="mt-3 space-y-3">
                <div v-for="project in draftProjects" :key="project.id" class="rounded-xl bg-white p-3 ring-1 ring-slate-200">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="text-sm font-extrabold text-slate-950">{{ project.title }}</p>
                      <p class="mt-1 text-xs text-slate-500">排序 {{ project.sort }} · {{ project.gallery.length }} 张图</p>
                    </div>
                    <button class="text-xs font-bold text-teal-700 transition hover:text-teal-900" type="button" @click="toggleDraft(project.id)">发布</button>
                  </div>
                </div>
                <p v-if="draftProjects.length === 0" class="text-sm text-slate-500">当前没有草稿项目。</p>
              </div>
            </article>

            <article class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p class="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">前台展示摘要</p>
              <div class="mt-3 space-y-3">
                <div v-for="project in visibleProjects" :key="project.id" class="rounded-xl bg-white p-3 ring-1 ring-slate-200">
                  <p class="text-sm font-extrabold text-slate-950">{{ project.sort }}. {{ project.title }}</p>
                  <p class="mt-1 text-xs leading-5 text-slate-500">{{ project.detailSummary }}</p>
                </div>
              </div>
            </article>
          </div>
        </section>
      </aside>
    </section>

    <div v-if="editOpen" class="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4" @click.self="closeDialog">
      <section class="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header class="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <h2 class="text-xl font-extrabold text-slate-950">{{ dialogTitle }}</h2>
            <p class="mt-1 text-sm leading-6 text-slate-500">所有项目内容都在弹窗内完成编辑，外层列表只保留紧凑信息，避免桌面和手机端溢出。</p>
          </div>
          <button class="icon-button" type="button" aria-label="关闭" @click="closeDialog">
            <X class="size-5" />
          </button>
        </header>

        <div class="grid min-h-0 flex-1 gap-0 xl:grid-cols-[minmax(0,1.45fr)_320px]">
          <div class="min-h-0 overflow-y-auto p-6">
            <div class="space-y-6">
              <section class="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                <div>
                  <h3 class="text-sm font-extrabold uppercase tracking-[0.22em] text-slate-400">基础信息</h3>
                  <p class="mt-1 text-sm leading-6 text-slate-500">项目数量上限 {{ maxProjects }} 个，排序使用 1、2、3 的自然顺序，案例标签会按排序自动生成，Slug 已移除。</p>
                </div>

                <div class="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <label class="block xl:col-span-2">
                    <span class="mb-2 block text-sm font-bold text-slate-700">项目标题</span>
                    <input v-model="projectForm.title" class="input-field" placeholder="请输入冷库项目标题" />
                  </label>
                  <label class="block">
                    <span class="mb-2 block text-sm font-bold text-slate-700">排序</span>
                    <input v-model.number="projectForm.sort" class="input-field" type="number" min="1" :max="maxProjects" />
                  </label>
                  <label class="block">
                    <span class="mb-2 block text-sm font-bold text-slate-700">发布状态</span>
                    <select v-model="projectForm.publishStatus" class="input-field">
                      <option value="published">已发布</option>
                      <option value="draft">草稿箱</option>
                    </select>
                  </label>
                </div>
              </section>

              <section class="rounded-3xl border border-slate-200 bg-white p-5">
                <div>
                  <h3 class="text-sm font-extrabold uppercase tracking-[0.22em] text-slate-400">首页案例卡片字段</h3>
                  <p class="mt-1 text-sm leading-6 text-slate-500">左上角案例标签会按当前排序自动生成，右下角自定义标签、标题和解释文案在这里统一维护。</p>
                </div>

                <div class="mt-4 grid gap-4 md:grid-cols-2">
                  <div class="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <p class="text-sm font-bold text-slate-700">左上角标签</p>
                    <p class="mt-2 text-base font-extrabold text-slate-950">{{ projectFormCaseLabel }}</p>
                    <p class="mt-2 text-sm leading-6 text-slate-500">不需要手动设置，保存后会按列表排序自动更新，避免和项目顺序冲突。</p>
                  </div>
                  <label class="block">
                    <span class="mb-2 block text-sm font-bold text-slate-700">右下角自定义标签</span>
                    <input v-model="projectForm.award" class="input-field" placeholder="例如：2024 年度卓越工程" />
                  </label>
                </div>

                <label class="mt-4 block">
                  <span class="mb-2 block text-sm font-bold text-slate-700">首页说明文案</span>
                  <textarea v-model="projectForm.summary" class="input-field min-h-28 resize-none" placeholder="用于首页案例卡片的大标题下方解释文案"></textarea>
                </label>

                <div class="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
                  <label class="block">
                    <span class="mb-2 block text-sm font-bold text-slate-700">封面图地址</span>
                    <input v-model="projectForm.coverUrl" class="input-field" placeholder="上传到 MinIO 后回填的数据库地址" />
                  </label>
                  <UploadGrid
                    compact
                    title="上传案例封面"
                    hint="前端联调阶段：模拟 MinIO 地址回填，正式接入后改为真实上传"
                    :current-label="projectForm.coverUrl"
                    :multiple="false"
                    @selected="handleCoverSelected"
                  />
                </div>
              </section>

              <section class="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                <div>
                  <h3 class="text-sm font-extrabold uppercase tracking-[0.22em] text-slate-400">详情页字段</h3>
                  <p class="mt-1 text-sm leading-6 text-slate-500">黄色按钮文案由前端固定为“案例介绍”，这里只维护标题下说明、三项指标和项目介绍。</p>
                </div>

                <label class="mt-4 block">
                  <span class="mb-2 block text-sm font-bold text-slate-700">标题下说明文案</span>
                  <input v-model="projectForm.detailSummary" class="input-field" placeholder="例如：恒温恒湿 · 智能监控 · 5000 支容量" />
                </label>

                <div class="mt-4 grid gap-4 md:grid-cols-3">
                  <label class="block">
                    <span class="mb-2 block text-sm font-bold text-slate-700">达到温度条件</span>
                    <input v-model="projectForm.temperatureCondition" class="input-field" placeholder="例如：12-18℃" />
                  </label>
                  <label class="block">
                    <span class="mb-2 block text-sm font-bold text-slate-700">建设周期</span>
                    <input v-model="projectForm.constructionPeriod" class="input-field" placeholder="例如：45 天" />
                  </label>
                  <label class="block">
                    <span class="mb-2 block text-sm font-bold text-slate-700">冷库面积</span>
                    <input v-model="projectForm.coldStorageArea" class="input-field" placeholder="例如：1200 平方米" />
                  </label>
                </div>

                <label class="mt-4 block">
                  <span class="mb-2 block text-sm font-bold text-slate-700">项目介绍正文</span>
                  <textarea v-model="projectForm.description" class="input-field min-h-36 resize-none" placeholder="用于详情页“项目介绍”正文与冷库页项目概况正文"></textarea>
                </label>
              </section>

              <section class="rounded-3xl border border-slate-200 bg-white p-5">
                <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 class="text-sm font-extrabold uppercase tracking-[0.22em] text-slate-400">项目图集</h3>
                    <p class="mt-1 text-sm leading-6 text-slate-500">上传流程会先经过 MinIO 获取地址，再写入 MySQL，前端统一从数据库地址加载图片。</p>
                  </div>
                  <div class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">当前 {{ projectForm.gallery.length }} 张</div>
                </div>

                <div class="mt-4 rounded-2xl border border-dashed border-sky-200 bg-sky-50/70 p-4 text-sm leading-7 text-slate-600">
                  <p class="font-extrabold text-slate-900">上传联动说明</p>
                  <p class="mt-2">1. 点击“本地上传”选择图片。</p>
                  <p>2. 图片先上传到 MinIO，返回可访问地址。</p>
                  <p>3. 后端把 MinIO 地址写入 `cold_project_gallery` 对应记录。</p>
                  <p>4. 前端后续从 MySQL 读取 `databaseUrl` 来加载图集，而不是固定写死路径。</p>
                </div>

                <div class="mt-4 grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
                  <UploadGrid
                    title="上传项目图集"
                    hint="支持多图上传；当前为前端联调，模拟生成 MinIO 地址与数据库回填结果"
                    :current-label="`${projectForm.gallery.length} 张图`"
                    @selected="handleGallerySelected"
                  />

                  <div class="space-y-3">
                    <article v-for="galleryItem in projectForm.gallery" :key="galleryItem.id" class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div class="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p class="text-sm font-extrabold text-slate-950">{{ galleryItem.sort }}. {{ galleryItem.fileName }}</p>
                          <p class="mt-1 text-xs text-slate-500">MinIO 地址：{{ galleryItem.storageUrl }}</p>
                        </div>
                        <button class="text-xs font-bold text-rose-700 transition hover:text-rose-900" type="button" @click="removeGalleryImage(galleryItem.id)">删除</button>
                      </div>
                      <label class="mt-3 block">
                        <span class="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-400">MySQL 图库地址</span>
                        <input :value="galleryItem.databaseUrl" class="input-field" placeholder="数据库最终存储地址" @input="updateGalleryDatabaseUrl(galleryItem.id, ($event.target as HTMLInputElement).value)" />
                      </label>
                      <div class="mt-3 flex items-center justify-between text-xs font-bold">
                        <span :class="galleryItem.persisted ? 'text-emerald-700' : 'text-amber-700'">{{ galleryItem.persisted ? '已准备写入 MySQL' : '待持久化' }}</span>
                        <span class="text-slate-400">加载源：databaseUrl</span>
                      </div>
                    </article>
                    <p v-if="projectForm.gallery.length === 0" class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-500">
                      暂无图集图片，建议至少维护 3 张，详情页会更完整。
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <aside class="border-l border-slate-200 bg-slate-50/80 p-5">
            <div class="space-y-4">
              <article class="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <p class="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-400">编辑摘要</p>
                <h3 class="mt-2 text-base font-extrabold text-slate-950">{{ projectForm.title || '未填写项目标题' }}</h3>
                <p class="mt-2 text-sm leading-6 text-slate-600">排序 {{ projectForm.sort }} · {{ projectForm.publishStatus === 'published' ? '已发布' : '草稿箱' }}</p>
                <p class="mt-2 text-sm leading-6 text-slate-600">左上角标签 {{ projectFormCaseLabel }} · 图集 {{ projectForm.gallery.length }} 张 · {{ projectForm.featuredOnColdPage ? '将作为冷库页主推' : '未设为冷库页主推' }}</p>
              </article>

              <article class="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <p class="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-400">前台展示判断</p>
                <p class="mt-2 text-sm leading-6 text-slate-600">只有“已发布”项目会进入小程序候选列表，最终仍只展示排序最靠前的 3 个。</p>
              </article>

              <article class="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <p class="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-400">图集读取来源</p>
                <p class="mt-2 text-sm leading-6 text-slate-600">正式接入后，详情页图集将以 MySQL 存下来的 `databaseUrl` 为准，不再读取静态写死地址。</p>
              </article>
            </div>
          </aside>
        </div>

        <footer class="flex flex-col gap-3 border-t border-slate-200 p-5 sm:flex-row sm:justify-end">
          <button class="btn-secondary sm:w-auto" type="button" @click="closeDialog">取消</button>
          <button class="btn-primary sm:w-auto" type="button" @click="saveProject">
            <Save class="size-4" />
            {{ isEditing ? '保存项目内容' : '新增并保存' }}
          </button>
        </footer>
      </section>
    </div>

    <AppToast :open="toastOpen" :tone="toastTone" :title="toastTitle" :message="toastMessage" @close="toastOpen = false" />
  </div>
</template>
