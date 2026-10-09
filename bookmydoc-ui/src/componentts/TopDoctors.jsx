import { useNavigate } from "react-router-dom";
import { Star, BadgeCheck, Building2, ArrowRight } from "lucide-react";
import "../style/LandingPage.css";

const DOCTORS = [
  {
    name: "Dr. Sneha Naidu", specialization: "Orthopedics", experience: "10 years",
    rating: 4.9, hospital: "Apollo Hospitals", appointments: "500+ appointments", availability: "today",
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=500&auto=format&fit=crop",
  },
  {
    name: "Dr. Rajesh Kumar", specialization: "Cardiologist", experience: "12 years",
    rating: 4.8, hospital: "Andhra Hospitals", appointments: "700+ appointments", availability: "today",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=500&auto=format&fit=crop",
  },
  {
    name: "Dr. Priya Reddy", specialization: "Neurologist", experience: "8 years",
    rating: 4.7, hospital: "Priya Hospital", appointments: "450+ appointments", availability: "limited",
    img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=500&auto=format&fit=crop",
  },
  {
    name: "Dr. Arjun Varma", specialization: "ENT specialist", experience: "15 years",
    rating: 5.0, hospital: "Kamala Hospital", appointments: "1000+ appointments", availability: "today",
    img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=500&auto=format&fit=crop",
  },
];

const AVAIL = {
  today: { text: "Available today", cls: "dot dot--ok" },
  limited: { text: "Few slots left", cls: "dot dot--warn" },
};

function TopDoctors() {
  const navigate = useNavigate();

  return (
    <section id="doctors" className="section section--tint">
      <div className="wrap">
        <header className="section__head section__head--row">
          <div>
            <h2>Doctors patients book again and again</h2>
            <p>Verified profiles, honest ratings, and live availability.</p>
          </div>
          <button className="btn btn--ghost" onClick={() => navigate("/doctors")}>
            View all doctors <ArrowRight size={16} />
          </button>
        </header>

        <div className="doc-grid">
          {DOCTORS.map((d) => (
            <article key={d.name} className="doc">
              <div className="doc__photo">
                <img src={d.img} alt={d.name} loading="lazy" />
                <span className="doc__avail"><i className={AVAIL[d.availability].cls} />{AVAIL[d.availability].text}</span>
              </div>

              <div className="doc__body">
                <div className="doc__top">
                  <h3>{d.name}<BadgeCheck size={16} className="doc__verified" aria-label="Verified" /></h3>
                  <span className="doc__rating"><Star size={14} fill="currentColor" />{d.rating}</span>
                </div>
                <p className="doc__spec">{d.specialization} · {d.experience}</p>
                <p className="doc__meta"><Building2 size={14} />{d.hospital}</p>
                <p className="doc__meta doc__meta--muted">{d.appointments}</p>

                <button className="btn btn--soft btn--block" onClick={() => navigate("/doctors")}>
                  Book appointment
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopDoctors;