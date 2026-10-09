import { Link } from "react-router-dom";
import {
  Stethoscope, HeartPulse, Sparkles, Brain, Bone, Baby, Smile, HeartHandshake,
} from "lucide-react";
import "../style/LandingPage.css";

const SPECIALITIES = [
  { icon: Stethoscope, name: "General Physician", hint: "Fever, checkups, everyday care" },
  { icon: HeartPulse, name: "Cardiologist", hint: "Heart and blood pressure" },
  { icon: Sparkles, name: "Dermatologist", hint: "Skin, hair and nails" },
  { icon: Brain, name: "Neurologist", hint: "Headaches, nerves, sleep" },
  { icon: Bone, name: "Orthopedic", hint: "Bones, joints and sports injuries" },
  { icon: Baby, name: "Pediatrician", hint: "Newborns to teenagers" },
  { icon: Smile, name: "Dentist", hint: "Teeth, gums and braces" },
  { icon: HeartHandshake, name: "Gynecologist", hint: "Women's health and pregnancy" },
];

function Specialities() {
  return (
    <section id="specialities" className="section">
      <div className="wrap">
        <header className="section__head">
          <h2>Start with what you need help with</h2>
          <p>Choose a speciality and see doctors who have open slots this week.</p>
        </header>

        <div className="spec-grid">
          {SPECIALITIES.map(({ icon: Icon, name, hint }) => (
            <Link
              key={name}
              to={`/doctors?speciality=${encodeURIComponent(name)}`}
              className="spec"
            >
              <span className="spec__icon"><Icon size={22} /></span>
              <span className="spec__text">
                <strong>{name}</strong>
                <small>{hint}</small>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Specialities;