import { Link } from "react-router-dom";
import {
  Stethoscope,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import "../style/LandingPage.css";

const QUICK_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Find Doctors", href: "#doctors" },
  { label: "Specialities", href: "#specialities" },
  { label: "About", href: "#about" }
];

const SUPPORT_LINKS = [
  { label: "Help Center", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "FAQs", href: "#" }
];



function Footer() {

  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-column">

          <Link to="/" className="footer-logo">

            <div className="footer-logo-icon">
              <Stethoscope size={18} />
            </div>

            <span>
              BookMy<span>Doc</span>
            </span>

          </Link>

          <p className="footer-description">
            Connecting patients with trusted doctors
            for fast, secure and transparent healthcare
            booking.
          </p>

         

        </div>

        <div className="footer-column">

          <h4>Quick Links</h4>

          {QUICK_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="footer-link"
            >
              {link.label}
            </a>
          ))}

        </div>

        <div className="footer-column">

          <h4>Support</h4>

          {SUPPORT_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="footer-link"
            >
              {link.label}
            </a>
          ))}

        </div>

        <div className="footer-column">

          <h4>Contact Us</h4>

          <div className="contact-item">
            <MapPin size={16} />
            <span>Vijayawada, Andhra Pradesh</span>
          </div>

          <div className="contact-item">
            <Phone size={16} />
            <span>+91 98765 43210</span>
          </div>

          <div className="contact-item">
            <Mail size={16} />
            <span>support@bookmydoc.com</span>
          </div>

        </div>

      </div>

      <div className="footer-bottom">
        © 2026 BookMyDoc. All Rights Reserved.
      </div>

    </footer>
  );
}

export default Footer;