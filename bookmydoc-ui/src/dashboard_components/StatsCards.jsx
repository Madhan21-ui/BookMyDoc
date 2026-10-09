import { useEffect, useState } from "react";
import { Stethoscope, CalendarCheck, LayoutGrid, Headphones } from "lucide-react";
import api from "../services/api";
import "../style/Dashboard.css";

function StatsCards() {
    const [doctorCount, setDoctorCount] = useState(0);
    const [appointmentCount, setAppointmentCount] = useState(0);
    const [specialityCount, setSpecialityCount] = useState(0);

    useEffect(() => {
        const email = localStorage.getItem("userEmail");

        api.get("/doctors")
            .then((response) => {
                const doctors = response.data;

                setDoctorCount(doctors.length);

                const specialities = new Set(
                    doctors.map((doctor) => doctor.specialization).filter(Boolean)
                );

                setSpecialityCount(specialities.size);
            })
            .catch((error) => console.error(error));

        if (email) {
            api.get(`/appointments/user/${email}`)
                .then((response) => setAppointmentCount(response.data.length))
                .catch((error) => console.error(error));
        }
    }, []);

    const stats = [
        { title: "Doctors", value: doctorCount, icon: Stethoscope, tone: "tone-blue" },
        { title: "My Appointments", value: appointmentCount, icon: CalendarCheck, tone: "tone-indigo" },
        { title: "Specialities", value: specialityCount, icon: LayoutGrid, tone: "tone-sky" },
        { title: "Support", value: "24/7", icon: Headphones, tone: "tone-green" },
    ];

    return (
        <section className="stats-section">
            <div className="stats-container">
                {stats.map(({ title, value, icon: Icon, tone }) => (
                    <div key={title} className="stats-card">
                        <div className={`stats-icon ${tone}`}>
                            <Icon size={24} />
                        </div>

                        <div>
                            <h2>{value}</h2>
                            <p>{title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default StatsCards;