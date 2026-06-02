---
title: 数据模型
description: 了解项目的数据模型设计
---

# 数据模型

## 模型概览

```
User (用户)
├── Tag (标签) [M:N]
├── Category (分类) [M:N]
├── Label (标签) [M:N]
├── Project (项目) [M:N]
├── Task (任务) [M:N]
├── Post (文章) [1:N]
└── Invoice (发票) [1:N]
    └── InvoiceItem (发票项) [1:N]

Profile (用户资料) [1:1]
MenuItem (菜单项) [自关联树形]
RoleMenu (角色菜单权限) [N:1 Group, N:1 MenuItem]
```

## 核心模型

### User 用户模型

继承自 `AbstractUser`，扩展了以下字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `url` | URLField | 个人网址 |
| `location` | PlainLocationField | 地理位置 |
| `file` | FileField | 文件 |
| `image` | ImageField | 图片 |
| `data` | JSONField | JSON 数据 |
| `status` | CharField | 状态 (active/inactive/pending) |
| `approval` | CharField | 审批状态 (new/reviewed/approved/rejected) |
| `priority` | CharField | 优先级 (low/medium/high) |
| `color` | CharField | 颜色 (red/blue/green/yellow) |
| `weight` | PositiveIntegerField | 权重（排序用） |

### 多对多关系

| 关系 | 说明 |
|------|------|
| User ↔ Tag | 用户标签 |
| User ↔ Category | 用户分类 |
| User ↔ Label | 用户标签 |
| User ↔ Project | 用户项目 |
| User ↔ Task | 用户任务 |

### 一对多关系

| 关系 | 说明 |
|------|------|
| User → Post | 用户文章 |
| User → Invoice | 用户发票 |
| Invoice → InvoiceItem | 发票明细 |
| Project → Task | 项目任务 |

### 菜单模型

```python
class MenuItem(models.Model):
    label = models.CharField(max_length=100)      # 菜单名称
    icon = models.CharField(max_length=50)        # 图标
    path = models.CharField(max_length=255)       # 路由路径
    parent = models.ForeignKey('self')            # 父菜单（树形结构）
    permission = models.CharField(max_length=100) # 权限标识
    order = models.IntegerField()               # 排序
    group_label = models.CharField(max_length=50) # 分组标签
    is_active = models.BooleanField()             # 是否启用

class RoleMenu(models.Model):
    group = models.ForeignKey('auth.Group')       # 角色
    menu_item = models.ForeignKey(MenuItem)       # 菜单项
    # unique_together: ['group', 'menu_item']
```

## 枚举类型

### StatusChoices 状态

| 值 | 说明 |
|----|------|
| `active` | 活跃 |
| `inactive` | 非活跃 |
| `pending` | 待处理 |

### ApprovalChoices 审批

| 值 | 说明 |
|----|------|
| `new` | 新建 |
| `reviewed` | 已审核 |
| `approved` | 已通过 |
| `rejected` | 已拒绝 |

### PriorityChoices 优先级

| 值 | 说明 |
|----|------|
| `low` | 低 |
| `medium` | 中 |
| `high` | 高 |

### ColorChoices 颜色

| 值 | 说明 |
|----|------|
| `red` | 红色 |
| `blue` | 蓝色 |
| `green` | 绿色 |
| `yellow` | 黄色 |

## Proxy 模型

项目使用 Proxy 模型来为同一 User 表提供不同的 Admin 视图：

| Proxy 模型 | 用途 |
|-----------|------|
| `SectionUser` | 侧边栏分区展示 |
| `ActionUser` | 操作功能展示 |
| `DialogActionUser` | 对话框操作展示 |
| `FilterUser` | 过滤器功能展示 |
