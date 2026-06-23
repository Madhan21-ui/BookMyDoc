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
    title: "Search Doctor",
    desc: "Browse by speciality, name, or location to find the right fit."
  },
  {
    icon: CalendarCheck,
    title: "Select Time Slot",
    desc: "View real-time availability and pick a slot that works for you."
  },
  {
    icon: BadgeCheck,
    title: "Confirm Appointment",
    desc: "Lock in your booking instantly with a confirmation in seconds."
  },
  {
    icon: Stethoscope,
    title: "Visit Doctor",
    desc: "Show up at your scheduled time."
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
          className="how-header"
        >

          <span className="how-tag">
            HOW IT WORKS
          </span>

          <h2>
            Booking Made Effortless
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