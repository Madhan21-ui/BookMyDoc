import "../style/Dashboard.css";

function Footer() {
    return (
        <footer className="dashboard-footer">

            <div className="footer-container">

                <div className="footer-section">

                    <h2>🏥 BookMyDoc</h2>

                    <p>
                        Connecting patients with trusted doctors
                        for seamless healthcare appointments.
                    </p>

                </div>

                <div className="footer-section">

                    <h3>Quick Links</h3>

                    <ul>
                        <li>
                            <a href="/dashboard">Dashboard</a>
                        </li>

                        <li>
                            <a href="/doctors">Doctors</a>
                        </li>

                        <li>
                            <a href="/appointments">Appointments</a>
                        </li>
                    </ul>

                </div>

                <div className="footer-section">

                    <h3>Support</h3>

                    <ul>
                        <li>Help Center</li>
                        <li>Privacy Policy</li>
                        <li>Terms & Conditions</li>
                    </ul>

                </div>

                <div className="footer-section">

                    <h3>Contact</h3>

                    <p>📍 Eluru, India</p>
                    <p>📧 bookmydoc@gmail.com</p>
                    <p>📞 +91 98765 43210</p>

                </div>

            </div>

            <div className="footer-bottom">

                <p>
                    © 2026 BookMyDoc. All Rights Reserved.
                </p>

            </div>

        </footer>
    );
}

export default Footer;