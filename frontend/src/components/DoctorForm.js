// src/components/AddDoctorForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function DoctorForm({ onSuccess,doctorId: passedId, mode = 'admin' }) {
    // const { doctorId } = useParams(); 


    const routeDoctorId = useParams()?.doctorId;
    const doctorId = passedId || routeDoctorId;
    console.log(doctorId);

    const isAdminMode = mode === 'admin';
    const editMode = isAdminMode && Boolean(doctorId);

    // const editMode = Boolean(doctorId);
    const [formData, setFormData] = useState({
        profile_image: null,
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        clinic_name: '',
        clinic_address: '',
        city: '',
        state: '',
        zipcode: '',
        specialization: '',
        working_start: '',
        working_end: '',
        gender: '',
        phone: '',
        qualification: '',
        experience_years: '',
        consultation_fee: '',
    });
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    // const handleFileChange = (e) => {
    //     setProfileImage(e.target.files[0]); // capture actual file
    //     if (file) {
    //         setFormData({ ...formData, profile_image: file });
    //         setImagePreview(URL.createObjectURL(file)); // For preview
    //     }
    // };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFormData({ ...formData, profile_image: selectedFile });
            setImagePreview(URL.createObjectURL(selectedFile));
        }
    };

    useEffect(() => {
        if (editMode) {
            const token = localStorage.getItem('accessToken');
            axios.get(`http://127.0.0.1:8000/api/doctors/${doctorId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                const data = res.data;
                setFormData({
                    username: data.username || '',
                    email: data.email || '',
                    password: '', // leave blank or disable this field
                    first_name: data.doctor_name?.split(' ')[0] || '',
                    last_name: data.doctor_name?.split(' ')[1] || '',
                    clinic_name: data.clinic_name || '',
                    clinic_address: data.clinic_address || '',
                    working_start: data.working_start || '',
                    working_end: data.working_end || '',
                    specialization: data.specialization || '',
                    qualification: data.qualification || '',
                    experience_years: data.experience_years || 0,
                    consultation_fee: data.consultation_fee || '',
                    city: data.city || '',
                    state: data.state || '',
                    zipcode: data.zipcode || '',
                    gender: data.gender || '',
                    phone: data.phone || '',
                    profile_image: null
                });
                if (data.profile_image) {
                    setImagePreview(`http://127.0.0.1:8000${data.profile_image}`);
                }
            });
        }
    }, [editMode, doctorId]);


    const handleSubmit = async e => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');
        const data = new FormData();
        for (let key in formData) {
            data.append(key, formData[key]);
        }
        if (profileImage) {
            data.append('profile_image', profileImage);
        }

        try {
            const url = editMode
                ? `http://127.0.0.1:8000/api/doctors/${doctorId}/edit/`
                : `http://127.0.0.1:8000/api/doctors/add/`;

            const method = editMode ? 'put' : 'post';

            const res = await axios({
                method,
                url,
                data,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert(res.data.message || "Success");
            if (onSuccess) onSuccess(); // Optional callback after success
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert("Error submitting doctor info.");
        }
    };

    return (

        <form onSubmit={handleSubmit} className="flex w-full h-full">
            {/* <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">{editMode ? 'Edit Doctor' : 'Add Doctor'}</h2> */}
            <div className="form-container vertical flex flex-col w-full justify-between">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="gap-4 flex flex-col flex-auto">

                            <div className='card p-7 bg-white border rounded-2xl'>
                                <h4 className="mb-6 text-xl font-bold">Overview</h4>
                                <div class="form-item vertical mb-4">
                                    <label className="block text-gray-500 text-sm font-semibold mb-1 form-label">Username</label>
                                    <input
                                        name="username"
                                        placeholder="Enter username"
                                        onChange={handleChange}
                                        value={formData.username}
                                        required
                                        className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Enter email"
                                        onChange={handleChange}
                                        value={formData.email}
                                        required
                                        className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Password</label>
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="Enter password"
                                        onChange={handleChange}
                                        value={formData.password}
                                        required={!editMode}
                                        className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="mb-4">
                                        <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">First Name</label>
                                        <input
                                            name="first_name"
                                            placeholder="First name"
                                            onChange={handleChange}
                                            value={formData.first_name}
                                            required
                                            className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Last Name</label>
                                        <input
                                            name="last_name"
                                            placeholder="Last name"
                                            onChange={handleChange}
                                            value={formData.last_name}
                                            required
                                            className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Gender</label>
                                        <select name="gender" onChange={handleChange} value={formData.gender} className="input">
                                        <option value="">Select Gender</option>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                    </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Phone</label>
                                        <input
                                        name="phone"
                                        placeholder="Phone no"
                                        onChange={handleChange}
                                        value={formData.phone}
                                        className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    </div>
                                </div>
                            </div>
                            <div className='card p-7 bg-white border rounded-2xl'>
                                 <h4 className="mb-6 text-xl font-bold">Clinic Information</h4>
                                <div className="mb-4">
                                    <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Clinic Name</label>
                                    <input
                                        name="clinic_name"
                                        placeholder="Clinic name"
                                        onChange={handleChange}
                                        value={formData.clinic_name}
                                        className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Clinic Address</label>
                                    <input
                                        name="clinic_address"
                                        placeholder="Clinic address"
                                        onChange={handleChange}
                                        value={formData.clinic_address}
                                        className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">City</label>
                                    <input
                                        name="city"
                                        placeholder="City"
                                        onChange={handleChange}
                                        value={formData.city}
                                        className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">State</label>
                                    <input
                                        name="state"
                                        placeholder="State"
                                        onChange={handleChange}
                                        value={formData.state}
                                        className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Zipcode</label>
                                    <input
                                        name="zipcode"
                                        placeholder="zipcode"
                                        onChange={handleChange}
                                        value={formData.zipcode}
                                        className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                              

                            </div>
                        </div>
                        <div class="md:w-[370px] gap-4 flex flex-col">
                            <div className='card p-7 bg-white border rounded-2xl'>
                                <div className="mb-4">
                                     <h4 className="mb-6 text-xl font-bold">Image</h4>

                                    <div className="flex flex-col items-center bg-gray-100 rounded-xl p-6">
                                        <div className="w-32 h-32 rounded-full overflow-hidden shadow-md border-4 border-white">
                                            <img
                                                src={
                                                    imagePreview ||
                                                    'https://via.placeholder.com/150'
                                                }
                                                alt="Preview"
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <label className="mt-4 cursor-pointer">
                                            <input
                                                type="file"
                                                name="profile_image"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <div className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 text-center">
                                                Upload Image
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className='card p-7 bg-white border rounded-2xl'>
                                 <h4 className="mb-6 text-xl font-bold">Doctor Info</h4>
                                <div className="mb-4">
                                    <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Specialization</label>
                                    <input
                                        name="specialization"
                                        placeholder="Specialization"
                                        onChange={handleChange}
                                        value={formData.specialization}
                                        className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="mb-4">
                                        <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Working Start Time</label>
                                        <input
                                            name="working_start"
                                            type="time"
                                            onChange={handleChange}
                                            value={formData.working_start}
                                            className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Working End Time</label>
                                        <input
                                            name="working_end"
                                            type="time"
                                            onChange={handleChange}
                                            value={formData.working_end}
                                            className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Qualification</label>
                                    <input name="qualification" placeholder="e.g., MBBS, MD" onChange={handleChange} value={formData.qualification}
                                        className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Experience (Years)</label>
                                    <input name="experience_years" type="number" min="0" onChange={handleChange} value={formData.experience_years}
                                        className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Consultation Fee (₹)</label>
                                    <input name="consultation_fee" type="number" step="0.01" onChange={handleChange} value={formData.consultation_fee}
                                        className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>




                            </div>
                        </div>
                    </div>

                </div>

                <div className='bottom-0 left-0 right-0 z-10 mt-8 border-t border-gray-200 bg-white -mx-4 sm:-mx-8 py-4 sticky'>
                    <div className='container mx-auto'>
                        <div className='flex items-center justify-between px-8'>
                            <button className='button hover:text-primary-mild h-12 rounded-xl px-5 py-2 ltr:mr-3 rtl:ml-3 button-press-feedback'>
                                <span className='flex gap-1 items-center justify-center'>
                                    <span class="text-lg"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M5 12l14 0"></path><path d="M5 12l4 4"></path><path d="M5 12l4 -4"></path></svg></span>
                                    <span>Back</span>
                                </span>
                            </button>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                                >
                                    {editMode ? 'Update Doctor' : 'Add Doctor'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>










        </form>

    );
}

export default DoctorForm;
