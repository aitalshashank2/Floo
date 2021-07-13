from rest_framework import permissions

from Floo.models import User


class UserIsInSafeMethods(permissions.BasePermission):
    """
    Permission class which allows only safe methods in requests for individual objects

    Methods
    -------
    has_object_permission()
        Check if the request has the permission to access the object
    """

    def has_object_permission(self, request, view, obj):
        """Checks if the request method is in safe methods

        Parameters
        ----------
        request : django.http.HttpRequest
            Request instance
        """
        return request.method in permissions.SAFE_METHODS
