from django.db import models

class Blog(models.Model):
    id = models.BigAutoField(primary_key=True)
    banner = models.CharField(max_length=255, null=True, blank=True)
    content = models.TextField(null=True, blank=True)
    date = models.CharField(max_length=255, null=True, blank=True)
    description = models.CharField(max_length=255, null=True, blank=True)
    title = models.CharField(max_length=255, null=True, blank=True)
    user_id = models.BigIntegerField()

    class Meta:
        managed = False  # Prevents Django from modifying the table
        db_table = "blogs"  # Matches the existing table name

    def save(self, *args, **kwargs):
        raise NotImplementedError("This table is read-only.")

    def delete(self, *args, **kwargs):
        raise NotImplementedError("This table is read-only.")
