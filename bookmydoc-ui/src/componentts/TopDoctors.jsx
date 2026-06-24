import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Star,
  BadgeCheck,
  ArrowRight
} from "lucide-react";

import "../style/LandingPage.css";

const DOCTORS = [
  {
    name: "Dr. Sneha Naidu",
    specialization: "Orthopedics",
    experience: "10 Years Experience",
    rating: 4.9,
    hospital: "Apollo Hospitals",
    appointments: "500+ Appointments",
    availability: "🟢 Available Today",
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Dr. Rajesh Kumar",
    specialization: "Cardiologist",
    experience: "12 Years Experience",
    hospital: "Andhra Hospitals",
    appointments: "700+ Appointments",
    availability: "🟢 Available Today",
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Dr. Priya Reddy",
    specialization: "Neurologist",
    experience: "8 Years Experience",
    hospital: "Priya Hospital",
    appointments: "450+ Appointments",
    availability: "🟡 Limited Slots",
    rating: 4.7,
    img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Dr. Arjun Varma",
    specialization: "ENT Specialist",
    experience: "15 Years Experience",
    hospital: "Kamala Hospital",
    appointments: "1000+ Appointments",
    availability: "🟢 Available Today",
    rating: 5.0,
    img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop"
  }
];

function TopDoctors() {

  const navigate = useNavigate();

  return (

    <section className="top-doctors-section">

      <div className="top-doctors-container">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="top-doctors-header"
        >

          <span className="section-tag">
            TOP DOCTORS
          </span>

          <h2>
            Meet Our Trusted Specialists
          </h2>

          <p>
            Verified healthcare professionals with
            years of experience and outstanding
            patient reviews.
          </p>

        </motion.div>

        <div className="doctor-grid">

          {DOCTORS.map((doctor, index) => (

            <motion.div
              key={doctor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                y: -10,
                scale: 1.03
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: index * 0.1
              }}
              className="doctor-card"
            >

              <div className="doctor-image-wrapper">

                <img
                  src={doctor.img}
                  alt={doctor.name}
                  className="doctor-image"
                />

              </div>

              <div className="doctor-content">

                <div className="doctor-title">

                  <div>

                    <h3>
                      {doctor.name}

                      <BadgeCheck
                        size={16}
                        className="verified-icon"
                      />
                    </h3>

                    <p className="specialization">
                      {doctor.specialization}
                    </p>

                    <p className="hospital">
                      🏥 {doctor.hospital}
                    </p>

                  </div>

                  <span className="rating">

                    <Star
                      size={14}
                      fill="currentColor"
                    />

                    {doctor.rating}

                  </span>

                </div>

                <p className="experience">
                  {doctor.experience}
                </p>

                <p
                  style={{
                    color: "#1976d2",
                    fontWeight: "600",
                    marginBottom: "8px"
                  }}
                >
                  {doctor.appointments}
                </p>

                <p
                  style={{
                    color: "green",
                    fontWeight: "600",
                    marginBottom: "15px"
                  }}
                >
                  {doctor.availability}
                </p>

                <button
                  className="doctor-btn"
                  onClick={() =>
                    navigate("/doctors")
                  }
                >

                  Book Appointment

                  <ArrowRight size={15} />

                </button>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default TopDoctors;