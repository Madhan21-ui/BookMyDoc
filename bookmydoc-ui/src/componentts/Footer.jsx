import { Link } from "react-router-dom";
import { Stethoscope, Mail, Phone, MapPin } from "lucide-react";
import "../style/LandingPage.css";

const EXPLORE = [
  { label: "Find doctors", to: "/doctors" },
  { label: "My appointments", to: "/appointments" },
  { label: "Sign in", to: "/auth" },
  { label: "For doctors", to: "/doctor-login" },
];

const SUPPORT = ["Help center", "Privacy policy", "Terms of service", "FAQs"];

function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="wrap footer__grid">
        <div className="footer__about">
          <Link to="/" className="brand brand--light">
            <span className="brand__mark"><Stethoscope size={18} strokeWidth={2.4} /></span>
            <span className="brand__name">BookMy<b>Doc</b></span>
          </Link>
          <p>Connecting patients with trusted doctors for fast, secure and transparent booking.</p>
        </div>

        <nav className="footer__col" aria-label="Explore">
          <h4>Explore</h4>
          {EXPLORE.map((l) => <Link key={l.label} to={l.to}>{l.label}</Link>)}
        </nav>

        <nav className="footer__col" aria-label="Support">
          <h4>Support</h4>
          {SUPPORT.map((l) => <a key={l} href="#contact">{l}</a>)}
        </nav>

        <div className="footer__col">
          <h4>Contact us</h4>
          <p className="footer__item"><MapPin size={16} />Vijayawada, Andhra Pradesh</p>
          <p className="footer__item"><Phone size={16} />+91 98765 43210</p>
          <p className="footer__item"><Mail size={16} />support@bookmydoc.com</p>
        </div>
      </div>

      <div className="footer__bottom">© 2026 BookMyDoc. All rights reserved.</div>
    </footer>
  );
}

export default Footer;