import { Search, CalendarCheck, BadgeCheck, Stethoscope } from "lucide-react";
import "../style/LandingPage.css";

const STEPS = [
  { icon: Search, title: "Find a doctor", desc: "Search by speciality, hospital or name and compare ratings." },
  { icon: CalendarCheck, title: "Choose a time slot", desc: "See live availability and pick a slot that fits your day." },
  { icon: BadgeCheck, title: "Confirm your booking", desc: "Get instant confirmation, with no calls and no waiting on hold." },
  { icon: Stethoscope, title: "Meet your doctor", desc: "Show up at the scheduled time and focus on your health." },
];

function HowItWorks() {
  return (
    <section id="about" className="how">
      <div className="wrap">
        <header className="section__head section__head--light">
          <h2>Book in four steps, usually under a minute</h2>
        </header>

        <ol className="how__steps">
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <li key={title} className="how__step">
              <span className="how__num">{i + 1}</span>
              <Icon size={26} className="how__icon" />
              <h3>{title}</h3>
              <p>{desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default HowItWorks;