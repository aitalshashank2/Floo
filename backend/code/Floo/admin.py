from django.contrib import admin

from Floo.models import *

admin.site.site_header = "Floo Administration"

# Register your models here.
admin.site.register(User)
admin.site.register(Meeting)
admin.site.register(Team)
