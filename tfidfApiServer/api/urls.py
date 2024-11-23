from django.urls import path

from api import views

urlpatterns = [
    path('blogs/', views.blog_list, name='getData'),
    path('blogs/post/', views.blog_post, name='postData'),
]