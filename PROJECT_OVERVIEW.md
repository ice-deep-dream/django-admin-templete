# Django Admin Template 项目概览

## 项目信息

- **项目名称**: django-admin-templete
- **作者**: ice-deep-dream
- **邮箱**: 1172624289@qq.com
- **仓库**: https://github.com/ice-deep-dream/django-admin-templete
- **许可证**: MIT

## 鸣谢

本项目基于 [unfoldadmin/django-unfold](https://github.com/unfoldadmin/django-unfold) 构建，感谢原作者的出色工作。

---

## 启动前提

### 环境要求

| 依赖 | 版本要求 |
|------|----------|
| Python | 3.12, 3.13, 3.14 |
| Django | 5.1, 5.2, 6.0 |
| Node.js | 支持 npm 的任意版本 |
| uv | 推荐（Python 包管理器） |

### 启动步骤

1. **安装 Python 依赖**
   ```bash
   uv sync
   ```

2. **安装前端 Node.js 依赖**
   ```bash
   npm install --prefix frontEnd
   ```

3. **数据库迁移**
   ```bash
   uv run python backEnd\manage.py migrate
   ```

4. **创建超级用户（可选）**
   ```bash
   uv run python backEnd\manage.py createsuperuser
   ```

5. **启动开发服务器**
   ```bash
   uv run python backEnd\manage.py runserver 0.0.0.0:8000
   ```

6. **访问管理后台**
   - 地址: http://localhost:8000/admin
   - 使用创建的超级用户账号登录

---

## 技术栈

### 后端

- **Django** (5.1+) - Web 框架
- **django.contrib.admin** - 基础管理后台
- **SQLite** - 默认数据库（可替换）

### 前端

- **Tailwind CSS 4** - CSS 框架
- **Alpine.js** - 轻量级 JavaScript 框架
- **HTMX** - AJAX 交互
- **Chart.js** - 图表库
- **SimpleBar** - 自定义滚动条
- **Trix** - WYSIWYG 编辑器
- **noUiSlider** - 范围滑块
- **Material Symbols** - 图标库
- **Inter** - 字体

### 第三方集成

- **django-guardian** - 对象级权限
- **django-import-export** - 数据导入导出
- **django-simple-history** - 模型历史追踪
- **django-constance** - 动态配置
- **django-celery-beat** - 定时任务
- **django-modeltranslation** - 多语言支持
- **django-money** - 货币处理
- **django-location-field** - 地理位置
- **djangoql** - 高级查询
- **django-json-widget** - JSON 编辑器
- **django-crispy-forms** - 表单渲染

---

## 项目架构

### 目录结构

```
django-admin-templete/
├── backEnd/                       # 后端 Django 项目
│   ├── manage.py                  # Django 管理脚本
│   ├── db.sqlite3                 # SQLite 数据库
│   ├── unfold/                    # Unfold 核心包
│   │   ├── admin.py               # ModelAdmin 基类
│   │   ├── sites.py               # 自定义 AdminSite
│   │   ├── components.py          # UI 组件系统
│   │   ├── datasets.py            # 数据集功能
│   │   ├── decorators.py          # 装饰器
│   │   ├── forms.py               # 表单类
│   │   ├── layout.py              # 布局系统
│   │   ├── paginator.py           # 分页器
│   │   ├── sections.py            # 侧边栏分区
│   │   ├── settings.py            # 配置处理
│   │   ├── mixins/                # Mixin 类
│   │   │   ├── action_model_admin.py
│   │   │   ├── dataset_model_admin.py
│   │   │   ├── formfield_model_admin.py
│   │   │   └── nested_inlines_model_admin.py
│   │   ├── contrib/               # 第三方集成
│   │   │   ├── filters/           # 高级过滤器
│   │   │   ├── forms/             # 表单组件（WYSIWYG等）
│   │   │   ├── inlines/           # 内联增强
│   │   │   ├── import_export/     # 导入导出模板
│   │   │   ├── guardian/          # 权限管理模板
│   │   │   ├── simple_history/    # 历史记录模板
│   │   │   ├── location_field/    # 地图组件
│   │   │   └── constance/         # 动态配置模板
│   │   ├── templates/             # HTML 模板
│   │   │   ├── admin/             # 覆盖 Django admin 模板
│   │   │   └── unfold/            # 自定义组件模板
│   │   └── static/                # 静态资源
│   │       ├── unfold/css/        # 样式文件
│   │       ├── unfold/js/         # JavaScript 文件
│   │       └── unfold/fonts/      # 字体文件
│   └── example/                   # 示例应用
│       ├── settings.py            # Django 配置
│       ├── models.py              # 示例模型
│       ├── admin.py               # 示例 Admin
│       ├── urls.py                # URL 路由
│       └── templates/             # 示例模板
│
├── frontEnd/                      # 前端构建目录
│   ├── package.json               # Node.js 依赖
│   ├── node_modules/              # npm 安装包
│   └── src/                       # 前端源码
│       └── styles.css             # Tailwind CSS 源文件
│
├── pyproject.toml                 # Python 项目配置
├── .venv/                         # Python 虚拟环境
└── PROJECT_OVERVIEW.md            # 项目概览文档
```

### 设计模式

- **模板继承**: 覆盖 Django admin 默认模板
- **Mixin 组合**: 通过 Mixin 扩展功能
- **组件化 UI**: 可复用的 UI 组件系统
- **配置驱动**: 通过 UNFOLD 设置字典配置

---

## 主要功能

### 界面特性

- **现代化 UI**: 基于 Tailwind CSS 的现代化管理界面
- **深色模式**: 支持亮色/暗色主题切换
- **响应式设计**: 适配各种屏幕尺寸
- **侧边栏导航**: 可折叠的侧边栏菜单，支持图标和分组
- **命令面板**: 快速搜索模型和数据

### 管理功能

- **高级过滤器**: 下拉选择、自动完成、数值范围、日期时间、文本过滤
- **高级操作**: 支持多种 admin actions（行操作、下拉操作、对话框操作）
- **内联增强**: 
  - 嵌套内联
  - 非关联内联
  - 可排序内联
  - 分页内联
- **标签页导航**: 
  - 模型标签页
  - 表单标签页
  - 字段集标签页
  - 动态标签页
- **无限分页**: 高效处理大数据集
- **可排序列表**: 拖拽排序 changelist

### 表单功能

- **条件字段**: 根据其他字段值动态显示/隐藏字段
- **WYSIWYG 编辑器**: 内置 Trix 富文本编辑器
- **数组字段**: PostgreSQL ArrayField 支持
- **JSON 字段**: 增强的 JSON 编辑
- **Crispy Forms**: 自定义模板包支持

### 仪表盘

- **组件系统**: 卡片、按钮、图表、进度条、表格等
- **图表支持**: 柱状图、折线图、热力图
- **自定义页面**: 可创建自定义管理页面

### 其他功能

- **多语言切换**: 直接在管理界面切换语言
- **环境标签**: 区分不同环境（开发/测试/生产）
- **主题定制**: 自定义颜色、背景、圆角等
- **Favicon 配置**: 支持自定义网站图标
- **第三方集成**: 与多个流行 Django 包无缝集成

---

## 快速开始

### 在你的项目中使用

1. **安装包**
   ```bash
   pip install django-unfold
   ```

2. **配置 settings.py**
   ```python
   INSTALLED_APPS = [
       "unfold",
       # 其他应用...
   ]
   ```

3. **使用 Unfold ModelAdmin**
   ```python
   from unfold.admin import ModelAdmin

   @admin.register(MyModel)
   class MyModelAdmin(ModelAdmin):
       pass
   ```

> Unfold 与默认 Django admin 并行工作，无需迁移现有模型或工作流。
