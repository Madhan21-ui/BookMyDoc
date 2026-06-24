import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import "../style/LandingPage.css";

function Hero() {
  return (
    <section className="hero-section">

      <div className="hero-content">

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-badge"
        >
          <ShieldCheck size={18} />
          Trusted by 10,000+ Patients
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="hero-title"
        >
          Find Trusted Doctors &
          <br />
          Book Appointments Online
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="hero-description"
        >
          Find experienced doctors, book appointments instantly,
          and manage your healthcare journey from one platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="hero-buttons"
        >

          <Link
            to="/auth"
            className="hero-primary-btn"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/doctors"
            className="hero-secondary-btn"
          >
            Find Doctors
          </Link>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="hero-stats"
        >

          <div className="hero-stat-card">
            <h2>8+</h2>
            <p>Doctors</p>
          </div>

          <div className="hero-stat-card">
            <h2>100+</h2>
            <p>Patients</p>
          </div>

          <div className="hero-stat-card">
            <h2>24/7</h2>
            <p>Support</p>
          </div>

        </motion.div>

      </div>

    </section>
  );
}

export default Hero;