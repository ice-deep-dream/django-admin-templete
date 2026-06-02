---
title: 管理后台功能
description: 了解 Django Admin 管理后台的功能
---

# 管理后台功能

## 界面特性

### 现代化 UI

- **Tailwind CSS** 驱动的现代化设计
- **深色/浅色模式** 一键切换
- **响应式布局** 适配桌面和移动端
- **Material Symbols** 图标库

### 侧边栏导航

- **可折叠菜单** 节省空间
- **图标支持** 每个菜单项可配置图标
- **分组展示** 按功能分组
- **动态菜单** 基于权限动态显示

### 命令面板

- **快速搜索** 快速定位模型和数据
- **键盘快捷键** 提高操作效率

## 高级过滤器

### 文本过滤

| 过滤器 | 说明 |
|--------|------|
| `TextFilter` | 自定义文本过滤 |
| `FieldTextFilter` | 基于字段的文本过滤 |

### 选择过滤

| 过滤器 | 说明 |
|--------|------|
| `DropdownFilter` | 下拉选择 |
| `RadioFilter` | 单选按钮 |
| `CheckboxFilter` | 复选框 |
| `ChoicesDropdownFilter` | 选项下拉 |
| `ChoicesRadioFilter` | 选项单选 |
| `ChoicesCheckboxFilter` | 选项复选框 |

### 多选过滤

| 过滤器 | 说明 |
|--------|------|
| `MultipleDropdownFilter` | 多选下拉 |
| `MultipleChoicesDropdownFilter` | 多选选项 |

### 关联过滤

| 过滤器 | 说明 |
|--------|------|
| `RelatedDropdownFilter` | 关联下拉 |
| `MultipleRelatedDropdownFilter` | 多关联下拉 |
| `RelatedCheckboxFilter` | 关联复选框 |
| `AutocompleteSelectFilter` | 自动完成单选 |
| `AutocompleteSelectMultipleFilter` | 自动完成多选 |

### 数值过滤

| 过滤器 | 说明 |
|--------|------|
| `SingleNumericFilter` | 单数值 |
| `RangeNumericFilter` | 数值范围 |
| `RangeNumericListFilter` | 列表数值范围 |
| `SliderNumericFilter` | 数值滑块 |

### 日期过滤

| 过滤器 | 说明 |
|--------|------|
| `RangeDateFilter` | 日期范围 |
| `RangeDateTimeFilter` | 日期时间范围 |

### 布尔过滤

| 过滤器 | 说明 |
|--------|------|
| `BooleanRadioFilter` | 布尔单选 |
| `AllValuesCheckboxFilter` | 全值复选框 |

## 高级操作

### 操作类型

| 类型 | 位置 | 说明 |
|------|------|------|
| `actions_list` | 列表页顶部 | 批量操作 |
| `actions_row` | 每行操作 | 单行操作 |
| `actions_detail` | 详情页顶部 | 详情操作 |

### 对话框操作

```python
@action(
    description="对话框操作",
    dialog={
        "title": "确认操作",
        "description": "确定要执行此操作吗？",
        "form_class": CustomForm,  # 可选
    },
)
def my_action(self, request, form):
    # 处理逻辑
    return HttpResponse(...)
```

### 操作权限

```python
@action(
    description="受限操作",
    permissions=["my_custom_permission"],
)
def restricted_action(self, request, form):
    pass

def has_my_custom_permission_permission(self, request):
    return request.user.is_superuser
```

### 下拉操作

```python
actions_list = [
    {
        "title": "下拉菜单",
        "items": [
            "action_one",
            "action_two",
        ],
    },
]
```

## 内联增强

### 内联类型

| 类型 | 说明 |
|------|------|
| `TabularInline` | 表格形式展示 |
| `StackedInline` | 堆叠形式展示 |
| `NonrelatedTabularInline` | 非关联表格内联 |
| `NonrelatedStackedInline` | 非关联堆叠内联 |

### 内联功能

- **嵌套内联** 支持多层嵌套
- **可排序内联** 拖拽排序
- **分页内联** 大数据集分页
- **可折叠内联** 折叠/展开
- **标签页内联** 在标签页中展示

## 标签页导航

### 标签页类型

| 类型 | 说明 |
|------|------|
| 模型标签页 | Fieldsets 标签页 |
| 表单标签页 | 表单字段分组 |
| 字段集标签页 | 字段集标签页 |
| 动态标签页 | 数据集标签页 |

### 配置方式

```python
fieldsets = (
    (None, {"fields": ("field1", "field2")}),
    ("分组名称", {
        "fields": ("field3", "field4"),
        "classes": ["tab"],  # 启用标签页
    }),
)
```

## 数据管理

### 无限分页

```python
paginator = InfinitePaginator
```

- 滚动加载更多
- 高效处理大数据集

### 拖拽排序

```python
ordering_field = "weight"
hide_ordering_field = True
```

- 拖拽调整顺序
- 自动保存权重

### 数据导入导出

- **导入** 支持 Excel/CSV 格式
- **导出** 支持多种格式
- **字段选择** 导出时选择字段

### 历史记录

- **变更追踪** 自动记录模型变更
- **历史对比** 查看历史版本
- **回滚支持** 恢复到历史版本

## 表单功能

### 条件字段

根据其他字段值动态显示/隐藏字段

### WYSIWYG 编辑器

内置 Trix 富文本编辑器

### 数组字段

PostgreSQL ArrayField 支持

### JSON 字段

增强的 JSON 编辑器

### Crispy Forms

自定义表单渲染

## 仪表盘

### 组件系统

| 组件 | 说明 |
|------|------|
| 卡片 | 数据卡片 |
| 按钮 | 操作按钮 |
| 图表 | 柱状图/折线图/热力图 |
| 进度条 | 进度展示 |
| 表格 | 数据表格 |

### 自定义页面

可创建自定义管理页面

## 其他功能

| 功能 | 说明 |
|------|------|
| 多语言切换 | 直接在管理界面切换语言 |
| 环境标签 | 区分开发/测试/生产环境 |
| 主题定制 | 自定义颜色、背景、圆角 |
| Favicon 配置 | 自定义网站图标 |
| 动态配置 | 运行时修改配置 |
