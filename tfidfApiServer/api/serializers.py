from rest_framework import serializers

class ListSerializer(serializers.Serializer):
    data = serializers.ListField(child=serializers.CharField())
    created_at = serializers.DateTimeField(read_only=True)

class BlogTitleSerializer(serializers.Serializer):
    data = serializers.CharField()
    created_at = serializers.DateTimeField(read_only=True)