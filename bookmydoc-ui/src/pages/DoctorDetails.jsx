import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

function DoctorDetails() {
    const { id } = useParams();

    const [doctor, setDoctor] = useState(null);

    useEffect(() => {
        console.log("Doctor ID:", id);

        api.get(`/doctors/${id}`)
            .then((response) => {
                console.log(response.data);
                setDoctor(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [id]);

    if (!doctor) {
        return (
            <div className="container">
                <h2>Loading...</h2>
                <p>Doctor ID: {id}</p>
            </div>
        );
    }
    return (
        <div className="doctor-details-container">

            <div className="doctor-profile-card">

                <div className="doctor-banner"></div>

                <div className="doctor-profile-content">

                    <div className="doctor-profile-avatar">
                        👨‍⚕️
                    </div>

                    <h1>{doctor.name}</h1>

                    <p className="specialization">
                        {doctor.specialization}
                    </p>

                    <div className="doctor-badges">
                        <span>⭐ 4.8 Rating</span>
                    </div>

                    <div className="doctor-info-grid">

                        <div className="info-box">
                            <h3>Experience</h3>
                            <p>{doctor.experience} Years</p>
                        </div>

                        <div className="info-box">
                            <h3>Location</h3>
                            <p>{doctor.location}</p>
                        </div>

                        <div className="info-box">
                            <h3>Consultation Fee</h3>
                            <p>₹500</p>
                        </div>

                        <div className="info-box">
                            <h3>Availability</h3>
                            <p>Mon - Sat</p>
                        </div>

                    </div>

                    <div className="doctor-about">
                        <h2>About Doctor</h2>

                        <p>
                            Experienced {doctor.specialization} specialist
                            dedicated to providing high-quality healthcare and
                            patient-centered treatment. Skilled in diagnosis,
                            consultation, and advanced medical care.
                        </p>
                    </div>

                    <Link to={`/book?doctorId=${doctor.id}`}>
                        <button className="book-now-btn">
                            Book Appointment
                        </button>
                    </Link>
                </div>

            </div>

        </div>
    );
}

export default DoctorDetails;