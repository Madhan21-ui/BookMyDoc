import { useEffect, useState } from "react";
import { CalendarDays, CalendarX, Clock, Phone, ArrowRight } from "lucide-react";
import api from "../services/api";
import "../style/Dashboard.css";

function formatDate(date) {
    if (!date) return "-";

    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatTime(time) {
    if (!time) return "-";

    const [h, m] = String(time).split(":").map(Number);

    if (Number.isNaN(h) || Number.isNaN(m)) return time;

    const suffix = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;

    return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

function UpcomingAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const email = localStorage.getItem("userEmail");

        if (!email) {
            setLoading(false);
            return;
        }

        api.get(`/appointments/user/${email}`)
            .then((response) => setAppointments(response.data))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="appointments-section">
            <div className="section-header">
                <div>
                    <h2>Upcoming Appointments</h2>
                    <p>Your scheduled healthcare visits</p>
                </div>

                {appointments.length > 0 && (
                    <a href="/appointments" className="section-link">
                        View all <ArrowRight size={16} />
                    </a>
                )}
            </div>

            {loading ? (
                <div className="appointments-grid">
                    <div className="skeleton skeleton--card" />
                    <div className="skeleton skeleton--card" />
                </div>
            ) : appointments.length === 0 ? (
                <div className="empty-appointment">
                    <div className="empty-icon">
                        <CalendarX size={28} />
                    </div>

                    <h3>No upcoming appointments</h3>

                    <p>Book your first appointment today.</p>

                    <button
                        className="primary-btn solid"
                        onClick={() => (window.location.href = "/doctors")}
                    >
                        Find Doctors
                    </button>
                </div>
            ) : (
                <div className="appointments-grid">
                    {appointments.map((appointment) => {
                        const status = (appointment.status || "PENDING").toUpperCase();
                        const doctorName = appointment.doctorName || "Doctor";

                        return (
                            <div key={appointment.id} className="appointment-card">
                                <div className="appointment-header">
                                    <div className="appointment-avatar">
                                        {doctorName.replace(/^dr\.?\s*/i, "").charAt(0).toUpperCase()}
                                    </div>

                                    <div className="appointment-title">
                                        <h3>{doctorName}</h3>
                                        <p>Patient: {appointment.patientName}</p>
                                    </div>

                                    <span className={`status-badge ${status}`}>{status}</span>
                                </div>

                                <div className="appointment-details">
                                    <div className="detail-row">
                                        <span><CalendarDays size={16} /> Date</span>
                                        <strong>{formatDate(appointment.appointmentDate)}</strong>
                                    </div>

                                    <div className="detail-row">
                                        <span><Clock size={16} /> Time</span>
                                        <strong>{formatTime(appointment.appointmentTime)}</strong>
                                    </div>

                                    <div className="detail-row">
                                        <span><Phone size={16} /> Phone</span>
                                        <strong>{appointment.phoneNumber || "-"}</strong>
                                    </div>
                                </div>

                                {appointment.reason && (
                                    <div className="appointment-reason">
                                        <span>Reason</span>
                                        <p>{appointment.reason}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default UpcomingAppointments;