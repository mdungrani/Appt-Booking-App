# Generated by Django 5.2.3 on 2025-06-29 20:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appointments', '0002_rename_user_appointment_patient_appointment_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='doctorprofile',
            name='profile_image',
            field=models.ImageField(blank=True, null=True, upload_to='doctor_images/'),
        ),
    ]
