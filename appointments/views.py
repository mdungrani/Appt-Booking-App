import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.utils import timezone
from .models import DoctorProfile, Appointment, PatientProfile
from .serializers import UserSerializer, DoctorSerializer, AppointmentSerializer, DoctorCreateSerializer, UserProfileSerializer, PatientProfileSerializer
from rest_framework import viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import DestroyAPIView
from django.shortcuts import get_object_or_404

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'email': user.email,
            'is_superuser': user.is_superuser,
            'is_staff': user.is_staff,
            'first_name': user.first_name,
            'last_name': user.last_name
        })
    
class UserRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]  # anyone can register

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # create the new user
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterPatientView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data.copy()
        
        # Safely parse the `user` field from JSON string
        try:
            user_data = json.loads(data.get('user', '{}'))
        except json.JSONDecodeError:
            return Response({'user': ['Invalid JSON format']}, status=status.HTTP_400_BAD_REQUEST)

        # Remove user from main data (it's already parsed)
        data.pop('user', None)

        serializer = PatientProfileSerializer(data=data, context={'user_data': user_data})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Patient registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DoctorListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        doctors = DoctorProfile.objects.all()
        data = DoctorSerializer(doctors, many=True).data
        return Response(data)

class AppointmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        # If the user has an associated DoctorProfile, they are a doctor
        try:
            doctor_profile = user.doctorprofile
        except DoctorProfile.DoesNotExist:
            doctor_profile = None

        if user.is_staff:
            # Admin user: return all appointments (or could filter upcoming only)
            qs = Appointment.objects.all()
        elif doctor_profile:
            # Doctor: only their appointments
            qs = Appointment.objects.filter(doctor=doctor_profile)
        else:
            # Patient: only appointments where they are the patient
            qs = Appointment.objects.filter(patient__user=user)
        qs = qs.order_by('date', 'time')
        data = AppointmentSerializer(qs, many=True).data
        return Response(data)

    def post(self, request):
        # Booking a new appointment (patient action)
        serializer = AppointmentSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            appointment = serializer.save()  # save will create the appointment
            # Send confirmation email to patient
            patient = request.user
            doctor_profile = appointment.doctor
            doctor_name = doctor_profile.user.get_full_name()
            appt_date = appointment.date.strftime("%Y-%m-%d")
            appt_time = appointment.time.strftime("%I:%M %p")
            location = doctor_profile.clinic_address or "Clinic"
            subject = "Appointment Confirmation"
            message = (f"Dear {patient.first_name},\n\nYour appointment is confirmed:\n"
                       f"Doctor: Dr. {doctor_name}\nDate: {appt_date}\nTime: {appt_time}\nLocation: {location}\n\n"
                       "Thank you!")
            # Use Django's send_mail function to send the email
            # from django.core.mail import send_mail
            # send_mail(subject, message, 
            #           from_email=None,  # uses DEFAULT_FROM_EMAIL if set, or EMAIL_HOST_USER
            #           recipient_list=[patient.email],
            #           fail_silently=False)
            # return Response({"message": "Appointment booked successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

class AvailableSlotsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Returns available time slots for a given doctor and date.
        Expects query parameters: ?doctor=<id>&date=<YYYY-MM-DD>
        """
        doctor_id = request.query_params.get('doctor')
        date_str = request.query_params.get('date')
        if not doctor_id or not date_str:
            return Response({"detail": "Doctor and date are required"}, status=status.HTTP_400_BAD_REQUEST)
        # Parse inputs
        try:
            doctor = DoctorProfile.objects.get(id=int(doctor_id))
        except DoctorProfile.DoesNotExist:
            return Response({"detail": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)
        try:
            date = timezone.datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response({"detail": "Invalid date format, use YYYY-MM-DD"}, status=status.HTTP_400_BAD_REQUEST)

        # Get all appointments for this doctor on that date
        booked = Appointment.objects.filter(doctor=doctor, date=date).values_list('time', flat=True)
        booked_times = set(booked)
        # Generate 2-hour interval slots between working_start and working_end
        start = doctor.working_start
        end = doctor.working_end
        available_slots = []
        current = timezone.datetime.combine(date, start)
        end_datetime = timezone.datetime.combine(date, end)
        slot_delta = timezone.timedelta(hours=2)
        # Loop from start to end, stepping 2 hours
        while current + slot_delta <= end_datetime:
            slot_time = current.time()
            if slot_time not in booked_times:
                available_slots.append(slot_time.strftime("%H:%M"))
            current += slot_delta
        return Response({"doctor": doctor.id, "date": date_str, "available_slots": available_slots})

class DoctorCreateView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        data = request.data
        files = request.FILES

        # Extract name fields
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')

        user = User.objects.create_user(
            username=data['username'],
            email=data.get('email'),
            password=data['password'],
            first_name=first_name,
            last_name=last_name,
            is_staff=True  # Optional if you want doctors to have staff access
        )

        DoctorProfile.objects.create(
            user=user,
            clinic_name=data.get('clinic_name', ''),
            clinic_address=data.get('clinic_address', ''),
            city = data.get('city', ''),
            state = data.get('state', ''),
            zipcode = data.get('zipcode', ''),
            specialization = data.get('specialization', ''),
            qualification = data.get('qualification', ''),
            experience_years = data.get('experience_years', ''),
            consultation_fee = data.get('consultation_fee', ''),
            working_start=data['working_start'],
            working_end=data['working_end'],
            gender = data.get('gender', ''),
            phone = data.get('phone', ''),
            profile_image=files.get('profile_image')
        )

        return Response({"message": "Doctor created successfully"}, status=201)

class DoctorDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request, pk):
        doctor = get_object_or_404(DoctorProfile, pk=pk)
        serializer = DoctorSerializer(doctor)
        return Response(serializer.data)

    def put(self, request, pk):
        doctor = get_object_or_404(DoctorProfile, pk=pk)
        serializer = DoctorSerializer(doctor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        doctor = get_object_or_404(DoctorProfile, pk=pk)
        doctor.delete()
        return Response({"message": "Doctor deleted"}, status=204)
    
class DoctorEditView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def put(self, request, pk):
        try:
            doctor = DoctorProfile.objects.select_related('user').get(pk=pk)
        except DoctorProfile.DoesNotExist:
            return Response({'error': 'Doctor not found'}, status=404)

        data = request.data
        files = request.FILES

        user = doctor.user
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.email = data.get('email', user.email)
        
        if data.get('password'):
            user.set_password(data['password'])
            
        user.save()

        # Update profile
        doctor.clinic_name = data.get('clinic_name', doctor.clinic_name)
        doctor.clinic_address = data.get('clinic_address', doctor.clinic_address)
        doctor.city = data.get('city', doctor.city)
        doctor.state = data.get('state', doctor.state)
        doctor.zipcode = data.get('zipcode', doctor.zipcode)
        doctor.specialization = data.get('specialization', doctor.specialization)
        doctor.qualification = data.get('qualification', doctor.qualification)
        doctor.experience_years = data.get('experience_years', doctor.experience_years)
        doctor.consultation_fee = data.get('consultation_fee', doctor.consultation_fee)
        doctor.working_start = data.get('working_start', doctor.working_start)
        doctor.working_end = data.get('working_end', doctor.working_end)
        doctor.gender = data.get('gender', doctor.gender)
        doctor.phone = data.get('phone', doctor.phone)

        if 'profile_image' in files:
            doctor.profile_image = files['profile_image']

        doctor.save()

        return Response({'message': 'Doctor updated successfully'})



class DoctorDeleteView(DestroyAPIView):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAdminUser]
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['id'] = self.user.id
        data['is_staff'] = self.user.is_staff
        data['is_superuser'] = self.user.is_superuser
        data['username'] = self.user.username
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class PatientListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        patients = PatientProfile.objects.select_related('user').all()
        serializer = PatientProfileSerializer(patients, many=True)
        return Response(serializer.data)