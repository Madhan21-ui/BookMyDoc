import { useEffect, useState } from "react";
import api from "../services/api";

function DoctorSlots() {

    const [slots, setSlots] = useState([]);
    const [filter, setFilter] = useState("ALL");

    const doctorId = localStorage.getItem("doctorId");

    useEffect(() => {

        fetchSlots();

    }, []);

    const fetchSlots = async () => {

        try {

            const response = await api.get(
                `/availability/doctor/${doctorId}`
            );

            setSlots(response.data);

        } catch (error) {

            console.error(error);
        }
    };

    // 24h -> 12h label (display only)
    const formatTime = (time) => {

        if (!time) return "";

        const [h, m] = time.split(":").map(Number);
        const suffix = h >= 12 ? "PM" : "AM";
        const hour = h % 12 || 12;

        return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
    };

    const formatDate = (date) =>
        new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    const availableCount = slots.filter((slot) => slot.available).length;
    const bookedCount = slots.length - availableCount;

    const tabs = [
        { key: "ALL", label: "All", count: slots.length },
        { key: "AVAILABLE", label: "Available", count: availableCount },
        { key: "BOOKED", label: "Booked", count: bookedCount },
    ];

    const filteredSlots = slots.filter((slot) => {

        if (filter === "AVAILABLE") return slot.available;
        if (filter === "BOOKED") return !slot.available;

        return true;
    });

    // Group by date, sorted by date and time
    const grouped = filteredSlots
        .slice()
        .sort((a, b) =>
            `${a.date} ${a.slotTime}`.localeCompare(`${b.date} ${b.slotTime}`)
        )
        .reduce((groups, slot) => {

            if (!groups[slot.date]) {
                groups[slot.date] = [];
            }

            groups[slot.date].push(slot);

            return groups;
        }, {});

    const dates = Object.keys(grouped).sort();

    return (

        <div className="ds-page">

            <style>{styles}</style>

            <div className="ds-container">

                {/* Header */}

                <header className="ds-header">

                    <div className="ds-header-icon">🕒</div>

                    <div>
                        <h1>My Availability Slots</h1>

                        <p>
                            Review the time slots you've created and their booking status
                        </p>
                    </div>

                </header>

                {/* Stats */}

                <section className="ds-stats">

                    <div className="ds-stat tone-blue">
                        <div className="ds-stat-icon">📅</div>
                        <div>
                            <h2>{slots.length}</h2>
                            <p>Total Slots</p>
                        </div>
                    </div>

                    <div className="ds-stat tone-green">
                        <div className="ds-stat-icon">✅</div>
                        <div>
                            <h2>{availableCount}</h2>
                            <p>Available</p>
                        </div>
                    </div>

                    <div className="ds-stat tone-rose">
                        <div className="ds-stat-icon">🔒</div>
                        <div>
                            <h2>{bookedCount}</h2>
                            <p>Booked</p>
                        </div>
                    </div>

                </section>

                {/* Filter tabs */}

                <div className="ds-tabs">

                    {tabs.map((tab) => (

                        <button
                            key={tab.key}
                            type="button"
                            className={`ds-tab ${filter === tab.key ? "active" : ""}`}
                            onClick={() => setFilter(tab.key)}
                        >
                            {tab.label}
                            <span>{tab.count}</span>
                        </button>

                    ))}

                </div>

                {/* Slots */}

                {dates.length === 0 ? (

                    <div className="ds-empty">
                        <div className="ds-empty-icon">📭</div>
                        <h3>No Slots Found</h3>
                        <p>
                            {slots.length === 0
                                ? "Slots you create will show up here."
                                : "No slots match this filter."}
                        </p>
                    </div>

                ) : (

                    <div className="ds-groups">

                        {dates.map((date) => {

                            const daySlots = grouped[date];
                            const dayAvailable = daySlots.filter((slot) => slot.available).length;

                            return (

                                <section key={date} className="ds-group">

                                    <div className="ds-group-header">

                                        <div className="ds-group-title">
                                            <span>📅</span>
                                            <h3>{formatDate(date)}</h3>
                                        </div>

                                        <div className="ds-group-meta">
                                            <span className="ds-pill green">
                                                {dayAvailable} available
                                            </span>

                                            <span className="ds-pill rose">
                                                {daySlots.length - dayAvailable} booked
                                            </span>
                                        </div>

                                    </div>

                                    <div className="ds-slots">

                                        {daySlots.map((slot) => (

                                            <div
                                                key={slot.id}
                                                className={`ds-slot ${slot.available ? "available" : "booked"}`}
                                            >

                                                <strong>
                                                    ⏰ {formatTime(slot.slotTime)}
                                                </strong>

                                                <span>
                                                    <i />
                                                    {slot.available ? "Available" : "Booked"}
                                                </span>

                                            </div>

                                        ))}

                                    </div>

                                </section>

                            );
                        })}

                    </div>

                )}

            </div>

        </div>
    );
}

const styles = `

.ds-page {
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

.ds-page *,
.ds-page *::before,
.ds-page *::after {
    box-sizing: border-box;
}

.ds-page h1,
.ds-page h2,
.ds-page h3,
.ds-page p {
    margin: 0;
}

.ds-container {
    max-width: 1100px;
    margin: 0 auto;
}

.tone-blue  { --tone: #2563eb; --tone-soft: #eff6ff; }
.tone-green { --tone: #16a34a; --tone-soft: #e3f8ea; }
.tone-rose  { --tone: #e11d48; --tone-soft: #ffe6ec; }

/* Header */

.ds-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 28px;
    padding: 28px 32px;
    border-radius: 18px;
    background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
    color: #fff;
}

.ds-header-icon {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    font-size: 30px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.16);
}

.ds-header h1 {
    font-size: 30px;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.2;
}

.ds-header p {
    margin-top: 6px !important;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.8);
}

/* Stats */

.ds-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 28px;
}

.ds-stat {
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

.ds-stat:hover {
    border-color: var(--tone);
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
    transform: translateY(-2px);
}

.ds-stat-icon {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    font-size: 22px;
    border-radius: 12px;
    background: var(--tone-soft);
}

.ds-stat h2 {
    font-size: 26px;
    font-weight: 700;
    line-height: 1.1;
    color: var(--tone);
}

.ds-stat p {
    margin-top: 3px !important;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-muted);
}

/* Tabs */

.ds-tabs {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 22px;
    padding: 5px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
}

.ds-tab {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
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

.ds-tab span {
    padding: 1px 8px;
    border-radius: 999px;
    background: #f1f5f9;
    color: var(--text-muted);
    font-size: 12px;
}

.ds-tab:hover {
    background: var(--primary-soft);
    color: var(--primary);
}

.ds-tab.active {
    background: var(--primary);
    color: #fff;
}

.ds-tab.active span {
    background: rgba(255, 255, 255, 0.22);
    color: #fff;
}

/* Groups */

.ds-groups {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.ds-group {
    padding: 22px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
}

.ds-group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 18px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
}

.ds-group-title {
    display: flex;
    align-items: center;
    gap: 10px;
}

.ds-group-title span {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    font-size: 18px;
    border-radius: 10px;
    background: var(--primary-soft);
}

.ds-group-title h3 {
    font-size: 17px;
    font-weight: 600;
}

.ds-group-meta {
    display: flex;
    gap: 8px;
}

.ds-pill {
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
}

.ds-pill.green {
    background: #dcfce7;
    color: #15803d;
}

.ds-pill.rose {
    background: #fee2e2;
    color: #b91c1c;
}

/* Slots */

.ds-slots {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
}

.ds-slot {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 14px;
    border: 1.5px solid var(--border);
    border-radius: 12px;
    background: #fff;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ds-slot:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.07);
}

.ds-slot strong {
    font-size: 14.5px;
    font-weight: 600;
    color: var(--text);
}

.ds-slot span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12.5px;
    font-weight: 600;
}

.ds-slot span i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
}

.ds-slot.available {
    border-color: #bbf7d0;
    background: #f6fef9;
}

.ds-slot.available span {
    color: #15803d;
}

.ds-slot.booked {
    border-color: #fecdd3;
    background: #fff8f9;
}

.ds-slot.booked span {
    color: #be123c;
}

/* Empty */

.ds-empty {
    padding: 64px 24px;
    text-align: center;
    background: var(--surface);
    border: 1.5px dashed #cbd5e1;
    border-radius: var(--radius);
}

.ds-empty-icon {
    width: 68px;
    height: 68px;
    margin: 0 auto 14px;
    display: grid;
    place-items: center;
    font-size: 32px;
    border-radius: 20px;
    background: var(--primary-soft);
}

.ds-empty h3 {
    font-size: 18px;
    font-weight: 600;
}

.ds-empty p {
    margin-top: 6px !important;
    font-size: 14px;
    color: var(--text-muted);
}

/* Responsive */

@media (max-width: 640px) {
    .ds-page {
        padding: 20px 14px 40px;
    }

    .ds-header {
        padding: 22px 20px;
        gap: 14px;
    }

    .ds-header-icon {
        width: 52px;
        height: 52px;
        font-size: 24px;
    }

    .ds-header h1 {
        font-size: 22px;
    }

    .ds-stats {
        grid-template-columns: 1fr;
    }

    .ds-tabs {
        display: flex;
    }

    .ds-tab {
        flex: 1;
        justify-content: center;
        padding: 8px 10px;
    }

    .ds-group {
        padding: 16px;
    }

    .ds-slots {
        grid-template-columns: repeat(2, 1fr);
    }
}

`;

export default DoctorSlots;