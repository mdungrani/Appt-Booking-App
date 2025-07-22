from django.contrib import admin
from .models import DoctorProfile, Appointment

admin.site.register(DoctorProfile)
admin.site.register(Appointment)
