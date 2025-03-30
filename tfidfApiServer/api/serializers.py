from rest_framework import serializers


class ListSerializer(serializers.Serializer):
    data = serializers.ListField(child=serializers.IntegerField())
    created_at = serializers.DateTimeField(read_only=True)
