---
title: 前端页面
description: 了解前端应用的页面功能
---

# 前端页面

## 页面概览

前端应用采用模块化设计，每个业务模块独立开发和维护。

```
/                    # 仪表盘首页
/login               # 登录页
/users               # 用户管理
/projects            # 项目管理
/roles               # 角色管理
/taxonomy            # 分类标签管理
/settings            # 系统设置
/template/*          # 模板页面
```

## 登录页

### 功能

- 用户名密码登录
- 图形验证码
- JWT Token 存储
- 自动跳转到仪表盘

### 技术

- React Hook Form 表单
- Axios 请求拦截
- Zustand 状态管理

## 仪表盘

### 功能

- 数据统计卡片
- 图表展示
- 快捷操作

### 数据

```typescript
interface DashboardStats {
  userCount: number
  projectCount: number
  taskCount: number
  postCount: number
}
```

## 用户管理

### 功能

- 用户列表展示
- 搜索和过滤
- 新增/编辑/删除用户
- 用户角色分配

### API 调用

```typescript
userApi.getList(params)
userApi.create(data)
userApi.update(id, data)
userApi.delete(id)
```

## 项目管理

### 功能

- 项目列表
- 项目状态管理
- 关联任务查看

## 角色管理

### 功能

- 角色列表
- 角色权限配置
- 菜单权限分配

## 分类标签管理

### 功能

- 标签管理
- 分类管理
- Label 管理

## 系统设置

### 功能

- 系统配置
- 主题设置
- 用户偏好

## 模板页面

项目提供多种模板页面供参考：

| 页面 | 说明 |
|------|------|
| `TemplateTabPage` | 标签页模板 |
| `TemplateSimplePage` | 简单页面模板 |
| `TemplateSearchPage` | 搜索页面模板 |
| `TemplateActionPage` | 操作页面模板 |

## 布局组件

### DashboardLayout

主布局组件，包含：

- **侧边栏** 动态菜单
- **顶部导航** 用户信息、主题切换
- **内容区域** 页面内容

### PageLayout

页面布局组件，包含：

- **PageHeader** 页面标题和面包屑
- **Content** 内容区域

### Pagination

分页组件：

- 页码导航
- 每页条数选择
- 总数显示

## 状态管理

### authStore

```typescript
interface AuthState {
  token: string | null
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
}
```

### themeStore

```typescript
interface ThemeState {
  mode: 'light' | 'dark'
  toggle: () => void
}
```

### layoutStore

```typescript
interface LayoutState {
  sidebarOpen: boolean
  breadcrumbs: Breadcrumb[]
  toggleSidebar: () => void
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void
}
```

## 国际化

支持中英文切换：

```typescript
import { useTranslation } from 'react-i18next'

const { t, i18n } = useTranslation()
i18n.changeLanguage('zh')
```
