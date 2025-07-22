export default function BookedAppointments({ appointments }) {
  return (
      <div>
      <h2>Your Appointments</h2>
      <ul>
        {appointments.map(app => (
          <li key={app.id}>{app.date} - {app.time} with Dr. {app.doctor_name}</li>
        ))}
      </ul>
    </div>
  );
}
