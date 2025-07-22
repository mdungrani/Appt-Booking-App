import json
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import DoctorProfile, Appointment, PatientProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_superuser', 'is_staff']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    def create(self, validated_data):
        # Create a new user (patient) with encrypted password
        user = User.objects.create_user(username=validated_data['username'],
                                        email=validated_data.get('email'),
                                        password=validated_data['password'])
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


 

class AppointmentNestedSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.first_name', read_only=True)  # assuming `name` field in Patient
    patient_profile_image = serializers.ImageField(source='patient.profile_image', read_only=True)

    class Meta:
        model = Appointment
        fields = ['id', 'patient_name','patient_profile_image', 'date', 'time']


class DoctorSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='user.get_full_name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    appointments = AppointmentNestedSerializer(many=True, read_only=True)
    class Meta:
        model = DoctorProfile
        fields = [
            'id',
            'email',
            'username',
            'appointments',
            'doctor_name',
            'clinic_name',
            'clinic_address',
            'city',
            'state',
            'zipcode',
            'specialization',
            'gender',
            'phone',
            'working_start',
            'working_end',
            'profile_image',
            'qualification',
            'experience_years',
            'consultation_fee'
        ]

class AppointmentSerializer(serializers.ModelSerializer):
    doctor = serializers.PrimaryKeyRelatedField(queryset=DoctorProfile.objects.all())
    patient = serializers.PrimaryKeyRelatedField(queryset=PatientProfile.objects.all())
    doctor_name = serializers.CharField(source='doctor.user.get_full_name', read_only=True)
    patient_name = serializers.CharField(source='patient.first_name', read_only=True)
    class Meta:
        model = Appointment
        fields = ['id', 'doctor', 'doctor_name', 'patient', 'patient_name', 'date', 'time']
        read_only_fields = ['patient']  # patient will be set from the logged-in user

    def validate(self, attrs):
        """Custom validation to prevent booking outside working hours or double-booking."""
        doctor_profile = attrs['doctor']
        date = attrs['date']
        time = attrs['time']
        # Check doctor's working hours:
        start = doctor_profile.working_start
        end = doctor_profile.working_end
        if time < start or (time.hour + 2) > end.hour:  # simplistic check: slot must be within working hours
            raise serializers.ValidationError("Selected time is outside the doctor's working hours.")
        # Check for existing appointment at this slot
        conflict = Appointment.objects.filter(doctor=doctor_profile, date=date, time=time).exists()
        if conflict:
            raise serializers.ValidationError("This time slot is already booked for the selected doctor.")
        return attrs

    def create(self, validated_data):
        # Set the patient as the logged-in user making the request
        user = self.context['request'].user

        try:
            patient_profile = PatientProfile.objects.get(user=user)
        except PatientProfile.DoesNotExist:
            raise serializers.ValidationError("User is not a valid patient.")

        validated_data['patient'] = patient_profile
        appointment = Appointment.objects.create(**validated_data)
        return appointment


class DoctorCreateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = DoctorProfile
        fields = [
            'user',
            'clinic_name',
            'clinic_address',
            'city',
            'state',
            'zipcode',
            'specialization',
            'gender',
            'phone',
            'working_start',
            'working_end',
            'profile_image',
            'qualification',
            'experience_years',
            'consultation_fee'
        ]

    def create(self, validated_data):
        username = validated_data.pop('username')
        email = validated_data.pop('email')
        password = validated_data.pop('password')

        # Create User
        user = User.objects.create_user(username=username, email=email, password=password, is_staff=True)

        # Create Doctor Profile
        doctor = DoctorProfile.objects.create(user=user, **validated_data)
        return doctor
    
class PatientAppointmentNestedSerializer(serializers.ModelSerializer):
    doctor_profile_image = serializers.ImageField(source='doctor.profile_image', read_only=True)
    doctor_specialization = serializers.CharField(source='doctor.specialization', read_only=True)
    doctor_name = serializers.CharField(source='doctor.user.get_full_name', read_only=True)

    class Meta:
        model = Appointment
        fields = ['id','doctor_profile_image','doctor_name','doctor_specialization', 'date', 'time']


class PatientProfileSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    appointments = PatientAppointmentNestedSerializer(many=True, read_only=True)
    class Meta:
        model = PatientProfile
        fields = ['user', 'first_name', 'last_name', 'gender', 'dob', 'phone', 'profile_image', 'blood_group', 'chronic_conditions', 'allergies', 'current_medications', 'emergency_contact', 'appointments']

    def get_user(self, obj):
        return {
            'username': obj.user.username,
            'email': obj.user.email,
        }

    def create(self, validated_data):
        # user data was pre-parsed and passed into the context
        user_data = self.context['user_data']
        user = User.objects.create_user(**user_data)
        return PatientProfile.objects.create(user=user, **validated_data)
       