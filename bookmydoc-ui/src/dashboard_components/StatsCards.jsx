import { useEffect, useState } from "react";
import api from "../services/api";
import "../style/Dashboard.css";

function StatsCards() {

    const [doctorCount, setDoctorCount] = useState(0);
    const [appointmentCount, setAppointmentCount] = useState(0);
    const [specialityCount, setSpecialityCount] = useState(0);

    useEffect(() => {

        const email =
            localStorage.getItem("userEmail");

        // Doctors

        api.get("/doctors")
            .then((response) => {

                const doctors = response.data;

                setDoctorCount(doctors.length);

                const specialities = [
                    ...new Set(
                        doctors.map(
                            doctor => doctor.specialization
                        )
                    )
                ];

                setSpecialityCount(
                    specialities.length
                );

            })
            .catch((error) => {
                console.error(error);
            });

        // User Appointments

        api.get(`/appointments/user/${email}`)
            .then((response) => {

                setAppointmentCount(
                    response.data.length
                );

            })
            .catch((error) => {
                console.error(error);
            });

    }, []);

    const stats = [
        {
            title: "Doctors",
            value: doctorCount,
            icon: "👨‍⚕️"
        },
        {
            title: "My Appointments",
            value: appointmentCount,
            icon: "📅"
        },
        {
            title: "Specialities",
            value: specialityCount,
            icon: "🏥"
        },
        {
            title: "Support",
            value: "24/7",
            icon: "🟢"
        }
    ];

    return (

        <section className="stats-section">

            <div className="stats-container">

                {stats.map((item, index) => (

                    <div
                        key={index}
                        className="stats-card"
                    >

                        <div className="stats-icon">
                            {item.icon}
                        </div>

                        <h2>
                            {item.value}
                        </h2>

                        <p>
                            {item.title}
                        </p>

                    </div>

                ))}

            </div>

        </section>

    );
}

export default StatsCards;