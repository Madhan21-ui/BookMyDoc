import { motion } from "framer-motion";
import {
  BadgeCheck,
  MousePointerClick,
  ShieldCheck,
  Zap,
  Wallet
} from "lucide-react";

import "../style/LandingPage.css";

const REASONS = [
  {
    icon: BadgeCheck,
    title: "Verified Doctors",
    desc: "Every doctor is credential-checked and license-verified before listing."
  },
  {
    icon: MousePointerClick,
    title: "Easy Booking",
    desc: "Book an appointment in under a minute, from any device."
  },
  {
    icon: ShieldCheck,
    title: "Secure Data Privacy",
    desc: "Your medical records and personal data stay encrypted, always."
  },
  {
    icon: Zap,
    title: "Instant Confirmation",
    desc: "No waiting on hold — get your booking confirmed in real time."
  },
  {
    icon: Wallet,
    title: "Affordable Access",
    desc: "Transparent pricing with no hidden fees on any consultation."
  }
];

function WhyChooseUs() {

  return (
    <section className="why-section">

      <div className="why-container">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="why-header"
        >

          <span className="why-tag">
            WHY CHOOSE US
          </span>

          <h2>
            Why Choose BookMyDoc
          </h2>

        </motion.div>

        <div className="why-grid">

          {REASONS.map(
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
                  y: 20
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
                  delay: i * 0.08
                }}
                className="why-card"
              >

                <div className="why-icon">

                  <Icon size={24} />

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

export default WhyChooseUs;