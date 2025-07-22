import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export default function LoginForm() {

    const navigate = useNavigate();
    const [creds, setCreds] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = e => {
        setCreds({ ...creds, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            const response = await axiosInstance.post('http://localhost:8000/api/auth/', creds);
            const { access, refresh } = response.data;
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);

            const profileRes = await axiosInstance.get('http://localhost:8000/api/profile/', {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            });

            const user = profileRes.data;
            localStorage.setItem('user', JSON.stringify(user));

            //   const userIsDoctor = parseJwt(access)?.user_is_doctor; 
            if (user.is_superuser) {
                navigate('/admin');
            } else if (user.is_staff) {
                navigate('/doctor');
            } else {
                navigate('/patient');
            }
        } catch (err) {
            setError('Login failed: Invalid credentials');
        }
    };

    // (Define parseJwt to decode the token if needed)
    // ...

    return (
        <div className="max-w-sm mx-auto mt-20">
            <div className="mb-6">
                <a href="/" className="max-sm:hidden"><img src="/logo-sm.png" alt="logo" className="w-24" /></a>
            </div>
            <div class="mb-10">
                <h2 class="mb-2 text-3xl font-bold">Welcome back!</h2>
                <p class="font-semibold text-sm heading-text">Please enter your credentials to sign in!</p>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Username</label>
                    <input
                        name="username" value={creds.username} onChange={handleChange}
                        className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Username" required />
                </div>
                <div className="mb-4">

                    <label className="block text-gray-500 text-sm font-semibold mb-2 form-label">Password</label>
                    <input
                        type="password" name="password" value={creds.password} onChange={handleChange}
                        className="w-full font-medium text-sm bg-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Password" required />
                </div>
                <button type="submit" className="bg-green-600 text-white px-4 py-3 rounded-lg w-full my-2">
                    Sign In
                </button>
            </form>
            <p className="text-center py-3 text-sm">Don't have an account yet?
                <a className="text-brandGreen-dark font-semibold px-2" href="">Sign up</a></p>
        </div>
    );
}
