from django.urls import path

from api import views

urlpatterns = [
    path('list', views.blog_list, name='getData'),
    path('add', views.blog_post, name='postData'),
]