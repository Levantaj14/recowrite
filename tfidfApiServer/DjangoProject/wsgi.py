"""
WSGI config for DjangoProject project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

from tfidf import tf_idf_new

tf_idf_new.setup()

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "DjangoProject.settings")

application = get_wsgi_application()
