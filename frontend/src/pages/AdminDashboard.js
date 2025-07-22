
import AdminSidebar from '../components/AdminSidebar';
import DoctorForm from '../components/DoctorForm';
import Header from '../components/Header';
import PatientList from './PatientsList';

function AdminDashboard() {


    return (
        <div>
            <Header />
            <AdminSidebar/>
            <div className="p-4 sm:ml-64">
                hello
            </div>
        </div>
    );
}

export default AdminDashboard;
