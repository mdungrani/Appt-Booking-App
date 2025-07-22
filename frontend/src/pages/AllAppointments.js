import { useEffect, useState } from 'react';
import API from '../api';
import Header from '../components/Header';
import AdminSidebar from '../components/AdminSidebar';

function AllAppointments() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        API.get('appointments/')
            .then(res => setAppointments(res.data))
            .catch(err => console.error('Error fetching appointments', err));
    }, []);

    return (

        <div>
            <Header />
            <AdminSidebar />

            <div className='sm:ml-64 bg-gray-50 p-5'>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                <tr>
                                    <th className="p-4">#</th>
                                    <th className="p-6">Patient Name</th>
                                    <th className="p-6">Appointment Date</th>
                                    <th className="p-6">Appointment Time</th>
                                    <th className="p-6">Doctor Assigned</th>
                                    <th className="p-6">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appointment, index) => (
                                    <tr key={appointment.id} className="even:bg-gray-100 odd:bg-white border-b hover:bg-gray-100">
                                        <td className="p-4">{index + 1}</td>
                                       
                                        <td className="px-6 py-4">{appointment.patient_name}</td>
                                        <td className="px-6 py-4">{appointment.date}</td>
                                        <td className="px-6 py-4">
                                            {appointment.time}
                                        </td>
                                        <td className="px-6 py-4">Dr. {appointment.doctor_name}</td>
                                        <td className="px-6 py-4">
                                              <button
                                                className="font-medium text-red-600 hover:underline"
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            
        </div>

    );
}

export default AllAppointments;
