# Generated by Django 3.2.4 on 2021-07-07 10:31

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Floo', '0007_user_uuid'),
    ]

    operations = [
        migrations.AddField(
            model_name='meeting',
            name='current_attendees',
            field=models.ManyToManyField(blank=True, related_name='ongoing_meetings', to=settings.AUTH_USER_MODEL),
        ),
    ]