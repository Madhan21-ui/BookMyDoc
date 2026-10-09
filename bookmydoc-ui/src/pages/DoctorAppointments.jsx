import { useEffect, useState } from "react";
import api from "../services/api";

function DoctorAppointments() {

    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [search, setSearch] = useState("");

    const doctorId = localStorage.getItem("doctorId");
    const doctorName = localStorage.getItem("doctorName");

    const fetchAppointments = async () => {

        try {

            const response = await api.get(
                `/appointments/doctor/${doctorId}`
            );

            setAppointments(response.data);

        } catch (error) {

            console.error(error);
        }
    };

    useEffect(() => {

        fetchAppointments();

    }, []);

    const approveAppointment = async (id) => {

        try {

            await api.put(`/appointments/${id}/approve`);

            fetchAppointments();

        } catch (error) {

            console.error(error);
        }
    };

    const rejectAppointment = async (id) => {

        try {

            await api.put(`/appointments/${id}/reject`);

            fetchAppointments();

        } catch (error) {

            console.error(error);
        }
    };

    const countByStatus = (status) =>
        appointments.filter(
            (appointment) => appointment.status === status
        ).length;

    const tabs = [
        { key: "ALL", label: "All", count: appointments.length },
        { key: "PENDING", label: "Pending", count: countByStatus("PENDING") },
        { key: "APPROVED", label: "Approved", count: countByStatus("APPROVED") },
        { key: "REJECTED", label: "Rejected", count: countByStatus("REJECTED") },
    ];

    const visibleAppointments = appointments.filter((appointment) => {

        const matchesFilter =
            filter === "ALL" || appointment.status === filter;

        const matchesSearch =
            !search ||
            appointment.patientName
                ?.toLowerCase()
                .includes(search.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    return (

        <div className="dap-page">

            <style>{styles}</style>

            <div className="dap-container">

                {/* Header */}

                <header className="dap-header">

                    <div>
                        <p className="dap-welcome">
                            Welcome, {doctorName} 👨‍⚕️
                        </p>

                        <h1>Appointment Requests</h1>

                        <p className="dap-subtitle">
                            Manage and review patient appointment requests
                        </p>
                    </div>

                    <div className="dap-header-badge">
                        <strong>{countByStatus("PENDING")}</strong>
                        <span>awaiting your review</span>
                    </div>

                </header>

                {/* Stats */}

                <section className="dap-stats">

                    <div className="dap-stat tone-blue">
                        <div className="dap-stat-icon">👥</div>
                        <div>
                            <h2>{appointments.length}</h2>
                            <p>Total Requests</p>
                        </div>
                    </div>

                    <div className="dap-stat tone-amber">
                        <div className="dap-stat-icon">⏳</div>
                        <div>
                            <h2>{countByStatus("PENDING")}</h2>
                            <p>Pending</p>
                        </div>
                    </div>

                    <div className="dap-stat tone-green">
                        <div className="dap-stat-icon">✅</div>
                        <div>
                            <h2>{countByStatus("APPROVED")}</h2>
                            <p>Approved</p>
                        </div>
                    </div>

                    <div className="dap-stat tone-rose">
                        <div className="dap-stat-icon">🚫</div>
                        <div>
                            <h2>{countByStatus("REJECTED")}</h2>
                            <p>Rejected</p>
                        </div>
                    </div>

                </section>

                {/* Toolbar */}

                <div className="dap-toolbar">

                    <div className="dap-tabs">

                        {tabs.map((tab) => (

                            <button
                                key={tab.key}
                                type="button"
                                className={`dap-tab ${filter === tab.key ? "active" : ""}`}
                                onClick={() => setFilter(tab.key)}
                            >
                                {tab.label}
                                <span>{tab.count}</span>
                            </button>

                        ))}

                    </div>

                    <div className="dap-search">
                        <span>🔍</span>
                        <input
                            type="text"
                            placeholder="Search patient name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                </div>

                {/* List */}

                {visibleAppointments.length === 0 ? (

                    <div className="dap-empty">
                        <div className="dap-empty-icon">📭</div>
                        <h3>No Appointment Requests Found</h3>
                        <p>
                            {appointments.length === 0
                                ? "New patient requests will show up here."
                                : "Try a different filter or search."}
                        </p>
                    </div>

                ) : (

                    <div className="dap-grid">

                        {visibleAppointments.map((appointment) => {

                            const status = (appointment.status || "PENDING").toUpperCase();

                            return (

                                <div key={appointment.id} className="dap-card">

                                    <div className="dap-card-top">

                                        <div className="dap-avatar">
                                            {appointment.patientName?.charAt(0).toUpperCase()}
                                        </div>

                                        <div className="dap-patient">
                                            <h3>{appointment.patientName}</h3>
                                            <p>Patient</p>
                                        </div>

                                        <span className={`dap-badge ${status}`}>
                                            {appointment.status}
                                        </span>

                                    </div>

                                    <div className="dap-schedule">

                                        <div>
                                            <small>📅 Date</small>
                                            <strong>{appointment.appointmentDate}</strong>
                                        </div>

                                        <div>
                                            <small>⏰ Time</small>
                                            <strong>{appointment.appointmentTime}</strong>
                                        </div>

                                    </div>

                                    <div className="dap-contact">

                                        <p>
                                            <span>📧</span>
                                            {appointment.userEmail}
                                        </p>

                                        <p>
                                            <span>📞</span>
                                            {appointment.phoneNumber}
                                        </p>

                                    </div>

                                    <div className="dap-reason">
                                        <small>Reason for visit</small>
                                        <p>{appointment.reason}</p>
                                    </div>

                                    {appointment.status === "PENDING" && (

                                        <div className="dap-actions">

                                            <button
                                                type="button"
                                                className="dap-btn dap-approve"
                                                onClick={() =>
                                                    approveAppointment(appointment.id)
                                                }
                                            >
                                                ✓ Approve
                                            </button>

                                            <button
                                                type="button"
                                                className="dap-btn dap-reject"
                                                onClick={() =>
                                                    rejectAppointment(appointment.id)
                                                }
                                            >
                                                ✕ Reject
                                            </button>

                                        </div>

                                    )}

                                </div>

                            );
                        })}

                    </div>

                )}

            </div>

        </div>

    );
}

const styles = `

.dap-page {
    --primary: #2563eb;
    --primary-soft: #eff6ff;
    --bg: #f8fafc;
    --surface: #ffffff;
    --border: #e2e8f0;
    --text: #0f172a;
    --text-soft: #475569;
    --text-muted: #64748b;
    --radius: 16px;

    min-height: 100vh;
    padding: 40px 20px 60px;
    background: var(--bg);
    color: var(--text);
    font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
}

.dap-page *,
.dap-page *::before,
.dap-page *::after {
    box-sizing: border-box;
}

.dap-page h1,
.dap-page h2,
.dap-page h3,
.dap-page p {
    margin: 0;
}

.dap-container {
    max-width: 1200px;
    margin: 0 auto;
}

.tone-blue  { --tone: #2563eb; --tone-soft: #eff6ff; }
.tone-amber { --tone: #d97706; --tone-soft: #fff4dc; }
.tone-green { --tone: #16a34a; --tone-soft: #e3f8ea; }
.tone-rose  { --tone: #e11d48; --tone-soft: #ffe6ec; }

/* Header */

.dap-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 28px;
    padding: 28px 32px;
    border-radius: 18px;
    background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
    color: #fff;
}

.dap-welcome {
    margin-bottom: 4px !important;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
}

.dap-header h1 {
    font-size: 30px;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.2;
}

.dap-subtitle {
    margin-top: 6px !important;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.8);
}

.dap-header-badge {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.16);
}

.dap-header-badge strong {
    font-size: 30px;
    font-weight: 700;
    line-height: 1;
}

.dap-header-badge span {
    max-width: 90px;
    font-size: 13px;
    line-height: 1.3;
    color: rgba(255, 255, 255, 0.85);
}

/* Stats */

.dap-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 28px;
}

.dap-stat {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.dap-stat:hover {
    border-color: var(--tone);
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
    transform: translateY(-2px);
}

.dap-stat-icon {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    font-size: 22px;
    border-radius: 12px;
    background: var(--tone-soft);
}

.dap-stat h2 {
    font-size: 26px;
    font-weight: 700;
    line-height: 1.1;
    color: var(--tone);
}

.dap-stat p {
    margin-top: 3px !important;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-muted);
}

/* Toolbar */

.dap-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 14px;
    margin-bottom: 22px;
}

.dap-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 5px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
}

.dap-tab {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border: none;
    border-radius: 9px;
    background: transparent;
    color: var(--text-soft);
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
}

.dap-tab span {
    padding: 1px 8px;
    border-radius: 999px;
    background: #f1f5f9;
    color: var(--text-muted);
    font-size: 12px;
}

.dap-tab:hover {
    background: var(--primary-soft);
    color: var(--primary);
}

.dap-tab.active {
    background: var(--primary);
    color: #fff;
}

.dap-tab.active span {
    background: rgba(255, 255, 255, 0.22);
    color: #fff;
}

.dap-search {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 260px;
    padding: 0 14px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.dap-search:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.dap-search input {
    flex: 1;
    min-width: 0;
    padding: 11px 0;
    border: none;
    outline: none;
    background: transparent;
    color: var(--text);
    font-family: inherit;
    font-size: 14px;
}

/* Cards */

.dap-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 20px;
}

.dap-card {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 22px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.dap-card:hover {
    box-shadow: 0 10px 28px rgba(15, 23, 42, 0.09);
    transform: translateY(-3px);
}

.dap-card-top {
    display: flex;
    align-items: center;
    gap: 12px;
}

.dap-avatar {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 14px;
    background: var(--primary);
    color: #fff;
    font-size: 19px;
    font-weight: 700;
}

.dap-patient {
    flex: 1;
    min-width: 0;
}

.dap-patient h3 {
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.dap-patient p {
    margin-top: 1px !important;
    font-size: 12.5px;
    color: var(--text-muted);
}

.dap-badge {
    flex-shrink: 0;
    padding: 5px 11px;
    border-radius: 999px;
    background: var(--primary-soft);
    color: var(--primary);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.dap-badge.PENDING {
    background: #fef3c7;
    color: #b45309;
}

.dap-badge.APPROVED {
    background: #dcfce7;
    color: #15803d;
}

.dap-badge.REJECTED,
.dap-badge.CANCELLED {
    background: #fee2e2;
    color: #b91c1c;
}

.dap-schedule {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.dap-schedule > div {
    padding: 12px 14px;
    border-radius: 12px;
    background: #f8fafc;
    border: 1px solid var(--border);
}

.dap-schedule small {
    display: block;
    margin-bottom: 3px;
    font-size: 11.5px;
    font-weight: 600;
    color: var(--text-muted);
}

.dap-schedule strong {
    font-size: 14.5px;
    font-weight: 600;
}

.dap-contact {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.dap-contact p {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: var(--text-soft);
    word-break: break-all;
}

.dap-contact span {
    font-size: 15px;
}

.dap-reason {
    padding: 12px 14px;
    border-left: 3px solid var(--primary);
    border-radius: 0 10px 10px 0;
    background: var(--primary-soft);
}

.dap-reason small {
    display: block;
    margin-bottom: 3px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--primary);
}

.dap-reason p {
    font-size: 14px;
    line-height: 1.55;
    color: var(--text-soft);
}

/* Actions */

.dap-actions {
    display: flex;
    gap: 10px;
    margin-top: auto;
}

.dap-btn {
    flex: 1;
    padding: 11px;
    border: none;
    border-radius: 10px;
    color: #fff;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.dap-btn:hover {
    transform: translateY(-1px);
}

.dap-approve {
    background: #16a34a;
}

.dap-approve:hover {
    background: #15803d;
    box-shadow: 0 8px 18px rgba(22, 163, 74, 0.28);
}

.dap-reject {
    background: #fff;
    border: 1px solid #fecaca;
    color: #b91c1c;
}

.dap-reject:hover {
    background: #dc2626;
    border-color: #dc2626;
    color: #fff;
    box-shadow: 0 8px 18px rgba(220, 38, 38, 0.28);
}

/* Empty */

.dap-empty {
    padding: 64px 24px;
    text-align: center;
    background: var(--surface);
    border: 1.5px dashed #cbd5e1;
    border-radius: var(--radius);
}

.dap-empty-icon {
    width: 68px;
    height: 68px;
    margin: 0 auto 14px;
    display: grid;
    place-items: center;
    font-size: 32px;
    border-radius: 20px;
    background: var(--primary-soft);
}

.dap-empty h3 {
    font-size: 18px;
    font-weight: 600;
}

.dap-empty p {
    margin-top: 6px !important;
    font-size: 14px;
    color: var(--text-muted);
}

/* Responsive */

@media (max-width: 1024px) {
    .dap-stats {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 640px) {
    .dap-page {
        padding: 20px 14px 40px;
    }

    .dap-header {
        padding: 22px 20px;
    }

    .dap-header h1 {
        font-size: 24px;
    }

    .dap-stat {
        flex-direction: column;
        align-items: flex-start;
        padding: 16px;
    }

    .dap-toolbar {
        flex-direction: column;
        align-items: stretch;
    }

    .dap-tabs {
        overflow-x: auto;
        flex-wrap: nowrap;
    }

    .dap-tab {
        flex-shrink: 0;
    }

    .dap-search {
        min-width: 0;
    }

    .dap-grid {
        grid-template-columns: 1fr;
    }
}

`;

export default DoctorAppointments;