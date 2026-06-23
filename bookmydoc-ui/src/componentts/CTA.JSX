import { motion } from "framer-motion";
import { ArrowRight, CalendarPlus } from "lucide-react";
import "../style/LandingPage.css";

function CTA() {
    return (
        <section className="cta-section">

            <div className="cta-container">

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                    className="cta-card"
                >

                    <h2>
                        Ready to Connect with the Right Doctor?
                    </h2>

                    <p>
                        Join thousands of patients who book smarter,
                        not harder.
                    </p>

                    <div className="cta-buttons">

                        <a
                            href="/auth"
                            className="cta-primary-btn"
                        >
                            Get Started
                            <ArrowRight size={18} />
                        </a>

                        <a
                            href="/doctors"
                            className="cta-secondary-btn"
                        >
                            <CalendarPlus size={18} />
                            Book Appointment
                        </a>

                    </div>

                </motion.div>

            </div>

        </section>
    );
}

export default CTA;