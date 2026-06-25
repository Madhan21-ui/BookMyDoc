import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function DoctorDashboard() {

    const navigate = useNavigate();

    const doctorName =
        localStorage.getItem("doctorName");

    const doctorId =
        localStorage.getItem("doctorId");

    const [slotCount, setSlotCount] =
        useState(0);

    const [appointmentCount, setAppointmentCount] =
        useState(0);

    const [pendingCount, setPendingCount] =
        useState(0);

    const [approvedCount, setApprovedCount] =
        useState(0);

    const [appointments, setAppointments] =
        useState([]);

    useEffect(() => {

        fetchSlots();
        fetchAppointments();

    }, []);

    const fetchSlots = async () => {

        try {

            const response =
                await api.get(
                    `/availability/doctor/${doctorId}`
                );

            setSlotCount(
                response.data.length
            );

        } catch (error) {

            console.error(error);
        }
    };

    const fetchAppointments = async () => {

        try {

            const response =
                await api.get(
                    `/appointments/doctor/${doctorId}`
                );

            setAppointments(
                response.data
            );

            setAppointmentCount(
                response.data.length
            );

            const pending =
                response.data.filter(
                    appointment =>
                        appointment.status ===
                        "PENDING"
                ).length;

            const approved =
                response.data.filter(
                    appointment =>
                        appointment.status ===
                        "APPROVED"
                ).length;

            setPendingCount(
                pending
            );

            setApprovedCount(
                approved
            );

        } catch (error) {

            console.error(error);
        }
    };

    return (

        <div
            style={{
                padding: "40px",
                background: "#f8fafc",
                minHeight: "100vh"
            }}
        >

            {/* Header */}

            <div
                style={{
                    marginBottom: "35px"
                }}
            >

                <h1
                    style={{
                        fontSize: "42px",
                        color: "#0f172a",
                        marginBottom: "10px"
                    }}
                >
                    👋 Welcome Back,
                    <br />
                    {doctorName}
                </h1>

                <p
                    style={{
                        color: "#64748b",
                        fontSize: "18px"
                    }}
                >
                    Manage your appointments and availability
                </p>

                <p
                    style={{
                        color: "#94a3b8",
                        marginTop: "10px"
                    }}
                >
                    {new Date().toDateString()}
                </p>

            </div>

            {/* Stats */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(220px,1fr))",
                    gap: "20px",
                    marginBottom: "45px"
                }}
            >

                <DashboardCard
                    icon="📅"
                    title="Total Slots"
                    value={slotCount}
                    color="#1976d2"
                />

                <DashboardCard
                    icon="👥"
                    title="Appointments"
                    value={appointmentCount}
                    color="#16a34a"
                />

                <DashboardCard
                    icon="⏳"
                    title="Pending"
                    value={pendingCount}
                    color="#f59e0b"
                />

                <DashboardCard
                    icon="✅"
                    title="Approved"
                    value={approvedCount}
                    color="#22c55e"
                />

            </div>

            {/* Quick Actions */}

            <h2
                style={{
                    marginBottom: "20px",
                    color: "#0f172a"
                }}
            >
                Quick Actions
            </h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(260px,1fr))",
                    gap: "20px"
                }}
            >

                <ActionCard
                    icon="📅"
                    title="Manage Availability"
                    desc="Create and manage slots"
                    onClick={() =>
                        navigate(
                            "/doctor-availability"
                        )
                    }
                />

                <ActionCard
                    icon="👥"
                    title="Appointments"
                    desc="View patient requests"
                    onClick={() =>
                        navigate(
                            "/doctor-appointments"
                        )
                    }
                />

                <ActionCard
                    icon="🕒"
                    title="Previous Slots"
                    desc="Review slot history"
                    onClick={() =>
                        navigate(
                            "/doctor-slots"
                        )
                    }
                />

                <ActionCard
                    icon="👨‍⚕️"
                    title="My Profile"
                    desc="Update doctor information"
                    onClick={() =>
                        navigate(
                            "/doctor-profile"
                        )
                    }
                />

            </div>

            {/* Recent Requests */}

            <h2
                style={{
                    marginTop: "50px",
                    marginBottom: "20px",
                    color: "#0f172a"
                }}
            >
                Recent Appointment Requests
            </h2>

            <div
                style={{
                    background: "white",
                    borderRadius: "20px",
                    padding: "20px",
                    boxShadow:
                        "0 10px 25px rgba(0,0,0,0.08)"
                }}
            >

                {
                    appointments.length === 0 ? (

                        <h3>
                            No Appointment Requests
                        </h3>

                    ) : (

                        appointments
                            .slice(0, 5)
                            .map((appointment) => (

                                <div
                                    key={appointment.id}
                                    style={{
                                        padding: "15px",
                                        borderBottom:
                                            "1px solid #e5e7eb"
                                    }}
                                >

                                    <h4>
                                        👤 {appointment.patientName}
                                    </h4>

                                    <p>
                                        📅 {appointment.appointmentDate}
                                    </p>

                                    <p>
                                        ⏰ {appointment.appointmentTime}
                                    </p>

                                    <p>
                                        Status:
                                        {" "}
                                        <strong>
                                            {appointment.status}
                                        </strong>
                                    </p>

                                </div>

                            ))

                    )
                }

            </div>

        </div>
    );
}

function DashboardCard({
    icon,
    title,
    value,
    color
}) {

    return (

        <div
            style={{
                background: "white",
                padding: "25px",
                borderRadius: "20px",
                boxShadow:
                    "0 10px 25px rgba(0,0,0,0.08)"
            }}
        >

            <h2>{icon}</h2>

            <h3>{title}</h3>

            <p
                style={{
                    fontSize: "34px",
                    fontWeight: "bold",
                    color
                }}
            >
                {value}
            </p>

        </div>
    );
}

function ActionCard({
    icon,
    title,
    desc,
    onClick
}) {

    return (

        <div
            onClick={onClick}
            style={{
                background: "white",
                padding: "30px",
                borderRadius: "18px",
                cursor: "pointer",
                boxShadow:
                    "0 10px 25px rgba(0,0,0,0.08)"
            }}
        >

            <h2>{icon}</h2>

            <h3>{title}</h3>

            <p>{desc}</p>

        </div>
    );
}

export default DoctorDashboard;