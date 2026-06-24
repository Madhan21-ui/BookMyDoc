import { useEffect, useState } from "react";
import api from "../services/api";
import "../style/DoctorAppointments.css";

function DoctorAppointments() {

    const [appointments, setAppointments] =
        useState([]);

    const doctorId =
        localStorage.getItem("doctorId");

    const doctorName =
        localStorage.getItem("doctorName");

    const fetchAppointments = async () => {

        try {

            const response = await api.get(
                `/appointments/doctor/${doctorId}`
            );

            setAppointments(
                response.data
            );

        } catch (error) {

            console.error(error);
        }
    };

    useEffect(() => {

        fetchAppointments();

    }, []);

    const approveAppointment = async (id) => {

        try {

            await api.put(
                `/appointments/${id}/approve`
            );

            fetchAppointments();

        } catch (error) {

            console.error(error);
        }
    };

    const rejectAppointment = async (id) => {

        try {

            await api.put(
                `/appointments/${id}/reject`
            );

            fetchAppointments();

        } catch (error) {

            console.error(error);
        }
    };

    return (

        <div className="doctor-page">

            <h1 className="page-title">
                Welcome {doctorName} 👨‍⚕️
            </h1>

            <p className="page-subtitle">
                Manage and review patient appointment requests
            </p>

            <div className="doctor-stats">

                <div className="stat-card">
                    <h2>
                        {appointments.length}
                    </h2>
                    <p>
                        Total Requests
                    </p>
                </div>

                <div className="stat-card">
                    <h2>
                        {
                            appointments.filter(
                                appointment =>
                                    appointment.status === "APPROVED"
                            ).length
                        }
                    </h2>
                    <p>
                        Approved
                    </p>
                </div>

                <div className="stat-card">
                    <h2>
                        {
                            appointments.filter(
                                appointment =>
                                    appointment.status === "PENDING"
                            ).length
                        }
                    </h2>
                    <p>
                        Pending
                    </p>
                </div>

            </div>

            {appointments.length === 0 ? (

                <h3>
                    No Appointment Requests Found
                </h3>

            ) : (

                <div className="doctor-appointments-grid">

                    {appointments.map((appointment) => (

                        <div
                            key={appointment.id}
                            className="doctor-appointment-card"
                        >

                            <h3>
                                👤 {appointment.patientName}
                            </h3>

                            <div className="appointment-info">

                                <p>
                                    📧 {appointment.userEmail}
                                </p>

                                <p>
                                    📞 {appointment.phoneNumber}
                                </p>

                                <p>
                                    📅 {appointment.appointmentDate}
                                </p>

                                <p>
                                    ⏰ {appointment.appointmentTime}
                                </p>

                                <p>
                                    📝 {appointment.reason}
                                </p>

                            </div>

                            <div
                                className={`status-badge ${appointment.status}`}
                            >
                                {appointment.status}
                            </div>

                            {
                                appointment.status === "PENDING" && (

                                    <div className="action-buttons">

                                        <button
                                            className="approve-btn"
                                            onClick={() =>
                                                approveAppointment(
                                                    appointment.id
                                                )
                                            }
                                        >
                                            ✓ Approve
                                        </button>

                                        <button
                                            className="reject-btn"
                                            onClick={() =>
                                                rejectAppointment(
                                                    appointment.id
                                                )
                                            }
                                        >
                                            ✕ Reject
                                        </button>

                                    </div>

                                )
                            }

                        </div>

                    ))}

                </div>

            )}

        </div>

    );
}

export default DoctorAppointments;