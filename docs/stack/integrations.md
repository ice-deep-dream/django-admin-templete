---
title: 第三方集成
description: 了解项目集成的第三方库和插件
---

# 第三方集成

## Unfold 扩展

### 过滤器系统

| 过滤器 | 用途 |
|--------|------|
| `TextFilter` | 文本过滤 |
| `FieldTextFilter` | 字段文本过滤 |
| `DropdownFilter` | 下拉过滤 |
| `MultipleDropdownFilter` | 多选下拉过滤 |
| `ChoicesDropdownFilter` | 选项下拉过滤 |
| `MultipleChoicesDropdownFilter` | 多选选项下拉过滤 |
| `RelatedDropdownFilter` | 关联下拉过滤 |
| `MultipleRelatedDropdownFilter` | 多关联下拉过滤 |
| `RadioFilter` | 单选过滤 |
| `ChoicesRadioFilter` | 选项单选过滤 |
| `CheckboxFilter` | 复选框过滤 |
| `ChoicesCheckboxFilter` | 选项复选框过滤 |
| `RelatedCheckboxFilter` | 关联复选框过滤 |
| `AllValuesCheckboxFilter` | 全值复选框过滤 |
| `BooleanRadioFilter` | 布尔单选过滤 |
| `SingleNumericFilter` | 单数值过滤 |
| `RangeNumericFilter` | 数值范围过滤 |
| `RangeNumericListFilter` | 列表数值范围过滤 |
| `SliderNumericFilter` | 数值滑块过滤 |
| `RangeDateFilter` | 日期范围过滤 |
| `RangeDateTimeFilter` | 日期时间范围过滤 |
| `AutocompleteSelectFilter` | 自动完成单选过滤 |
| `AutocompleteSelectMultipleFilter` | 自动完成多选过滤 |

### 内联增强

| 类型 | 说明 |
|------|------|
| `TabularInline` | 表格内联 |
| `StackedInline` | 堆叠内联 |
| `NonrelatedTabularInline` | 非关联表格内联 |
| `NonrelatedStackedInline` | 非关联堆叠内联 |

### 表单组件

| 组件 | 说明 |
|------|------|
| `UnfoldAdminTextInputWidget` | 文本输入 |
| `UnfoldAdminSelect2Widget` | Select2 下拉选择 |
| `UnfoldAdminCheckboxSelectMultipleWidget` | 多选复选框 |
| `UnfoldAdminLocationWidget` | 地理位置选择 |
| `UnfoldAdminTextareaWidget` | 文本域 |
| `UnfoldAdminSplitDateTimeWidget` | 日期时间选择 |

### 高级功能

| 功能 | 说明 |
|------|------|
| `action` 装饰器 | 自定义操作 |
| `display` 装饰器 | 自定义显示 |
| `InfinitePaginator` | 无限分页 |
| `BaseDataset` | 数据集 |
| `TableSection` | 表格区块 |
| `TemplateSection` | 模板区块 |
| 对话框操作 | Dialog Action |
| 标签页导航 | Tab Navigation |
| 拖拽排序 | Sortable List |

## Django 第三方包

### 权限管理

| 包 | 说明 |
|----|------|
| `django-guardian` | 对象级权限控制 |
| Django Auth | 内置用户权限 |

### 数据管理

| 包 | 说明 |
|----|------|
| `django-import-export` | 数据导入导出（Excel/CSV） |
| `django-simple-history` | 模型变更历史 |
| `django-constance` | 运行时动态配置 |

### 表单和 UI

| 包 | 说明 |
|----|------|
| `django-crispy-forms` | 表单渲染框架 |
| `django-location-field` | 地图位置选择 |
| `django-json-widget` | JSON 编辑器组件 |

### 查询和过滤

| 包 | 说明 |
|----|------|
| `djangoql` | 高级查询语言 |
| DRF Filters | REST Framework 过滤器 |

### 国际化

| 包 | 说明 |
|----|------|
| `django-modeltranslation` | 模型字段多语言 |

### 财务

| 包 | 说明 |
|----|------|
| `django-money` | 货币处理 |

### 任务调度

| 包 | 说明 |
|----|------|
| `django-celery-beat` | 定时任务调度 |

## 前端集成

### API 通信

| 技术 | 说明 |
|------|------|
| Axios | HTTP 客户端 |
| JWT | Token 认证 |
| CORS | 跨域资源共享 |

### 状态同步

| 技术 | 说明 |
|------|------|
| React Query | 服务端状态缓存 |
| Zustand | 客户端全局状态 |
