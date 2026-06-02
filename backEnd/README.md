# Django Unfold 项目

[![PyPI - Version](https://img.shields.io/pypi/v/django-unfold.svg?style=for-the-badge)](https://pypi.org/project/django-unfold/)
[![Discord](https://img.shields.io/discord/1297493955231088650?style=for-the-badge&logo=discord&logoColor=%23ffffff&color=7289da)](https://discord.gg/9sQj9MEbNz)

Enhance Django Admin with a modern interface and powerful tools to build internal applications.

## 项目结构

```
django-admin-templete/
├── backEnd/          # 后端 Django 项目
│   ├── unfold/       # Unfold 核心包
│   ├── example/      # 示例应用
│   ├── tests/        # 测试文件
│   ├── manage.py     # Django 管理脚本
│   └── pyproject.toml # Python 项目配置
│
├── frontEnd/         # 前端构建目录
│   ├── src/          # 前端源码
│   ├── package.json  # Node.js 依赖配置
│   └── node_modules/ # npm 安装包
│
├── .gitignore
├── PROJECT_OVERVIEW.md # 项目概览文档
├── CHANGELOG.md
└── LICENSE.md
```

## 快速开始

### 1. 安装依赖

```bash
# 安装后端 Python 依赖
cd backEnd
uv sync

# 安装前端 Node.js 依赖
cd ../frontEnd
npm install
```

### 2. 数据库迁移

```bash
cd backEnd
uv run python manage.py migrate
```

### 3. 创建超级用户

```bash
cd backEnd
uv run python manage.py createsuperuser
```

### 4. 启动开发服务器

```bash
cd backEnd
uv run python manage.py runserver 0.0.0.0:8000
```

### 5. 前端构建（可选）

```bash
cd frontEnd
# 开发模式（监听变化）
npm run tailwind:watch

# 生产构建
npm run tailwind:build
```

## 登录信息

- **地址**: http://localhost:8000/admin
- **用户名**: admin
- **密码**: admin123

## 文档

详细文档请查看 [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)

## 许可证

MIT License
