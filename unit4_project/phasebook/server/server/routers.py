from rest_framework_nested import routers
from django.urls import path, include
from main.views import PostViewSet, CommentViewSet, ReplyViewSet

## generates:
# /post/
# /post/{pk}/
router = routers.SimpleRouter()
router.register(r'post', PostViewSet, basename='post')

## generates:
# /post/{post_pk}/comment/
# /post/{post_pk}/comment/{comment_pk}/
post_router = routers.NestedSimpleRouter(router, r'post', lookup='post')
post_router.register(r'comment', CommentViewSet, basename='comment')

# ## generates:
# # /post/{post_pk}/comment/{comment_pk}/reply/
# # /post/{post_pk}/comment/{comment_pk}/reply/{pk}/
comment_router = routers.NestedSimpleRouter(post_router, r'comment', lookup='comment')
comment_router.register(r'reply', ReplyViewSet, basename='reply')

urlpatterns = [
    path(r'', include(router.urls)),
    path(r'', include(post_router.urls)),
    path(r'', include(comment_router.urls)),
]
