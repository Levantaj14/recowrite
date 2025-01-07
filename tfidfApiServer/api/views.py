from bson import ObjectId
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from tfidf import tf_idf
from utils import get_db_handle
from .serializers import ListSerializer, BlogTitleSerializer

blogs = get_db_handle()['blogs']


@api_view(['GET'])
def blog_list(request):
    blog_id = request.GET.get('id', '')
    k = int(request.GET.get('k', 3))

    result = blogs.find_one({'_id': ObjectId(blog_id)})
    if result:
        data = tf_idf.search(result['content'], k)
        serializer = ListSerializer(data={'data': data})
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response('', status=status.HTTP_200_OK)


@api_view(['POST'])
def blog_post(request):
    serializer = BlogTitleSerializer(data=request.data)
    if serializer.is_valid():
        blog = serializer.validated_data.get('data')
        tf_idf.add(blog)
        return Response("Added successfully", status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
