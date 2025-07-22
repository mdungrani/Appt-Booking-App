import { useEffect, useState } from 'react';
import API from '../api';  // our axios instance with baseURL and interceptors
import { useNavigate } from 'react-router-dom';


function AppoinmentForm() {
   const [appointments, setAppointments] = useState([]);
   const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingMessage, setBookingMessage] = useState('');
const navigate = useNavigate();
   useEffect(() => {
    // Fetch patient's own appointments
    API.get('appointments/').then(res => {
      setAppointments(res.data);
    }).catch(err => {
      console.error("Failed to load appointments", err);
    });
    // Fetch list of doctors for the dropdown
    API.get('doctors/').then(res => {
      setDoctors(res.data);
    });
  }, []);

  useEffect(() => {
    // Fetch available slots when doctor and date are selected
    if (selectedDoctor && selectedDate) {
      API.get(`appointments/available/?doctor=${selectedDoctor}&date=${selectedDate}`)
        .then(res => {
          setAvailableSlots(res.data.available_slots || []);
        });
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDoctor, selectedDate]);

  const handleBook = (e) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !e.target.time.value) {
      return;
    }
    const data = {
      doctor: selectedDoctor,
      date: selectedDate,
      time: e.target.time.value + ":00"  // append seconds if needed
    };
    API.post('appointments/', data).then(res => {
      setBookingMessage("Appointment booked successfully!");
      // Refresh appointments list to include the new one
      navigate('/my-appointments');
      return API.get('appointments/');
    }).then(res => {
      setAppointments(res.data);
    }).catch(err => {
      if (err.response && err.response.data) {
        setBookingMessage("Error: " + JSON.stringify(err.response.data));
      } else {
        setBookingMessage("Booking failed due to network error.");
      }
    });
  };

  return (
      <form onSubmit={handleBook} className="max-w-md">
        <div className="mb-2">
          <label className="block mb-1">Doctor:</label>
          <select 
            value={selectedDoctor} 
            onChange={e => setSelectedDoctor(e.target.value)} 
            className="border p-2 w-full" required
          >
            <option value="">-- Select Doctor --</option>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.doctor_name} ({doc.clinic_name})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block mb-1">Date:</label>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={e => setSelectedDate(e.target.value)} 
            className="border p-2 w-full" required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Time Slot:</label>
          <select name="time" className="border p-2 w-full" required 
                  disabled={!availableSlots.length}>
            <option value="">-- Select Time --</option>
            {availableSlots.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          {!selectedDoctor || !selectedDate ? (
            <p className="text-sm text-gray-500">Select a doctor and date to see available slots.</p>
          ) : null}
          {selectedDoctor && selectedDate && availableSlots.length === 0 ? (
            <p className="text-sm text-red-500">No slots available for this date.</p>
          ) : null}
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Book Appointment
        </button>
      </form>
  );
}

export default AppoinmentForm;
