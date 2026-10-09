import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    User, Mail, Stethoscope, GraduationCap, Building2, MapPin, Pencil, Save, X,
    Loader2, CheckCircle2, AlertCircle, BadgeCheck, Lock,
} from "lucide-react";
import api from "../services/api";

const EMPTY = {
    name: "", email: "", specialization: "", experience: "",
    hospitalName: "", location: "", availability: "",
};

const FIELDS = [
    { name: "name", label: "Full name", type: "text", icon: User, editable: true, required: true, wide: true },
    { name: "email", label: "Email address", type: "email", icon: Mail, editable: false, wide: true },
    { name: "specialization", label: "Speciality", type: "text", icon: Stethoscope, editable: true, required: true },
    { name: "experience", label: "Experience (years)", type: "number", icon: GraduationCap, editable: true },
    { name: "hospitalName", label: "Hospital name", type: "text", icon: Building2, editable: true },
    { name: "location", label: "Location", type: "text", icon: MapPin, editable: true },
];

const COMPLETENESS_KEYS = ["name", "specialization", "experience", "hospitalName", "location"];

function initialOf(name = "") {
    return (name.replace(/^dr\.?\s*/i, "").trim()[0] || "D").toUpperCase();
}

function DoctorProfile() {
    const doctorId = localStorage.getItem("doctorId");

    const [doctor, setDoctor] = useState(EMPTY);
    const [saved, setSaved] = useState(EMPTY); // last version from the server
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [loadFailed, setLoadFailed] = useState(false);
    const [notice, setNotice] = useState(null);

    const fetchDoctor = async () => {
        try {
            const response = await api.get(`/doctors/${doctorId}`);
            setDoctor(response.data);
            setSaved(response.data);
            setLoadFailed(false);
        } catch (error) {
            console.error(error);
            setLoadFailed(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctor();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-hide the success message
    useEffect(() => {
        if (notice?.type !== "success") return;
        const t = setTimeout(() => setNotice(null), 4000);
        return () => clearTimeout(t);
    }, [notice]);

    const handleChange = (e) => setDoctor({ ...doctor, [e.target.name]: e.target.value });

    const dirty = useMemo(
        () => FIELDS.some((f) => String(doctor[f.name] ?? "") !== String(saved[f.name] ?? "")),
        [doctor, saved]
    );

    const completeness = useMemo(() => {
        const filled = COMPLETENESS_KEYS.filter((k) => String(saved[k] ?? "").trim() !== "").length;
        return Math.round((filled / COMPLETENESS_KEYS.length) * 100);
    }, [saved]);

    const saveProfile = async (e) => {
        e.preventDefault();
        setNotice(null);
        setSaving(true);
        try {
            await api.put(`/doctors/${doctorId}`, doctor);
            setIsEditing(false);
            await fetchDoctor();
            setNotice({ type: "success", text: "Profile updated. Patients now see your latest details." });
        } catch (error) {
            console.error(error);
            setNotice({ type: "error", text: "We could not save your changes. Please try again." });
        } finally {
            setSaving(false);
        }
    };

    const cancelEdit = () => {
        setDoctor(saved);
        setIsEditing(false);
        setNotice(null);
    };

    /* ---------- Loading / error ---------- */
    if (loading) {
        return (
            <main className="dp">
                <style>{styles}</style>
                <div className="dp-wrap" aria-busy="true">
                    <div className="dp-skel dp-skel--head" />
                    <div className="dp-skel dp-skel--body" />
                </div>
            </main>
        );
    }

    if (loadFailed) {
        return (
            <main className="dp">
                <style>{styles}</style>
                <div className="dp-wrap">
                    <div className="dp-error">
                        <AlertCircle size={28} />
                        <h2>We could not load your profile</h2>
                        <p>Check your connection and try again.</p>
                        <button className="dp-btn dp-btn--primary" onClick={() => { setLoading(true); fetchDoctor(); }}>
                            Try again
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    const displayName = doctor.name ? (/^dr\.?\s/i.test(doctor.name) ? doctor.name : `Dr. ${doctor.name}`) : "Doctor";

    return (
        <main className="dp">
            <style>{styles}</style>
            <div className="dp-wrap">
                {/* ---------- Header ---------- */}
                <header className="dp-head">
                    <span className="dp-avatar">{initialOf(doctor.name)}</span>
                    <div className="dp-head__info">
                        <h1>{displayName}</h1>
                        <p>{saved.specialization || "Add your speciality so patients can find you"}</p>
                    </div>

                    <div className="dp-meter" aria-label={`Profile ${completeness}% complete`}>
                        <div className="dp-meter__top">
                            <span>Profile complete</span>
                            <strong>{completeness}%</strong>
                        </div>
                        <div className="dp-meter__bar"><i style={{ width: `${completeness}%` }} /></div>
                    </div>
                </header>

                <AnimatePresence initial={false}>
                    {notice && (
                        <motion.div
                            key={notice.text}
                            role={notice.type === "error" ? "alert" : "status"}
                            className={`dp-notice dp-notice--${notice.type}`}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {notice.type === "error" ? <AlertCircle size={17} /> : <CheckCircle2 size={17} />}
                            <span>{notice.text}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="dp-grid">
                    {/* ---------- Form ---------- */}
                    <form className="dp-card" onSubmit={saveProfile}>
                        <div className="dp-card__head">
                            <div>
                                <h2>Profile details</h2>
                                <p>{isEditing ? "Update your information, then save." : "The professional details patients see."}</p>
                            </div>
                            {!isEditing && (
                                <button type="button" className="dp-btn dp-btn--ghost" onClick={() => setIsEditing(true)}>
                                    <Pencil size={16} /> Edit profile
                                </button>
                            )}
                        </div>

                        <div className="dp-form">
                            {FIELDS.map(({ name, label, type, icon: Icon, editable, required, wide }) => {
                                const locked = !isEditing || !editable;
                                return (
                                    <label key={name} className={`dp-field ${wide ? "dp-field--wide" : ""}`}>
                                        <span className="dp-field__label">
                                            {label}
                                            {!editable && <em><Lock size={11} /> Cannot be changed</em>}
                                        </span>
                                        <span className={`dp-field__box ${locked ? "is-locked" : ""}`}>
                                            <Icon size={17} />
                                            <input
                                                type={type}
                                                name={name}
                                                min={type === "number" ? 0 : undefined}
                                                value={doctor[name] ?? ""}
                                                onChange={editable ? handleChange : undefined}
                                                disabled={locked}
                                                required={editable && required}
                                            />
                                        </span>
                                    </label>
                                );
                            })}
                        </div>

                        {isEditing && (
                            <div className="dp-actions">
                                <button type="button" className="dp-btn dp-btn--ghost" onClick={cancelEdit} disabled={saving}>
                                    <X size={16} /> Cancel
                                </button>
                                <button type="submit" className="dp-btn dp-btn--primary" disabled={saving || !dirty}>
                                    {saving ? <><Loader2 size={17} className="dp-spin" /> Saving</> : <><Save size={16} /> Save changes</>}
                                </button>
                            </div>
                        )}
                    </form>

                    {/* ---------- Live patient preview ---------- */}
                    <aside className="dp-preview" aria-label="How patients see you">
                        <p className="dp-preview__label">How patients see you</p>

                        <article className="dp-pcard">
                            <div className="dp-pcard__top">
                                <span className="dp-avatar dp-avatar--sm">{initialOf(doctor.name)}</span>
                                <div>
                                    <h3>
                                        {displayName} <BadgeCheck size={16} />
                                    </h3>
                                    <p>{doctor.specialization || "Speciality"}</p>
                                </div>
                            </div>

                            <ul>
                                <li><Building2 size={15} /> {doctor.hospitalName || "Hospital name"}</li>
                                <li><MapPin size={15} /> {doctor.location || "Location"}</li>
                                <li><GraduationCap size={15} /> {doctor.experience !== "" && doctor.experience != null ? `${doctor.experience} years of experience` : "Experience"}</li>
                            </ul>
                        </article>

                        <p className="dp-preview__hint">
                            {isEditing ? "This preview updates as you type." : "Click Edit profile to change what patients see."}
                        </p>
                    </aside>
                </div>
            </div>
        </main>
    );
}

const styles = `

/* ============ DOCTOR PROFILE (blue theme) ============ */
.dp {
  --ink: #0f172a;
  --ink-2: #1e293b;
  --teal: #2563eb;          /* primary blue */
  --teal-dark: #1d4ed8;
  --mint: #eff6ff;          /* soft blue tint */
  --mint-2: #dbeafe;
  --paper: #f8fafc;
  --line: #e2e8f0;
  --muted: #64748b;
  --amber: #93c5fd;         /* focus ring */
  --bright: #ffffff;

  min-height: calc(100vh - 68px);
  padding: 36px 20px 72px;
  background: var(--paper);
  color: var(--ink);
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.dp *, .dp *::before, .dp *::after { box-sizing: border-box; }
.dp h1, .dp h2, .dp h3, .dp p, .dp ul { margin: 0; padding: 0; }
.dp ul { list-style: none; }
.dp :focus-visible { outline: 3px solid var(--amber); outline-offset: 2px; border-radius: 8px; }
.dp-wrap { max-width: 1100px; margin: 0 auto; }

/* ---------- Header ---------- */
.dp-head { display: grid; grid-template-columns: auto 1fr minmax(220px, 280px); align-items: center; gap: 22px; padding: 28px 32px; border-radius: 18px; color: #fff; background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%); }
.dp-avatar { display: grid; place-items: center; width: 72px; height: 72px; border-radius: 18px; background: rgba(255, 255, 255, 0.16); color: #fff; font: 700 30px "Inter", sans-serif; }
.dp-avatar--sm { width: 52px; height: 52px; border-radius: 14px; font-size: 21px; background: var(--mint); color: var(--teal-dark); }
.dp-head__info h1 { font-size: clamp(24px, 3.2vw, 30px); font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; }
.dp-head__info p { margin-top: 6px; font-size: 15px; color: rgba(255, 255, 255, 0.8); }

.dp-meter { padding: 16px 18px; border-radius: 14px; background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.2); }
.dp-meter__top { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13.5px; color: rgba(255, 255, 255, 0.85); }
.dp-meter__top strong { color: #fff; }
.dp-meter__bar { height: 7px; border-radius: 99px; background: rgba(255, 255, 255, 0.22); overflow: hidden; }
.dp-meter__bar i { display: block; height: 100%; border-radius: 99px; background: #fff; transition: width 0.6s cubic-bezier(0.2, 0.7, 0.2, 1); }

/* ---------- Notice ---------- */
.dp-notice { display: flex; align-items: center; gap: 10px; margin-top: 16px; padding: 13px 18px; border-radius: 12px; font-size: 14.5px; font-weight: 600; }
.dp-notice--success { background: #dcfce7; color: #15803d; }
.dp-notice--error { background: #fee2e2; color: #b91c1c; }

/* ---------- Layout ---------- */
.dp-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 20px; margin-top: 20px; align-items: start; }

.dp-card { padding: 28px; background: #fff; border: 1px solid var(--line); border-radius: 16px; box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05); }
.dp-card__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; flex-wrap: wrap; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--line); }
.dp-card__head h2 { font-size: 20px; font-weight: 700; }
.dp-card__head p { margin-top: 5px; font-size: 14.5px; color: var(--muted); }

.dp-form { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
.dp-field { display: block; min-width: 0; }
.dp-field--wide { grid-column: 1 / -1; }
.dp-field__label { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 7px; font-size: 13px; font-weight: 600; color: var(--ink-2); }
.dp-field__label em { display: inline-flex; align-items: center; gap: 4px; font-style: normal; font-size: 11.5px; font-weight: 500; color: var(--muted); }
.dp-field__box { display: flex; align-items: center; gap: 10px; height: 50px; padding: 0 14px; border: 1.5px solid var(--line); border-radius: 12px; background: #fff; color: var(--teal); transition: border-color 0.18s, box-shadow 0.18s, background 0.18s; }
.dp-field__box:not(.is-locked):hover { border-color: #cbd5e1; }
.dp-field__box:not(.is-locked):focus-within { border-color: var(--teal); box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.14); }
.dp-field__box.is-locked { background: var(--paper); color: var(--muted); }
.dp-field__box input { flex: 1; min-width: 0; height: 100%; border: 0; outline: 0; background: transparent; font: 500 15px "Inter", system-ui, sans-serif; color: var(--ink); }
.dp-field__box input:disabled { -webkit-text-fill-color: var(--ink); opacity: 1; cursor: default; }

/* ---------- Buttons ---------- */
.dp-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 26px; padding-top: 22px; border-top: 1px solid var(--line); }
.dp-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 22px; border: 1.5px solid transparent; border-radius: 12px; font: 600 15px "Inter", system-ui, sans-serif; cursor: pointer; transition: background 0.18s, color 0.18s, border-color 0.18s, transform 0.18s; }
.dp-btn:active:not(:disabled) { transform: scale(0.98); }
.dp-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.dp-btn--primary { background: var(--teal); color: #fff; }
.dp-btn--primary:hover:not(:disabled) { background: var(--teal-dark); }
.dp-btn--ghost { background: #fff; color: var(--ink); border-color: var(--line); }
.dp-btn--ghost:hover:not(:disabled) { border-color: var(--teal); color: var(--teal-dark); background: var(--mint); }
.dp-spin { animation: dp-spin 0.8s linear infinite; }
@keyframes dp-spin { to { transform: rotate(360deg); } }

/* ---------- Preview ---------- */
.dp-preview { position: sticky; top: 92px; }
.dp-preview__label { margin-bottom: 12px; font-size: 13.5px; font-weight: 700; color: var(--muted); }
.dp-pcard { padding: 22px; background: #fff; border: 1px solid var(--line); border-radius: 16px; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08); }
.dp-pcard__top { display: flex; align-items: center; gap: 14px; }
.dp-pcard h3 { display: flex; align-items: center; gap: 6px; font-size: 17px; font-weight: 600; line-height: 1.2; }
.dp-pcard h3 svg { flex: none; color: var(--teal); }
.dp-pcard__top p { margin-top: 4px; font-size: 14.5px; font-weight: 600; color: var(--teal-dark); }
.dp-pcard ul { display: grid; gap: 2px; margin-top: 18px; padding-top: 14px; border-top: 1px dashed #cbd5e1; }
.dp-pcard li { display: flex; align-items: center; gap: 11px; padding: 7px 0; font-size: 14.5px; color: var(--ink-2); }
.dp-pcard li svg { flex: none; color: var(--teal); }
.dp-preview__hint { margin-top: 14px; font-size: 13.5px; line-height: 1.55; color: var(--muted); }

/* ---------- Skeleton + error ---------- */
.dp-skel { border-radius: 16px; background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%); background-size: 200% 100%; animation: dp-shimmer 1.4s linear infinite; }
.dp-skel--head { height: 140px; }
.dp-skel--body { height: 360px; margin-top: 20px; }
@keyframes dp-shimmer { to { background-position: -200% 0; } }
.dp-error { display: grid; justify-items: center; gap: 10px; padding: 64px 24px; text-align: center; background: #fff; border: 1.5px dashed #cbd5e1; border-radius: 16px; color: #b91c1c; }
.dp-error h2 { color: var(--ink); }
.dp-error p { margin-bottom: 8px; color: var(--muted); }

/* ---------- Responsive ---------- */
@media (max-width: 900px) {
  .dp-head { grid-template-columns: auto 1fr; padding: 24px; }
  .dp-meter { grid-column: 1 / -1; }
  .dp-grid { grid-template-columns: 1fr; }
  .dp-preview { position: static; order: -1; }
}
@media (max-width: 600px) {
  .dp { padding: 20px 14px 56px; }
  .dp-card { padding: 20px; }
  .dp-form { grid-template-columns: 1fr; }
  .dp-actions { flex-direction: column-reverse; }
  .dp-actions .dp-btn, .dp-card__head .dp-btn { width: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .dp *, .dp *::before, .dp *::after { animation: none !important; transition: none !important; }
}

`;

export default DoctorProfile;