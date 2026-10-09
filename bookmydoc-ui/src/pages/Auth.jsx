import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
    Stethoscope, Mail, Lock, User, Phone, CalendarDays, Droplet,
    Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ArrowLeft,
} from "lucide-react";
import api from "../services/api";
import "../style/UserAuth.css";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const EMPTY_REGISTER = {
    name: "", email: "", phoneNumber: "", age: "",
    bloodGroup: "", password: "", confirmPassword: "",
};

function passwordScore(pw) {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
}
const SCORE_LABEL = ["Too short", "Weak", "Okay", "Good", "Strong"];

function Notice({ notice }) {
    return (
        <AnimatePresence initial={false}>
            {notice && (
                <motion.div
                    key={notice.text}
                    role={notice.type === "error" ? "alert" : "status"}
                    className={`notice notice--${notice.type}`}
                    initial={{ opacity: 0, height: 0, y: -6 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {notice.type === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                    <span>{notice.text}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function Field({ icon: Icon, label, children }) {
    return (
        <label className="field">
            <span className="field__label">{label}</span>
            <span className="field__box">
                <Icon size={17} />
                {children}
            </span>
        </label>
    );
}

function Auth() {
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const [isLogin, setIsLogin] = useState(params.get("mode") !== "register");
    const [user, setUser] = useState(EMPTY_REGISTER);
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loginNotice, setLoginNotice] = useState(null);
    const [registerNotice, setRegisterNotice] = useState(null);

    const score = passwordScore(user.password);

    const switchMode = (login) => {
        setIsLogin(login);
        setShowPw(false);
        setLoginNotice(null);
        setRegisterNotice(null);
    };

    const onRegisterChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });
    const onLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegisterNotice(null);

        if (user.password !== user.confirmPassword) {
            setRegisterNotice({ type: "error", text: "Passwords do not match. Please re-enter them." });
            return;
        }

        setLoading(true);
        try {
            await api.post("/users", {
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                age: user.age,
                bloodGroup: user.bloodGroup,
                password: user.password,
                verified: false,
            });

            setLoginData({ email: user.email, password: "" });
            setUser(EMPTY_REGISTER);
            setIsLogin(true);
            setLoginNotice({ type: "success", text: "Account created. Sign in to continue." });
        } catch (error) {
            console.error(error);
            const msg = typeof error?.response?.data === "string" ? error.response.data : "";
            setRegisterNotice({
                type: "error",
                text: msg || "We could not create your account. Please check your details and try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginNotice(null);
        setLoading(true);

        try {
            const response = await api.post("/users/login", loginData);

            if (response.data === "Login Success") {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userEmail", loginData.email);
                window.location.href = "/dashboard";
            } else {
                setLoginNotice({ type: "error", text: String(response.data) });
            }
        } catch (error) {
            console.error(error);
            setLoginNotice({ type: "error", text: "We could not sign you in. Check your connection and try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <div className={`auth-box ${isLogin ? "is-login" : "is-register"}`}>
                {/* ---------- Login ---------- */}
                <section className="pane pane--login" aria-hidden={!isLogin}>
                    <form onSubmit={handleLogin} className="form">
                        <Link to="/" className="back"><ArrowLeft size={15} /> Back to home</Link>
                        <h2>Welcome back</h2>
                        <p className="form__lead">Sign in to manage your appointments.</p>

                        <Notice notice={loginNotice} />

                        <Field icon={Mail} label="Email">
                            <input type="email" name="email" value={loginData.email} onChange={onLoginChange}
                                placeholder="you@example.com" autoComplete="email" required />
                        </Field>

                        <Field icon={Lock} label="Password">
                            <input type={showPw ? "text" : "password"} name="password" value={loginData.password}
                                onChange={onLoginChange} placeholder="Your password" autoComplete="current-password" required />
                            <button type="button" className="eye" onClick={() => setShowPw((v) => !v)}
                                aria-label={showPw ? "Hide password" : "Show password"}>
                                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </Field>

                        <button type="submit" className="submit" disabled={loading}>
                            {loading && isLogin ? <><Loader2 size={18} className="spin" /> Signing in</> : "Sign in"}
                        </button>

                        <p className="switch-text">
                            New to BookMyDoc?{" "}
                            <button type="button" onClick={() => switchMode(false)}>Create an account</button>
                        </p>
                    </form>
                </section>

                {/* ---------- Register ---------- */}
                <section className="pane pane--register" aria-hidden={isLogin}>
                    <form onSubmit={handleRegister} className="form form--register">
                        <Link to="/" className="back"><ArrowLeft size={15} /> Back to home</Link>
                        <h2>Create your account</h2>
                        <p className="form__lead">It takes about a minute.</p>

                        <Notice notice={registerNotice} />

                        <Field icon={User} label="Full name">
                            <input type="text" name="name" value={user.name} onChange={onRegisterChange}
                                placeholder="Your full name" autoComplete="name" required />
                        </Field>

                        <Field icon={Mail} label="Email">
                            <input type="email" name="email" value={user.email} onChange={onRegisterChange}
                                placeholder="you@example.com" autoComplete="email" required />
                        </Field>

                        <div className="row">
                            <Field icon={Phone} label="Phone number">
                                <input type="tel" name="phoneNumber" value={user.phoneNumber} onChange={onRegisterChange}
                                    placeholder="98765 43210" autoComplete="tel" required />
                            </Field>
                            <Field icon={CalendarDays} label="Age">
                                <input type="number" name="age" min="0" max="120" value={user.age}
                                    onChange={onRegisterChange} placeholder="Age" required />
                            </Field>
                        </div>

                        <Field icon={Droplet} label="Blood group">
                            <select name="bloodGroup" value={user.bloodGroup} onChange={onRegisterChange} required>
                                <option value="" disabled>Select blood group</option>
                                {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </Field>

                        <div className="row">
                            <Field icon={Lock} label="Password">
                                <input type={showPw ? "text" : "password"} name="password" value={user.password}
                                    onChange={onRegisterChange} placeholder="Create password" autoComplete="new-password" required />
                            </Field>
                            <Field icon={Lock} label="Confirm password">
                                <input type={showPw ? "text" : "password"} name="confirmPassword" value={user.confirmPassword}
                                    onChange={onRegisterChange} placeholder="Repeat password" autoComplete="new-password" required />
                                <button type="button" className="eye" onClick={() => setShowPw((v) => !v)}
                                    aria-label={showPw ? "Hide passwords" : "Show passwords"}>
                                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </Field>
                        </div>

                        {user.password && (
                            <div className="strength" aria-live="polite">
                                <div className="strength__bars">
                                    {[1, 2, 3, 4].map((n) => (
                                        <i key={n} className={score >= n ? `on on--${score}` : ""} />
                                    ))}
                                </div>
                                <span>{SCORE_LABEL[score]}</span>
                            </div>
                        )}

                        <button type="submit" className="submit" disabled={loading}>
                            {loading && !isLogin ? <><Loader2 size={18} className="spin" /> Creating account</> : "Create account"}
                        </button>

                        <p className="switch-text">
                            Already registered?{" "}
                            <button type="button" onClick={() => switchMode(true)}>Sign in</button>
                        </p>
                    </form>
                </section>

                {/* ---------- Sliding overlay ---------- */}
                <div className="overlay-container" aria-hidden="true">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <OverlayContent
                                title="Already have an account?"
                                text="Sign in and pick up where you left off."
                                cta="Sign in"
                                onClick={() => switchMode(true)}
                            />
                        </div>
                        <div className="overlay-panel overlay-right">
                            <OverlayContent
                                title="New to BookMyDoc?"
                                text="Create a free account to book verified doctors in under a minute."
                                cta="Create account"
                                onClick={() => switchMode(false)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function OverlayContent({ title, text, cta, onClick }) {
    return (
        <>
            <span className="overlay__logo"><Stethoscope size={22} strokeWidth={2.4} /></span>

            <svg className="ecg" viewBox="0 0 400 80" fill="none" preserveAspectRatio="none">
                <path className="ecg__ghost" pathLength="1" d="M0 40H110L128 40L143 10L163 70L180 24L193 40H400" />
                <path className="ecg__line" pathLength="1" d="M0 40H110L128 40L143 10L163 70L180 24L193 40H400" />
            </svg>

            <h1>{title}</h1>
            <p>{text}</p>
            <button type="button" className="ghost" onClick={onClick} tabIndex={-1}>{cta}</button>
        </>
    );
}

export default Auth;