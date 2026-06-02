from collections import OrderedDict
from datetime import timedelta
from os import environ
from pathlib import Path

from django.core.management.utils import get_random_secret_key
from django.utils.translation import gettext_lazy as _

from unfold.contrib.constance.settings import UNFOLD_CONSTANCE_ADDITIONAL_FIELDS

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = environ.get("SECRET_KEY", get_random_secret_key())

DEBUG = environ.get("DEBUG", "true").lower() in ("true", "1", "yes")

ALLOWED_HOSTS = environ.get("ALLOWED_HOSTS", "localhost,127.0.0.1,0.0.0.0,testserver").split(",")

AUTH_USER_MODEL = "example.User"

USE_TZ = False

INSTALLED_APPS = [
    "unfold",
    "unfold.contrib.filters",
    "unfold.contrib.forms",
    "unfold.contrib.inlines",
    "unfold.contrib.import_export",
    "unfold.contrib.guardian",
    "unfold.contrib.simple_history",
    "unfold.contrib.location_field",
    "unfold.contrib.constance",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "example",
    "constance",
    "import_export",
    "location_field",
    "crispy_forms",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "example.core.middleware.RequestLoggingMiddleware",
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

CORS_ALLOW_CREDENTIALS = True

REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "example.core.pagination.StandardPagination",
    "PAGE_SIZE": 10,
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "100/hour",
        "user": "1000/hour",
    },
    "EXCEPTION_HANDLER": "example.core.exceptions.custom_exception_handler",
    "DEFAULT_FILTER_BACKENDS": [
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=2),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

ROOT_URLCONF = "example.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-snowflake",
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "WARNING",
    },
}

STATIC_URL = "static/"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

CRISPY_TEMPLATE_PACK = "unfold_crispy"

CRISPY_ALLOWED_TEMPLATE_PACKS = ["unfold_crispy"]

CONSTANCE_BACKEND = "constance.backends.database.DatabaseBackend"

CONSTANCE_ADDITIONAL_FIELDS = {
    **UNFOLD_CONSTANCE_ADDITIONAL_FIELDS,
    "choice_field": [
        "django.forms.fields.ChoiceField",
        {
            "widget": "unfold.widgets.UnfoldAdminSelectWidget",
            "choices": (
                ("light-blue", "Light blue"),
                ("dark-blue", "Dark blue"),
            ),
        },
    ],
}

CONSTANCE_CONFIG = {
    "SITE_NAME": ("My Title", _("Website title")),
    "SITE_DESCRIPTION": ("", _("Website description")),
    "THEME": ("light-blue", _("Website theme"), "choice_field"),
    "IN_CONSTRUCTION": (False, _("Website in construction")),
    "SITE_URL": ("", _("Website URL")),
    "SITE_LOGO": ("", _("Website logo"), "image_field"),
    "SITE_FAVICON": ("", _("Website favicon"), "file_field"),
    "SITE_BACKGROUND_IMAGE": ("", _("Website background image"), "image_field"),
    "SITE_BACKGROUND_COLOR": ("#FFFFFF", _("Website background color")),
    "SITE_FONT_SIZE": (16, _("Base font size in pixels")),
    "SITE_ANALYTICS_ID": ("", _("Google Analytics ID")),
    "SITE_MAINTENANCE_MODE": (False, _("Enable maintenance mode")),
    "SITE_MAINTENANCE_MESSAGE": ("", _("Maintenance mode message")),
    "SITE_SOCIAL_LINKS": ("", _("Social media links")),
    "SITE_FOOTER_TEXT": ("", _("Footer text")),
    "SITE_META_KEYWORDS": ("", _("Meta keywords")),
    "SITE_CACHE_TTL": (3600, _("Cache TTL in seconds")),
    "SITE_DATE_FORMAT": ("%Y-%m-%d", _("Date format")),
    "SITE_TIME_ZONE": ("UTC", _("Time zone")),
}

CONSTANCE_CONFIG_FIELDSETS = OrderedDict(
    {
        "General Settings": {
            "fields": (
                "SITE_NAME",
                "SITE_DESCRIPTION",
                "SITE_URL",
            ),
        },
        "Theme & Design": {
            "fields": (
                "THEME",
                "SITE_FONT_SIZE",
                "SITE_BACKGROUND_COLOR",
                "SITE_BACKGROUND_IMAGE",
            ),
        },
        "Assets": {
            "fields": (
                "SITE_LOGO",
                "SITE_FAVICON",
            ),
        },
        "Content": {
            "fields": (
                "SITE_FOOTER_TEXT",
                "SITE_META_KEYWORDS",
                "SITE_SOCIAL_LINKS",
            ),
        },
        "System": {
            "fields": (
                "IN_CONSTRUCTION",
                "SITE_MAINTENANCE_MODE",
                "SITE_MAINTENANCE_MESSAGE",
                "SITE_CACHE_TTL",
                "SITE_DATE_FORMAT",
                "SITE_TIME_ZONE",
                "SITE_ANALYTICS_ID",
            ),
        },
    }
)

UNFOLD = {
    "TABS": "example.utils.tabs_callback",
}
