import { HeartPulse, MapPin, Mail, Phone } from "lucide-react";
import "../style/Dashboard.css";

function Footer() {
    return (
        <footer className="dashboard-footer">
            <div className="footer-container">
                <div className="footer-section">
                    <div className="footer-brand">
                        <span className="footer-brand-icon">
                            <HeartPulse size={20} />
                        </span>
                        BookMyDoc
                    </div>

                    <p>
                        Connecting patients with trusted doctors for seamless
                        healthcare appointments.
                    </p>
                </div>

                <div className="footer-section">
                    <h3>Quick Links</h3>

                    <ul>
                        <li><a href="/dashboard">Dashboard</a></li>
                        <li><a href="/doctors">Doctors</a></li>
                        <li><a href="/appointments">Appointments</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Support</h3>

                    <ul>
                        <li>Help Center</li>
                        <li>Privacy Policy</li>
                        <li>Terms &amp; Conditions</li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Contact</h3>

                    <ul>
                        <li><MapPin size={16} /> Eluru, India</li>
                        <li><Mail size={16} /> bookmydoc@gmail.com</li>
                        <li><Phone size={16} /> +91 98765 43210</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2026 BookMyDoc. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;