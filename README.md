# Django Admin Template

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?logo=python" />
  <img src="https://img.shields.io/badge/Django-5.x-092E20?logo=django" />
  <img src="https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js" />
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/License-MIT-blue" />
</p>

> 基于 Django Unfold 和 React 的现代化管理后台项目模板

📖 **完整文档**: https://ice-deep-dream.github.io/django-admin-templete/

🌐 [English](README.en.md) | [中文](README.md)

---

## 功能

| 功能 | 说明 |
|:-----|:-----|
| Django Unfold | 现代化 Django Admin 界面 |
| REST API | 完整的 RESTful API 支持 |
| 权限系统 | 基于角色的权限控制 |
| React 前端 | 响应式前端页面 |
| 文档站点 | VitePress 构建的在线文档 |

---

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/ice-deep-dream/django-admin-templete.git
cd django-admin-templete
```

### 2. 安装依赖

```bash
# 安装后端 Python 依赖
cd backEnd
uv sync

# 安装前端 Node.js 依赖
cd ../frontEnd
npm install
```

### 3. 数据库迁移

```bash
cd backEnd
uv run python manage.py migrate
```

### 4. 创建超级用户

```bash
cd backEnd
uv run python manage.py createsuperuser
```

### 5. 启动服务

```bash
# 启动后端服务
cd backEnd
uv run python manage.py runserver 0.0.0.0:8000

# 另开终端，启动前端开发服务
cd ../frontEnd
npm run dev
```

---

## 默认账号

| 账号 | 密码 | 角色 |
|:-----|:-----|:-----|
| admin | admin123 | 超级管理员 |
| editor | editor123 | 编辑 |
| viewer | viewer123 | 只读用户 |

---

## 访问地址

- **Django Admin**: http://localhost:8000/admin
- **React 前端**: http://localhost:5173
- **在线文档**: https://ice-deep-dream.github.io/django-admin-templete/

---

## 目录结构

```
django-admin-templete/
├── backEnd/              # 后端 Django 项目
│   ├── unfold/           # Unfold 核心包
│   ├── example/          # 示例应用
│   ├── tests/            # 测试文件
│   ├── manage.py         # Django 管理脚本
│   └── pyproject.toml    # Python 项目配置
│
├── frontEnd/             # 前端构建目录
│   ├── src/              # 前端源码
│   └── package.json      # Node.js 依赖配置
│
├── docs/                 # VitePress 文档站点
│   ├── .vitepress/       # VitePress 配置
│   ├── guide/            # 指南文档
│   ├── architecture/     # 架构文档
│   ├── features/         # 功能文档
│   └── package.json      # 文档依赖
│
├── .github/
│   └── workflows/        # GitHub Actions 配置
│
├── .gitignore
├── CHANGELOG.md
└── LICENSE.md
```

---

## 技术栈

### 后端
- **Python 3.12+**
- **Django 5.x**
- **Django Unfold** - 现代化 Admin 界面
- **uv** - Python 包管理器

### 前端
- **Node.js 18+**
- **React 18.x**
- **Tailwind CSS** - 原子化 CSS 框架

### 文档
- **VitePress** - 静态站点生成器
- **GitHub Pages** - 文档托管

---

## 文档

- 📖 [在线文档](https://ice-deep-dream.github.io/django-admin-templete/)
- 📋 [项目概览](./PROJECT_OVERVIEW.md)
- 📝 [更新日志](./CHANGELOG.md)

---

## 许可证

MIT License

---

## 作者

- **ice-deep-dream**
- **邮箱**: 1172624289@qq.com
- **仓库**: https://github.com/ice-deep-dream/django-admin-templete
