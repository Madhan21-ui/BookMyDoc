import { useEffect, useState } from "react";
import { ShieldCheck, Search, CalendarCheck, BadgeCheck, Clock, Lock } from "lucide-react";
import api from "../services/api";
import "../style/Dashboard.css";

const POINTS = [
    { icon: BadgeCheck, title: "Verified doctors", text: "Trusted specialists across every field" },
    { icon: Clock, title: "Quick booking", text: "Pick a slot and confirm in minutes" },
    { icon: Lock, title: "Secure records", text: "Your health data stays private" },
];

function DashboardHero() {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const email = localStorage.getItem("userEmail");

        if (!email) return;

        api.get(`/users/email/${email}`)
            .then((response) => setUserName(response.data.name))
            .catch((error) => console.error(error));
    }, []);

    const hour = new Date().getHours();
    let greeting = "Good evening";

    if (hour < 12) {
        greeting = "Good morning";
    } else if (hour < 18) {
        greeting = "Good afternoon";
    }

    const firstName = userName.trim().split(" ")[0];

    return (
        <section className="dashboard-hero">
            <div className="dashboard-hero-inner">
                <div className="dashboard-hero-content">
                    <span className="welcome-badge">
                        <ShieldCheck size={16} />
                        Trusted healthcare platform
                    </span>

                    <h1>
                        {greeting}
                        {firstName ? `, ${firstName}` : ""}
                    </h1>

                    <p>
                        Book appointments with trusted doctors, manage your
                        healthcare records, and stay connected with specialists
                        all in one place.
                    </p>

                    <div className="dashboard-buttons">
                        <button
                            className="primary-btn"
                            onClick={() => (window.location.href = "/doctors")}
                        >
                            <Search size={18} />
                            Find Doctors
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={() => (window.location.href = "/appointments")}
                        >
                            <CalendarCheck size={18} />
                            My Appointments
                        </button>
                    </div>
                </div>

                <div className="hero-points">
                    {POINTS.map(({ icon: Icon, title, text }) => (
                        <div key={title} className="hero-point">
                            <div className="hero-point-icon">
                                <Icon size={20} />
                            </div>

                            <div>
                                <strong>{title}</strong>
                                <span>{text}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default DashboardHero;