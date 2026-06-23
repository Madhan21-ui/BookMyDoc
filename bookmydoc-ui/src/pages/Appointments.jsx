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
        <div className="container">

            <h2>
                My Appointments
            </h2>

            <table
                border="1"
                cellPadding="10"
            >

                <thead>
                    <tr>
                        <th>Patient Name</th>
                        <th>Doctor Name</th>
                        <th>Reason</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        appointments.length === 0 && (

                            <h3>
                                No Appointments Found
                            </h3>

                        )
                    }
                    {appointments.map(
                        (appointment) => (

                            <tr
                                key={appointment.id}
                            >

                                <td>
                                    {appointment.patientName}
                                </td>

                                <td>
                                    {appointment.doctorName}
                                </td>

                                <td>
                                    {appointment.reason}
                                </td>

                                <td>
                                    {appointment.appointmentDate}
                                </td>

                                <td>
                                    {appointment.appointmentTime}
                                </td>

                                <td>

                                    <span
                                        style={{
                                            padding: "5px 10px",
                                            borderRadius: "20px",
                                            color: "white",
                                            backgroundColor:
                                                appointment.status === "APPROVED"
                                                    ? "green"
                                                    : appointment.status === "REJECTED"
                                                        ? "red"
                                                        : "orange"
                                        }}
                                    >
                                        {appointment.status}
                                    </span>

                                </td>

                                <td>

                                    {
                                        appointment.status !== "APPROVED" && (

                                            <button
                                                className="btn"
                                                onClick={() =>
                                                    deleteAppointment(
                                                        appointment.id
                                                    )
                                                }
                                            >
                                                Cancel
                                            </button>

                                        )
                                    }

                                </td>

                            </tr>

                        )
                    )}

                </tbody>

            </table>

        </div>
    );
}

export default Appointments;