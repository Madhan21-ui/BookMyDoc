import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BadgeCheck, MapPin, Search, Star } from "lucide-react";
import "../style/LandingPage.css";

const SPECIALITY_OPTIONS = [
  "General Physician", "Cardiologist", "Dermatologist", "Neurologist",
  "Orthopedic", "Pediatrician", "Dentist", "Gynecologist",
];

const TIMES = [
  { label: "9:30 AM", booked: false },
  { label: "11:00 AM", booked: true },
  { label: "2:30 PM", booked: false },
  { label: "5:00 PM", booked: false },
];

const rise = (i) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay: 0.08 * i, ease: "easeOut" },
});

function Hero() {
  const navigate = useNavigate();
  const [speciality, setSpeciality] = useState("");
  const [city, setCity] = useState("");
  const [dayIdx, setDayIdx] = useState(0);
  const [time, setTime] = useState("9:30 AM");

  const days = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
          weekday: i === 0 ? "Today" : d.toLocaleDateString("en-IN", { weekday: "short" }),
          date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        };
      }),
    []
  );

  const search = (e) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (speciality) q.set("speciality", speciality);
    if (city.trim()) q.set("city", city.trim());
    navigate(`/doctors${q.toString() ? `?${q}` : ""}`);
  };

  return (
    <section id="home" className="hero">
      <div className="hero__grid">
        <div className="hero__copy">
          <motion.p className="pill" {...rise(0)}>
            <BadgeCheck size={16} /> Every doctor is license-verified
          </motion.p>

          <motion.h1 className="hero__title" {...rise(1)}>
            See the right doctor, at a time that suits you.
          </motion.h1>

          <motion.p className="hero__lead" {...rise(2)}>
            Compare specialists in Vijayawada, check real open slots, and confirm your
            appointment in under a minute. No calls, no waiting room guesswork.
          </motion.p>

          <motion.form className="search" onSubmit={search} {...rise(3)}>
            <label className="search__field">
              <Search size={18} />
              <select value={speciality} onChange={(e) => setSpeciality(e.target.value)} aria-label="Speciality">
                <option value="">Any speciality</option>
                {SPECIALITY_OPTIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label className="search__field">
              <MapPin size={18} />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City or area"
                aria-label="City or area"
              />
            </label>
            <button type="submit" className="btn btn--primary">Find doctors</button>
          </motion.form>

          <motion.p className="hero__sub" {...rise(4)}>
            New here? <Link to="/auth">Create a free account</Link>
          </motion.p>
        </div>

        <motion.aside
          className="slot"
          aria-label="Sample appointment booking"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        >
          <div className="slot__doctor">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=240&auto=format&fit=crop"
              alt="Dr. Sneha Naidu"
            />
            <div>
              <h3>Dr. Sneha Naidu</h3>
              <p>Orthopedics · 10 years</p>
            </div>
            <span className="slot__rating"><Star size={14} fill="currentColor" /> 4.9</span>
          </div>

          <p className="slot__label">Pick a day</p>
          <div className="slot__days" role="radiogroup" aria-label="Day">
            {days.map((d, i) => (
              <button
                key={d.date}
                role="radio"
                aria-checked={dayIdx === i}
                className={`chip chip--day ${dayIdx === i ? "is-active" : ""}`}
                onClick={() => setDayIdx(i)}
              >
                <span>{d.weekday}</span>
                <strong>{d.date}</strong>
              </button>
            ))}
          </div>

          <p className="slot__label">Pick a time</p>
          <div className="slot__times" role="radiogroup" aria-label="Time">
            {TIMES.map((t) => (
              <button
                key={t.label}
                role="radio"
                aria-checked={time === t.label}
                disabled={t.booked}
                className={`chip ${time === t.label ? "is-active" : ""}`}
                onClick={() => setTime(t.label)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button className="btn btn--primary btn--block" onClick={() => navigate("/doctors")}>
            Book {days[dayIdx].weekday}, {time} <ArrowRight size={16} />
          </button>
          <p className="slot__note">Sample preview. Browse all doctors to book for real.</p>
        </motion.aside>
      </div>
    </section>
  );
}

export default Hero;