from rest_framework import permissions


class ValidMethods(permissions.BasePermission):
    """
    Permission class which allows only safe methods in requests

    Methods
    -------
    has_permission()
        Checks if the user has the permission to access the endpoint

    """

    def has_permission(self, request, view):
        """Check if the request can access the resource that is, the request method is a safe method

        Parameters
        ----------
        request : django.http.HttpRequest
            Request instance

        """
        return request.method in permissions.SAFE_METHODS
