from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from tfidf import tf_idf
from utils import get_db_handle
from .serializers import ListSerializer, BlogTitleSerializer


@api_view(['GET'])
def blog_list(request):
    blog_id = request.GET.get('id', '')
    k = int(request.GET.get('k', 3))

    if blog_id.isnumeric():
        with get_db_handle() as connection:
            with connection.cursor() as mycursor:
                mycursor.execute("SELECT * FROM blogs WHERE id = %s", [blog_id])
                result = mycursor.fetchone()
        
        if result:
            data = tf_idf.search(result[2], k)
            serializer = ListSerializer(data={'data': data})
            if serializer.is_valid():
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response('{}', status=status.HTTP_200_OK)
    return Response('ID must be an integer greater than 0', status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def blog_post(request):
    serializer = BlogTitleSerializer(data=request.data)
    if serializer.is_valid():
        blog = serializer.validated_data.get('data')
        tf_idf.add(blog)
        return Response("Added successfully", status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
