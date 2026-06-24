import { useEffect, useState } from "react";
import api from "../services/api";

function Appointments() {

    const [appointments, setAppointments] = useState([]);

    useEffect(() => {

        const userEmail =
            localStorage.getItem("userEmail");

        api.get(
            `/appointments/user/${userEmail}`
        )
            .then((response) => {

                console.log(response.data);

                setAppointments(response.data);

            })
            .catch((error) => {

                console.error(error);

            });

    }, []);

    const deleteAppointment = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to cancel this appointment?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(`/appointments/${id}`);

            setAppointments((prevAppointments) =>
                prevAppointments.filter(
                    (appointment) =>
                        appointment.id !== id
                )
            );

            alert(
                "Appointment Cancelled Successfully"
            );

        } catch (error) {

            console.error(error);

            alert(
                "Failed to Cancel Appointment"
            );

        }

    };

    return (
        <div className="appointments-grid">

            {
                appointments.length === 0 && (
                    <h3>
                        No Appointments Found
                    </h3>
                )
            }

            {appointments.map((appointment) => (

                <div
                    key={appointment.id}
                    className="appointment-card"
                >

                    <h3>
                        👨‍⚕️ {appointment.doctorName}
                    </h3>

                    <p>
                        📅 {appointment.appointmentDate}
                    </p>

                    <p>
                        ⏰ {appointment.appointmentTime}
                    </p>

                    <p>
                        📝 {appointment.reason}
                    </p>

                    <div
                        className={`status-badge ${appointment.status}`}
                    >
                        {appointment.status}
                    </div>

                    {
                        appointment.status !==
                        "APPROVED" && (

                            <button
                                className="cancel-btn"
                                onClick={() =>
                                    deleteAppointment(
                                        appointment.id
                                    )
                                }
                            >
                                Cancel Appointment
                            </button>

                        )
                    }

                </div>

            ))}

        </div>
    );
}

export default Appointments;