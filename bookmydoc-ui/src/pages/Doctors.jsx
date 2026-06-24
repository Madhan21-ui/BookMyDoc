import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Doctors() {

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

        <div className="doctors-container">

            <h1 className="page-title">
                Find the Right Doctor for Your Healthcare Needs
            </h1>

            <p className="page-subtitle">
                Browse experienced specialists and book appointments instantly.
            </p>

            <div className="doctors-grid">

                {doctors.map((doctor) => (

                    <div
                        key={doctor.id}
                        className="doctor-card"
                    >

                        <div className="doctor-avatar">
                            {doctor.name.replace("Dr. ", "").charAt(0)}                        </div>

                        <div className="doctor-body">

                            <div className="doctor-rating">
                                ⭐ 4.8
                            </div>

                            <h2 className="doctor-name">
                                {doctor.name}
                            </h2>

                            <p className="doctor-specialization">
                                {doctor.specialization}
                            </p>

                            <div className="doctor-info">

                                <p>
                                    🏥 {doctor.hospitalName}
                                </p>

                                <p>
                                    📍 {doctor.location}
                                </p>

                                <p>
                                    👨‍⚕️ {doctor.experience} Years Experience
                                </p>

                            </div>

                            <div className="doctor-status">
                                🟢 Available Today
                            </div>

                            <Link
                                to={`/doctors/${doctor.id}`}
                            >
                                <button
                                    className="book-btn"
                                >
                                    View Profile →
                                </button>
                            </Link>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );
}

export default Doctors;