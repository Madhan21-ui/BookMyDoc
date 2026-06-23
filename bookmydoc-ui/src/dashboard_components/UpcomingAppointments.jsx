import { useEffect, useState } from "react";
import api from "../services/api";
import "../style/Dashboard.css";

function UpcomingAppointments() {

    const [appointments, setAppointments] = useState([]);

    useEffect(() => {

        const email =
            localStorage.getItem("userEmail");

        api.get(`/appointments/user/${email}`)
            .then((response) => {

                setAppointments(response.data);

            })
            .catch((error) => {

                console.error(error);

            });

    }, []);

    return (

        <section className="appointments-section">

            <div className="section-header">

                <h2>
                    Upcoming Appointments
                </h2>

                <p>
                    Your scheduled healthcare visits
                </p>

            </div>

            {appointments.length === 0 ? (

                <div className="empty-appointment">

                    <h3>
                        📅 No Upcoming Appointments
                    </h3>

                    <p>
                        Book your first appointment today.
                    </p>

                    <button
                        onClick={() =>
                            window.location.href = "/doctors"
                        }
                    >
                        Find Doctors
                    </button>

                </div>

            ) : (

                <div className="appointments-grid">

                    {appointments.map((appointment) => (

                        <div
                            key={appointment.id}
                            className="appointment-card"
                        >

                            <div className="appointment-header">

                                <div>

                                    <h3>
                                        {appointment.doctorName}
                                    </h3>

                                    <p>
                                        Patient :
                                        {" "}
                                        {appointment.patientName}
                                    </p>

                                </div>

                                <span className="booked-status">
                                    {appointment.status}
                                </span>

                            </div>

                            <div className="appointment-details">

                                <p>
                                    📅 {appointment.appointmentDate}
                                </p>

                                <p>
                                    ⏰ {appointment.appointmentTime}
                                </p>

                                <p>
                                    📞 {appointment.phoneNumber}
                                </p>

                            </div>

                            <div className="appointment-reason">

                                <strong>
                                    Reason :
                                </strong>

                                <p>
                                    {appointment.reason}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </section>

    );
}

export default UpcomingAppointments;