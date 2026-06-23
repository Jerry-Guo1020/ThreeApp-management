import type { FunctionalComponent } from 'vue'
import {
  Archive,
  BadgeHelp,
  Bell,
  BottleWine,
  Boxes,
  Home,
  Image,
  LayoutDashboard,
  MessageSquareText,
  PackageCheck,
  Settings,
  Snowflake,
  Sparkles,
} from '@lucide/vue'

export type MenuIcon = FunctionalComponent

export interface MenuItem {
  label: string
  path: string
  icon: MenuIcon
  badge?: string
}

export interface MenuGroup {
  title: string
  items: MenuItem[]
}

export const menuGroups: MenuGroup[] = [
  {
    title: '菜单',
    items: [
      { label: '工作台', path: '/dashboard', icon: LayoutDashboard },
      { label: '酒水商品', path: '/products/wine', icon: BottleWine },
      { label: '特产商品', path: '/products/specialty', icon: PackageCheck },
      { label: '商品更新', path: '/updates', icon: Bell, badge: '9' },
      { label: '评论管理', path: '/comments/wine', icon: MessageSquareText },
      { label: '问答管理', path: '/questions', icon: BadgeHelp },
    ],
  },
  {
    title: '内容配置',
    items: [
      { label: '首页 Banner', path: '/content/banner', icon: Home },
      { label: '特产模块', path: '/content/specialty', icon: Boxes },
      { label: '酒水模块', path: '/content/wine', icon: Sparkles },
      { label: '冷库项目', path: '/content/cold-storage', icon: Snowflake },
    ],
  },
  {
    title: '资源',
    items: [
      { label: '素材管理', path: '/materials', icon: Image },
      { label: '系统设置', path: '/settings', icon: Settings },
      { label: '设计稿归档', path: '/design-review', icon: Archive },
    ],
  },
]
