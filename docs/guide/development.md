---
title: 开发规范
description: 项目开发规范和最佳实践
---

# 开发规范

## Git 提交规范

提交信息格式：`type: 中国式子英文格式`（不超过 10 个单词）

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: add dashboard panel` |
| `fix` | 修复 bug | `fix: prevent null token startup` |
| `docs` | 文档更新 | `docs: add installation` |
| `style` | 代码格式 | `style: format admin views` |
| `refactor` | 重构 | `refactor: simplify pagination` |
| `test` | 测试 | `test: add user admin tests` |
| `chore` | 其他 | `chore: update dependencies` |

## Python 开发规范

### 代码风格

- 遵循 PEP 8 规范
- 使用 `ruff` 进行代码检查
- 使用 `black` 进行代码格式化

### 模型定义

```python
from django.db import models
from django.utils.translation import gettext_lazy as _

class MyModel(models.Model):
    name = models.CharField(max_length=255, verbose_name='名称')
    is_active = models.BooleanField(default=True, verbose_name='是否启用')

    class Meta:
        verbose_name = '模型名称'
        verbose_name_plural = '模型名称'
        ordering = ['-created_at']
```

### Admin 定义

```python
from unfold.admin import ModelAdmin

@admin.register(MyModel)
class MyModelAdmin(ModelAdmin):
    list_display = ['name', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name']
```

## TypeScript 开发规范

### 代码风格

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 严格模式，禁止隐式 any

### 组件定义

```tsx
interface Props {
  title: string
  isActive?: boolean
}

export function MyComponent({ title, isActive = true }: Props) {
  return <div>{title}</div>
}
```

### API 调用

```typescript
import { client } from '@/shared/api/client'

export const userApi = {
  getList: (params: ListParams) => client.get('/api/users/', { params }),
  getById: (id: number) => client.get(`/api/users/${id}/`),
  create: (data: CreateData) => client.post('/api/users/', data),
  update: (id: number, data: UpdateData) => client.put(`/api/users/${id}/`, data),
  delete: (id: number) => client.delete(`/api/users/${id}/`),
}
```

## 目录规范

### 后端目录

```
backEnd/
├── example/              # 主应用
│   ├── core/             # 核心模块
│   │   ├── middleware.py # 中间件
│   │   ├── permissions.py # 权限
│   │   ├── pagination.py # 分页
│   │   └── serializers.py # 序列化器
│   ├── models.py         # 数据模型
│   ├── admin.py          # 管理后台
│   ├── api_views.py      # API 视图
│   └── serializers.py    # 序列化器
└── unfold/               # Unfold 核心
```

### 前端目录

```
frontEnd/src/
├── modules/              # 业务模块
│   ├── dashboard/        # 仪表盘模块
│   ├── user/             # 用户模块
│   ├── project/          # 项目模块
│   └── role/             # 角色模块
├── shared/               # 共享模块
│   ├── api/              # API 封装
│   ├── components/       # 通用组件
│   ├── stores/           # 状态管理
│   ├── hooks/            # 自定义 Hooks
│   ├── types/            # 类型定义
│   └── i18n/             # 国际化
└── App.tsx               # 根组件
```
