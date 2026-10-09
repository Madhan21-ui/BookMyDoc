import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowLeft, BadgeCheck, CalendarDays, Clock3, FileText, User, Phone, Building2,
    Loader2, CheckCircle2, AlertCircle, CalendarX2, SearchX,
} from "lucide-react";
import api from "../services/api";

const todayISO = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
};

const prettyDate = (iso) =>
    iso
        ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
            weekday: "long", day: "numeric", month: "long",
        })
        : "";

const initialOf = (name = "") => (name.replace(/^dr\.?\s*/i, "").trim()[0] || "D").toUpperCase();

const EMPTY_APPOINTMENT = {
    doctorId: "", doctorName: "", patientName: "", phoneNumber: "", userEmail: "",
    appointmentDate: "", appointmentTime: "", reason: "", status: "PENDING",
};

function BookAppointment() {
    const [searchParams] = useSearchParams();
    const selectedDoctorId = searchParams.get("doctorId") || "";

    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [doctorState, setDoctorState] = useState(selectedDoctorId ? "loading" : "missing");
    const [availableSlots, setAvailableSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [appointment, setAppointment] = useState(EMPTY_APPOINTMENT);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [booked, setBooked] = useState(null); // summary of the confirmed request
    const slotRequest = useRef(0);

    /* ----- Doctor ----- */
    useEffect(() => {
        if (!selectedDoctorId) {
            setDoctorState("missing");
            return;
        }
        setDoctorState("loading");
        api
            .get(`/doctors/${selectedDoctorId}`)
            .then((response) => {
                const doctor = response.data;
                setSelectedDoctor(doctor);
                setAppointment((prev) => ({ ...prev, doctorId: doctor.id, doctorName: doctor.name }));
                setDoctorState("ready");
            })
            .catch((e) => {
                console.error(e);
                setDoctorState("missing");
            });
    }, [selectedDoctorId]);

    /* ----- Patient ----- */
    useEffect(() => {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) return;

        api
            .get(`/users/email/${userEmail}`)
            .then((response) =>
                setAppointment((prev) => ({
                    ...prev,
                    patientName: response.data.name,
                    phoneNumber: response.data.phoneNumber,
                    userEmail: response.data.email,
                }))
            )
            .catch((e) => console.error(e));
    }, []);

    /* ----- Slots (ignores out-of-date responses if the date changes quickly) ----- */
    const fetchAvailableSlots = async (selectedDate) => {
        const requestId = ++slotRequest.current;
        setSlotsLoading(true);
        try {
            const response = await api.get(`/availability/doctor/${selectedDoctorId}/${selectedDate}`);
            if (requestId === slotRequest.current) setAvailableSlots(response.data || []);
        } catch (e) {
            console.error(e);
            if (requestId === slotRequest.current) setAvailableSlots([]);
        } finally {
            if (requestId === slotRequest.current) setSlotsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setError("");

        if (name === "appointmentDate") {
            setAppointment((prev) => ({ ...prev, appointmentDate: value, appointmentTime: "" }));
            if (value) fetchAvailableSlots(value);
            else setAvailableSlots([]);
            return;
        }
        setAppointment((prev) => ({ ...prev, [name]: value }));
    };

    const pickSlot = (slotTime) => {
        setError("");
        setAppointment((prev) => ({ ...prev, appointmentTime: slotTime }));
    };

    const canSubmit =
        appointment.reason.trim() && appointment.appointmentDate && appointment.appointmentTime && !submitting;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit) return;

        setError("");
        setSubmitting(true);
        try {
            await api.post("/appointments", appointment);
            setBooked({
                doctor: appointment.doctorName,
                date: appointment.appointmentDate,
                time: appointment.appointmentTime,
            });
            setAppointment((prev) => ({
                ...prev, appointmentDate: "", appointmentTime: "", reason: "", status: "PENDING",
            }));
            setAvailableSlots([]);
        } catch (e2) {
            console.error(e2);
            setError("We could not send your request. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    /* ---------- Loading / missing doctor ---------- */
    if (doctorState === "loading") {
        return (
            <main className="ba">
                <style>{styles}</style>
                <div className="ba-wrap" aria-busy="true">
                    <div className="ba-skel ba-skel--head" />
                    <div className="ba-skel ba-skel--body" />
                </div>
            </main>
        );
    }

    if (doctorState === "missing") {
        return (
            <main className="ba">
                <style>{styles}</style>
                <div className="ba-wrap">
                    <div className="ba-empty">
                        <span className="ba-empty__icon"><SearchX size={28} /></span>
                        <h1>Choose a doctor first</h1>
                        <p>Pick a doctor from the list, then come back here to choose a date and time.</p>
                        <Link to="/doctors" className="ba-btn ba-btn--primary">Browse doctors</Link>
                    </div>
                </div>
            </main>
        );
    }

    /* ---------- Success ---------- */
    if (booked) {
        return (
            <main className="ba">
                <style>{styles}</style>
                <div className="ba-wrap">
                    <motion.div
                        className="ba-done"
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                    >
                        <span className="ba-done__icon"><CheckCircle2 size={40} /></span>
                        <h1>Request sent</h1>
                        <p>
                            Your appointment request with <strong>{booked.doctor}</strong> has been sent.
                            You will see its status on your appointments page.
                        </p>

                        <dl className="ba-done__sum">
                            <div><dt>Date</dt><dd>{prettyDate(booked.date)}</dd></div>
                            <div><dt>Time</dt><dd>{booked.time}</dd></div>
                        </dl>

                        <div className="ba-done__actions">
                            <Link to="/appointments" className="ba-btn ba-btn--primary">View my appointments</Link>
                            <button className="ba-btn ba-btn--ghost" onClick={() => setBooked(null)}>
                                Book another time
                            </button>
                        </div>
                    </motion.div>
                </div>
            </main>
        );
    }

    const dateChosen = !!appointment.appointmentDate;

    return (
        <main className="ba">
            <style>{styles}</style>

            <div className="ba-wrap">
                <Link to={`/doctors/${selectedDoctorId}`} className="ba-back">
                    <ArrowLeft size={16} /> Back to profile
                </Link>

                <header className="ba-head">
                    <h1>Book an appointment</h1>
                    <p>Three quick steps and your request goes straight to the doctor.</p>
                </header>

                <form className="ba-layout" onSubmit={handleSubmit}>
                    {/* ---------- Steps ---------- */}
                    <div className="ba-steps">
                        {/* Step 1 */}
                        <section className="ba-card">
                            <h2><span className="ba-num">1</span> Reason for your visit</h2>
                            <label className="ba-field">
                                <span className="ba-field__box">
                                    <FileText size={18} />
                                    <input
                                        type="text"
                                        name="reason"
                                        value={appointment.reason}
                                        onChange={handleChange}
                                        placeholder="For example: fever for two days, follow-up checkup"
                                        maxLength={160}
                                        required
                                    />
                                </span>
                            </label>
                        </section>

                        {/* Step 2 */}
                        <section className="ba-card">
                            <h2><span className="ba-num">2</span> Choose a date</h2>
                            <label className="ba-field">
                                <span className="ba-field__box">
                                    <CalendarDays size={18} />
                                    <input
                                        type="date"
                                        name="appointmentDate"
                                        value={appointment.appointmentDate}
                                        min={todayISO()}
                                        onChange={handleChange}
                                        required
                                    />
                                </span>
                            </label>
                        </section>

                        {/* Step 3 */}
                        <section className="ba-card">
                            <h2><span className="ba-num">3</span> Pick a time</h2>

                            {!dateChosen ? (
                                <p className="ba-hint"><Clock3 size={16} /> Choose a date to see available times.</p>
                            ) : slotsLoading ? (
                                <div className="ba-slots" aria-busy="true">
                                    {[1, 2, 3, 4, 5, 6].map((n) => <span key={n} className="ba-skel ba-skel--slot" />)}
                                </div>
                            ) : availableSlots.length === 0 ? (
                                <div className="ba-noslots">
                                    <CalendarX2 size={22} />
                                    <div>
                                        <strong>No times available on this date</strong>
                                        <p>Try another day. The doctor may not be working then.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="ba-slots" role="radiogroup" aria-label="Available times">
                                    {availableSlots.map((slot) => {
                                        const active = appointment.appointmentTime === slot.slotTime;
                                        return (
                                            <button
                                                key={slot.id}
                                                type="button"
                                                role="radio"
                                                aria-checked={active}
                                                className={`ba-slot ${active ? "is-active" : ""}`}
                                                onClick={() => pickSlot(slot.slotTime)}
                                            >
                                                {slot.slotTime}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* ---------- Summary ---------- */}
                    <aside className="ba-side">
                        <div className="ba-summary">
                            <p className="ba-summary__label">Your appointment</p>

                            <div className="ba-doc">
                                <span className="ba-doc__avatar">{initialOf(selectedDoctor?.name)}</span>
                                <div>
                                    <h3>{selectedDoctor?.name} <BadgeCheck size={16} /></h3>
                                    <p>{selectedDoctor?.specialization}</p>
                                </div>
                            </div>

                            <dl className="ba-rows">
                                {selectedDoctor?.hospitalName && (
                                    <div><dt><Building2 size={15} /> Hospital</dt><dd>{selectedDoctor.hospitalName}</dd></div>
                                )}
                                <div>
                                    <dt><CalendarDays size={15} /> Date</dt>
                                    <dd className={dateChosen ? "" : "is-empty"}>{dateChosen ? prettyDate(appointment.appointmentDate) : "Not chosen"}</dd>
                                </div>
                                <div>
                                    <dt><Clock3 size={15} /> Time</dt>
                                    <dd className={appointment.appointmentTime ? "" : "is-empty"}>{appointment.appointmentTime || "Not chosen"}</dd>
                                </div>
                                <div><dt><User size={15} /> Patient</dt><dd>{appointment.patientName || "–"}</dd></div>
                                <div><dt><Phone size={15} /> Phone</dt><dd>{appointment.phoneNumber || "–"}</dd></div>
                            </dl>

                            <AnimatePresence initial={false}>
                                {error && (
                                    <motion.div
                                        role="alert"
                                        className="ba-error"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <AlertCircle size={16} /> <span>{error}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button type="submit" className="ba-btn ba-btn--light ba-btn--block" disabled={!canSubmit}>
                                {submitting ? <><Loader2 size={18} className="ba-spin" /> Sending request</> : "Confirm appointment"}
                            </button>

                            <p className="ba-note">
                                {canSubmit ? "The doctor will review your request." : "Fill in all three steps to continue."}
                            </p>
                        </div>
                    </aside>
                </form>
            </div>
        </main>
    );
}

const styles = `
@import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");

.ba {
    --ink: #0b2a2c;
    --ink-2: #123a3d;
    --teal: #0f766e;
    --teal-dark: #0a5a54;
    --mint: #e2f3ed;
    --mint-2: #cfeadf;
    --paper: #f6f8f5;
    --line: #dbe4e0;
    --muted: #55696a;
    --amber: #f2b441;
    --bright: #5fd3b4;
    --err: #b42318;

    min-height: calc(100vh - 68px);
    padding: 28px 20px 72px;
    background: var(--paper);
    color: var(--ink);
    font-family: "Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif;
}
.ba *, .ba *::before, .ba *::after { box-sizing: border-box; }
.ba h1, .ba h2, .ba h3, .ba p, .ba dl, .ba dd { margin: 0; padding: 0; }
.ba :focus-visible { outline: 3px solid var(--amber); outline-offset: 2px; border-radius: 8px; }
.ba-wrap { max-width: 1060px; margin: 0 auto; }

.ba-back { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 18px; padding: 9px 16px; border: 1.5px solid var(--line); border-radius: 99px; background: #fff; color: var(--muted); font-size: 14px; font-weight: 600; text-decoration: none; transition: color 0.18s, border-color 0.18s; }
.ba-back:hover { color: var(--teal-dark); border-color: var(--teal); }

.ba-head { margin-bottom: 26px; }
.ba-head h1 { font-family: "Bricolage Grotesque", "Segoe UI", sans-serif; font-size: clamp(30px, 4.5vw, 44px); font-weight: 800; letter-spacing: -0.035em; line-height: 1.08; }
.ba-head p { margin-top: 10px; font-size: 17px; color: var(--muted); }

.ba-layout { display: grid; grid-template-columns: 1.4fr 1fr; gap: 20px; align-items: start; }
.ba-steps { display: grid; gap: 16px; min-width: 0; }

.ba-card { padding: 24px; background: #fff; border: 1px solid var(--line); border-radius: 22px; }
.ba-card h2 { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; font-family: "Bricolage Grotesque", "Segoe UI", sans-serif; font-size: 19px; font-weight: 700; }
.ba-num { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: var(--teal); color: #fff; font: 700 14px "Plus Jakarta Sans", sans-serif; }

.ba-field { display: block; }
.ba-field__box { display: flex; align-items: center; gap: 12px; height: 52px; padding: 0 16px; border: 1.5px solid var(--line); border-radius: 13px; background: var(--paper); color: var(--teal); transition: border-color 0.18s, background 0.18s, box-shadow 0.18s; }
.ba-field__box:hover { border-color: #bccdc7; }
.ba-field__box:focus-within { border-color: var(--teal); background: #fff; box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.14); }
.ba-field__box input { flex: 1; min-width: 0; height: 100%; border: 0; outline: 0; background: transparent; font: 500 15.5px "Plus Jakarta Sans", sans-serif; color: var(--ink); }
.ba-field__box input::placeholder { color: #8da09b; }

.ba-hint { display: flex; align-items: center; gap: 10px; padding: 16px; border-radius: 13px; background: var(--paper); color: var(--muted); font-size: 14.5px; }
.ba-hint svg { color: var(--teal); }

.ba-slots { display: grid; grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); gap: 10px; }
.ba-slot { padding: 13px 8px; border: 1.5px solid var(--line); border-radius: 12px; background: #fff; color: var(--ink); font: 600 14.5px "Plus Jakarta Sans", sans-serif; cursor: pointer; transition: border-color 0.16s, background 0.16s, color 0.16s, transform 0.16s; }
.ba-slot:hover { border-color: var(--teal); background: var(--mint); }
.ba-slot.is-active { background: var(--teal); border-color: var(--teal); color: #fff; transform: scale(1.03); }

.ba-noslots { display: flex; align-items: flex-start; gap: 14px; padding: 18px; border: 1.5px dashed var(--line); border-radius: 14px; background: var(--paper); color: var(--muted); }
.ba-noslots svg { flex: none; margin-top: 2px; color: #b87c0b; }
.ba-noslots strong { display: block; color: var(--ink); font-size: 15px; }
.ba-noslots p { margin-top: 4px; font-size: 14px; }

/* ---------- Summary ---------- */
.ba-side { position: sticky; top: 92px; }
.ba-summary { padding: 26px; border-radius: 24px; color: #fff; background: radial-gradient(360px 220px at 100% 0%, rgba(95, 211, 180, 0.26), transparent 70%), var(--ink); box-shadow: 0 30px 56px -30px rgba(11, 42, 44, 0.8); }
.ba-summary__label { margin-bottom: 18px; font-size: 14px; font-weight: 600; color: rgba(255, 255, 255, 0.7); }
.ba-doc { display: flex; align-items: center; gap: 14px; padding-bottom: 20px; border-bottom: 1px dashed rgba(255, 255, 255, 0.2); }
.ba-doc__avatar { flex: none; display: grid; place-items: center; width: 52px; height: 52px; border-radius: 15px; background: var(--bright); color: var(--ink); font: 800 21px "Bricolage Grotesque", sans-serif; }
.ba-doc h3 { display: flex; align-items: center; gap: 6px; font-family: "Bricolage Grotesque", "Segoe UI", sans-serif; font-size: 18px; font-weight: 700; line-height: 1.2; }
.ba-doc h3 svg { flex: none; color: var(--bright); }
.ba-doc p { margin-top: 4px; font-size: 14px; color: var(--bright); font-weight: 600; }

.ba-rows { display: grid; margin: 6px 0 20px; }
.ba-rows > div { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.ba-rows dt { display: inline-flex; align-items: center; gap: 8px; flex: none; font-size: 13.5px; color: rgba(255, 255, 255, 0.65); }
.ba-rows dd { text-align: right; font-size: 14.5px; font-weight: 600; overflow-wrap: anywhere; }
.ba-rows dd.is-empty { font-weight: 500; color: rgba(255, 255, 255, 0.4); }

.ba-error { display: flex; align-items: flex-start; gap: 9px; margin-bottom: 14px; padding: 11px 14px; overflow: hidden; border-radius: 12px; background: #fdecea; color: var(--err); font-size: 14px; font-weight: 500; line-height: 1.45; }
.ba-error svg { flex: none; margin-top: 2px; }
.ba-note { margin-top: 12px; text-align: center; font-size: 13px; color: rgba(255, 255, 255, 0.6); }

/* ---------- Buttons ---------- */
.ba-btn { display: inline-flex; align-items: center; justify-content: center; gap: 9px; padding: 14px 24px; border: 1.5px solid transparent; border-radius: 13px; font: 700 15.5px "Plus Jakarta Sans", sans-serif; text-decoration: none; cursor: pointer; transition: background 0.18s, color 0.18s, border-color 0.18s, transform 0.18s; }
.ba-btn:active:not(:disabled) { transform: scale(0.98); }
.ba-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.ba-btn--primary { background: var(--teal); color: #fff; }
.ba-btn--primary:hover { background: var(--teal-dark); }
.ba-btn--ghost { background: #fff; color: var(--ink); border-color: var(--line); }
.ba-btn--ghost:hover { border-color: var(--teal); color: var(--teal-dark); }
.ba-btn--light { background: var(--bright); color: var(--ink); }
.ba-btn--light:hover:not(:disabled) { background: #fff; }
.ba-btn--block { width: 100%; }
.ba-spin { animation: ba-spin 0.8s linear infinite; }
@keyframes ba-spin { to { transform: rotate(360deg); } }

/* ---------- Success ---------- */
.ba-done { max-width: 560px; margin: 40px auto 0; padding: 48px 36px; text-align: center; background: #fff; border: 1px solid var(--line); border-radius: 28px; box-shadow: 0 30px 56px -34px rgba(11, 42, 44, 0.5); }
.ba-done__icon { display: inline-grid; place-items: center; width: 80px; height: 80px; margin-bottom: 18px; border-radius: 50%; background: var(--mint); color: var(--teal); }
.ba-done h1 { font-family: "Bricolage Grotesque", "Segoe UI", sans-serif; font-size: 32px; font-weight: 800; letter-spacing: -0.03em; }
.ba-done > p { margin-top: 10px; line-height: 1.7; color: var(--muted); }
.ba-done__sum { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 24px 0; }
.ba-done__sum > div { padding: 14px; border-radius: 14px; background: var(--paper); }
.ba-done__sum dt { font-size: 12.5px; font-weight: 600; color: var(--muted); }
.ba-done__sum dd { margin-top: 4px; font-weight: 700; font-size: 15px; }
.ba-done__actions { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }

/* ---------- Empty + skeleton ---------- */
.ba-empty { display: grid; justify-items: center; gap: 10px; max-width: 560px; margin: 40px auto 0; padding: 64px 28px; text-align: center; background: #fff; border: 1.5px dashed var(--line); border-radius: 26px; }
.ba-empty__icon { display: grid; place-items: center; width: 62px; height: 62px; margin-bottom: 4px; border-radius: 18px; background: var(--mint); color: var(--teal); }
.ba-empty h1 { font-family: "Bricolage Grotesque", "Segoe UI", sans-serif; font-size: 26px; }
.ba-empty p { margin-bottom: 12px; color: var(--muted); }

.ba-skel { display: block; border-radius: 18px; background: linear-gradient(90deg, #e9efec 25%, #f4f7f5 50%, #e9efec 75%); background-size: 200% 100%; animation: ba-shimmer 1.4s linear infinite; }
.ba-skel--head { height: 80px; margin-top: 54px; }
.ba-skel--body { height: 340px; margin-top: 20px; }
.ba-skel--slot { height: 46px; border-radius: 12px; }
@keyframes ba-shimmer { to { background-position: -200% 0; } }

/* ---------- Responsive ---------- */
@media (max-width: 900px) {
    .ba-layout { grid-template-columns: 1fr; }
    .ba-side { position: static; }
}
@media (max-width: 600px) {
    .ba { padding: 18px 14px 56px; }
    .ba-card { padding: 20px; }
    .ba-done { padding: 36px 22px; }
    .ba-done__sum { grid-template-columns: 1fr; }
    .ba-done__actions .ba-btn { width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
    .ba *, .ba *::before, .ba *::after { animation: none !important; transition: none !important; }
}
`;

export default BookAppointment;