# Django Admin Template

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?logo=python" />
  <img src="https://img.shields.io/badge/Django-5.x-092E20?logo=django" />
  <img src="https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js" />
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/License-MIT-blue" />
</p>

> A modern Django Admin project template built with Django Unfold and React

📖 **Documentation**: https://ice-deep-dream.github.io/django-admin-templete/

🌐 [English](README.en.md) | [中文](README.md)

---

## Features

| Feature | Description |
|:--------|:------------|
| Django Unfold | Modern Django Admin interface |
| REST API | Complete RESTful API support |
| Permission System | Role-based access control |
| React Frontend | Responsive frontend pages |
| Documentation Site | Online docs built with VitePress |

---

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/ice-deep-dream/django-admin-templete.git
cd django-admin-templete
```

### 2. Install Dependencies

```bash
# Install backend Python dependencies
cd backEnd
uv sync

# Install frontend Node.js dependencies
cd ../frontEnd
npm install
```

### 3. Database Migration

```bash
cd backEnd
uv run python manage.py migrate
```

### 4. Create Superuser

```bash
cd backEnd
uv run python manage.py createsuperuser
```

### 5. Start Services

```bash
# Start backend server
cd backEnd
uv run python manage.py runserver 0.0.0.0:8000

# Open another terminal, start frontend dev server
cd ../frontEnd
npm run dev
```

---

## Default Accounts

| Username | Password | Role |
|:---------|:---------|:-----|
| admin | admin123 | Super Admin |
| editor | editor123 | Editor |
| viewer | viewer123 | Read-only User |

---

## Access URLs

- **Django Admin**: http://localhost:8000/admin
- **React Frontend**: http://localhost:5173
- **Online Docs**: https://ice-deep-dream.github.io/django-admin-templete/

---

## Directory Structure

```
django-admin-templete/
├── backEnd/              # Backend Django project
│   ├── unfold/           # Unfold core package
│   ├── example/          # Example application
│   ├── tests/            # Test files
│   ├── manage.py         # Django management script
│   └── pyproject.toml    # Python project configuration
│
├── frontEnd/             # Frontend build directory
│   ├── src/              # Frontend source code
│   └── package.json      # Node.js dependency configuration
│
├── docs/                 # VitePress documentation site
│   ├── .vitepress/       # VitePress configuration
│   ├── guide/            # Guide documentation
│   ├── architecture/     # Architecture documentation
│   ├── features/         # Features documentation
│   └── package.json      # Documentation dependencies
│
├── .github/
│   └── workflows/        # GitHub Actions configuration
│
├── .gitignore
├── CHANGELOG.md
└── LICENSE.md
```

---

## Tech Stack

### Backend
- **Python 3.12+**
- **Django 5.x**
- **Django Unfold** - Modern Admin interface
- **uv** - Python package manager

### Frontend
- **Node.js 18+**
- **React 18.x**
- **Tailwind CSS** - Atomic CSS framework

### Documentation
- **VitePress** - Static site generator
- **GitHub Pages** - Documentation hosting

---

## Documentation

- 📖 [Online Docs](https://ice-deep-dream.github.io/django-admin-templete/)
- 📋 [Project Overview](./PROJECT_OVERVIEW.md)
- 📝 [Changelog](./CHANGELOG.md)

---

## License

MIT License

---

## Author

- **ice-deep-dream**
- **Email**: 1172624289@qq.com
- **Repository**: https://github.com/ice-deep-dream/django-admin-templete
