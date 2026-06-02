---
title: 前端架构
description: 了解前端项目的架构设计
---

# 前端架构

## 目录结构

```
frontEnd/
├── package.json               # Node.js 依赖
├── tsconfig.json              # TypeScript 配置
├── vite.config.ts             # Vite 配置
└── src/
    ├── main.tsx               # 应用入口
    ├── App.tsx                # 根组件
    ├── vite-env.d.ts          # 类型声明
    ├── modules/               # 业务模块
    │   ├── dashboard/         # 仪表盘
    │   │   ├── api.ts         # API 调用
    │   │   └── pages/
    │   │       └── DashboardPage.tsx
    │   ├── user/              # 用户管理
    │   │   ├── api.ts
    │   │   └── pages/
    │   │       └── UsersPage.tsx
    │   ├── project/           # 项目管理
    │   │   ├── api.ts
    │   │   └── pages/
    │   │       └── ProjectsPage.tsx
    │   ├── role/              # 角色管理
    │   │   ├── api.ts
    │   │   └── pages/
    │   │       └── RolesPage.tsx
    │   ├── taxonomy/          # 分类标签
    │   │   ├── api.ts
    │   │   └── pages/
    │   │       ├── TaxonomyPage.tsx
    │   │       └── ContentPage.tsx
    │   ├── template/          # 模板页面
    │   │   └── pages/
    │   │       ├── TemplateTabPage.tsx
    │   │       ├── TemplateSimplePage.tsx
    │   │       ├── TemplateSearchPage.tsx
    │   │       └── TemplateActionPage.tsx
    │   └── settings/          # 系统设置
    │       └── pages/
    │           └── SettingsPage.tsx
    └── shared/                # 共享模块
        ├── api/               # API 封装
        │   ├── client.ts      # Axios 客户端
        │   ├── auth.ts        # 认证 API
        │   └── index.ts
        ├── components/        # 通用组件
        │   ├── layout/        # 布局组件
        │   │   ├── DashboardLayout.tsx
        │   │   ├── PageLayout.tsx
        │   │   ├── PageHeader.tsx
        │   │   └── Pagination.tsx
        │   └── common/        # 权限组件
        │       ├── PermissionProvider.tsx
        │       ├── HasPermission.tsx
        │       └── PermissionGuard.tsx
        ├── stores/            # 状态管理
        │   ├── authStore.ts   # 认证状态
        │   ├── themeStore.ts  # 主题状态
        │   ├── themeColorStore.ts
        │   ├── layoutStore.ts # 布局状态
        │   └── index.ts
        ├── hooks/             # 自定义 Hooks
        │   ├── useQueries.ts  # React Query Hooks
        │   └── index.ts
        ├── types/             # 类型定义
        │   └── index.ts
        ├── i18n/              # 国际化
        │   ├── index.ts
        │   └── locales/
        │       └── zh.json
        ├── theme/             # 主题配置
        │   └── index.ts
        ├── utils/             # 工具函数
        │   └── index.ts
        └── data/              # 数据
            └── mockData.ts    # Mock 数据
```

## 技术架构

### 状态管理

使用 Zustand 进行全局状态管理：

```
authStore          # 认证状态（token, user, login/logout）
themeStore         # 主题状态（dark/light）
themeColorStore    # 主题色状态
layoutStore        # 布局状态（侧边栏、面包屑）
```

### 数据流

```
组件 → useQuery/useMutation → API 调用 → React Query 缓存 → 组件更新
                    ↓
              Zustand Store（全局状态）
```

### 路由设计

```
/                    # 首页/仪表盘
/login               # 登录页
/users               # 用户管理
/projects            # 项目管理
/roles               # 角色管理
/taxonomy            # 分类管理
/settings            # 系统设置
/template/*          # 模板页面
```

## 组件架构

### 布局组件

```
DashboardLayout          # 主布局
├── Sidebar              # 侧边栏（动态菜单）
├── Header               # 顶部导航
└── PageLayout           # 页面布局
    ├── PageHeader       # 页面标题
    └── Content          # 内容区域
```

### 权限组件

```
PermissionProvider       # 权限上下文提供者
└── PermissionGuard      # 权限守卫（条件渲染）
    └── HasPermission    # 权限检查组件
```

## API 封装

### Axios 客户端

```typescript
// client.ts
const client = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截器：添加 JWT Token
client.interceptors.request.use((config) => {
  const token = authStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：处理 401 等错误
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStore.getState().logout()
    }
    return Promise.reject(error)
  }
)
```

### 模块化 API

每个业务模块独立封装 API：

```typescript
// modules/user/api.ts
export const userApi = {
  getList: (params) => client.get('/api/users/', { params }),
  getById: (id) => client.get(`/api/users/${id}/`),
  create: (data) => client.post('/api/users/', data),
  update: (id, data) => client.put(`/api/users/${id}/`, data),
  delete: (id) => client.delete(`/api/users/${id}/`),
}
```
