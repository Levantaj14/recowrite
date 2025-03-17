from django.apps import AppConfig


class BaseConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "base"

    def ready(self):
        from django.db.migrations.executor import MigrationExecutor
        MigrationExecutor.migrate = lambda *args, **kwargs: None
