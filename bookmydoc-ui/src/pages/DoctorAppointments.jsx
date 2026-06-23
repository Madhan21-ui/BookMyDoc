import { useEffect, useState } from "react";
import api from "../services/api";

function DoctorAppointments() {

    const [appointments, setAppointments] =
        useState([]);

    const doctorId =
        localStorage.getItem("doctorId");

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

        <div
            style={{
                padding: "30px"
            }}
        >

            <h2>
                Appointment Requests
            </h2>

            {appointments.length === 0 ? (

                <p>
                    No Appointments Found
                </p>

            ) : (

                appointments.map(
                    (appointment) => (

                        <div
                            key={appointment.id}
                            style={{
                                border:
                                    "1px solid #ddd",
                                padding:
                                    "15px",
                                marginBottom:
                                    "15px",
                                borderRadius:
                                    "10px"
                            }}
                        >

                            <h3>
                                {appointment.patientName}
                            </h3>

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

                            <p>
                                Status:
                                {" "}
                                <strong>
                                    {appointment.status}
                                </strong>
                            </p>

                            {appointment.status ===
                                "PENDING" && (

                                    <>

                                        <button
                                            onClick={() =>
                                                approveAppointment(
                                                    appointment.id
                                                )
                                            }
                                        >
                                            Approve
                                        </button>

                                        <button
                                            onClick={() =>
                                                rejectAppointment(
                                                    appointment.id
                                                )
                                            }
                                            style={{
                                                marginLeft:
                                                    "10px"
                                            }}
                                        >
                                            Reject
                                        </button>

                                    </>

                                )}

                        </div>
                    )
                )

            )}

        </div>
    );
}

export default DoctorAppointments;