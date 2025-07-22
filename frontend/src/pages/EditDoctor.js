import { useParams } from 'react-router-dom';
import DoctorForm from '../components/DoctorForm';
import Header from '../components/Header';
import AdminSidebar from '../components/AdminSidebar';

export default function EditDoctor() {
    const { id } = useParams(); // Get doctor ID from URL

    return (
        <div>
            <Header />
            <AdminSidebar />
            <div className="sm:ml-64 bg-brandGreen-light px-5 pt-5">
                <DoctorForm mode="admin" />
            </div>
        </div>
    );
}
