import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import AdminSidebar from '../components/AdminSidebar';
import { format, addHours } from "date-fns";
import GeocodedMap from '../components/GeocodedMap';

function DoctorView() {
    const location = useLocation();
    const { doctorId } = useParams();
    const [doctor, setDoctor] = useState(location.state?.doctor || null);

    useEffect(() => {
        // If no data was passed (e.g. user refreshed page), fetch from API,
        if (!doctor) {
            fetch(`http://127.0.0.1:8000/api/doctors/${doctorId}/`)
                .then(res => res.json())
                .then(data => setDoctor(data));
        }
    }, [doctorId, doctor]);

    if (!doctor) return <p>Loading...</p>;

    function formatAppointment(dateStr, timeStr) {
        if (!dateStr || !timeStr) return "Invalid date/time";

        const datetime = new Date(`${dateStr}T${timeStr}`);
        if (isNaN(datetime.getTime())) return "Invalid date/time";

        const endTime = addHours(datetime, 2);

        return `${format(datetime, "EEE, dd/MM/yyyy")} ${format(datetime, "hh:mm a")} - ${format(endTime, "hh:mm a")}`;
    }

    const fullAddress = `${doctor.clinic_address}, ${doctor.city}, ${doctor.state}, ${doctor.zipcode}`;

    return (
        <div>
            <Header />
            <AdminSidebar />
            <div className='sm:ml-64 bg-brandGreen-light px-5 pt-5'>
                <div className="p-6">
                    <h1 className="text-xl mb-4">Doctor Profile</h1>

                    <div class="flex flex-col xl:flex-row gap-4">
                        <div class="min-w-[330px] 2xl:min-w-[400px]">
                            <div class="card w-full card-border bg-white p-5 rounded-2xl text-md">
                                <div class="card-body">
                                    <div className="flex items-center">
                                        <p className="flex-1 font-bold">Appointment Schedule</p>
                                        <div>
                                            <p className="rounded-full bg-green-400 text-white py-3 px-5">{doctor.appointments.length}</p>
                                        </div>
                                    </div>
                                    <div className="">
                                        {doctor.appointments.map((appt, index) => (
                                            <div className="card bg-gray-100 rounded-xl px-6 py-3 mt-5">
                                                <div className="flex items-center text-gray-900 whitespace-nowrap">
                                                    <img
                                                        className="w-10 h-10 rounded-full object-cover"
                                                        src={`http://localhost:8000${appt.patient_profile_image}`}
                                                        alt="Patient Image"
                                                    />
                                                    <div className="ps-3">
                                                        <div className="text-md">{appt.patient_name}</div>
                                                        <div className="text-xs text-gray-400">{doctor.specialization}</div>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-medium text-brandGreen-dark pt-3">{formatAppointment(appt.date, appt.time)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card w-full card-border bg-white p-5 rounded-lg">
                            <div className="flex">
                                <div className="pr-5">
                                    <img
                                        className="w-24 h-24 rounded-lg border object-cover"
                                        src={`http://localhost:8000${doctor.profile_image}`}
                                        alt="Doctor"
                                    />
                                </div>
                                <div className="">
                                    <div>
                                        <p class="font-bold text-md">Dr. {doctor.doctor_name}</p>
                                        <p className="text-sm text-gray-400">{doctor.clinic_name}</p>
                                    </div>
                                    <div className="flex gap-4 pt-5">
                                        <div className="flex items-center bg-brandGreen-default px-4 rounded-full py-1">
                                            <svg fill="#00c046" height="17px" width="17px" version="1.1" id="Layer_1" viewBox="0 0 512 512">
                                                <g>
                                                    <g>
                                                        <path d="M290.146,492.76c-1.947-5.192-7.735-7.822-12.924-5.876c-8.916,3.343-18.328,5.038-27.973,5.038    c-21.45,0.001-41.69-8.347-56.993-23.504c-15.317-15.171-23.752-35.282-23.752-56.625V290.566h27.426    c47.069,0,85.361-38.281,85.361-85.334v-61.587c0-10.27-6.204-19.115-15.059-22.996V71.261c0-14.405-4.28-28.052-12.12-39.527    c1.078-2.668,1.679-5.579,1.679-8.629C255.79,10.365,245.422,0,232.678,0s-23.111,10.365-23.111,23.106    s10.367,23.107,23.111,23.107c2.179,0,4.285-0.309,6.284-0.875c4.658,7.696,7.193,16.583,7.193,25.924v49.387    c-8.855,3.881-15.059,12.726-15.059,22.996v61.587c0,19.376-15.776,35.138-35.165,35.138h-71.917    c-19.39,0-35.165-15.763-35.165-35.138v-61.587c0-10.27-6.204-19.115-15.059-22.996V71.261c0-9.395,2.565-18.331,7.273-26.057    c2.136,0.654,4.402,1.007,6.749,1.007c12.744,0,23.112-10.365,23.112-23.107C110.923,10.365,100.555,0,87.811,0    C75.066,0,64.699,10.365,64.699,23.106c0,2.856,0.525,5.59,1.476,8.118C58.112,42.803,53.71,56.642,53.71,71.261v49.387    c-8.855,3.881-15.059,12.726-15.059,22.996v61.587c0,47.054,38.294,85.334,85.361,85.334h24.411v121.227    c0,26.743,10.548,51.92,29.701,70.891c19.088,18.907,44.346,29.319,71.123,29.318c12.062,0,23.845-2.125,35.023-6.316    C289.462,503.738,292.093,497.951,290.146,492.76z M124.012,270.488c-35.997,0-65.283-29.274-65.283-65.256v-61.587    c0-2.768,2.252-5.02,5.02-5.02c2.768,0,5.02,2.252,5.02,5.02v61.587c0,30.447,24.783,55.217,55.244,55.217h71.917    c30.462,0,55.244-24.77,55.244-55.217v-61.587c0-2.768,2.252-5.02,5.02-5.02c2.768,0,5.02,2.252,5.02,5.02v61.587    c0,35.983-29.286,65.256-65.283,65.256H124.012z" />
                                                    </g>
                                                </g>
                                                <g>
                                                    <g>
                                                        <path d="M434.667,356.38v-59.266c0-32.008-26.03-58.049-58.025-58.049c-31.876,0-57.81,26.041-57.811,58.049v138.379    c0.001,13.27-5.276,25.576-14.858,34.652c-4.026,3.813-4.197,10.167-0.385,14.192c1.974,2.084,4.629,3.135,7.29,3.135    c2.478,0,4.96-0.912,6.902-2.751c13.428-12.72,21.13-30.664,21.129-49.23V297.115c0.001-20.937,16.927-37.971,37.732-37.971    c20.924,0,37.946,17.034,37.946,37.97v59.266c-22.065,4.643-38.683,24.263-38.683,47.696c0,26.877,21.857,48.742,48.723,48.742    c26.865,0,48.72-21.865,48.72-48.742C473.349,380.643,456.731,361.023,434.667,356.38z M424.629,432.74    c-15.795,0-28.645-12.858-28.645-28.664c0-15.805,12.85-28.663,28.644-28.664c15.794,0,28.643,12.858,28.643,28.664    C453.271,419.882,440.421,432.74,424.629,432.74z" />
                                                    </g>
                                                </g>
                                            </svg>

                                            <p className="text-sm font-medium pl-2">{doctor.specialization}</p>
                                        </div>
                                        <div className="flex items-center bg-brandGreen-default px-4 rounded-full py-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#00c046" class="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                            <p className="text-sm font-medium pl-2">{doctor.gender == "F" ? "Female" : "Male"}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="flex py-5">
                                <div class="pr-5">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#00c046" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                    </svg>

                                </div>
                                <div class="w-1/3">
                                    <p className="text-gray-300 pb-2 font-medium">Address</p>
                                    <p>{doctor.clinic_address}</p>
                                    <p>{doctor.city}</p>
                                    <p>{doctor.state} , {doctor.zipcode}</p>
                                </div>
                                <div className='w-2/3'>
                                    <GeocodedMap address={fullAddress} />
                                </div>

                            </div>
                            <div className="flex">
                                <div className="flex py-5 w-1/3">
                                    <div class="pr-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#00c046" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                        </svg>


                                    </div>
                                    <div>
                                        <p className="text-gray-300 pb-2">Phone</p>
                                        <p>{doctor.phone}</p>

                                    </div>
                                </div>

                                <div className="flex py-5 w-2/3">
                                    <div class="pr-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#00c046" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                        </svg>


                                    </div>
                                    <div>
                                        <p className="text-gray-300 pb-2">Email</p>
                                        <p>{doctor.email}</p>

                                    </div>
                                </div>
                            </div>


                            <div className="flex">

                                 <div className="flex py-5 w-1/3">
                                    <div class="pr-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#00c046" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                                        </svg>



                                    </div>
                                    <div>
                                        <div>
                                        <p className="text-gray-300 pb-2">Qualification</p>
                                        <p>{doctor.qualification}</p>

                                    </div>
                                    <div className='pt-3'>
                                        <p className="text-gray-300 pb-2">Experience Years</p>
                                        <p>{doctor.experience_years} Year</p>

                                    </div>
                                    </div>
                                </div>

                                <div className="flex py-5 w-1/3">
                                    <div class="pr-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#00c046" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>



                                    </div>
                                    <div>
                                        <p className="text-gray-300 pb-2">Working Hours</p>
                                        <p>{doctor.working_start} - {doctor.working_end}</p>

                                    </div>
                                </div>

                                <div className="flex py-5 w-1/3">
                                    <div class="pr-5">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#00c046" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                        </svg>



                                    </div>
                                    <div>
                                        <p className="text-gray-300 pb-2">Consultation Fee</p>
                                        <p>{doctor.consultation_fee}</p>

                                    </div>
                                </div>
                               
                            </div>



                        </div>
                    </div>


                </div>
            </div>
        </div>

    );
}

export default DoctorView;
