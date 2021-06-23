from django.http import HttpResponse


def landing_view(request):
    return HttpResponse("You have reached Floo API")
