import { useEffect, useState } from 'react';
import API from '../api';
import Header from '../components/Header';
import DoctorForm from '../components/DoctorForm';

function PatientProfile() {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get('profile/')
      .then(res => setProfile(res.data))
      .catch(err => console.error("Failed to fetch profile", err));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    API.put('profile/', profile)
      .then(res => {
        setProfile(res.data);
        setMessage("Profile updated successfully.");
      })
      .catch(err => {
        console.error("Update failed", err);
        setMessage("Error updating profile.");
      });
  };

  const user = JSON.parse(localStorage.getItem('user'));
  const doctorId = user?.id;

  return (
    <div className="">
    <Header />
      <h2 className="text-xl mb-4">My Profile</h2>
      <div className=" bg-brandGreen-light px-5 pt-5">
    <DoctorForm doctorId={doctorId} mode="profile" onSuccess={() => alert("Profile updated successfully")} />
      </div>
      <form onSubmit={handleSubmit}>
        <input name="username" value={profile.username} disabled className="bg-gray-100 border p-2 w-full mb-2" />
        <input name="first_name" value={profile.first_name} onChange={handleChange} placeholder="First Name" className="border p-2 w-full mb-2" />
        <input name="last_name" value={profile.last_name} onChange={handleChange} placeholder="Last Name" className="border p-2 w-full mb-2" />
        <input name="email" value={profile.email} onChange={handleChange} placeholder="Email" className="border p-2 w-full mb-2" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">Update</button>
      </form>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}

export default PatientProfile;
