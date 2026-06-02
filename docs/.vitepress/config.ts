import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Django Admin Template',
  description: '基于 Django Unfold 和 React 的现代化管理后台项目模板',
  base: '/django-admin-templete/',
  ignoreDeadLinks: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/getting-started' },
      { text: '架构', link: '/architecture/overview' },
      { text: '功能', link: '/features/admin' },
    ],
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '项目配置', link: '/guide/configuration' },
          { text: '开发规范', link: '/guide/development' },
        ],
      },
      {
        text: '架构设计',
        items: [
          { text: '架构概览', link: '/architecture/overview' },
          { text: '后端架构', link: '/architecture/backend' },
          { text: '前端架构', link: '/architecture/frontend' },
          { text: '数据模型', link: '/architecture/models' },
        ],
      },
      {
        text: '技术栈',
        items: [
          { text: '后端技术', link: '/stack/backend' },
          { text: '前端技术', link: '/stack/frontend' },
          { text: '第三方集成', link: '/stack/integrations' },
        ],
      },
      {
        text: '功能文档',
        items: [
          { text: '管理后台', link: '/features/admin' },
          { text: 'REST API', link: '/features/api' },
          { text: '权限系统', link: '/features/permissions' },
          { text: '前端页面', link: '/features/frontend-pages' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ice-deep-dream/django-admin-templete' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 ice-deep-dream',
    },
    search: {
      provider: 'local',
    },
  },
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],
})
