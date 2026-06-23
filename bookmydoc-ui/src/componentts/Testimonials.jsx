import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import "../style/LandingPage.css";

const TESTIMONIALS = [
  {
    name: "Anjali Desai",
    role: "Patient · Mumbai",
    rating: 5,
    quote:
      "Booking a cardiologist used to take days of phone calls. With BookMyDoc I found a slot and confirmed it in under two minutes.",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop",
  },
  {
    name: "Rahul Kapoor",
    role: "Patient · Bengaluru",
    rating: 5,
    quote:
      "The availability calendar is so clear. I knew exactly when my doctor was free without a single back-and-forth message.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop",
  },
  {
    name: "Sneha Iyer",
    role: "Patient · Pune",
    rating: 4,
    quote:
      "Switched from calling clinics to using this app for the whole family. The reminders alone have saved us from missed visits.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop",
  },
];

function TestimonialCard({ t, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.45,
        delay: index * 0.08
      }}
      className="testimonial-card"
    >
      <Quote
        className="quote-icon"
        size={36}
      />

      <div className="rating-stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={15}
            fill="currentColor"
            className={
              i < t.rating
                ? "star-active"
                : "star-inactive"
            }
          />
        ))}
      </div>

      <p className="testimonial-text">
        "{t.quote}"
      </p>

      <div className="testimonial-footer">

        <img
          src={t.avatar}
          alt={t.name}
          className="testimonial-avatar"
        />

        <div>

          <p className="testimonial-name">
            {t.name}
          </p>

          <p className="testimonial-role">
            {t.role}
          </p>

        </div>

      </div>
    </motion.div>
  );
}

function Testimonials() {
  return (
    <section className="testimonials-section">

      <div className="testimonials-container">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="testimonials-header"
        >

          <span className="testimonials-tag">
            TESTIMONIALS
          </span>

          <h2>
            What Our Patients Say
          </h2>

        </motion.div>

        <div className="testimonials-grid">

          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard
              key={t.name}
              t={t}
              index={i}
            />
          ))}

        </div>

      </div>

    </section>
  );
}

export default Testimonials;