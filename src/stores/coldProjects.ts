import { ref } from 'vue'

import { getErrorMessage, requestData } from '@/utils/request'
import { readStorage, writeStorage } from './persistence'

const COLD_PROJECT_STORAGE_KEY = 'threeapp-cold-projects'

interface KeyValueItemApi {
  label?: string
  value?: string
  unit?: string
}

interface HighlightApiItem {
  icon?: string
  text?: string
}

interface TechItemApi {
  icon?: string
  name?: string
  description?: string
}

interface ProcessStepApi {
  name?: string
  duration?: string
  description?: string
}

interface ColdProjectApiItem {
  id?: number | string
  slug?: string
  title?: string
  subtitle?: string
  summary?: string
  detailSummary?: string
  homeSummary?: string
  description?: string
  coverUrl?: string
  tag?: string
  homeTag?: string
  award?: string
  homeBadge?: string
  temperatureCondition?: string
  constructionPeriod?: string
  coldStorageArea?: string
  overviewArea?: string
  overviewMinTemperature?: string
  overviewDailyThroughput?: string
  basicInfo?: KeyValueItemApi[]
  stats?: KeyValueItemApi[]
  highlights?: HighlightApiItem[]
  techItems?: TechItemApi[]
  processSteps?: ProcessStepApi[]
  galleryUrls?: string[]
  featuredOnColdPage?: boolean
  status?: number | null
  sort?: number | null
}

export interface ColdProjectGalleryItem {
  id: string
  fileName: string
  storageUrl: string
  databaseUrl: string
  sort: number
  persisted: boolean
}

export interface ColdProjectEditor {
  id: number
  slug: string
  title: string
  subtitle: string
  tag: string
  homeTag: string
  summary: string
  detailSummary: string
  homeSummary: string
  description: string
  coverUrl: string
  award: string
  homeBadge: string
  temperatureCondition: string
  constructionPeriod: string
  coldStorageArea: string
  overviewArea: string
  overviewMinTemperature: string
  overviewDailyThroughput: string
  basicInfo: Array<{ label: string; value: string }>
  stats: Array<{ label: string; value: string }>
  highlights: Array<{ icon: string; text: string }>
  techItems: Array<{ icon: string; name: string; description: string }>
  processSteps: Array<{ name: string; duration: string; description: string }>
  gallery: ColdProjectGalleryItem[]
  sort: number
  publishStatus: 'published' | 'draft'
  featuredOnColdPage: boolean
}

export const coldProjectState = ref<ColdProjectEditor[]>(readStorage<ColdProjectEditor[]>(COLD_PROJECT_STORAGE_KEY, []))
export const coldProjectLoading = ref(false)
export const coldProjectError = ref('')

export function getColdProjectCaseLabel(sort: number) {
  const caseOrderLabels = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
  const normalizedSort = Number.isFinite(sort) && sort > 0 ? Math.floor(sort) : 1
  const suffix = caseOrderLabels[normalizedSort - 1] ?? String(normalizedSort)
  return `项目案例${suffix}`
}

function persistColdProjects() {
  writeStorage(COLD_PROJECT_STORAGE_KEY, coldProjectState.value)
}

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function cloneGalleryItem(item: ColdProjectGalleryItem): ColdProjectGalleryItem {
  return { ...item }
}

function cloneColdProject(project: ColdProjectEditor): ColdProjectEditor {
  return {
    ...project,
    basicInfo: project.basicInfo.map((item) => ({ ...item })),
    stats: project.stats.map((item) => ({ ...item })),
    highlights: project.highlights.map((item) => ({ ...item })),
    techItems: project.techItems.map((item) => ({ ...item })),
    processSteps: project.processSteps.map((item) => ({ ...item })),
    gallery: project.gallery.map(cloneGalleryItem),
  }
}

function cloneColdProjectState() {
  return coldProjectState.value.map(cloneColdProject)
}

function toPublishStatus(status: number | null | undefined): ColdProjectEditor['publishStatus'] {
  return Number(status) === 1 ? 'published' : 'draft'
}

function toApiStatus(status: ColdProjectEditor['publishStatus']) {
  return status === 'published' ? 1 : 0
}

function toKeyValueItems(items: KeyValueItemApi[] | undefined) {
  if (!Array.isArray(items)) {
    return [] as ColdProjectEditor['basicInfo']
  }

  return items
    .map((item) => ({
      label: normalizeText(item?.label) || normalizeText(item?.unit),
      value: normalizeText(item?.value),
    }))
    .filter((item) => item.label || item.value)
}

function toHighlights(items: HighlightApiItem[] | undefined) {
  if (!Array.isArray(items)) {
    return [] as ColdProjectEditor['highlights']
  }

  return items
    .map((item) => ({
      icon: normalizeText(item?.icon),
      text: normalizeText(item?.text),
    }))
    .filter((item) => item.icon || item.text)
}

function toTechItems(items: TechItemApi[] | undefined) {
  if (!Array.isArray(items)) {
    return [] as ColdProjectEditor['techItems']
  }

  return items
    .map((item) => ({
      icon: normalizeText(item?.icon),
      name: normalizeText(item?.name),
      description: normalizeText(item?.description),
    }))
    .filter((item) => item.icon || item.name || item.description)
}

function toProcessSteps(items: ProcessStepApi[] | undefined) {
  if (!Array.isArray(items)) {
    return [] as ColdProjectEditor['processSteps']
  }

  return items
    .map((item) => ({
      name: normalizeText(item?.name),
      duration: normalizeText(item?.duration),
      description: normalizeText(item?.description),
    }))
    .filter((item) => item.name || item.duration || item.description)
}

function buildGalleryItem(url: string, index: number): ColdProjectGalleryItem {
  const cleanUrl = normalizeText(url)
  const fileName = cleanUrl.split('?')[0].split('/').pop() || `gallery-${index + 1}.jpg`

  return {
    id: `gallery-${index + 1}-${fileName}`,
    fileName,
    storageUrl: cleanUrl,
    databaseUrl: cleanUrl,
    sort: index + 1,
    persisted: true,
  }
}

function normalizeGalleryUrls(coverUrl: string, gallery: ColdProjectGalleryItem[]) {
  const urls = gallery
    .map((item) => normalizeText(item.databaseUrl) || normalizeText(item.storageUrl))
    .filter(Boolean)

  const uniqueGalleryUrls = Array.from(new Set(urls.filter((url) => url !== coverUrl)))
  return coverUrl ? [coverUrl, ...uniqueGalleryUrls] : uniqueGalleryUrls
}

function mapColdProject(item: ColdProjectApiItem): ColdProjectEditor {
  const sort = Number(item.sort ?? 0) || 1
  const coverUrl = normalizeText(item.coverUrl)
  const galleryUrls = Array.isArray(item.galleryUrls) ? item.galleryUrls.map((value) => normalizeText(value)).filter(Boolean) : []
  const detailGalleryUrls = galleryUrls.filter((url) => url !== coverUrl)
  const caseLabel = getColdProjectCaseLabel(sort)

  return {
    id: Number(item.id ?? 0),
    slug: normalizeText(item.slug),
    title: normalizeText(item.title),
    subtitle: normalizeText(item.subtitle) || normalizeText(item.detailSummary) || normalizeText(item.title),
    tag: normalizeText(item.tag) || caseLabel,
    homeTag: normalizeText(item.homeTag) || normalizeText(item.tag) || caseLabel,
    summary: normalizeText(item.summary),
    detailSummary: normalizeText(item.detailSummary) || normalizeText(item.subtitle),
    homeSummary: normalizeText(item.homeSummary) || normalizeText(item.summary),
    description: normalizeText(item.description),
    coverUrl,
    award: normalizeText(item.award),
    homeBadge: normalizeText(item.homeBadge) || normalizeText(item.award),
    temperatureCondition: normalizeText(item.temperatureCondition),
    constructionPeriod: normalizeText(item.constructionPeriod),
    coldStorageArea: normalizeText(item.coldStorageArea),
    overviewArea: normalizeText(item.overviewArea),
    overviewMinTemperature: normalizeText(item.overviewMinTemperature),
    overviewDailyThroughput: normalizeText(item.overviewDailyThroughput),
    basicInfo: toKeyValueItems(item.basicInfo),
    stats: toKeyValueItems(item.stats),
    highlights: toHighlights(item.highlights),
    techItems: toTechItems(item.techItems),
    processSteps: toProcessSteps(item.processSteps),
    gallery: detailGalleryUrls.map(buildGalleryItem),
    sort,
    publishStatus: toPublishStatus(item.status),
    featuredOnColdPage: Boolean(item.featuredOnColdPage),
  }
}

function buildDefaultBasicInfo(project: ColdProjectEditor) {
  return [
    { label: '达到温度条件', value: normalizeText(project.temperatureCondition) },
    { label: '建设周期', value: normalizeText(project.constructionPeriod) },
    { label: '冷库面积', value: normalizeText(project.coldStorageArea) },
  ].filter((item) => item.label && item.value)
}

function buildDefaultStats(project: ColdProjectEditor) {
  return [
    { label: '冷库面积', value: normalizeText(project.coldStorageArea) },
    { label: '温度条件', value: normalizeText(project.temperatureCondition) },
    { label: '建设周期', value: normalizeText(project.constructionPeriod) },
  ].filter((item) => item.label && item.value)
}

function buildDefaultHighlights(project: ColdProjectEditor) {
  return [
    { icon: '❄️', text: normalizeText(project.temperatureCondition) ? `温度范围 ${normalizeText(project.temperatureCondition)}` : '' },
    { icon: '⏱️', text: normalizeText(project.constructionPeriod) ? `建设周期 ${normalizeText(project.constructionPeriod)}` : '' },
    { icon: '📦', text: normalizeText(project.coldStorageArea) ? `冷库面积 ${normalizeText(project.coldStorageArea)}` : '' },
  ].filter((item) => item.text)
}

function buildDefaultTechItems(project: ColdProjectEditor) {
  const title = normalizeText(project.title) || '冷库项目'

  return [
    {
      icon: '❄️',
      name: '温控方案',
      description: normalizeText(project.temperatureCondition) || `${title} 的温控参数待补充`,
    },
    {
      icon: '🏗️',
      name: '建设周期',
      description: normalizeText(project.constructionPeriod) || `${title} 的建设周期待补充`,
    },
    {
      icon: '📐',
      name: '空间规模',
      description: normalizeText(project.coldStorageArea) || `${title} 的冷库面积待补充`,
    },
  ]
}

function buildDefaultProcessSteps() {
  return [
    { name: '需求沟通', duration: '1-2 天', description: '明确项目目标、场地情况与施工边界。' },
    { name: '方案设计', duration: '3-5 天', description: '输出冷库布局、温控与交付方案。' },
    { name: '施工建设', duration: '按项目排期', description: '完成主体施工、设备安装与联调。' },
    { name: '验收交付', duration: '1-2 天', description: '完成验收测试并进入运维支持阶段。' },
  ]
}

function buildPayload(project: ColdProjectEditor) {
  const title = normalizeText(project.title)
  const coverUrl = normalizeText(project.coverUrl)
  const summary = normalizeText(project.summary) || title
  const detailSummary = normalizeText(project.detailSummary)
  const subtitle = normalizeText(project.subtitle) || detailSummary || title
  const caseLabel = getColdProjectCaseLabel(project.sort)
  const award = normalizeText(project.award)

  return {
    slug: normalizeText(project.slug) || undefined,
    title,
    subtitle,
    summary,
    detailSummary: detailSummary || subtitle,
    homeSummary: normalizeText(project.homeSummary) || summary || undefined,
    description: normalizeText(project.description),
    coverUrl,
    tag: caseLabel,
    homeTag: caseLabel,
    award: award || undefined,
    homeBadge: normalizeText(project.homeBadge) || award || undefined,
    temperatureCondition: normalizeText(project.temperatureCondition) || undefined,
    constructionPeriod: normalizeText(project.constructionPeriod) || undefined,
    coldStorageArea: normalizeText(project.coldStorageArea) || undefined,
    overviewArea: normalizeText(project.overviewArea) || normalizeText(project.coldStorageArea) || undefined,
    overviewMinTemperature: normalizeText(project.overviewMinTemperature) || normalizeText(project.temperatureCondition) || undefined,
    overviewDailyThroughput: normalizeText(project.overviewDailyThroughput) || undefined,
    basicInfo: project.basicInfo.length ? project.basicInfo.map((item) => ({ ...item })) : buildDefaultBasicInfo(project),
    stats: project.stats.length ? project.stats.map((item) => ({ ...item })) : buildDefaultStats(project),
    highlights: project.highlights.length ? project.highlights.map((item) => ({ ...item })) : buildDefaultHighlights(project),
    techItems: project.techItems.length ? project.techItems.map((item) => ({ ...item })) : buildDefaultTechItems(project),
    processSteps: project.processSteps.length ? project.processSteps.map((item) => ({ ...item })) : buildDefaultProcessSteps(),
    galleryUrls: normalizeGalleryUrls(coverUrl, project.gallery),
    featuredOnColdPage: Boolean(project.featuredOnColdPage),
    status: toApiStatus(project.publishStatus),
    sort: Number(project.sort) || 1,
  }
}

function upsertColdProject(nextProject: ColdProjectEditor) {
  const index = coldProjectState.value.findIndex((item) => item.id === nextProject.id)
  if (index === -1) {
    coldProjectState.value = [...coldProjectState.value, nextProject].sort((left, right) => left.sort - right.sort || left.id - right.id)
    return
  }

  const nextState = [...coldProjectState.value]
  nextState.splice(index, 1, nextProject)
  coldProjectState.value = nextState.sort((left, right) => left.sort - right.sort || left.id - right.id)
}

async function fetchColdProjectDetail(id: number | string) {
  return requestData<ColdProjectApiItem>(`/api/admin/content/cold-projects/${id}`)
}

export async function fetchColdProjects() {
  coldProjectLoading.value = true
  coldProjectError.value = ''

  try {
    const data = await requestData<{ items: ColdProjectApiItem[]; total: number }>('/api/admin/content/cold-projects')
    const detailItems = await Promise.all((data.items ?? []).map((item) => fetchColdProjectDetail(item.id ?? '')))

    coldProjectState.value = detailItems.map(mapColdProject).sort((left, right) => left.sort - right.sort || left.id - right.id)
    persistColdProjects()
  } catch (error) {
    coldProjectError.value = getErrorMessage(error)
  } finally {
    coldProjectLoading.value = false
  }
}

export function getStoredColdProjects() {
  return coldProjectState.value.map(cloneColdProject).sort((left, right) => left.sort - right.sort || left.id - right.id)
}

export async function saveStoredColdProject(project: ColdProjectEditor) {
  coldProjectError.value = ''

  try {
    const body = buildPayload(project)
    const data = project.id
      ? await requestData<ColdProjectApiItem>(`/api/admin/content/cold-projects/${project.id}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        })
      : await requestData<ColdProjectApiItem>('/api/admin/content/cold-projects', {
          method: 'POST',
          body: JSON.stringify(body),
        })

    const nextProject = mapColdProject(data)
    upsertColdProject(nextProject)
    persistColdProjects()
    return cloneColdProject(nextProject)
  } catch (error) {
    coldProjectError.value = getErrorMessage(error)
    throw error
  }
}

export async function deleteStoredColdProject(projectId: number) {
  coldProjectError.value = ''

  try {
    await requestData<{ id: number; deleted: boolean }>(`/api/admin/content/cold-projects/${projectId}`, {
      method: 'DELETE',
    })

    coldProjectState.value = coldProjectState.value.filter((item) => item.id !== projectId)
    persistColdProjects()
  } catch (error) {
    coldProjectError.value = getErrorMessage(error)
    throw error
  }
}

export async function syncStoredColdProjectCollection(projects: ColdProjectEditor[]) {
  coldProjectError.value = ''

  const orderedProjects = [...projects]
    .sort((left, right) => left.sort - right.sort || left.id - right.id)
    .map((item, index) => {
      const caseLabel = getColdProjectCaseLabel(index + 1)
      return {
        ...cloneColdProject(item),
        sort: index + 1,
        tag: caseLabel,
        homeTag: caseLabel,
        homeSummary: normalizeText(item.homeSummary) || normalizeText(item.summary),
        homeBadge: normalizeText(item.homeBadge) || normalizeText(item.award),
        gallery: item.gallery.map((galleryItem, galleryIndex) => ({
          ...cloneGalleryItem(galleryItem),
          sort: galleryIndex + 1,
        })),
      }
    })

  const previousState = cloneColdProjectState()
  coldProjectState.value = orderedProjects
  persistColdProjects()

  try {
    const updatedItems = await Promise.all(
      orderedProjects.map((project) =>
        requestData<ColdProjectApiItem>(`/api/admin/content/cold-projects/${project.id}`, {
          method: 'PATCH',
          body: JSON.stringify(buildPayload(project)),
        }),
      ),
    )

    coldProjectState.value = updatedItems.map(mapColdProject).sort((left, right) => left.sort - right.sort || left.id - right.id)
    persistColdProjects()
    return getStoredColdProjects()
  } catch (error) {
    coldProjectState.value = previousState
    persistColdProjects()
    coldProjectError.value = getErrorMessage(error)
    throw error
  }
}
