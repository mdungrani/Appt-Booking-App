import { useEffect, useState } from 'react';
import API from '../api';
import Header from '../components/Header';
import AdminSidebar from '../components/AdminSidebar';
import { useNavigate } from 'react-router-dom';

function PatientList() {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        API.get('patients/')
            .then(res => setPatients(res.data))
            .catch(err => console.error('Error fetching patient list', err));
    }, []);

     const handleViewClick = (patient) => {
        navigate(`/patients/view/${patient.id}`, {
            state: { patient }, // 👈 pass full doctor object here
        });
    };

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
                                <th className="p-6">Patient</th>
                                <th className="p-6">email</th>
                                <th className="p-6">Phone</th>
                                <th className="p-6">Gender</th>
                                <th className="p-6">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((doc, index) => (
                                <tr key={doc.id} className="even:bg-gray-100 odd:bg-white border-b hover:bg-gray-100">
                                    <td className="p-4">{index + 1}</td>
                                    <td className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                                        <img
                                            className="w-10 h-10 rounded-full object-cover"
                                            src={`http://localhost:8000${doc.profile_image}`}
                                            alt="Doctor"
                                        />
                                        <div className="ps-3">
                                            <div className="text-md font-bold">{doc.first_name} {doc.last_name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{doc.user.email}</td>
                                    <td className="px-6 py-4">{doc.phone}</td>
                                    <td className="px-6 py-4">
                                        {doc.gender == "F" ? "Female" : "Male"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            className="font-medium text-blue-600 hover:underline pr-5"
                                        >
                                            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"></path><path d="M13.5 6.5l4 4"></path></svg>
                                        </button>
                                        <button
                                            className="font-medium text-blue-600 hover:underline pr-5"  onClick={() => handleViewClick(doc)}
                                        >
                                            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"></path></svg>                                        </button>
                                        <button
                                            className="font-medium text-red-600 hover:underline"
                                        >
                                            Delete
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

export default PatientList;