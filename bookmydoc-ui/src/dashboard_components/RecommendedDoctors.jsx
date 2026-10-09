import { useEffect, useState } from "react";
import { Building2, GraduationCap, ArrowRight } from "lucide-react";
import api from "../services/api";
import "../style/Dashboard.css";

function displayName(name = "") {
    if (!name) return "Doctor";

    return /^dr\.?\s/i.test(name) ? name : `Dr. ${name}`;
}

function RecommendedDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/doctors")
            .then((response) => setDoctors(response.data))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="recommended-section">
            <div className="section-header">
                <div>
                    <h2>Recommended Doctors</h2>
                    <p>Top specialists available for consultation</p>
                </div>

                <a href="/doctors" className="section-link">
                    See all doctors <ArrowRight size={16} />
                </a>
            </div>

            <div className="recommended-grid">
                {loading
                    ? [0, 1, 2].map((i) => <div key={i} className="skeleton skeleton--card" />)
                    : doctors.slice(0, 3).map((doctor) => (
                        <div key={doctor.id} className="recommended-card">
                            <div className="doctor-top">
                                <div className="doctor-avatar">
                                    {(doctor.name || "D")
                                        .replace(/^dr\.?\s*/i, "")
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>
                                    <h3>{displayName(doctor.name)}</h3>
                                    <p className="doctor-speciality">{doctor.specialization}</p>
                                </div>
                            </div>

                            <ul className="doctor-meta">
                                <li>
                                    <GraduationCap size={16} />
                                    {doctor.experience} years of experience
                                </li>

                                <li>
                                    <Building2 size={16} />
                                    {doctor.hospitalName}
                                </li>
                            </ul>

                            <button
                                className="book-now-btn"
                                onClick={() =>
                                    (window.location.href = `/doctors/${doctor.id}`)
                                }
                            >
                                View Profile
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    ))}
            </div>
        </section>
    );
}

export default RecommendedDoctors;