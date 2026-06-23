import { motion } from "framer-motion";
import { Star, BadgeCheck, ArrowRight, Hospital } from "lucide-react";
import "../style/LandingPage.css";

const DOCTORS = [
  {
    name: "Dr.Sneha Naidu",
    specialization: "Orthopedics",
    experience: "10 Years Experience",
    rating: 4.9,
    hospital: "Apollo Hospitals",

    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Dr. Rajesh Kumar",
    specialization: "Cardiologist",
    experience: "12 Years Experience",
    hospital: "Andhra Hospitals",
    rating: 4.8,

    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Dr. Priya Reddy",
    specialization: "Neurologist",
    experience: "8 Years Experience",
    hospital: "Priya Hospital",
    rating: 4.7,

    img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Dr. Arjun Varma ",
    specialization: "ENT",
    experience: "15 Years Experience",
    hospital: "Kamala Hospital",
    rating: 5.0,

    img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop"
  }
];

function TopDoctors() {

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
            Hand-picked, verified doctors with proven
            experience and excellent patient reviews.
          </p>

        </motion.div>

        <div className="doctor-grid">

          {DOCTORS.map((doctor, index) => (

            <motion.div
              key={doctor.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
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
                    <p
                      className="hospital">
                      {doctor.hospital}
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

                <button className="doctor-btn">

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