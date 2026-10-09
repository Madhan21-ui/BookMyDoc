import { Users, Stethoscope, Layers, Headset } from "lucide-react";
import "../style/LandingPage.css";

const STATS = [
  { icon: Users, value: "10,000+", label: "Patients served" },
  { icon: Stethoscope, value: "8+", label: "Verified doctors" },
  { icon: Layers, value: "50+", label: "Specialities" },
  { icon: Headset, value: "24/7", label: "Patient support" },
];

function Stats() {
  return (
    <section className="stats" aria-label="BookMyDoc at a glance">
      <ul className="stats__row">
        {STATS.map(({ icon: Icon, value, label }) => (
          <li key={label}>
            <Icon size={20} />
            <div>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Stats;