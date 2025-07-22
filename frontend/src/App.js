import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PatientDashboard from './pages/PatientDashboard';  // Patient dashboard (appointment list & form)
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PatientBookAppointment from './pages/PatientBookAppointment';
import BookedAppointments from './pages/BookedAppointments';
import PatientProfile from './pages/PatientProfile';
import DoctorsList from './pages/DoctorsList';
import PatientList from './pages/PatientsList';
import AddNewDoctor from './pages/AddNewDoctor';
import AllAppointments from './pages/AllAppointments';
import EditDoctor from './pages/EditDoctor';
import DoctorView from './pages/DoctorView';
import PatientView from './pages/PatientView';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/book-appointment" element={<PatientBookAppointment />} />
        <Route path="/my-appointments" element={<BookedAppointments />} />
        <Route path="/profile" element={<PatientProfile />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/all-appointments" element={<AllAppointments />} />
        <Route path="/doctors" element={<DoctorsList />} />
        <Route path="/doctors/add-new" element={<AddNewDoctor />} />
        <Route path="/doctor/edit/:doctorId" element={<EditDoctor />} />
        <Route path="/doctors/view/:doctorId" element={<DoctorView />} />
        <Route path="/patients" element={<PatientList />} />
        <Route path="/patients/view/:patientId" element={<PatientView />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
