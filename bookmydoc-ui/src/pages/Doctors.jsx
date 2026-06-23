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
                Find Your Doctor
            </h1>

            <p className="page-subtitle">
                Book appointments with experienced specialists
            </p>

            <div className="doctors-grid">

                {doctors.map((doctor) => (

                    <div
                        key={doctor.id}
                        className="doctor-card"
                    >

                        <div className="doctor-header"></div>

                        <div className="doctor-avatar">
                            👨‍⚕️
                        </div>

                        <div className="doctor-body">

                            <h2 className="doctor-name">
                                {doctor.name}
                            </h2>

                            <p className="doctor-specialization">
                                {doctor.specialization}
                            </p>

                            <p className="doctor-hospital">
                                🏥 {doctor.hospitalName}
                            </p>

                            <p className="doctor-exp">
                                🏥 Experience: {doctor.experience} Years
                            </p>

                         

                            <br />
                            <br />

                            <Link to={`/doctors/${doctor.id}`}>
                                <button className="book-btn">
                                    View Profile
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