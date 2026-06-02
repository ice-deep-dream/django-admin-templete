"""
初始化菜单数据
运行方式：python manage.py seed_menu
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group
from example.models import MenuItem, RoleMenu


class Command(BaseCommand):
    help = '初始化菜单数据和角色-菜单关联'

    def handle(self, *args, **options):
        self.stdout.write('开始初始化菜单数据...')

        MenuItem.objects.all().delete()
        RoleMenu.objects.all().delete()

        dashboard = MenuItem.objects.create(
            label='仪表盘',
            icon='DashboardIcon',
            path='/',
            order=1,
            is_active=True,
        )

        user_mgmt = MenuItem.objects.create(
            label='用户管理',
            icon='PeopleIcon',
            order=2,
            is_active=True,
        )
        MenuItem.objects.create(
            label='用户列表',
            icon='PeopleIcon',
            path='/users',
            parent=user_mgmt,
            order=1,
            is_active=True,
        )

        project_mgmt = MenuItem.objects.create(
            label='项目任务',
            icon='FolderIcon',
            order=3,
            is_active=True,
        )
        MenuItem.objects.create(
            label='项目管理',
            icon='FolderIcon',
            path='/projects',
            parent=project_mgmt,
            order=1,
            is_active=True,
        )
        MenuItem.objects.create(
            label='任务管理',
            icon='FolderIcon',
            path='/tasks',
            parent=project_mgmt,
            order=2,
            is_active=True,
        )

        MenuItem.objects.create(
            label='分类管理',
            icon='TagIcon',
            path='/taxonomy',
            order=4,
            is_active=True,
        )

        MenuItem.objects.create(
            label='内容管理',
            icon='PostIcon',
            path='/content',
            order=5,
            is_active=True,
        )

        MenuItem.objects.create(
            label='角色权限',
            icon='AdminIcon',
            path='/roles',
            order=6,
            is_active=True,
        )

        template = MenuItem.objects.create(
            label='布局',
            icon='PostIcon',
            order=7,
            is_active=True,
            group_label='布局',
        )
        MenuItem.objects.create(
            label='纯标题布局',
            icon='PostIcon',
            path='/template/simple',
            parent=template,
            order=1,
            is_active=True,
            group_label='布局',
        )
        MenuItem.objects.create(
            label='Tab切换布局',
            icon='PostIcon',
            path='/template/tab',
            parent=template,
            order=2,
            is_active=True,
            group_label='布局',
        )
        MenuItem.objects.create(
            label='标题+按钮布局',
            icon='PostIcon',
            path='/template/action',
            parent=template,
            order=3,
            is_active=True,
            group_label='布局',
        )
        MenuItem.objects.create(
            label='搜索+表格布局',
            icon='PostIcon',
            path='/template/search',
            parent=template,
            order=4,
            is_active=True,
            group_label='布局',
        )

        MenuItem.objects.create(
            label='系统设置',
            icon='SettingsIcon',
            path='/settings',
            order=8,
            is_active=True,
        )

        self.stdout.write(self.style.SUCCESS(f'创建了 {MenuItem.objects.count()} 个菜单项'))

        groups = Group.objects.all()
        if not groups.exists():
            self.stdout.write(self.style.WARNING('没有找到任何角色，跳过角色-菜单关联'))
            return

        for group in groups:
            for menu_item in MenuItem.objects.all():
                RoleMenu.objects.get_or_create(
                    group=group,
                    menu_item=menu_item,
                )

        self.stdout.write(self.style.SUCCESS(f'创建了 {RoleMenu.objects.count()} 个角色-菜单关联'))
        self.stdout.write(self.style.SUCCESS('菜单数据初始化完成！'))
