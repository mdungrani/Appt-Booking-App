import DoctorForm from '../components/DoctorForm';

export default function DoctorProfilePage() {
  const user = JSON.parse(localStorage.getItem('user'));
  const doctorId = user?.id; // or profile?.doctor.id based on your backend

  return (
    <DoctorForm doctorId={doctorId} mode="profile" onSuccess={() => alert("Profile updated successfully")} />
  );
}
