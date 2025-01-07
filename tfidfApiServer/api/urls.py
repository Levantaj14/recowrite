from django.urls import path

from api import views

urlpatterns = [
    path('recommendation', views.blog_list, name='getData'),
    path('recommendation', views.blog_post, name='postData'),
]