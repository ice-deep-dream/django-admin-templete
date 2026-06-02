PERMISSION_NAME_MAP = {
    'add': '添加',
    'change': '修改',
    'delete': '删除',
    'view': '查看',
}

MODEL_NAME_MAP = {
    'user': '用户',
    'group': '角色',
    'permission': '权限',
    'tag': '标签',
    'category': '分类',
    'label': '标记',
    'project': '项目',
    'task': '任务',
    'post': '文章',
    'invoice': '发票',
    'profile': '个人资料',
    'menuitem': '菜单项',
    'rolemenu': '角色菜单',
    'contenttype': '内容类型',
    'session': '会话',
    'logentry': '日志',
    'value': '配置项',
}

APP_NAME_MAP = {
    'auth': '认证',
    'example': '业务',
    'admin': '管理',
    'contenttypes': '内容类型',
    'sessions': '会话',
    'constance': '系统配置',
    'unfold_constance': '系统配置',
}


def get_permission_display_name(codename: str, name: str) -> str:
    action_name = None
    model_name = None

    for key in ['add_', 'change_', 'delete_', 'view_']:
        if codename.startswith(key):
            action_name = PERMISSION_NAME_MAP.get(key[:-1], key[:-1])
            model_codename = codename[len(key):]
            model_name = MODEL_NAME_MAP.get(model_codename, model_codename)
            break

    if action_name and model_name:
        return f'{action_name}{model_name}'

    return name


def get_app_display_name(app_label: str) -> str:
    return APP_NAME_MAP.get(app_label, app_label)
