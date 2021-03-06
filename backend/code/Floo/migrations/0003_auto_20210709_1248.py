# Generated by Django 3.2.4 on 2021-07-09 07:18

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('Floo', '0002_auto_20210709_1234'),
    ]

    operations = [
        migrations.AddField(
            model_name='topic',
            name='creator',
            field=models.ForeignKey(default=2, on_delete=django.db.models.deletion.CASCADE, related_name='topics', to='Floo.user'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='topic',
            name='publish_time',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
