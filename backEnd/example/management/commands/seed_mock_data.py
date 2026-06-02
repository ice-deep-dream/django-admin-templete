from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from example.models import User, Tag, Category, Label, Project, Task, Post, Invoice, Profile


class Command(BaseCommand):
    help = 'Initialize mock data: admin, users, roles and business data'

    def handle(self, *args, **options):
        self.stdout.write('Initializing mock data...')

        self._create_admin()
        self._create_groups()
        self._create_users()
        self._create_tags()
        self._create_categories()
        self._create_projects()
        self._create_posts()

        self.stdout.write(self.style.SUCCESS('Mock data initialization complete!'))

    def _create_admin(self):
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='admin123',
                first_name='Admin',
                last_name='User',
            )
            self.stdout.write('Created superuser: admin / admin123')
        else:
            self.stdout.write('Superuser already exists')

    def _create_groups(self):
        groups_data = [
            {
                'name': 'Admin',
                'permissions': ['add', 'change', 'delete', 'view'],
                'models': ['user', 'tag', 'category', 'label', 'project', 'task', 'post', 'invoice', 'profile'],
            },
            {
                'name': 'Editor',
                'permissions': ['add', 'change', 'view'],
                'models': ['tag', 'category', 'label', 'project', 'task', 'post'],
            },
            {
                'name': 'Viewer',
                'permissions': ['view'],
                'models': ['user', 'tag', 'category', 'label', 'project', 'task', 'post', 'invoice', 'profile'],
            },
        ]

        for group_data in groups_data:
            group, created = Group.objects.get_or_create(name=group_data['name'])
            perms = []
            for model_name in group_data['models']:
                for perm_type in group_data['permissions']:
                    try:
                        ct = ContentType.objects.get_for_model(User) if model_name == 'user' else \
                             ContentType.objects.get(app_label='example', model=model_name)
                        codename = f'{perm_type}_{model_name}'
                        perm = Permission.objects.get(codename=codename, content_type=ct)
                        perms.append(perm)
                    except (ContentType.DoesNotExist, Permission.DoesNotExist):
                        pass
            group.permissions.set(perms)
            if created:
                self.stdout.write(f'Created role: {group_data["name"]}')

    def _create_users(self):
        users_data = [
            {
                'username': 'editor',
                'email': 'editor@example.com',
                'password': 'editor123',
                'first_name': 'Editor',
                'last_name': 'User',
                'is_staff': True,
                'groups': ['Editor'],
            },
            {
                'username': 'viewer',
                'email': 'viewer@example.com',
                'password': 'viewer123',
                'first_name': 'View',
                'last_name': 'User',
                'is_staff': True,
                'groups': ['Viewer'],
            },
            {
                'username': 'zhangsan',
                'email': 'zhangsan@example.com',
                'password': 'user123',
                'first_name': 'San',
                'last_name': 'Zhang',
                'is_staff': False,
                'groups': [],
            },
            {
                'username': 'lisi',
                'email': 'lisi@example.com',
                'password': 'user123',
                'first_name': 'Si',
                'last_name': 'Li',
                'is_staff': False,
                'groups': [],
            },
        ]

        for user_data in users_data:
            if not User.objects.filter(username=user_data['username']).exists():
                user = User.objects.create_user(
                    username=user_data['username'],
                    email=user_data['email'],
                    password=user_data['password'],
                    first_name=user_data['first_name'],
                    last_name=user_data['last_name'],
                    is_staff=user_data['is_staff'],
                )
                for group_name in user_data['groups']:
                    group = Group.objects.get(name=group_name)
                    user.groups.add(group)
                self.stdout.write(f'Created user: {user_data["username"]} / {user_data["password"]}')
            else:
                self.stdout.write(f'User {user_data["username"]} already exists')

    def _create_tags(self):
        tags = ['Python', 'Django', 'React', 'TypeScript', 'Vue', 'JavaScript', 'CSS', 'HTML']
        for tag_name in tags:
            Tag.objects.get_or_create(name=tag_name)
        self.stdout.write(f'Created {len(tags)} tags')

    def _create_categories(self):
        categories = ['Tech', 'Tutorial', 'News', 'Product', 'Design', 'Operations']
        for cat_name in categories:
            Category.objects.get_or_create(name=cat_name)
        self.stdout.write(f'Created {len(categories)} categories')

    def _create_projects(self):
        projects = [
            ('Admin System', True),
            ('Frontend Refactor', True),
            ('Data Analytics Platform', True),
            ('Mobile App', False),
            ('API Gateway Service', True),
        ]
        for name, is_active in projects:
            Project.objects.get_or_create(name=name, defaults={'is_active': is_active})
        self.stdout.write(f'Created {len(projects)} projects')

    def _create_posts(self):
        admin = User.objects.filter(is_superuser=True).first()
        if not admin:
            return

        posts = [
            'Django REST Framework Best Practices',
            'React Hooks Guide',
            'TypeScript Advanced Type Tips',
            'Frontend Performance Optimization',
            'Microservice Architecture Design',
        ]
        for title in posts:
            Post.objects.get_or_create(title=title, defaults={'user': admin, 'weight': 0})
        self.stdout.write(f'Created {len(posts)} posts')
