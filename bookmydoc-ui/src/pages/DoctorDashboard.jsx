import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../style/DoctorDashboard.css";

function DoctorDashboard() {
    const navigate = useNavigate();

    const doctorName = localStorage.getItem("doctorName");
    const doctorId = localStorage.getItem("doctorId");

    const [slotCount, setSlotCount] = useState(0);
    const [appointmentCount, setAppointmentCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [approvedCount, setApprovedCount] = useState(0);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetchSlots();
        fetchAppointments();
    }, []);

    const fetchSlots = async () => {
        try {
            const response = await api.get(`/availability/doctor/${doctorId}`);

            setSlotCount(response.data.length);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAppointments = async () => {
        try {
            const response = await api.get(`/appointments/doctor/${doctorId}`);

            setAppointments(response.data);
            setAppointmentCount(response.data.length);

            const pending = response.data.filter(
                (appointment) => appointment.status === "PENDING"
            ).length;

            const approved = response.data.filter(
                (appointment) => appointment.status === "APPROVED"
            ).length;

            setPendingCount(pending);
            setApprovedCount(approved);
        } catch (error) {
            console.error(error);
        }
    };

    const hour = new Date().getHours();
    let greeting = "Good Evening";

    if (hour < 12) {
        greeting = "Good Morning";
    } else if (hour < 18) {
        greeting = "Good Afternoon";
    }

    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="dd-page">
            <div className="dd-container">

                {/* Header */}

                <header className="dd-header">
                    <div>
                        <p className="dd-greeting">{greeting} 👋</p>
                        <h1>{doctorName}</h1>
                        <p className="dd-subtitle">
                            Manage your appointments and availability
                        </p>
                    </div>

                    <div className="dd-date">
                        <span>📆</span>
                        {today}
                    </div>
                </header>

                {/* Stats */}

                <section className="dd-stats">
                    <DashboardCard
                        icon="📅"
                        title="Total Slots"
                        value={slotCount}
                        tone="blue"
                    />

                    <DashboardCard
                        icon="👥"
                        title="Appointments"
                        value={appointmentCount}
                        tone="violet"
                    />

                    <DashboardCard
                        icon="⏳"
                        title="Pending"
                        value={pendingCount}
                        tone="amber"
                    />

                    <DashboardCard
                        icon="✅"
                        title="Approved"
                        value={approvedCount}
                        tone="green"
                    />
                </section>

                {/* Quick Actions */}

                <section className="dd-section">
                    <div className="dd-section-header">
                        <h2>Quick Actions</h2>
                        <p>Jump straight to what you need</p>
                    </div>

                    <div className="dd-actions">
                        <ActionCard
                            icon="📅"
                            title="Manage Availability"
                            desc="Create and manage slots"
                            onClick={() => navigate("/doctor-availability")}
                        />

                        <ActionCard
                            icon="👥"
                            title="Appointments"
                            desc="View patient requests"
                            onClick={() => navigate("/doctor-appointments")}
                        />

                        <ActionCard
                            icon="🕒"
                            title="Previous Slots"
                            desc="Review slot history"
                            onClick={() => navigate("/doctor-slots")}
                        />

                        <ActionCard
                            icon="👨‍⚕️"
                            title="My Profile"
                            desc="Update doctor information"
                            onClick={() => navigate("/doctor-profile")}
                        />
                    </div>
                </section>

                {/* Recent Requests */}

                <section className="dd-section">
                    <div className="dd-section-header row">
                        <div>
                            <h2>Recent Appointment Requests</h2>
                            <p>Your latest 5 patient requests</p>
                        </div>

                        {appointments.length > 0 && (
                            <button
                                className="dd-link-btn"
                                onClick={() => navigate("/doctor-appointments")}
                            >
                                View all →
                            </button>
                        )}
                    </div>

                    <div className="dd-requests">
                        {appointments.length === 0 ? (
                            <div className="dd-empty">
                                <div className="dd-empty-icon">📭</div>
                                <h3>No Appointment Requests</h3>
                                <p>New patient requests will show up here.</p>
                            </div>
                        ) : (
                            appointments.slice(0, 5).map((appointment) => (
                                <RequestRow
                                    key={appointment.id}
                                    appointment={appointment}
                                />
                            ))
                        )}
                    </div>
                </section>

            </div>
        </div>
    );
}

function DashboardCard({ icon, title, value, tone }) {
    return (
        <div className={`dd-stat-card tone-${tone}`}>
            <div className="dd-stat-icon">{icon}</div>

            <div>
                <p className="dd-stat-value">{value}</p>
                <p className="dd-stat-title">{title}</p>
            </div>
        </div>
    );
}

function ActionCard({ icon, title, desc, onClick }) {
    return (
        <div className="dd-action-card" onClick={onClick}>
            <div className="dd-action-icon">{icon}</div>

            <div className="dd-action-text">
                <h3>{title}</h3>
                <p>{desc}</p>
            </div>

            <span className="dd-action-arrow">→</span>
        </div>
    );
}

function RequestRow({ appointment }) {
    const status = (appointment.status || "PENDING").toUpperCase();

    return (
        <div className="dd-request-row">
            <div className="dd-request-avatar">
                {appointment.patientName?.charAt(0).toUpperCase()}
            </div>

            <div className="dd-request-info">
                <h4>{appointment.patientName}</h4>

                <div className="dd-request-meta">
                    <span>📅 {appointment.appointmentDate}</span>
                    <span>⏰ {appointment.appointmentTime}</span>
                </div>
            </div>

            <span className={`dd-badge ${status}`}>{appointment.status}</span>
        </div>
    );
}

export default DoctorDashboard;