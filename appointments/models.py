# appointments/models.py
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import datetime

GENDER_CHOICES = [
    ('M', 'Male'),
    ('F', 'Female'),
    ('O', 'Other'),
]

class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    clinic_name = models.CharField(max_length=100, blank=True)
    clinic_address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    zipcode = models.CharField(max_length=10, blank=True)

    specialization = models.CharField(max_length=100, default='General')
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    phone = models.CharField(max_length=15, blank=True)

    working_start = models.TimeField() 
    working_end = models.TimeField()    
    profile_image = models.ImageField(upload_to='doctor_images/', null=True, blank=True)

    qualification = models.CharField(max_length=255, blank=True)  
    experience_years = models.PositiveIntegerField(default=0)      
    consultation_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)  

    def __str__(self):
        return f"Dr. {self.user.get_full_name()}" 


class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=20, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    dob = models.DateField(null=True, blank=True)
    profile_image = models.ImageField(upload_to='patient_images/', blank=True, null=True)

    blood_group = models.CharField(max_length=5, blank=True, null=True)
    chronic_conditions = models.TextField(blank=True, null=True)
    allergies = models.TextField(blank=True, null=True)
    current_medications = models.TextField(blank=True, null=True)
    emergency_contact = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.user.get_full_name()
    


class Appointment(models.Model):
    doctor = models.ForeignKey(DoctorProfile,related_name='appointments', on_delete=models.CASCADE, null=True, blank=True)
    patient = models.ForeignKey(PatientProfile,related_name='appointments', on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    time = models.TimeField(default=datetime.time(9, 0)) # start time of the appointment slot

    class Meta:
        unique_together = [('doctor', 'date', 'time')]  # no double-booking same doc/time

    def __str__(self):
        return f"{self.date} {self.time} - Dr.{self.doctor.user.last_name} with {self.patient.username}"