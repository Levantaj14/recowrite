from django.urls import path

from api import views

urlpatterns = [
    path('recommend', views.blog_list, name='getData'),
    path('add', views.blog_post, name='postData'),
    path('remove', views.blog_delete, name='deleteData'),
]
