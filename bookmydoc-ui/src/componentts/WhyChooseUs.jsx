import { BadgeCheck, MousePointerClick, ShieldCheck, Zap, Wallet } from "lucide-react";
import "../style/LandingPage.css";

const REASONS = [
  { icon: BadgeCheck, title: "Verified doctors", desc: "Credentials and licenses are checked before any doctor is listed." },
  { icon: MousePointerClick, title: "Easy booking", desc: "Book from your phone or laptop in under a minute." },
  { icon: ShieldCheck, title: "Private by default", desc: "Your records and personal details stay encrypted." },
  { icon: Zap, title: "Instant confirmation", desc: "Your slot is confirmed in real time, so there is nothing to follow up on." },
  { icon: Wallet, title: "Clear pricing", desc: "Consultation fees are shown up front, with no hidden charges." },
];

function WhyChooseUs() {
  return (
    <section className="section">
      <div className="wrap why">
        <header className="why__head">
          <h2>Healthcare booking that respects your time</h2>
          <p>We built BookMyDoc around the things that usually go wrong when you try to see a doctor.</p>
        </header>

        <ul className="why__list">
          {REASONS.map(({ icon: Icon, title, desc }) => (
            <li key={title}>
              <span className="why__icon"><Icon size={22} /></span>
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default WhyChooseUs;