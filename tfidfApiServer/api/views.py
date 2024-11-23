from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from tfidf import tf_idf
from .serializers import ListSerializer, BlogTitleSerializer


@api_view(['GET'])
def blog_list(request):
    query = request.GET.get('query', "tfidf/query4.txt")
    k = request.GET.get('k', 1)
    data = tf_idf.search(query, k)[0]
    serializer = ListSerializer(data={'data': data})
    if serializer.is_valid():
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def blog_post(request):
    serializer = BlogTitleSerializer(data=request.data)
    if serializer.is_valid():
        blog = serializer.validated_data.get('data')
        tf_idf.add(blog)
        return Response("Added successfully", status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)