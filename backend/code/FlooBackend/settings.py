from os import stat_result
from pathlib import Path
import io
import yaml

# Import environment variables
with io.open('configuration/config.yml', 'r') as stream:
    CONFIG_VARS = yaml.safe_load(stream)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = CONFIG_VARS['SECRET_KEY']

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = CONFIG_VARS['DEBUG']

ALLOWED_HOSTS = CONFIG_VARS['ALLOWED_HOSTS']

SESSION_ENGINE = 'django.contrib.sessions.backends.signed_cookies'
CSRF_COOKIE_NAME = 'floo_csrftoken'
SESSION_COOKIE_NAME = 'floo_sessionid'

# CORS configuration
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = CONFIG_VARS['CORS_ALLOWED_ORIGINS']


# Application definition

INSTALLED_APPS = [
    'corsheaders',
    'channels',
    'Floo',
    'rest_framework',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'FlooBackend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'FlooBackend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': CONFIG_VARS['DATABASE']['NAME'],
        'USER': CONFIG_VARS['DATABASE']['USER'],
        'PASSWORD': CONFIG_VARS['DATABASE']['PASSWORD'],
        'HOST': CONFIG_VARS['DATABASE']['HOST'],
        'PORT': CONFIG_VARS['DATABASE']['PORT']
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Admin site configuration
ADMIN_SITE_URL = 'admin/'

# Auth User model
AUTH_USER_MODEL = 'Floo.User'

# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Kolkata'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_ROOT = CONFIG_VARS['STATIC_ROOT']
STATIC_URL = '/api_static/'

MEDIA_ROOT = CONFIG_VARS['MEDIA_ROOT']
MEDIA_URL = '/api_media/'

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ASGI Application configurations
ASGI_APPLICATION = 'FlooBackend.asgi.application'
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [
                (
                    CONFIG_VARS['CHANNEL_LAYER']['HOST'],
                    CONFIG_VARS['CHANNEL_LAYER']['PORT']
                )
            ],
        }
    }
}
