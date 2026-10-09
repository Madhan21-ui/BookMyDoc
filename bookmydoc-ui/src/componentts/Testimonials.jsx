import { Star } from "lucide-react";
import "../style/LandingPage.css";

const TESTIMONIALS = [
  {
    name: "Anjali Desai", role: "Patient, Mumbai", rating: 5,
    quote: "Booking a cardiologist used to take days of phone calls. With BookMyDoc I found a slot and confirmed it in under two minutes.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop",
  },
  {
    name: "Rahul Kapoor", role: "Patient, Bengaluru", rating: 5,
    quote: "The availability calendar is so clear. I knew exactly when my doctor was free without a single back-and-forth message.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop",
  },
  {
    name: "Sneha Iyer", role: "Patient, Pune", rating: 4,
    quote: "I switched the whole family from calling clinics to this app. The reminders alone have saved us from missed visits.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop",
  },
];

function Person({ t }) {
  return (
    <figcaption className="quote__who">
      <img src={t.avatar} alt="" loading="lazy" />
      <div>
        <strong>{t.name}</strong>
        <span>{t.role}</span>
      </div>
      <span className="quote__stars" aria-label={`${t.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} fill="currentColor" className={i < t.rating ? "on" : "off"} />
        ))}
      </span>
    </figcaption>
  );
}

function Testimonials() {
  const [lead, ...rest] = TESTIMONIALS;
  return (
    <section className="section section--tint">
      <div className="wrap">
        <header className="section__head">
          <h2>What patients say after their first booking</h2>
        </header>

        <div className="quotes">
          <figure className="quote quote--lead">
            <blockquote>{lead.quote}</blockquote>
            <Person t={lead} />
          </figure>

          {rest.map((t) => (
            <figure key={t.name} className="quote">
              <blockquote>{t.quote}</blockquote>
              <Person t={t} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;