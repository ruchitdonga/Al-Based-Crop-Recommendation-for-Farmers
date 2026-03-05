from django.urls import path
from .views import RecommendView, ChatView, ModelInfoView

urlpatterns = [
    path('recommend/', RecommendView.as_view()),
    path('chat/', ChatView.as_view()),
    path('model-info/', ModelInfoView.as_view()),
]
