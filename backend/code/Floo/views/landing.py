from django.http import HttpResponse


def landing_view(request):
    """Landing view which is served at the root URL of the backend

    Parameters
    ----------
    request : django.http.HttpRequest
        Request instance

    Returns
    -------
    django.http.HttpResponse
        Landing page data
    """
    return HttpResponse("You have reached Floo API")
