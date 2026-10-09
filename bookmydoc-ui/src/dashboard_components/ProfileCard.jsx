import { useEffect, useState } from "react";
import { Mail, Phone, Droplet, Cake } from "lucide-react";
import api from "../services/api";
import "../style/Dashboard.css";

function ProfileCard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const email = localStorage.getItem("userEmail");

        if (!email) {
            setLoading(false);
            return;
        }

        api.get(`/users/email/${email}`)
            .then((response) => setUser(response.data))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="profile-section">
                <div className="skeleton skeleton--profile" aria-busy="true" />
            </section>
        );
    }

    if (!user) {
        return (
            <section className="profile-section">
                <p className="loading-text">We could not load your profile.</p>
            </section>
        );
    }

    const info = [
        { label: "Email", value: user.email, icon: Mail },
        { label: "Phone", value: user.phoneNumber, icon: Phone },
        { label: "Blood group", value: user.bloodGroup, icon: Droplet },
        { label: "Age", value: user.age ? `${user.age} years` : "-", icon: Cake },
    ];

    return (
        <section className="profile-section">
            <div className="profile-card">
                <div className="profile-avatar">
                    {user.name?.charAt(0).toUpperCase()}
                </div>

                <div className="profile-details">
                    <h2>{user.name}</h2>

                    <div className="profile-info">
                        {info.map(({ label, value, icon: Icon }) => (
                            <div key={label} className="profile-item">
                                <div className="profile-item-icon">
                                    <Icon size={18} />
                                </div>

                                <div>
                                    <span>{label}</span>
                                    <strong>{value || "-"}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProfileCard;