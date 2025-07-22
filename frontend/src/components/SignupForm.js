import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignupForm() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormValues] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone: '',
        dob: '',
        gender: '',

        // Step 2
        blood_group: '',
        chronic_conditions: '',
        allergies: '',
        current_medications: '',
        emergency_contact: '',
    });

    const [errors, setErrors] = useState({});
    const [backendError, setBackendError] = useState('');

    const handleChange = e => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = e => {
        setFormValues(prev => ({ ...prev, profile_image: e.target.files[0] }));
    };

    const validateForm = (fields = []) => {
        const newErrors = {};

        for (const field of fields) {
            const value = formData[field];

            if (!value || (typeof value === 'string' && value.trim() === '')) {
                newErrors[field] = 'This field is required';
            }

            if (field === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
                newErrors[field] = 'Enter a valid email';
            }

            if (field === 'phone' && value && !/^\d{10}$/.test(value)) {
                newErrors[field] = 'Enter a valid 10-digit phone number';
            }

            if (field === 'password' && value.length < 6) {
                newErrors[field] = 'Password must be at least 6 characters';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        const valid = validateForm([
            'username', 'email', 'password',
            'first_name', 'last_name'
        ]);

        if (valid) setStep(2);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setBackendError('');

        const payload = new FormData();
        payload.append('user', JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password
        }));

        for (const [key, value] of Object.entries(formData)) {
            if (key !== 'profile_image') payload.append(key, value);
        }

        if (formData.profile_image) {
            payload.append('profile_image', formData.profile_image);
        }

        try {
            await axios.post('http://localhost:8000/api/register/patient/', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            navigate('/login');
        } catch (err) {
            if (err.response?.data) {
                const serverErrors = err.response.data;
                const fieldErrors = {};

                // Flatten backend validation errors
                for (let key in serverErrors) {
                    fieldErrors[key] = Array.isArray(serverErrors[key])
                        ? serverErrors[key][0]
                        : serverErrors[key];
                }

                setErrors(fieldErrors);
                setBackendError('Registration failed. Check highlighted fields.');
            } else {
                setBackendError('Network or server error');
            }
        }
    };

    return (
        <div className="">

            <div className="max-w-sm mx-auto mt-10">
                <div className="mb-6">
                    <a href="/" className="max-sm:hidden"><img src="/logo-sm.png" alt="logo" className="w-24" /></a>
                </div>
                <div class="mb-10">
                    <h2 class="mb-2 text-3xl font-bold">Register</h2>
                    <p class="font-semibold text-sm heading-text">Please enter data to create new account!</p>
                </div>
                {backendError && <p className="text-red-500 text-sm mb-2">{backendError}</p>}
                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <>
                            <div className="mb-3">
                                <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Username</label>
                                <input
                                    name="username" value={formData.username} onChange={handleChange} error={errors.username}
                                    className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Username" required />
                            </div>

                            <div className="mb-3">
                                <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Email</label>
                                <input
                                    name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email}
                                    className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Email" required />
                            </div>

                            <div className="mb-3">

                                <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Password</label>
                                <input
                                    type="password" name="password" value={formData.password} onChange={handleChange}
                                    className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Password" required />
                            </div>

                            <div className="flex">
                                <div className="flex-1 pr-2">
                                    <div className="mb-3">
                                        <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">First Name</label>
                                        <input
                                            name="first_name" value={formData.first_name} onChange={handleChange} error={errors.first_name}
                                            className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="First Name"  />
                                    </div>
                                </div>
                                <div className="flex-1 pl-2">
                                    <div className="mb-3">
                                        <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Last Name</label>
                                        <input
                                            name="last_name" value={formData.last_name} onChange={handleChange} error={errors.last_name}
                                            className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Last Name"  />
                                    </div>

                                </div>
                            </div>
                            <div className="flex">
                                <div className="flex-1 pr-2">
                                    <div className="mb-3">
                                        <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Phone</label>
                                        <input
                                            name="phone" value={formData.phone} onChange={handleChange} error={errors.phone}
                                            className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Phone"  />
                                    </div>
                                </div>
                                <div className="flex-1 pl-2">
                                    <div className="mb-3">
                                        <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Date of Birth</label>
                                        <input
                                            name="dob" value={formData.dob} onChange={handleChange} error={errors.dob} type="date"
                                            className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Date of Birth"  />
                                    </div>

                                </div>
                            </div>








                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="block w-full border p-2 mb-1"
                            >
                                <option value="">-- Select Gender --</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                            {errors.gender && <p className="text-sm text-red-500 mb-2">{errors.gender}</p>}

                            <input type="file" name="profile_image" onChange={handleFileChange} className="border p-2 w-full mb-3" />

                            <button onClick={handleNext} type="button" className="bg-green-600 text-white px-4 py-3 rounded-lg w-full my-2">
                                Next
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="mb-3">
                                <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Blood Group</label>
                                <input
                                    name="blood_group" value={formData.blood_group} onChange={handleChange}
                                    className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Blood Group"  />
                            </div>
                            <div className="mb-3">
                                <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Chronic Conditions</label>
                                <input
                                    name="chronic_conditions" value={formData.chronic_conditions} onChange={handleChange}
                                    className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Chronic Conditions"  />
                            </div>
                            <div className="mb-3">
                                <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Allergies</label>
                                <input
                                    name="allergies" value={formData.allergies} onChange={handleChange}
                                    className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Allergies"  />
                            </div>
                            <div className="mb-3">
                                <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Current Medications</label>
                                <input
                                    name="current_medications" value={formData.current_medications} onChange={handleChange}
                                    className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Current Medications"  />
                            </div>
                            <div className="mb-3">
                                <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Emergency Contact</label>
                                <input
                                    name="emergency_contact" value={formData.emergency_contact} onChange={handleChange}
                                    className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Emergency Contact"  />
                            </div>

                            <div className="flex justify-between mt-4">
                                <button type="button" onClick={() => setStep(1)} className="btn">Back</button>
                                <button type="submit" className="btn bg-blue-600 text-white">Submit</button>
                            </div>
                            <button type="submit" className="text-sm mt-2 text-gray-500 hover:underline">Skip & Complete Later</button>
                        </>
                    )}

                </form>
                <p className="text-center py-3 text-sm">Already have an account?
                    <a className="text-brandGreen-dark font-semibold px-2" href="">Sign In</a></p>
            </div>




            {/* <h2 className="text-2xl font-bold mb-3">Register</h2>
            {backendError && <p className="text-red-500 text-sm mb-2">{backendError}</p>} */}

            {/* <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <>
                        <FormInput name="username" placeholder="Username" value={formData.username} onChange={handleChange} error={errors.username} />
                        <FormInput name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} error={errors.email} />
                        <FormInput name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} error={errors.password} />
                        <FormInput name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} error={errors.first_name} />
                        <FormInput name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} error={errors.last_name} />
                        <FormInput name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} error={errors.phone} />
                        <FormInput name="dob" type="date" value={formData.dob} onChange={handleChange} error={errors.dob} />

                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="block w-full border p-2 mb-1"
                        >
                            <option value="">-- Select Gender --</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                        {errors.gender && <p className="text-sm text-red-500 mb-2">{errors.gender}</p>}

                        <input type="file" name="profile_image" onChange={handleFileChange} className="border p-2 w-full mb-3" />

                        <button type="button" onClick={handleNext} className="w-full bg-blue-600 text-white py-2 rounded">Next</button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <FormInput name="blood_group" placeholder="Blood Group" value={formData.blood_group} onChange={handleChange} />
                        <FormInput name="chronic_conditions" placeholder="Chronic Conditions" value={formData.chronic_conditions} onChange={handleChange} />
                        <FormInput name="allergies" placeholder="Allergies" value={formData.allergies} onChange={handleChange} />
                        <FormInput name="current_medications" placeholder="Current Medications" value={formData.current_medications} onChange={handleChange} />
                        <FormInput name="emergency_contact" placeholder="Emergency Contact" value={formData.emergency_contact} onChange={handleChange} />

                        <div className="flex justify-between mt-4">
                            <button type="button" onClick={() => setStep(1)} className="btn">Back</button>
                            <button type="submit" className="btn bg-blue-600 text-white">Submit</button>
                        </div>
                        <button type="submit" className="text-sm mt-2 text-gray-500 hover:underline">Skip & Complete Later</button>
                    </>
                )}
            </form> */}
        </div>
    );
}

function FormInput({ name, type = "text", placeholder, value, onChange, error }) {
    return (
        <div className="mb-2">
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`block w-full border p-2 ${error ? 'border-red-500' : ''}`}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
