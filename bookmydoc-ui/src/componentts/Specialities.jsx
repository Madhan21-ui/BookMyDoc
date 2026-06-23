import { motion } from "framer-motion";
import {
  Stethoscope,
  HeartPulse,
  Sparkles,
  Brain,
  Bone,
  Baby,
  Smile,
  HeartHandshake,
} from "lucide-react";

const SPECIALITIES = [
  { icon: Stethoscope, name: "General Physician" },
  { icon: HeartPulse, name: "Cardiologist" },
  { icon: Sparkles, name: "Dermatologist" },
  { icon: Brain, name: "Neurologist" },
  { icon: Bone, name: "Orthopedic" },
  { icon: Baby, name: "Pediatrician" },
  { icon: Smile, name: "Dentist" },
  { icon: HeartHandshake, name: "Gynecologist" },
];

function Specialities() {
  return (
    <section id="specialities" className="specialities-section">

      <div className="specialities-container">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="specialities-header"
        >

          <span className="specialities-tag">
            Specialities
          </span>

          <h2>
            Find the Right Specialist for You
          </h2>

          <p>
            From routine checkups to specialist care,
            BookMyDoc connects you with the right expert
            in seconds.
          </p>

        </motion.div>

        <div className="specialities-grid">

          {SPECIALITIES.map(({ icon: Icon, name }, i) => (

            <motion.a
              href="#doctors"
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: i * 0.05
              }}
              className="speciality-card"
            >

              <span className="speciality-icon">
                <Icon size={24} />
              </span>

              <span className="speciality-name">
                {name}
              </span>

            </motion.a>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Specialities;
