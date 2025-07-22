import { useEffect, useState } from 'react';
import API from '../api';
import Header from '../components/Header';

function BookedAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    API.get('appointments/')
      .then(res => setAppointments(res.data))
      .catch(err => console.error('Error fetching appointments', err));
  }, []);

  return (
    <div>
      <Header />
      <h2>My Appointments</h2>
      <ul>
        {appointments.map(app => (
          <li key={app.id}>
            {app.date} at {app.time} with Dr. {app.doctor_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookedAppointments;
