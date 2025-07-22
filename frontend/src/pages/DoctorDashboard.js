import { useEffect, useState } from 'react';
import API from '../api';
import Header from '../components/Header';
import DoctorSidebar from '../components/DoctorSidebar';

export default function DoctorDashboard() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        API.get('appointments/')
            .then(res => setAppointments(res.data))
            .catch(err => console.error("Failed to load appointments", err));
    }, []);

    return (

        <div>
            <Header />
            <DoctorSidebar />
            <div className="p-4 sm:ml-64">
                <h1 className="text-2xl font-bold mb-4">My Doctor Schedule</h1>
                {appointments.length === 0 ? (
                    <p>No appointments scheduled.</p>
                ) : (
                    <ul>
                        {appointments.map(appt => (
                            <li key={appt.id} className="mb-2">
                                {appt.date} at {appt.time} - Patient: <strong>{appt.patient_name}</strong>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>


    );
}

