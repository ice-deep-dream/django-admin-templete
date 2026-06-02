from rest_framework import serializers


class BaseModelSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True, required=False)
    updated_at = serializers.DateTimeField(read_only=True, required=False)

    class Meta:
        model = None
        fields = '__all__'
        read_only_fields = ['id']


class BulkActionSerializer(serializers.Serializer):
    ids = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=False,
    )


class BulkDeleteSerializer(BulkActionSerializer):
    pass
