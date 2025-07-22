import { useEffect, useState } from 'react';
import API from '../api';
import Header from '../components/Header';
import AdminSidebar from '../components/AdminSidebar';
import { useNavigate } from 'react-router-dom';
function DoctorsList() {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        API.get('doctors/')
            .then(res => setDoctors(res.data))
            .catch(err => console.error('Error fetching doctors list', err));
    }, []);

    const handleDelete = async (id) => {
        try {
            await API.delete(`doctors/${id}/`);
            setDoctors(prev => prev.filter(doc => doc.id !== id));  // remove from UI
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    const handleViewClick = (doctor) => {
        navigate(`/doctors/view/${doctor.id}`, {
            state: { doctor }, // 👈 pass full doctor object here
        });
    };

    return (
        <div>
            <Header />
            <AdminSidebar />
            <div className='sm:ml-64 bg-brandGreen-light px-5 pt-5'>
                <div className=''>
                    <div className='flex items-center'>
                        <div className="flex-1">
                            <button className='bg-brandGreen-dark text-white px-4 py-2 rounded-full' >Add new Doctor</button>
                        </div>
                        <form>
                            <label htmlFor="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                            <div class="relative">
                                <input type="search" id="default-search" class="block w-full py-3 px-4 shadow text-sm text-gray-900 rounded-full bg-white" placeholder="Search..." required />
                                <button type="submit" class="text-white absolute end-1 bottom-1.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2">
                                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className='sm:ml-64 bg-brandGreen-light p-5'>
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-white">
                            <tr>
                                <th className="p-4">#</th>
                                <th className="p-6">Doctor</th>
                                <th className="p-6">email</th>
                                <th className="p-6">Specialization</th>

                                <th className="p-6">Working Hours</th>
                                <th className="p-6">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((doc, index) => (
                                <tr key={doc.id} className="even:bg-white odd:bg-gray-100  hover:bg-gray-50">
                                    <td className="px-4 py-3">{index + 1}</td>
                                    <td className="flex items-center px-6 py-3 text-gray-900 whitespace-nowrap">
                                        <img
                                            className="w-10 h-10 rounded-full object-cover"
                                            src={`http://localhost:8000${doc.profile_image}`}
                                            alt="Doctor"
                                        />
                                        <div className="ps-3">
                                            <div className="text-md font-bold">{doc.doctor_name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">{doc.email}</td>
                                    <td className="px-6 py-3">{doc.specialization}</td>

                                    <td className="px-6 py-3">
                                        {doc.working_start} to {doc.working_end}
                                    </td>
                                    <td className="px-6 py-3">
                                        <button
                                            className="text-blue-600"
                                            onClick={() => navigate(`/doctor/edit/${doc.id}`)}
                                        >Edit</button>
                                        <button
                                            onClick={() => handleViewClick(doc)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(doc.id)}
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

export default DoctorsList;