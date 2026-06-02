---
title: 前端技术栈
description: 了解前端使用的技术栈
---

# 前端技术栈

## 核心框架

### React 19

- **组件化**：基于组件的 UI 开发
- **Hooks**：函数式组件状态管理
- **并发渲染**：React 19 并发特性
- **Server Components**：服务端组件支持

### TypeScript 5.8

- **类型安全**：静态类型检查
- **接口定义**：API 和组件类型定义
- **严格模式**：禁止隐式 any

### Vite 6.3

- **快速启动**：基于 ESBuild 的极速开发体验
- **HMR**：热模块替换
- **构建优化**：Rollup 生产构建

## UI 框架

### Material UI 9

| 组件 | 用途 |
|------|------|
| `@mui/material` | 核心组件库 |
| `@mui/icons-material` | 图标库 |
| `@emotion/react` | CSS-in-JS 样式 |
| `@emotion/styled` | 样式化组件 |

### Tailwind CSS 4

- **原子化 CSS**：实用优先的 CSS 框架
- **响应式**：内置响应式断点
- **主题定制**：自定义设计令牌
- **PostCSS**：CSS 后处理

## 状态管理

### Zustand 5

- **轻量级**：极简的状态管理
- **Hooks API**：简单易用的 API
- **TypeScript**：完整类型支持

```typescript
const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  login: (token, user) => set({ token, user }),
  logout: () => set({ token: null, user: null }),
}))
```

## 数据请求

### Axios 1.9

- **HTTP 客户端**：基于 Promise 的 HTTP 客户端
- **拦截器**：请求/响应拦截
- **自动转换**：JSON 数据自动转换

### React Query 5

| 功能 | 说明 |
|------|------|
| `useQuery` | 数据查询 |
| `useMutation` | 数据变更 |
| `QueryClient` | 缓存管理 |
| `DevTools` | 开发调试工具 |

## 路由

### React Router 7

- **声明式路由**：基于组件的路由配置
- **嵌套路由**：支持路由嵌套
- **数据加载**：Loader 和 Action

## 国际化

### i18next 26

- **多语言支持**：中英文切换
- **延迟加载**：按需加载语言包
- **React 集成**：react-i18next

## 开发工具

| 工具 | 用途 |
|------|------|
| `ESLint` | 代码检查 |
| `Prettier` | 代码格式化 |
| `TypeScript` | 类型检查 |
| `@vitejs/plugin-react` | React 支持 |
| `@tailwindcss/vite` | Tailwind 集成 |
| `autoprefixer` | CSS 前缀 |

## 工具库

| 库 | 用途 |
|----|------|
| `clsx` | 条件类名拼接 |
| `tailwind-merge` | Tailwind 类名合并 |

## 项目结构约定

```
src/
├── modules/          # 业务模块（按功能划分）
│   └── {module}/
│       ├── api.ts    # API 调用
│       └── pages/    # 页面组件
├── shared/           # 共享模块
│   ├── api/          # API 封装
│   ├── components/   # 通用组件
│   ├── stores/       # 状态管理
│   ├── hooks/        # 自定义 Hooks
│   ├── types/        # 类型定义
│   ├── i18n/         # 国际化
│   ├── theme/        # 主题配置
│   └── utils/        # 工具函数
└── App.tsx           # 根组件
```
