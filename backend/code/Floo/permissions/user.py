from rest_framework import permissions

from Floo.models import User


class UserIsInSafeMethods(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.method in permissions.SAFE_METHODS
