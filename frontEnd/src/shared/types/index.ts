export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  is_staff: boolean
  is_superuser: boolean
  status: 'active' | 'inactive' | 'pending'
  approval: 'new' | 'reviewed' | 'approved' | 'rejected'
  priority: 'low' | 'medium' | 'high'
  color: 'red' | 'blue' | 'green' | 'yellow'
  date_joined: string
  last_login: string
  tags: Tag[]
  projects: Project[]
  groups: Group[]
}

export interface Tag {
  id: number
  name: string
}

export interface Category {
  id: number
  name: string
}

export interface Label {
  id: number
  name: string
}

export interface Project {
  id: number
  name: string
  is_active: boolean
  tasks?: Task[]
}

export interface Task {
  id: number
  project: number
  name: string
}

export interface Profile {
  id: number
  name: string
}

export interface Post {
  id: number
  user: number
  title: string
  weight: number
}

export interface Invoice {
  id: number
  user: number
  name: string
  items: InvoiceItem[]
}

export interface InvoiceItem {
  id: number
  name: string
  invoice: number
}

export interface Group {
  id: number
  name: string
  permissions?: Permission[]
  user_count?: number
  users?: { id: number; username: string }[]
}

export interface GroupInput {
  name: string
  permissions?: number[]
  user_ids?: number[]
}

export interface Permission {
  id: number
  codename: string
  name: string
  content_type: number
  display_name?: string
}

export interface UserPermissions {
  id: number
  username: string
  groups: { id: number; name: string }[]
  permissions: string[]
  is_superuser: boolean
}

export interface MenuItem {
  label: string
  path: string
  icon: string
  permission?: string
  children?: MenuItem[]
}

export interface DashboardStats {
  total_users: number
  active_users: number
  total_projects: number
  active_projects: number
  total_tasks: number
  total_tags: number
  total_categories: number
  user_growth: number[]
  project_growth: number[]
}

export interface PaginationParams {
  page: number
  page_size: number
  search?: string
  ordering?: string
}

export interface PaginationMeta {
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface PaginatedResponse<T> {
  list: T[]
  pagination: PaginationMeta
}
