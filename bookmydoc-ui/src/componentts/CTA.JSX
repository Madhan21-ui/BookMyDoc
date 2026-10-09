import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "../style/LandingPage.css";

function CTA() {
    return (
        <section className="cta">
            <div className="wrap cta__inner">
                <div>
                    <h2>Your next appointment is a few taps away</h2>
                    <p>Create a free account and book your first visit today.</p>
                </div>
                <div className="cta__actions">
                    <Link to="/auth" className="btn btn--light">Create free account <ArrowRight size={16} /></Link>
                    <Link to="/doctors" className="btn btn--outline-light">Browse doctors</Link>
                </div>
            </div>
        </section>
    );
}

export default CTA;