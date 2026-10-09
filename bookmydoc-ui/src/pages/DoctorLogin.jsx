import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
    Stethoscope, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle,
    ArrowLeft, CalendarCheck, Clock3, UserRound,
} from "lucide-react";
import api from "../services/api";
import "../style/DoctorLogin.css";

const SAMPLE_DAY = [
    { time: "9:30 AM", name: "Anjali D.", reason: "Follow-up visit", state: "done", label: "Completed" },
    { time: "11:00 AM", name: "Rahul K.", reason: "New consultation", state: "now", label: "In progress" },
    { time: "2:30 PM", name: "Sneha I.", reason: "Report review", state: "next", label: "Upcoming" },
];

function DoctorLogin() {
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
        if (error) setError("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/doctors/login", loginData);

            if (response.data) {
                localStorage.setItem("doctorId", response.data.id);
                localStorage.setItem("doctorName", response.data.name);
                localStorage.setItem("doctorEmail", response.data.email);
                window.location.href = "/doctor-dashboard";
            } else {
                setError("Invalid email or password. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError("Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="dl-page">
            <div className="dl-card">
                {/* ---------- Left: what the doctor gets ---------- */}
                <aside className="dl-aside" aria-label="Doctor dashboard preview">
                    <span className="dl-logo"><Stethoscope size={22} strokeWidth={2.4} /></span>
                    <h1>Your day, already organised.</h1>
                    <p>See today's patients, manage your slots and confirm visits from one place.</p>

                    <div className="dl-day" aria-hidden="true">
                        <div className="dl-day__head">
                            <span><CalendarCheck size={15} /> Today's schedule</span>
                            <em>Sample</em>
                        </div>

                        <ul>
                            {SAMPLE_DAY.map((a, i) => (
                                <li key={a.time} className={`dl-appt dl-appt--${a.state}`} style={{ "--i": i }}>
                                    <span className="dl-appt__time"><Clock3 size={13} />{a.time}</span>
                                    <span className="dl-appt__who">
                                        <UserRound size={15} />
                                        <span>
                                            <strong>{a.name}</strong>
                                            <small>{a.reason}</small>
                                        </span>
                                    </span>
                                    <span className="dl-appt__state">
                                        {a.state === "now" && <i className="dl-pulse" />}
                                        {a.label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* ---------- Right: form ---------- */}
                <section className="dl-formwrap">
                    <form onSubmit={handleLogin} className="dl-form">
                        <Link to="/" className="dl-back"><ArrowLeft size={15} /> Back to home</Link>

                        <h2>Doctor sign in</h2>
                        <p className="dl-lead">Access your dashboard and manage appointments.</p>

                        <AnimatePresence initial={false}>
                            {error && (
                                <motion.div
                                    key="err"
                                    role="alert"
                                    className="dl-notice"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <AlertCircle size={16} /> <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <label className="dl-field">
                            <span className="dl-field__label">Email</span>
                            <span className="dl-field__box">
                                <Mail size={17} />
                                <input
                                    type="email" name="email" value={loginData.email} onChange={handleChange}
                                    placeholder="doctor@hospital.com" autoComplete="email" required
                                />
                            </span>
                        </label>

                        <label className="dl-field">
                            <span className="dl-field__label">Password</span>
                            <span className="dl-field__box">
                                <Lock size={17} />
                                <input
                                    type={showPw ? "text" : "password"} name="password" value={loginData.password}
                                    onChange={handleChange} placeholder="Your password" autoComplete="current-password" required
                                />
                                <button
                                    type="button" className="dl-eye" onClick={() => setShowPw((v) => !v)}
                                    aria-label={showPw ? "Hide password" : "Show password"}
                                >
                                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </span>
                        </label>

                        <button type="submit" className="dl-submit" disabled={loading}>
                            {loading ? <><Loader2 size={18} className="dl-spin" /> Signing in</> : "Sign in to dashboard"}
                        </button>

                        <p className="dl-switch">
                            Looking to book an appointment? <Link to="/auth">Patient sign in</Link>
                        </p>
                    </form>
                </section>
            </div>
        </main>
    );
}

export default DoctorLogin;