import { motion } from "framer-motion";
import { Users, Stethoscope, Layers, Headset } from "lucide-react";
import "../style/LandingPage.css";
const STATS = [
  { icon: Users, value: "10,000+", label: "Patients" },
  { icon: Stethoscope, value: "8+", label: "Doctors" },
  { icon: Layers, value: "50+", label: "Specialities" },
  { icon: Headset, value: "24/7", label: "Support" },
];

function Stats() {
  return (
    <section className="stats-section">
      <div className="stats-container">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="stats-grid"
        >

          {STATS.map(({ icon: Icon, value, label }) => (

            <div
              key={label}
              className="stat-card"
            >

              <span className="stat-icon">
                <Icon size={22} />
              </span>

              <span className="stat-value">
                {value}
              </span>

              <span className="stat-label">
                {label}
              </span>

            </div>

          ))}

        </motion.div>

      </div>
    </section>
  );
}

export default Stats;
