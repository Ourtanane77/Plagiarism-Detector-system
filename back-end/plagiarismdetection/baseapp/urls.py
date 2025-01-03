from django.urls import path
from .views import PlagiarismDetectionAPIView

urlpatterns = [
    path('plagiarism-detection/', PlagiarismDetectionAPIView.as_view(), name='plagiarism-detection'),
    # path('upload/', FileUploadView.as_view(), name='file-upload'),
]
