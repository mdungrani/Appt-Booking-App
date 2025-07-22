from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import AppointmentViewSet, DoctorCreateView, DoctorDeleteView, PatientListView, ProfileView, RegisterPatientView, DoctorEditView, DoctorDetailView

router = DefaultRouter()
router.register(r'appointments', AppointmentViewSet, basename='appointment')

urlpatterns = [
    # path('', include(router.urls)),
    path('register/', views.UserRegistrationView.as_view(), name='register'),
    path('register/patient/', RegisterPatientView.as_view(), name='register-patient'),
    path('doctors/', views.DoctorListView.as_view(), name='doctors'),
    path('doctors/add/', DoctorCreateView.as_view(), name='add-doctor-api'),
    path('doctors/<int:pk>/edit/', DoctorEditView.as_view(), name='edit-doctor'),
    path('doctors/<int:pk>/', DoctorDetailView.as_view(), name='doctor-detail'),
    path('appointments/', views.AppointmentView.as_view(), name='appointments'),
    path('appointments/available/', views.AvailableSlotsView.as_view(), name='available-slots'),
    path('profile/', ProfileView.as_view(), name='user-profile'),
    path('patients/', PatientListView.as_view(), name='patients'),
    path('doctors/<int:pk>/', DoctorDeleteView.as_view(), name='delete-doctor')
]
