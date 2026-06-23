import { useEffect, useState } from "react";
import api from "../services/api";
import "../style/Dashboard.css";

function RecommendedDoctors() {

    const [doctors, setDoctors] = useState([]);

    useEffect(() => {

        api.get("/doctors")
            .then((response) => {

                setDoctors(response.data);

            })
            .catch((error) => {

                console.error(error);

            });

    }, []);

    return (

        <section className="recommended-section">

            <div className="section-header">

                <h2>
                    Recommended Doctors
                </h2>

                <p>
                    Top specialists available for consultation
                </p>

            </div>

            <div className="recommended-grid">

                {doctors.slice(0, 3).map((doctor) => (

                    <div
                        key={doctor.id}
                        className="recommended-card"
                    >

                        <div className="doctor-avatar">
                            👨‍⚕️
                        </div>

                        <h3>
                            {doctor.name}
                        </h3>

                        <p className="doctor-speciality">
                            {doctor.specialization}
                        </p>

                        <p className="doctor-exp">
                            {doctor.experience} Years Experience
                        </p>

                        <p className="doctor-hospital">
                            🏥 {doctor.hospitalName}
                        </p>

                        <button
                            className="book-now-btn"
                            onClick={() =>
                                window.location.href =
                                `/doctors/${doctor.id}`
                            }
                        >
                            View Profile
                        </button>

                    </div>

                ))}

            </div>

        </section>

    );
}

export default RecommendedDoctors;