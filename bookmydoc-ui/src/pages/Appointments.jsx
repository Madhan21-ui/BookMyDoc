import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
    CalendarPlus, CalendarX2, Clock3, FileText, Stethoscope, Trash2, Loader2,
    CheckCircle2, AlertCircle, TriangleAlert,
} from "lucide-react";
import api from "../services/api";

/* ---------- helpers ---------- */
const parseDate = (v) => {
    if (!v) return null;
    const d = /^\d{4}-\d{2}-\d{2}$/.test(v) ? new Date(`${v}T00:00:00`) : new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
};
const startOfToday = () => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
};
const isPast = (a) => {
    const d = parseDate(a.appointmentDate);
    return d ? d < startOfToday() : false;
};
const statusOf = (a) => String(a.status || "PENDING").toUpperCase();
const dayParts = (v) => {
    const d = parseDate(v);
    if (!d) return { day: "–", month: "", weekday: "" };
    return {
        day: d.toLocaleDateString("en-IN", { day: "2-digit" }),
        month: d.toLocaleDateString("en-IN", { month: "short" }),
        weekday: d.toLocaleDateString("en-IN", { weekday: "long" }),
    };
};
const sortAppointments = (list) => {
    const stamp = (a) => parseDate(a.appointmentDate)?.getTime() ?? 0;
    const upcoming = list.filter((a) => !isPast(a)).sort((a, b) => stamp(a) - stamp(b));
    const past = list.filter(isPast).sort((a, b) => stamp(b) - stamp(a));
    return [...upcoming, ...past];
};

const TABS = [
    { key: "ALL", label: "All" },
    { key: "UPCOMING", label: "Upcoming" },
    { key: "PENDING", label: "Pending" },
    { key: "APPROVED", label: "Approved" },
    { key: "PAST", label: "Past" },
];

const matchesTab = (a, tab) => {
    if (tab === "UPCOMING") return !isPast(a) && statusOf(a) !== "REJECTED";
    if (tab === "PENDING") return statusOf(a) === "PENDING";
    if (tab === "APPROVED") return statusOf(a) === "APPROVED";
    if (tab === "PAST") return isPast(a);
    return true;
};

const STATUS_TEXT = {
    PENDING: "Waiting for the doctor",
    APPROVED: "Confirmed",
    REJECTED: "Not accepted",
};

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);
    const [tab, setTab] = useState("ALL");
    const [toCancel, setToCancel] = useState(null); // appointment awaiting confirmation
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState(null);
    const keepRef = useRef(null);

    const load = () => {
        const userEmail = localStorage.getItem("userEmail");
        setLoading(true);
        setFailed(false);
        api
            .get(`/appointments/user/${userEmail}`)
            .then((response) => setAppointments(response.data || []))
            .catch((error) => {
                console.error(error);
                setFailed(true);
            })
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [toast]);

    // Esc closes the dialog; focus moves to the safe option
    useEffect(() => {
        if (!toCancel) return;
        keepRef.current?.focus();
        const onKey = (e) => e.key === "Escape" && !busy && setToCancel(null);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [toCancel, busy]);

    const confirmCancel = async () => {
        if (!toCancel) return;
        setBusy(true);
        try {
            await api.delete(`/appointments/${toCancel.id}`);
            setAppointments((prev) => prev.filter((a) => a.id !== toCancel.id));
            setToast({ type: "success", text: "Appointment cancelled." });
            setToCancel(null);
        } catch (error) {
            console.error(error);
            setToast({ type: "error", text: "We could not cancel it. Please try again." });
            setToCancel(null);
        } finally {
            setBusy(false);
        }
    };

    const sorted = useMemo(() => sortAppointments(appointments), [appointments]);
    const visible = useMemo(() => sorted.filter((a) => matchesTab(a, tab)), [sorted, tab]);
    const counts = useMemo(
        () => Object.fromEntries(TABS.map((t) => [t.key, sorted.filter((a) => matchesTab(a, t.key)).length])),
        [sorted]
    );

    return (
        <main className="ap">
            <style>{styles}</style>

            <div className="ap-wrap">
                <header className="ap-head">
                    <div>
                        <h1>My appointments</h1>
                        <p>Track your requests and manage upcoming visits.</p>
                    </div>
                    <Link to="/doctors" className="ap-btn ap-btn--primary">
                        <CalendarPlus size={17} /> Book new
                    </Link>
                </header>

                {/* ---------- Tabs ---------- */}
                {!loading && !failed && appointments.length > 0 && (
                    <div className="ap-tabs" role="tablist" aria-label="Filter appointments">
                        {TABS.map((t) => (
                            <button
                                key={t.key}
                                role="tab"
                                aria-selected={tab === t.key}
                                className={`ap-tab ${tab === t.key ? "is-active" : ""}`}
                                onClick={() => setTab(t.key)}
                            >
                                {t.label} <span>{counts[t.key]}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* ---------- Content ---------- */}
                {loading ? (
                    <div className="ap-list" aria-busy="true">
                        {[1, 2, 3].map((n) => <div key={n} className="ap-skel" />)}
                    </div>
                ) : failed ? (
                    <div className="ap-empty">
                        <span className="ap-empty__icon ap-empty__icon--err"><AlertCircle size={28} /></span>
                        <h2>We could not load your appointments</h2>
                        <p>Check your connection and try again.</p>
                        <button className="ap-btn ap-btn--primary" onClick={load}>Try again</button>
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="ap-empty">
                        <span className="ap-empty__icon"><CalendarX2 size={28} /></span>
                        <h2>No appointments yet</h2>
                        <p>When you book a visit, you will see its status here.</p>
                        <Link to="/doctors" className="ap-btn ap-btn--primary">Find a doctor</Link>
                    </div>
                ) : visible.length === 0 ? (
                    <div className="ap-empty ap-empty--small">
                        <h2>Nothing in this view</h2>
                        <p>Try a different filter.</p>
                        <button className="ap-btn ap-btn--ghost" onClick={() => setTab("ALL")}>Show all</button>
                    </div>
                ) : (
                    <ul className="ap-list">
                        <AnimatePresence initial={false}>
                            {visible.map((a) => {
                                const status = statusOf(a);
                                const past = isPast(a);
                                const { day, month, weekday } = dayParts(a.appointmentDate);
                                const canCancel = status !== "APPROVED";

                                return (
                                    <motion.li
                                        key={a.id}
                                        layout
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -24 }}
                                        transition={{ duration: 0.25 }}
                                        className={`ap-card ${past ? "is-past" : ""}`}
                                    >
                                        <div className="ap-date">
                                            <strong>{day}</strong>
                                            <span>{month}</span>
                                        </div>

                                        <div className="ap-main">
                                            <h2><Stethoscope size={17} /> {a.doctorName}</h2>
                                            <p className="ap-meta">
                                                <span><Clock3 size={14} /> {a.appointmentTime}</span>
                                                {weekday && <span>{weekday}</span>}
                                                {past && <span className="ap-pastlabel">Past visit</span>}
                                            </p>
                                            {a.reason && <p className="ap-reason"><FileText size={14} /> {a.reason}</p>}
                                        </div>

                                        <div className="ap-side">
                                            <span className={`ap-status ap-status--${status.toLowerCase()}`}>
                                                {status.charAt(0) + status.slice(1).toLowerCase()}
                                            </span>
                                            <small>{STATUS_TEXT[status] || ""}</small>

                                            {canCancel && (
                                                <button className="ap-cancel" onClick={() => setToCancel(a)}>
                                                    <Trash2 size={15} /> {status === "REJECTED" ? "Remove" : "Cancel"}
                                                </button>
                                            )}
                                        </div>
                                    </motion.li>
                                );
                            })}
                        </AnimatePresence>
                    </ul>
                )}
            </div>

            {/* ---------- Confirm dialog ---------- */}
            <AnimatePresence>
                {toCancel && (
                    <motion.div
                        className="ap-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => !busy && setToCancel(null)}
                    >
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="ap-dialog-title"
                            className="ap-dialog"
                            initial={{ opacity: 0, y: 20, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="ap-dialog__icon"><TriangleAlert size={24} /></span>
                            <h2 id="ap-dialog-title">Cancel this appointment?</h2>
                            <p>
                                Your visit with <strong>{toCancel.doctorName}</strong> on{" "}
                                <strong>{dayParts(toCancel.appointmentDate).day} {dayParts(toCancel.appointmentDate).month}</strong>{" "}
                                at <strong>{toCancel.appointmentTime}</strong> will be removed.
                            </p>
                            <div className="ap-dialog__actions">
                                <button ref={keepRef} className="ap-btn ap-btn--ghost" onClick={() => setToCancel(null)} disabled={busy}>
                                    Keep it
                                </button>
                                <button className="ap-btn ap-btn--danger" onClick={confirmCancel} disabled={busy}>
                                    {busy ? <><Loader2 size={17} className="ap-spin" /> Cancelling</> : "Yes, cancel"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ---------- Toast ---------- */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        role={toast.type === "error" ? "alert" : "status"}
                        className={`ap-toast ap-toast--${toast.type}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                    >
                        {toast.type === "error" ? <AlertCircle size={17} /> : <CheckCircle2 size={17} />}
                        {toast.text}
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

const styles = `
@import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");

.ap {
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
    --err: #b42318;

    min-height: calc(100vh - 68px);
    padding: 36px 20px 72px;
    background: var(--paper);
    color: var(--ink);
    font-family: "Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif;
}
.ap *, .ap *::before, .ap *::after { box-sizing: border-box; }
.ap h1, .ap h2, .ap p, .ap ul { margin: 0; padding: 0; }
.ap ul { list-style: none; }
.ap :focus-visible { outline: 3px solid var(--amber); outline-offset: 2px; border-radius: 8px; }
.ap-wrap { max-width: 880px; margin: 0 auto; }

/* ---------- Header + tabs ---------- */
.ap-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 26px; }
.ap-head h1 { font-family: "Bricolage Grotesque", "Segoe UI", sans-serif; font-size: clamp(30px, 4.5vw, 42px); font-weight: 800; letter-spacing: -0.035em; line-height: 1.08; }
.ap-head p { margin-top: 8px; font-size: 16.5px; color: var(--muted); }

.ap-tabs { display: flex; gap: 8px; overflow-x: auto; padding: 2px 2px 14px; margin-bottom: 4px; scrollbar-width: thin; }
.ap-tab { flex: none; display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border: 1.5px solid var(--line); border-radius: 99px; background: #fff; color: var(--muted); font: 600 14px "Plus Jakarta Sans", sans-serif; cursor: pointer; transition: background 0.16s, color 0.16s, border-color 0.16s; }
.ap-tab span { padding: 1px 8px; border-radius: 99px; background: var(--paper); font-size: 12.5px; }
.ap-tab:hover { border-color: var(--teal); color: var(--teal-dark); }
.ap-tab.is-active { background: var(--teal); border-color: var(--teal); color: #fff; }
.ap-tab.is-active span { background: rgba(255, 255, 255, 0.22); }

/* ---------- Cards ---------- */
.ap-list { display: grid; gap: 14px; }
.ap-card { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 20px; padding: 20px 24px; background: #fff; border: 1px solid var(--line); border-radius: 20px; transition: border-color 0.18s, box-shadow 0.18s; }
.ap-card:hover { border-color: #bccdc7; box-shadow: 0 18px 32px -24px rgba(11, 42, 44, 0.45); }
.ap-card.is-past { background: var(--paper); }
.ap-card.is-past .ap-date { background: #e6ebe8; color: var(--muted); }

.ap-date { display: grid; justify-items: center; align-content: center; width: 64px; height: 70px; border-radius: 16px; background: var(--mint); color: var(--teal-dark); }
.ap-date strong { font-family: "Bricolage Grotesque", sans-serif; font-size: 25px; line-height: 1; }
.ap-date span { margin-top: 4px; font-size: 12.5px; font-weight: 700; }

.ap-main { min-width: 0; }
.ap-main h2 { display: flex; align-items: center; gap: 8px; font-family: "Bricolage Grotesque", "Segoe UI", sans-serif; font-size: 19px; font-weight: 700; }
.ap-main h2 svg { flex: none; color: var(--teal); }
.ap-meta { display: flex; flex-wrap: wrap; gap: 6px 16px; margin-top: 8px; font-size: 14px; color: var(--muted); }
.ap-meta span { display: inline-flex; align-items: center; gap: 6px; }
.ap-pastlabel { padding: 2px 9px; border-radius: 99px; background: #e6ebe8; font-size: 12.5px; font-weight: 600; }
.ap-reason { display: flex; align-items: flex-start; gap: 8px; margin-top: 10px; font-size: 14.5px; line-height: 1.5; color: var(--ink-2); }
.ap-reason svg { flex: none; margin-top: 3px; color: var(--teal); }

.ap-side { display: grid; justify-items: end; gap: 6px; }
.ap-side small { font-size: 12.5px; color: var(--muted); }
.ap-status { padding: 6px 14px; border-radius: 99px; font-size: 13px; font-weight: 700; background: #fdf3d9; color: #8a5a00; }
.ap-status--approved { background: #dcf5e8; color: #0a6b49; }
.ap-status--rejected { background: #fdecea; color: var(--err); }
.ap-cancel { display: inline-flex; align-items: center; gap: 6px; margin-top: 6px; padding: 8px 14px; border: 1.5px solid #f1c6c2; border-radius: 10px; background: #fff; color: var(--err); font: 600 13.5px "Plus Jakarta Sans", sans-serif; cursor: pointer; transition: background 0.16s, border-color 0.16s; }
.ap-cancel:hover { background: #fdecea; border-color: var(--err); }

/* ---------- Buttons ---------- */
.ap-btn { display: inline-flex; align-items: center; justify-content: center; gap: 9px; padding: 13px 22px; border: 1.5px solid transparent; border-radius: 13px; font: 700 15px "Plus Jakarta Sans", sans-serif; text-decoration: none; cursor: pointer; transition: background 0.18s, color 0.18s, border-color 0.18s, transform 0.18s; }
.ap-btn:active:not(:disabled) { transform: scale(0.98); }
.ap-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.ap-btn--primary { background: var(--teal); color: #fff; }
.ap-btn--primary:hover { background: var(--teal-dark); }
.ap-btn--ghost { background: #fff; color: var(--ink); border-color: var(--line); }
.ap-btn--ghost:hover:not(:disabled) { border-color: var(--teal); color: var(--teal-dark); }
.ap-btn--danger { background: var(--err); color: #fff; }
.ap-btn--danger:hover:not(:disabled) { background: #8f1c12; }
.ap-spin { animation: ap-spin 0.8s linear infinite; }
@keyframes ap-spin { to { transform: rotate(360deg); } }

/* ---------- Empty + skeleton ---------- */
.ap-empty { display: grid; justify-items: center; gap: 10px; padding: 64px 24px; text-align: center; background: #fff; border: 1.5px dashed var(--line); border-radius: 26px; }
.ap-empty--small { padding: 40px 24px; }
.ap-empty__icon { display: grid; place-items: center; width: 62px; height: 62px; margin-bottom: 4px; border-radius: 18px; background: var(--mint); color: var(--teal); }
.ap-empty__icon--err { background: #fdecea; color: var(--err); }
.ap-empty h2 { font-family: "Bricolage Grotesque", "Segoe UI", sans-serif; font-size: 23px; }
.ap-empty p { max-width: 40ch; margin-bottom: 10px; color: var(--muted); }
.ap-skel { height: 110px; border-radius: 20px; background: linear-gradient(90deg, #e9efec 25%, #f4f7f5 50%, #e9efec 75%); background-size: 200% 100%; animation: ap-shimmer 1.4s linear infinite; }
@keyframes ap-shimmer { to { background-position: -200% 0; } }

/* ---------- Dialog + toast ---------- */
.ap-overlay { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 20px; background: rgba(11, 42, 44, 0.55); backdrop-filter: blur(3px); }
.ap-dialog { width: 100%; max-width: 420px; padding: 30px; text-align: center; background: #fff; border-radius: 24px; box-shadow: 0 40px 80px -30px rgba(11, 42, 44, 0.7); }
.ap-dialog__icon { display: inline-grid; place-items: center; width: 54px; height: 54px; margin-bottom: 14px; border-radius: 16px; background: #fdecea; color: var(--err); }
.ap-dialog h2 { font-family: "Bricolage Grotesque", "Segoe UI", sans-serif; font-size: 22px; }
.ap-dialog p { margin-top: 10px; line-height: 1.65; color: var(--muted); font-size: 15px; }
.ap-dialog p strong { color: var(--ink); }
.ap-dialog__actions { display: flex; gap: 10px; margin-top: 24px; }
.ap-dialog__actions .ap-btn { flex: 1; }

.ap-toast { position: fixed; left: 50%; bottom: 28px; z-index: 110; transform: translateX(-50%); display: inline-flex; align-items: center; gap: 10px; padding: 13px 20px; border-radius: 14px; font-size: 14.5px; font-weight: 600; box-shadow: 0 20px 40px -18px rgba(11, 42, 44, 0.5); }
.ap-toast--success { background: var(--ink); color: #fff; }
.ap-toast--success svg { color: #5fd3b4; }
.ap-toast--error { background: #fdecea; color: var(--err); }

/* ---------- Responsive ---------- */
@media (max-width: 640px) {
    .ap { padding: 22px 14px 56px; }
    .ap-card { grid-template-columns: auto 1fr; padding: 18px; gap: 14px; }
    .ap-side { grid-column: 1 / -1; grid-auto-flow: column; justify-content: space-between; justify-items: start; align-items: center; padding-top: 14px; border-top: 1px dashed var(--line); }
    .ap-side small { display: none; }
    .ap-cancel { margin-top: 0; }
    .ap-head .ap-btn { width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
    .ap *, .ap *::before, .ap *::after { animation: none !important; transition: none !important; }
}
`;

export default Appointments;