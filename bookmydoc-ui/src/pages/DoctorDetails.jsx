import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft, BadgeCheck, GraduationCap, Building2, MapPin, IndianRupee, Star,
    CalendarPlus, ShieldCheck, Zap, Clock3, SearchX, CheckCircle2,
} from "lucide-react";
import api from "../services/api";

// Used when the doctor record has no fee of its own (same value your page showed before)
const DEFAULT_FEE = 500;

const initialOf = (name = "") => (name.replace(/^dr\.?\s*/i, "").trim()[0] || "D").toUpperCase();

function DoctorDetails() {
    const { id } = useParams();

    const [doctor, setDoctor] = useState(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        setDoctor(null);
        setFailed(false);

        api
            .get(`/doctors/${id}`)
            .then((response) => setDoctor(response.data))
            .catch((error) => {
                console.error(error);
                setFailed(true);
            });
    }, [id]);

    /* ---------- Loading ---------- */
    if (!doctor && !failed) {
        return (
            <main className="dd">
                <style>{styles}</style>
                <div className="dd-wrap" aria-busy="true">
                    <div className="dd-skel dd-skel--hero" />
                    <div className="dd-layout">
                        <div className="dd-skel dd-skel--card" />
                        <div className="dd-skel dd-skel--card" />
                    </div>
                </div>
            </main>
        );
    }

    /* ---------- Not found / error ---------- */
    if (failed) {
        return (
            <main className="dd">
                <style>{styles}</style>
                <div className="dd-wrap">
                    <div className="dd-empty">
                        <span className="dd-empty__icon"><SearchX size={28} /></span>
                        <h1>We could not find this doctor</h1>
                        <p>The profile may have been removed, or the connection dropped.</p>
                        <Link to="/doctors" className="dd-btn dd-btn--primary">Browse all doctors</Link>
                    </div>
                </div>
            </main>
        );
    }

    const fee = doctor.consultationFee ?? doctor.fee ?? DEFAULT_FEE;
    const bookingLink = `/book?doctorId=${doctor.id}`;

    const details = [
        { icon: GraduationCap, label: "Experience", value: doctor.experience ? `${doctor.experience} years` : null },
        { icon: Building2, label: "Hospital", value: doctor.hospitalName },
        { icon: MapPin, label: "Location", value: doctor.location },
        { icon: IndianRupee, label: "Consultation fee", value: `₹${fee}` },
    ].filter((d) => d.value);

    const steps = [
        { icon: CalendarPlus, text: "Choose a date and time that suits you" },
        { icon: CheckCircle2, text: "Get instant confirmation of your slot" },
        { icon: Clock3, text: "Arrive a few minutes early for your visit" },
    ];

    return (
        <main className="dd">
            <style>{styles}</style>

            <div className="dd-wrap">
                <Link to="/doctors" className="dd-back">
                    <ArrowLeft size={16} /> Back to doctors
                </Link>

                {/* ---------- Profile header ---------- */}
                <section className="dd-hero">
                    <span className="dd-avatar">{initialOf(doctor.name)}</span>

                    <div className="dd-hero__info">
                        <p className="dd-speciality">{doctor.specialization}</p>
                        <h1>
                            {doctor.name}
                            <BadgeCheck size={26} className="dd-verified" aria-label="Verified doctor" />
                        </h1>

                        <ul className="dd-chips">
                            {doctor.experience && (
                                <li><GraduationCap size={15} /> {doctor.experience} years experience</li>
                            )}
                            {doctor.hospitalName && <li><Building2 size={15} /> {doctor.hospitalName}</li>}
                            {doctor.location && <li><MapPin size={15} /> {doctor.location}</li>}
                            {doctor.rating && (
                                <li className="dd-chips__rating">
                                    <Star size={15} fill="currentColor" /> {Number(doctor.rating).toFixed(1)}
                                </li>
                            )}
                        </ul>
                    </div>
                </section>

                <div className="dd-layout">
                    {/* ---------- Main column ---------- */}
                    <div className="dd-main">
                        <section className="dd-card">
                            <h2>At a glance</h2>
                            <div className="dd-grid">
                                {details.map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="dd-info">
                                        <span className="dd-info__icon"><Icon size={19} /></span>
                                        <div>
                                            <small>{label}</small>
                                            <strong>{value}</strong>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="dd-card">
                            <h2>About {doctor.name}</h2>
                            <p className="dd-about">
                                {doctor.name} is {doctor.specialization ? `a ${doctor.specialization} specialist` : "an experienced doctor"}
                                {doctor.experience ? ` with ${doctor.experience} years of experience` : ""}
                                {doctor.hospitalName ? `, practising at ${doctor.hospitalName}` : ""}
                                {doctor.location ? ` in ${doctor.location}` : ""}. Patients are welcome to book a visit
                                for consultation, follow-up care and treatment advice.
                            </p>
                        </section>

                        <section className="dd-card">
                            <h2>What happens when you book</h2>
                            <ol className="dd-steps">
                                {steps.map(({ icon: Icon, text }, i) => (
                                    <li key={text}>
                                        <span className="dd-steps__num">{i + 1}</span>
                                        <Icon size={18} />
                                        <span>{text}</span>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    </div>

                    {/* ---------- Booking card ---------- */}
                    <aside className="dd-side">
                        <div className="dd-book">
                            <p className="dd-book__label">Consultation fee</p>
                            <p className="dd-price">₹{fee}<span>per visit</span></p>

                            <ul className="dd-perks">
                                <li><Zap size={16} /> Instant appointment booking</li>
                                <li><BadgeCheck size={16} /> Verified specialist</li>
                                <li><CalendarPlus size={16} /> Pick your preferred slot</li>
                            </ul>

                            <Link to={bookingLink} className="dd-btn dd-btn--light dd-btn--block">
                                <CalendarPlus size={18} /> Book appointment
                            </Link>

                            <p className="dd-note"><ShieldCheck size={14} /> Secure and confidential</p>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Mobile: booking is always one tap away */}
            <div className="dd-bar">
                <div>
                    <small>Consultation fee</small>
                    <strong>₹{fee}</strong>
                </div>
                <Link to={bookingLink} className="dd-btn dd-btn--primary">
                    <CalendarPlus size={17} /> Book now
                </Link>
            </div>
        </main>
    );
}

const styles = `
@import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");

.dd {
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

    min-height: calc(100vh - 68px);
    padding: 28px 20px 72px;
    background: var(--paper);
    color: var(--ink);
    font-family: "Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif;
}

.dd *, .dd *::before, .dd *::after { box-sizing: border-box; }
.dd h1, .dd h2, .dd p, .dd ul, .dd ol { margin: 0; padding: 0; }
.dd ul, .dd ol { list-style: none; }
.dd :focus-visible { outline: 3px solid var(--amber); outline-offset: 2px; border-radius: 8px; }

.dd-wrap { max-width: 1100px; margin: 0 auto; }

/* ---------- Back link ---------- */
.dd-back {
    display: inline-flex; align-items: center; gap: 8px;
    margin-bottom: 18px; padding: 9px 16px;
    border: 1.5px solid var(--line); border-radius: 99px; background: #fff;
    color: var(--muted); font-size: 14px; font-weight: 600; text-decoration: none;
    transition: color 0.18s, border-color 0.18s;
}
.dd-back:hover { color: var(--teal-dark); border-color: var(--teal); }

/* ---------- Header ---------- */
.dd-hero {
    display: flex; align-items: center; gap: 28px;
    padding: 36px 40px; margin-bottom: 20px;
    border: 1px solid var(--mint-2); border-radius: 28px;
    background: linear-gradient(180deg, var(--mint) 0%, #eef6f2 100%);
}
.dd-avatar {
    flex: none; display: grid; place-items: center;
    width: 112px; height: 112px; border-radius: 32px;
    background: var(--teal); color: #fff;
    font: 800 46px "Bricolage Grotesque", sans-serif;
    box-shadow: 0 20px 36px -18px rgba(15, 118, 110, 0.7);
}
.dd-hero__info { min-width: 0; }
.dd-speciality { font-size: 15px; font-weight: 700; color: var(--teal-dark); }
.dd-hero h1 {
    display: flex; align-items: center; gap: 10px; margin-top: 6px;
    font-family: "Bricolage Grotesque", "Segoe UI", sans-serif;
    font-size: clamp(28px, 4vw, 42px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.1;
}
.dd-verified { flex: none; color: var(--teal); }
.dd-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
.dd-chips li {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 8px 14px; border-radius: 99px; background: #fff; border: 1px solid var(--mint-2);
    font-size: 13.5px; font-weight: 600; color: var(--ink-2);
}
.dd-chips li svg { color: var(--teal); }
.dd-chips__rating { background: #fdf3d9 !important; border-color: #f4e2b0 !important; color: #8a5a00 !important; }
.dd-chips__rating svg { color: #b87c0b !important; }

/* ---------- Layout ---------- */
.dd-layout { display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: start; }
.dd-main { display: grid; gap: 20px; min-width: 0; }

.dd-card { padding: 28px; background: #fff; border: 1px solid var(--line); border-radius: 24px; }
.dd-card h2 { margin-bottom: 20px; font-family: "Bricolage Grotesque", "Segoe UI", sans-serif; font-size: 22px; font-weight: 700; letter-spacing: -0.01em; }

.dd-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.dd-info { display: flex; align-items: center; gap: 14px; padding: 16px; border: 1px solid var(--line); border-radius: 16px; background: var(--paper); }
.dd-info__icon { flex: none; display: grid; place-items: center; width: 44px; height: 44px; border-radius: 13px; background: #fff; color: var(--teal); }
.dd-info small { display: block; margin-bottom: 3px; font-size: 12.5px; font-weight: 600; color: var(--muted); }
.dd-info strong { display: block; font-size: 15.5px; font-weight: 700; overflow-wrap: anywhere; }

.dd-about { font-size: 16px; line-height: 1.8; color: var(--ink-2); }

.dd-steps { display: grid; gap: 12px; }
.dd-steps li { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 14px; background: var(--paper); color: var(--ink-2); font-size: 15px; }
.dd-steps li svg { flex: none; color: var(--teal); }
.dd-steps__num { flex: none; display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; background: var(--teal); color: #fff; font: 700 13.5px "Plus Jakarta Sans", sans-serif; }

/* ---------- Booking card ---------- */
.dd-side { position: sticky; top: 92px; }
.dd-book {
    padding: 28px; border-radius: 24px; color: #fff;
    background: radial-gradient(360px 220px at 100% 0%, rgba(95, 211, 180, 0.26), transparent 70%), var(--ink);
    box-shadow: 0 30px 56px -30px rgba(11, 42, 44, 0.8);
}
.dd-book__label { font-size: 14px; font-weight: 600; color: rgba(255, 255, 255, 0.7); }
.dd-price { margin: 6px 0 22px; font: 800 46px/1.1 "Bricolage Grotesque", sans-serif; letter-spacing: -0.03em; }
.dd-price span { margin-left: 8px; font: 500 15px "Plus Jakarta Sans", sans-serif; letter-spacing: 0; color: rgba(255, 255, 255, 0.6); }
.dd-perks { display: grid; gap: 12px; margin-bottom: 24px; padding: 20px 0; border-top: 1px solid rgba(255, 255, 255, 0.13); border-bottom: 1px solid rgba(255, 255, 255, 0.13); }
.dd-perks li { display: flex; align-items: center; gap: 12px; font-size: 14.5px; color: rgba(255, 255, 255, 0.86); }
.dd-perks li svg { flex: none; color: var(--bright); }
.dd-note { display: flex; align-items: center; justify-content: center; gap: 7px; margin-top: 14px; font-size: 13px; color: rgba(255, 255, 255, 0.6); }

/* ---------- Buttons ---------- */
.dd-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 9px;
    padding: 14px 24px; border: 1.5px solid transparent; border-radius: 13px;
    font: 700 15.5px "Plus Jakarta Sans", sans-serif; text-decoration: none; cursor: pointer;
    transition: background 0.18s, color 0.18s, transform 0.18s;
}
.dd-btn:active { transform: scale(0.98); }
.dd-btn--primary { background: var(--teal); color: #fff; }
.dd-btn--primary:hover { background: var(--teal-dark); }
.dd-btn--light { background: var(--bright); color: var(--ink); }
.dd-btn--light:hover { background: #fff; }
.dd-btn--block { width: 100%; }

/* ---------- Mobile booking bar ---------- */
.dd-bar { display: none; }

/* ---------- Loading + empty ---------- */
.dd-skel { border-radius: 24px; background: linear-gradient(90deg, #e9efec 25%, #f4f7f5 50%, #e9efec 75%); background-size: 200% 100%; animation: dd-shimmer 1.4s linear infinite; }
.dd-skel--hero { height: 190px; margin-top: 54px; margin-bottom: 20px; }
.dd-skel--card { height: 280px; }
@keyframes dd-shimmer { to { background-position: -200% 0; } }

.dd-empty { display: grid; justify-items: center; gap: 10px; padding: 72px 24px; text-align: center; background: #fff; border: 1.5px dashed var(--line); border-radius: 26px; }
.dd-empty__icon { display: grid; place-items: center; width: 62px; height: 62px; margin-bottom: 4px; border-radius: 18px; background: var(--mint); color: var(--teal); }
.dd-empty h1 { font-family: "Bricolage Grotesque", "Segoe UI", sans-serif; font-size: 26px; }
.dd-empty p { max-width: 42ch; margin-bottom: 12px; color: var(--muted); }

/* ---------- Responsive ---------- */
@media (max-width: 900px) {
    .dd { padding-bottom: 110px; }
    .dd-layout { grid-template-columns: 1fr; }
    .dd-side { display: none; }

    .dd-bar {
        position: fixed; left: 0; right: 0; bottom: 0; z-index: 40;
        display: flex; align-items: center; justify-content: space-between; gap: 16px;
        padding: 12px 20px calc(12px + env(safe-area-inset-bottom, 0px));
        background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px);
        border-top: 1px solid var(--line);
        font-family: "Plus Jakarta Sans", "Segoe UI", sans-serif; color: var(--ink);
    }
    .dd-bar small { display: block; font-size: 12.5px; color: var(--muted); }
    .dd-bar strong { font: 800 22px "Bricolage Grotesque", sans-serif; }
}

@media (max-width: 640px) {
    .dd { padding: 18px 14px 110px; }
    .dd-hero { flex-direction: column; text-align: center; padding: 28px 20px; gap: 18px; }
    .dd-avatar { width: 96px; height: 96px; border-radius: 28px; font-size: 40px; }
    .dd-hero h1, .dd-chips { justify-content: center; }
    .dd-card { padding: 22px; }
    .dd-grid { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
    .dd *, .dd *::before, .dd *::after { animation: none !important; transition: none !important; }
}
`;

export default DoctorDetails;