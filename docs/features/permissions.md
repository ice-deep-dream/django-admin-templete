---
title: 权限系统
description: 了解项目的权限系统设计
---

# 权限系统

## 权限架构

项目采用三层权限架构：

```
┌─────────────────────────────────────────────────────────┐
│                    权限架构                               │
├─────────────────────────────────────────────────────────┤
│  第一层：用户权限 (Django Auth)                           │
│  - 用户认证                                               │
│  - 内置权限 (add/change/delete/view)                     │
│  - 组权限                                                 │
├─────────────────────────────────────────────────────────┤
│  第二层：对象权限 (django-guardian)                       │
│  - 对象级权限控制                                         │
│  - 细粒度权限                                             │
├─────────────────────────────────────────────────────────┤
│  第三层：菜单权限 (RoleMenu)                              │
│  - 菜单访问控制                                           │
│  - 前端路由控制                                           │
└─────────────────────────────────────────────────────────┘
```

## 用户权限

### 内置权限

Django 自动为每个模型生成以下权限：

| 权限 | 编码 | 说明 |
|------|------|------|
| 查看 | `view_{model}` | 查看模型实例 |
| 添加 | `add_{model}` | 创建模型实例 |
| 修改 | `change_{model}` | 修改模型实例 |
| 删除 | `delete_{model}` | 删除模型实例 |

### 组权限

```
Group (角色)
├── Permission 1
├── Permission 2
└── Permission 3
```

用户通过加入组获得相应权限。

### 默认角色

| 角色 | 权限 |
|------|------|
| 超级管理员 | 全部权限 |
| 编辑 | 增/改/查（标签、分类、项目、任务、文章） |
| 只读用户 | 仅查看 |

## 对象权限

使用 `django-guardian` 实现对象级权限：

```python
from guardian.shortcuts import assign_perm, get_perms

# 分配对象权限
assign_perm('view_user', user, obj)
assign_perm('change_user', user, obj)

# 获取用户权限
get_perms(user, obj)
```

## 菜单权限

### 模型设计

```python
class MenuItem(models.Model):
    label = models.CharField(max_length=100)      # 菜单名称
    icon = models.CharField(max_length=50)        # 图标
    path = models.CharField(max_length=255)       # 路由路径
    parent = models.ForeignKey('self')            # 父菜单
    permission = models.CharField(max_length=100) # 权限标识
    order = models.IntegerField()               # 排序
    is_active = models.BooleanField()             # 是否启用

class RoleMenu(models.Model):
    group = models.ForeignKey('auth.Group')       # 角色
    menu_item = models.ForeignKey(MenuItem)       # 菜单项
```

### 权限检查流程

```
用户请求菜单 → 获取用户角色 → 查询 RoleMenu → 返回有权限的菜单树
```

### API 接口

```
GET /api/menu/
```

返回当前用户有权限访问的菜单树。

## 前端权限控制

### 权限组件

```tsx
// 权限守卫
<PermissionGuard permission="user:add">
  <Button>添加用户</Button>
</PermissionGuard>

// 权限检查
const { hasPermission } = usePermission()
if (hasPermission('user:delete')) {
  // 显示删除按钮
}
```

### 权限提供者

```tsx
<PermissionProvider permissions={userPermissions}>
  <App />
</PermissionProvider>
```

## 后端权限控制

### DRF 权限类

```python
from rest_framework.permissions import IsAuthenticated
from example.core.permissions import HasPermission

class UserViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, HasPermission]
```

### Admin 权限

```python
@admin.register(User)
class UserAdmin(ModelAdmin):
    def has_add_permission(self, request):
        return request.user.has_perm('example.add_user')

    def has_change_permission(self, request, obj=None):
        return request.user.has_perm('example.change_user')

    def has_delete_permission(self, request, obj=None):
        return request.user.has_perm('example.delete_user')
```

## 权限数据流

```
登录 → 获取用户信息 → 获取用户角色 → 获取角色权限 → 获取菜单权限
                                            ↓
                                      前端存储权限列表
                                            ↓
                                      组件权限检查
```
