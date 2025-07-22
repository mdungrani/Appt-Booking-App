import { useEffect, useState } from 'react';
import API from '../api';
import Header from '../components/Header';
import AppointmentForm from '../components/AppointmentForm';

function PatientDashboard() {
 const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Load initial appointments
    API.get('appointments/')
      .then(res => setAppointments(res.data))
      .catch(err => console.error("Failed to fetch appointments", err));
  }, []);

  return (
    <div>
      <Header />
      <AppointmentForm appointments={appointments} setAppointments={setAppointments} />
    </div>
  );
}

export default PatientDashboard;
