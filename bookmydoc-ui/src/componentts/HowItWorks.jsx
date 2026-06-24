import { motion } from "framer-motion";
import {
  Search,
  CalendarCheck,
  BadgeCheck,
  Stethoscope
} from "lucide-react";

import "../style/LandingPage.css";

const STEPS = [
  {
    icon: Search,
    title: "Find a Doctor",
    desc: "Search and explore experienced doctors based on speciality and expertise."
  },
  {
    icon: CalendarCheck,
    title: "Choose a Time Slot",
    desc: "Check real-time availability and select a convenient appointment slot."
  },
  {
    icon: BadgeCheck,
    title: "Book Appointment",
    desc: "Confirm your appointment instantly with secure booking."
  },
  {
    icon: Stethoscope,
    title: "Consult Doctor",
    desc: "Meet your doctor at the scheduled date and time."
  }
];

function HowItWorks() {

  return (
    <section className="how-section">

      <div className="how-container">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          whileHover={{
            y: -8,
            scale: 1.03
          }}
          className="how-header"
        >

          <span className="how-tag">
            HOW IT WORKS
          </span>

          <h2>
            Book Your Appointment in 4 Simple Steps
          </h2>

        </motion.div>

        <div className="steps-grid">

          {STEPS.map(
            (
              {
                icon: Icon,
                title,
                desc
              },
              i
            ) => (

              <motion.div
                key={title}
                initial={{
                  opacity: 0,
                  y: 24
                }}
                whileInView={{
                  opacity: 1,
                  y: 0
                }}
                viewport={{
                  once: true
                }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.1
                }}
                className="step-card"
              >

                <div className="step-icon">

                  <Icon size={28} />

                  <span className="step-number">
                    {i + 1}
                  </span>

                </div>

                <h3>
                  {title}
                </h3>

                <p>
                  {desc}
                </p>

              </motion.div>

            )
          )}

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;