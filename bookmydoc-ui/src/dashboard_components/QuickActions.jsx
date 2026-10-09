import { Search, CalendarPlus, ClipboardList, PhoneCall, ArrowRight } from "lucide-react";
import "../style/Dashboard.css";

const ACTIONS = [
    { title: "Find Doctors", icon: Search, path: "/doctors", tone: "tone-blue" },
    { title: "Book Appointment", icon: CalendarPlus, path: "/doctors", tone: "tone-indigo" },
    { title: "My Appointments", icon: ClipboardList, path: "/appointments", tone: "tone-sky" },
    { title: "Emergency Support", icon: PhoneCall, path: "#", tone: "tone-red" },
];

function QuickActions() {
    return (
        <section className="quick-actions">
            <div className="section-header">
                <div>
                    <h2>Quick Actions</h2>
                    <p>Jump straight to what you need</p>
                </div>
            </div>

            <div className="actions-grid">
                {ACTIONS.map(({ title, icon: Icon, path, tone }) => (
                    <a key={title} href={path} className="action-card">
                        <div className={`action-icon ${tone}`}>
                            <Icon size={22} />
                        </div>

                        <h3>{title}</h3>

                        <ArrowRight size={18} className="action-arrow" />
                    </a>
                ))}
            </div>
        </section>
    );
}

export default QuickActions;