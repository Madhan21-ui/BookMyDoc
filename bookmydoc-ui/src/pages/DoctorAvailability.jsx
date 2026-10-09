import { useState } from "react";
import api from "../services/api";

function DoctorAvailability() {

    const doctorId = localStorage.getItem("doctorId");
    const doctorName = localStorage.getItem("doctorName");

    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [slots, setSlots] = useState([]);
    const [saving, setSaving] = useState(false);

    const selectedCount = slots.filter((slot) => slot.selected).length;

    // 24h -> 12h label (display only, payload still uses 24h)
    const formatTime = (time) => {

        const [h, m] = time.split(":").map(Number);
        const suffix = h >= 12 ? "PM" : "AM";
        const hour = h % 12 || 12;

        return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
    };

    const generateSlots = () => {

        if (!date) {
            alert("Please select a date");
            return;
        }

        if (!startTime || !endTime) {
            alert("Please select start and end time");
            return;
        }

        const generatedSlots = [];

        let current = new Date(`2026-01-01T${startTime}`);
        const end = new Date(`2026-01-01T${endTime}`);

        while (current <= end) {

            generatedSlots.push({
                time: current.toTimeString().slice(0, 5),
                selected: false
            });

            current.setMinutes(current.getMinutes() + 10);
        }

        setSlots(generatedSlots);
    };

    const toggleSlot = (index) => {

        setSlots((prev) =>
            prev.map((slot, i) =>
                i === index
                    ? { ...slot, selected: !slot.selected }
                    : slot
            )
        );
    };

    const selectAll = () => {
        setSlots((prev) => prev.map((slot) => ({ ...slot, selected: true })));
    };

    const clearAll = () => {
        setSlots((prev) => prev.map((slot) => ({ ...slot, selected: false })));
    };

    const saveAvailability = async () => {

        try {

            const selectedSlots = slots.filter((slot) => slot.selected);

            if (selectedSlots.length === 0) {
                alert("Please select at least one slot");
                return;
            }

            setSaving(true);

            for (const slot of selectedSlots) {

                const payload = {
                    doctorId: Number(doctorId),
                    doctorName: doctorName,
                    date: date,
                    slotTime: slot.time,
                    available: true
                };

                await api.post("/availability", payload);
            }

            alert("Availability Saved Successfully");

            setDate("");
            setStartTime("");
            setEndTime("");
            setSlots([]);

        } catch (error) {

            console.error(error);
            console.log(error.response);

            alert("Failed To Save Availability");

        } finally {

            setSaving(false);
        }
    };

    const prettyDate = date
        ? new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        })
        : "";

    return (

        <div className="da-page">

            <style>{styles}</style>

            <div className="da-container">

                {/* Header */}

                <header className="da-header">

                    <div className="da-header-icon">📅</div>

                    <div>
                        <p className="da-welcome">
                            Welcome, {doctorName}
                        </p>

                        <h1>Manage Availability</h1>

                        <p className="da-subtitle">
                            Create time slots so patients can book appointments with you
                        </p>
                    </div>

                </header>

                <div className="da-layout">

                    {/* Left: form */}

                    <section className="da-card da-form-card">

                        <div className="da-card-title">
                            <span className="da-step">1</span>
                            <div>
                                <h3>Select Date & Time</h3>
                                <p>Choose the day and your working hours</p>
                            </div>
                        </div>

                        <div className="da-field">
                            <label htmlFor="da-date">Date</label>
                            <input
                                id="da-date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div className="da-row">

                            <div className="da-field">
                                <label htmlFor="da-start">Start Time</label>
                                <input
                                    id="da-start"
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>

                            <div className="da-field">
                                <label htmlFor="da-end">End Time</label>
                                <input
                                    id="da-end"
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>

                        </div>

                        <div className="da-note">
                            ⏱️ Slots are generated every <strong>10 minutes</strong>
                        </div>

                        <button
                            type="button"
                            className="da-btn da-btn-primary"
                            onClick={generateSlots}
                        >
                            Generate Slots
                        </button>

                    </section>

                    {/* Right: slots */}

                    <section className="da-card da-slots-card">

                        <div className="da-card-title">
                            <span className="da-step">2</span>
                            <div>
                                <h3>Choose Slots</h3>
                                <p>
                                    {prettyDate
                                        ? prettyDate
                                        : "Tap the slots you want to make available"}
                                </p>
                            </div>
                        </div>

                        {slots.length === 0 ? (

                            <div className="da-empty">
                                <div className="da-empty-icon">🕒</div>
                                <h4>No slots generated yet</h4>
                                <p>
                                    Pick a date and time range, then click
                                    <strong> Generate Slots</strong>.
                                </p>
                            </div>

                        ) : (

                            <>
                                <div className="da-toolbar">

                                    <span className="da-count">
                                        <strong>{selectedCount}</strong> of {slots.length} selected
                                    </span>

                                    <div className="da-toolbar-actions">
                                        <button
                                            type="button"
                                            className="da-link"
                                            onClick={selectAll}
                                        >
                                            Select all
                                        </button>

                                        <button
                                            type="button"
                                            className="da-link"
                                            onClick={clearAll}
                                        >
                                            Clear
                                        </button>
                                    </div>

                                </div>

                                <div className="da-slots-grid">

                                    {slots.map((slot, index) => (

                                        <button
                                            key={slot.time}
                                            type="button"
                                            className={`da-slot ${slot.selected ? "active" : ""}`}
                                            onClick={() => toggleSlot(index)}
                                        >
                                            {formatTime(slot.time)}
                                        </button>

                                    ))}

                                </div>

                                <div className="da-footer">

                                    <p>
                                        {selectedCount === 0
                                            ? "Select at least one slot to save"
                                            : `${selectedCount} slot${selectedCount > 1 ? "s" : ""} will be saved`}
                                    </p>

                                    <button
                                        type="button"
                                        className="da-btn da-btn-success"
                                        onClick={saveAvailability}
                                        disabled={saving || selectedCount === 0}
                                    >
                                        {saving ? "Saving..." : "Save Availability"}
                                    </button>

                                </div>
                            </>

                        )}

                    </section>

                </div>

            </div>

        </div>
    );
}

const styles = `

.da-page {
    --primary: #2563eb;
    --primary-dark: #1d4ed8;
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

.da-page *,
.da-page *::before,
.da-page *::after {
    box-sizing: border-box;
}

.da-page h1,
.da-page h3,
.da-page h4,
.da-page p {
    margin: 0;
}

.da-container {
    max-width: 1100px;
    margin: 0 auto;
}

/* Header */

.da-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 28px;
    padding: 28px 32px;
    border-radius: 18px;
    background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
    color: #fff;
}

.da-header-icon {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    font-size: 30px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.16);
}

.da-welcome {
    margin-bottom: 4px !important;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
}

.da-header h1 {
    font-size: 30px;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.2;
}

.da-subtitle {
    margin-top: 6px !important;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.8);
}

/* Layout */

.da-layout {
    display: grid;
    grid-template-columns: 380px 1fr;
    gap: 24px;
    align-items: start;
}

.da-card {
    padding: 26px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
}

.da-card-title {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 22px;
    padding-bottom: 18px;
    border-bottom: 1px solid var(--border);
}

.da-step {
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: var(--primary-soft);
    color: var(--primary);
    font-size: 15px;
    font-weight: 700;
}

.da-card-title h3 {
    font-size: 17px;
    font-weight: 600;
}

.da-card-title p {
    margin-top: 2px !important;
    font-size: 13px;
    color: var(--text-muted);
}

/* Form */

.da-field {
    margin-bottom: 16px;
    flex: 1;
    min-width: 0;
}

.da-field label {
    display: block;
    margin-bottom: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-soft);
}

.da-field input {
    width: 100%;
    padding: 11px 14px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: #fff;
    color: var(--text);
    font-family: inherit;
    font-size: 15px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.da-field input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.da-row {
    display: flex;
    gap: 12px;
}

.da-note {
    margin: 4px 0 20px;
    padding: 11px 14px;
    border-radius: 10px;
    background: var(--primary-soft);
    color: var(--text-soft);
    font-size: 13.5px;
}

/* Buttons */

.da-btn {
    width: 100%;
    padding: 13px 20px;
    border: none;
    border-radius: 10px;
    color: #fff;
    font-family: inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.da-btn:hover:not(:disabled) {
    transform: translateY(-1px);
}

.da-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.da-btn-primary {
    background: var(--primary);
}

.da-btn-primary:hover:not(:disabled) {
    background: var(--primary-dark);
    box-shadow: 0 8px 18px rgba(37, 99, 235, 0.28);
}

.da-btn-success {
    width: auto;
    min-width: 190px;
    background: #16a34a;
}

.da-btn-success:hover:not(:disabled) {
    background: #15803d;
    box-shadow: 0 8px 18px rgba(22, 163, 74, 0.28);
}

/* Slots */

.da-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 16px;
}

.da-count {
    font-size: 14px;
    color: var(--text-muted);
}

.da-count strong {
    color: var(--primary);
    font-size: 16px;
}

.da-toolbar-actions {
    display: flex;
    gap: 6px;
}

.da-link {
    padding: 6px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: #fff;
    color: var(--primary);
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease;
}

.da-link:hover {
    background: var(--primary-soft);
    border-color: var(--primary);
}

.da-slots-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
    gap: 10px;
    max-height: 420px;
    padding: 4px;
    margin: 0 -4px;
    overflow-y: auto;
}

.da-slot {
    padding: 11px 8px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    background: #fff;
    color: var(--text-soft);
    font-family: inherit;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s ease;
}

.da-slot:hover {
    border-color: var(--primary);
    background: var(--primary-soft);
    color: var(--primary);
}

.da-slot.active {
    border-color: var(--primary);
    background: var(--primary);
    color: #fff;
    box-shadow: 0 6px 14px rgba(37, 99, 235, 0.28);
}

.da-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 22px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
}

.da-footer p {
    font-size: 14px;
    color: var(--text-muted);
}

/* Empty state */

.da-empty {
    padding: 56px 20px;
    text-align: center;
    border: 1.5px dashed #cbd5e1;
    border-radius: 14px;
    background: #fbfcfe;
}

.da-empty-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 14px;
    display: grid;
    place-items: center;
    font-size: 30px;
    border-radius: 18px;
    background: var(--primary-soft);
}

.da-empty h4 {
    font-size: 17px;
    font-weight: 600;
}

.da-empty p {
    max-width: 320px;
    margin: 6px auto 0 !important;
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-muted);
}

/* Responsive */

@media (max-width: 900px) {
    .da-layout {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 560px) {
    .da-page {
        padding: 20px 14px 40px;
    }

    .da-header {
        padding: 22px 20px;
        gap: 14px;
    }

    .da-header-icon {
        width: 52px;
        height: 52px;
        font-size: 24px;
    }

    .da-header h1 {
        font-size: 24px;
    }

    .da-card {
        padding: 20px;
    }

    .da-row {
        flex-direction: column;
        gap: 0;
    }

    .da-footer {
        flex-direction: column;
        align-items: stretch;
    }

    .da-btn-success {
        width: 100%;
    }
}

`;

export default DoctorAvailability;