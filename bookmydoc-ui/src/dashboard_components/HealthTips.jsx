import { Droplets, Footprints, Moon, Apple } from "lucide-react";
import "../style/Dashboard.css";

const TIPS = [
    {
        icon: Droplets,
        tone: "tone-sky",
        title: "Stay Hydrated",
        description: "Drink at least 2-3 litres of water daily for better health.",
    },
    {
        icon: Footprints,
        tone: "tone-green",
        title: "Daily Exercise",
        description: "Walk or exercise for at least 30 minutes every day.",
    },
    {
        icon: Moon,
        tone: "tone-indigo",
        title: "Quality Sleep",
        description: "Get 7-8 hours of sleep to improve recovery and focus.",
    },
    {
        icon: Apple,
        tone: "tone-amber",
        title: "Healthy Diet",
        description: "Include fruits, vegetables, and proteins in your meals.",
    },
];

function HealthTips() {
    return (
        <section className="health-tips-section">
            <div className="section-header">
                <div>
                    <h2>Health Tips</h2>
                    <p>Simple habits for a healthier lifestyle</p>
                </div>
            </div>

            <div className="health-tips-grid">
                {TIPS.map(({ icon: Icon, tone, title, description }) => (
                    <div key={title} className="health-tip-card">
                        <div className={`tip-icon ${tone}`}>
                            <Icon size={24} />
                        </div>

                        <h3>{title}</h3>

                        <p>{description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default HealthTips;