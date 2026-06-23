export type ProductType = 'wine' | 'specialty'
export type PublishStatus = 'published' | 'draft' | 'scheduled' | 'hidden'
export type UserRole = 'admin' | 'editor'
export type BusinessType = 'wine' | 'specialty' | 'cold-storage'

export interface Product {
  id: string
  type: ProductType
  name: string
  subtitle: string
  category: string
  scene: string
  tag: string
  tagTone: 'amber' | 'blue' | 'green' | 'teal' | 'rose'
  comments: number
  replies: number
  status: PublishStatus
  sort: number
  imageTone: string
  description: string
  detailImages: DetailImage[]
}

export interface DetailImage {
  id: string
  title: string
  status: 'visible' | 'hidden'
  sort: number
  tone: string
}

export interface ProductUpdate {
  id: string
  type: ProductType
  productId: string
  title: string
  description: string
  placement: string
  status: PublishStatus
  date: string
  author: string
  sort: number
  scheduledAt?: string
}

export interface CommentSummary {
  productId: string
  productName: string
  type: ProductType
  total: number
  secondLevel: number
  flagged: number
  lastAt: string
}

export interface CommentItem {
  id: string
  productId: string
  author: string
  rating: number
  createdAt: string
  content: string
  images: number
  pinned: boolean
  deleted?: boolean
  reply?: string
}

export interface QuestionItem {
  id: string
  businessType: BusinessType
  subject: string
  contactName: string
  contactPhone: string
  content: string
  status: 'pending' | 'replied'
  createdAt: string
  reply?: string
}

export interface ContentCard {
  id: string
  title: string
  description: string
  status: PublishStatus
  sort: number
  target: string
  imageName?: string
}

export interface ConfigSection {
  title: string
  description: string
  items: string[]
  buttonLabel: string
}

export interface MaterialAsset {
  id: string
  name: string
  group: string
  size: string
  usedBy: string
  tone: string
}

export interface UserAccount {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  status: 'active' | 'disabled'
  lastLogin: string
}

export const statusLabels: Record<PublishStatus, string> = {
  published: '上架',
  draft: '草稿',
  scheduled: '定时发布',
  hidden: '隐藏',
}

export const productTypeLabels: Record<ProductType, string> = {
  wine: '酒水',
  specialty: '特产',
}

export const businessTypeLabels: Record<BusinessType, string> = {
  wine: '酒水业务',
  specialty: '特产业务',
  'cold-storage': '冷库业务',
}

export const roleLabels: Record<UserRole, string> = {
  admin: '管理员',
  editor: '普通用户',
}

export const products: Product[] = [
  {
    id: 'wine-xifeng',
    type: 'wine',
    name: '西凤酒',
    subtitle: '凤香经典 · 长辈礼赠',
    category: '凤香白酒',
    scene: '商务 / 家宴',
    tag: '经典',
    tagTone: 'green',
    comments: 86,
    replies: 24,
    status: 'published',
    sort: 1,
    imageTone: 'from-amber-100 to-orange-200',
    description: '凤香型代表酒款，适合家宴、长辈礼赠和商务宴请。',
    detailImages: [
      { id: 'xifeng-1', title: '01 主卖点', status: 'visible', sort: 1, tone: 'from-amber-100 to-yellow-200' },
      { id: 'xifeng-2', title: '02 产品细节', status: 'visible', sort: 2, tone: 'from-slate-100 to-amber-100' },
      { id: 'xifeng-3', title: '03 配送说明', status: 'hidden', sort: 3, tone: 'from-teal-50 to-slate-100' },
    ],
  },
  {
    id: 'wine-bourbon-xo',
    type: 'wine',
    name: '波本蓝君邑 XO',
    subtitle: '高端威士忌 · 礼赠',
    category: '威士忌',
    scene: '商务馈赠',
    tag: '主推',
    tagTone: 'amber',
    comments: 32,
    replies: 8,
    status: 'published',
    sort: 2,
    imageTone: 'from-sky-100 to-indigo-200',
    description: '醇厚绵柔的高端威士忌，用于礼赠和重要聚会场景。',
    detailImages: [
      { id: 'bourbon-1', title: '01 礼赠场景', status: 'visible', sort: 1, tone: 'from-sky-100 to-indigo-200' },
      { id: 'bourbon-2', title: '02 包装细节', status: 'visible', sort: 2, tone: 'from-slate-100 to-sky-100' },
    ],
  },
  {
    id: 'wine-happy-day',
    type: 'wine',
    name: '福莱好日子',
    subtitle: '喜庆专用酒 · 婚宴',
    category: '宴席白酒',
    scene: '结婚宴席',
    tag: '喜宴',
    tagTone: 'blue',
    comments: 18,
    replies: 3,
    status: 'scheduled',
    sort: 3,
    imageTone: 'from-rose-100 to-red-200',
    description: '面向婚宴和喜庆宴席的高性价比酒款。',
    detailImages: [
      { id: 'happy-1', title: '01 婚宴主图', status: 'visible', sort: 1, tone: 'from-rose-100 to-red-200' },
      { id: 'happy-2', title: '02 桌席展示', status: 'visible', sort: 2, tone: 'from-orange-100 to-rose-100' },
    ],
  },
  {
    id: 'specialty-chicken',
    type: 'specialty',
    name: '清远走地鸡',
    subtitle: '清远农家 · 散养',
    category: '清远特产',
    scene: '广东清远',
    tag: '热销',
    tagTone: 'amber',
    comments: 24,
    replies: 7,
    status: 'published',
    sort: 1,
    imageTone: 'from-lime-100 to-emerald-200',
    description: '清远农家散养走地鸡，主打新鲜配送和地道风味。',
    detailImages: [
      { id: 'chicken-1', title: '01 原产地', status: 'visible', sort: 1, tone: 'from-lime-100 to-emerald-200' },
      { id: 'chicken-2', title: '02 新鲜配送', status: 'visible', sort: 2, tone: 'from-teal-50 to-lime-100' },
    ],
  },
  {
    id: 'specialty-tea',
    type: 'specialty',
    name: '英德红茶 英红九号',
    subtitle: '英德茶业 · 一级红茶',
    category: '茶叶冲饮',
    scene: '广东英德',
    tag: '推荐',
    tagTone: 'blue',
    comments: 15,
    replies: 4,
    status: 'published',
    sort: 2,
    imageTone: 'from-red-100 to-stone-200',
    description: '香气浓郁、汤色红亮，适合礼盒和日常冲饮。',
    detailImages: [
      { id: 'tea-1', title: '01 茶园采摘', status: 'visible', sort: 1, tone: 'from-red-100 to-stone-200' },
      { id: 'tea-2', title: '02 冲泡建议', status: 'visible', sort: 2, tone: 'from-amber-50 to-red-100' },
    ],
  },
  {
    id: 'specialty-bamboo',
    type: 'specialty',
    name: '阳山冬笋',
    subtitle: '阳山特产 · 高山竹笋',
    category: '山珍蔬食',
    scene: '广东阳山',
    tag: '新鲜',
    tagTone: 'green',
    comments: 9,
    replies: 2,
    status: 'draft',
    sort: 3,
    imageTone: 'from-emerald-100 to-green-200',
    description: '高山鲜笋，适合家庭烹饪和餐饮供应。',
    detailImages: [
      { id: 'bamboo-1', title: '01 产地环境', status: 'visible', sort: 1, tone: 'from-emerald-100 to-green-200' },
      { id: 'bamboo-2', title: '02 食用方法', status: 'hidden', sort: 2, tone: 'from-lime-50 to-emerald-100' },
    ],
  },
]

export const updates: ProductUpdate[] = [
  {
    id: 'update-1',
    type: 'wine',
    productId: 'wine-xifeng',
    title: '首页通知：西凤酒礼盒图已更新',
    description: '首页轮播提示用户西凤酒礼盒图片已换新，适合近期送礼场景。',
    placement: '首页消息轮播',
    status: 'published',
    date: '2026-06-22 09:30',
    author: '运营小周',
    sort: 1,
  },
  {
    id: 'update-2',
    type: 'wine',
    productId: 'wine-bourbon-xo',
    title: '首页通知：波本蓝君邑 XO 补充商务礼赠说明',
    description: '增加商务礼赠场景说明，方便首页轮播中同步告知用户。',
    placement: '首页消息轮播',
    status: 'draft',
    date: '2026-06-21 16:15',
    author: '运营小梁',
    sort: 2,
  },
  {
    id: 'update-3',
    type: 'wine',
    productId: 'wine-happy-day',
    title: '首页通知：福莱好日子婚宴场景图替换',
    description: '准备在婚宴旺季前上线新的场景图，并以文字轮播提醒用户。',
    placement: '首页消息轮播',
    status: 'scheduled',
    date: '2026-06-24 10:00',
    author: '运营小周',
    sort: 3,
    scheduledAt: '2026-06-24T10:00',
  },
  {
    id: 'update-4',
    type: 'specialty',
    productId: 'specialty-chicken',
    title: '首页通知：清远走地鸡新增农家产地介绍',
    description: '轮播告知用户特产页已补充农家产地故事与图片展示。',
    placement: '首页消息轮播',
    status: 'published',
    date: '2026-06-20 14:40',
    author: '内容小何',
    sort: 1,
  },
]

export const commentSummaries: CommentSummary[] = products.map((product) => ({
  productId: product.id,
  productName: product.name,
  type: product.type,
  total: product.comments,
  secondLevel: product.replies,
  flagged: product.id === 'wine-bourbon-xo' ? 1 : 0,
  lastAt: product.type === 'wine' ? '最近 2 小时前' : '最近 5 小时前',
}))

export const comments: CommentItem[] = [
  {
    id: 'comment-1',
    productId: 'wine-xifeng',
    author: '老陕酒客',
    rating: 5,
    createdAt: '2026-04-20',
    content: '凤香经典，入口绵柔不辣喉。开瓶就能闻到浓郁的粮食香，家里长辈很认可。',
    images: 2,
    pinned: true,
    reply: '感谢认可，后续会继续优化包装防震。',
  },
  {
    id: 'comment-2',
    productId: 'wine-xifeng',
    author: '陈老板',
    rating: 5,
    createdAt: '2026-04-18',
    content: '买来送礼很体面，礼盒做工不错，金色元素很高级。',
    images: 0,
    pinned: false,
  },
  {
    id: 'comment-3',
    productId: 'wine-xifeng',
    author: '品酒师小李',
    rating: 4,
    createdAt: '2026-04-15',
    content: '风格识别度很高，物流外箱再扎实一点会更好。',
    images: 1,
    pinned: false,
  },
  {
    id: 'comment-4',
    productId: 'wine-bourbon-xo',
    author: '礼品采购阿宁',
    rating: 5,
    createdAt: '2026-05-08',
    content: '商务礼赠很合适，瓶身颜色很稳，客户反馈也不错。',
    images: 1,
    pinned: false,
  },
  {
    id: 'comment-5',
    productId: 'specialty-chicken',
    author: '清远老友',
    rating: 5,
    createdAt: '2026-05-16',
    content: '鸡肉紧实，煲汤很香，收到的时候冰袋还没完全化。',
    images: 2,
    pinned: true,
    reply: '感谢支持，生鲜配送会继续盯紧时效。',
  },
  {
    id: 'comment-6',
    productId: 'wine-bourbon-xo',
    author: '婚宴采购周周',
    rating: 3,
    createdAt: '2026-06-23',
    content: '外观不错，但我想知道大批量采购是否支持贺卡定制，希望客服尽快回复。',
    images: 0,
    pinned: false,
  },
]

export const questions: QuestionItem[] = [
  {
    id: 'question-1',
    businessType: 'wine',
    subject: '送礼选酒咨询',
    contactName: '孙先生',
    contactPhone: '138****2301',
    content: '我想咨询一下长辈生日宴用酒，想看礼盒装和价位推荐。',
    status: 'pending',
    createdAt: '2026-06-22 14:20',
  },
  {
    id: 'question-2',
    businessType: 'specialty',
    subject: '特产配送时效',
    contactName: '黄先生',
    contactPhone: '136****7752',
    content: '清远走地鸡配送到深圳大概多久，是否可以安排周末送达？',
    status: 'pending',
    createdAt: '2026-06-22 10:08',
  },
  {
    id: 'question-3',
    businessType: 'cold-storage',
    subject: '冷库安装需求',
    contactName: '赵小姐',
    contactPhone: '139****4920',
    content: '门店准备新增一个小型冷库，想了解大概周期、报价和后期维保。',
    status: 'replied',
    createdAt: '2026-06-21 17:42',
    reply: '已收到您的需求，冷库项目可先按使用面积和温区要求评估，我们会尽快与您联系。',
  },
]

export const homeBanners: ContentCard[] = [
  {
    id: 'banner-1',
    title: '主推冷库工程',
    description: '工程服务首屏入口，强调方案设计和安装交付。',
    status: 'published',
    sort: 1,
    target: '冷库页',
    imageName: 'cold-storage-cover.jpg',
  },
  {
    id: 'banner-2',
    title: '酒水精选入口',
    description: '导流热门酒水和场景推荐。',
    status: 'published',
    sort: 2,
    target: '酒水商品',
    imageName: 'wine-banner.jpg',
  },
  {
    id: 'banner-3',
    title: '岭南特产入口',
    description: '展示广东地区特产和分类入口。',
    status: 'draft',
    sort: 3,
    target: '特产分类',
    imageName: 'specialty-banner.jpg',
  },
]

export const contentConfigs: Record<'specialty' | 'wine' | 'coldStorage', ConfigSection> = {
  specialty: {
    title: '特产模块配置',
    description: '品牌故事、核心亮点、地区特产、分类入口。',
    buttonLabel: '编辑特产配置',
    items: ['品牌故事', '核心亮点', '地区特产', '分类入口'],
  },
  wine: {
    title: '酒水模块配置',
    description: '热门酒水、场景推荐、详情卖点、联系入口。',
    buttonLabel: '编辑酒水配置',
    items: ['热门酒水', '场景推荐', '详情卖点', '联系入口'],
  },
  coldStorage: {
    title: '冷库项目内容',
    description: '服务场景、流程步骤、项目介绍、咨询按钮。',
    buttonLabel: '编辑冷库配置',
    items: ['项目介绍', '流程步骤', '服务场景', '咨询按钮'],
  },
}

export const materials: MaterialAsset[] = [
  { id: 'asset-1', name: '西凤酒主图', group: '商品封面', size: '1080 x 1080', usedBy: '酒水商品', tone: 'from-amber-100 to-orange-200' },
  { id: 'asset-2', name: '首页酒水 Banner', group: 'Banner', size: '1500 x 640', usedBy: '首页 Banner', tone: 'from-sky-100 to-teal-200' },
  { id: 'asset-3', name: '清远走地鸡详情图 01', group: '详情图片', size: '750 x 1680', usedBy: '特产商品', tone: 'from-lime-100 to-emerald-200' },
  { id: 'asset-4', name: '评价晒单图', group: '评价图片', size: '900 x 900', usedBy: '评论管理', tone: 'from-slate-100 to-blue-100' },
  { id: 'asset-5', name: '清远地区入口图', group: '地区图片', size: '720 x 480', usedBy: '特产模块', tone: 'from-emerald-100 to-cyan-200' },
]

export const dashboardMetrics = [
  { label: '今日评论', value: '86', hint: '默认前台展示', tone: 'teal' },
  { label: '待回复问答', value: '12', hint: '酒水 7 / 特产 5', tone: 'sky' },
  { label: '商品更新', value: '09', hint: '首页轮播通知', tone: 'amber' },
  { label: '素材待整理', value: '34', hint: '图片资源', tone: 'rose' },
]

export const userAccounts: UserAccount[] = [
  {
    id: 'user-admin',
    name: '平台管理员',
    email: 'admin@threeapp.com',
    password: 'password',
    role: 'admin',
    status: 'active',
    lastLogin: '2026-06-23 08:30',
  },
  {
    id: 'user-ops',
    name: '运营小周',
    email: 'ops@threeapp.com',
    password: 'password',
    role: 'editor',
    status: 'active',
    lastLogin: '2026-06-23 07:56',
  },
  {
    id: 'user-content',
    name: '内容小何',
    email: 'content@threeapp.com',
    password: 'password',
    role: 'editor',
    status: 'disabled',
    lastLogin: '2026-06-18 18:12',
  },
]

export function getProductsByType(type: ProductType) {
  return products.filter((product) => product.type === type)
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id)
}

export function getCommentsByProduct(productId: string) {
  return comments.filter((comment) => comment.productId === productId)
}

export function getCommentSummariesByType(type: ProductType) {
  return commentSummaries.filter((summary) => summary.type === type)
}
