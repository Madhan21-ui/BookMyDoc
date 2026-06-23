import { useEffect, useState } from "react";
import api from "../services/api";
import "../style/Dashboard.css";

function DashboardHero() {

    const [userName, setUserName] = useState("User");

    useEffect(() => {

        const email =
            localStorage.getItem("userEmail");

        if (email) {

            api.get(`/users/email/${email}`)
                .then((response) => {

                    setUserName(
                        response.data.name
                    );

                })
                .catch((error) => {

                    console.error(error);

                });

        }

    }, []);

    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12) {

        greeting = "Good Morning";

    } else if (hour < 18) {

        greeting = "Good Afternoon";

    }

    return (

        <section className="dashboard-hero">

            <div className="dashboard-hero-content">

                <h1>
                    {greeting}, {userName} 👋
                </h1>

                <p>
                    Welcome back to BookMyDoc.
                    Manage your appointments,
                    discover specialists,
                    and take control of your healthcare journey.
                </p>

                <div className="dashboard-buttons">

                    <button
                        className="primary-btn"
                        onClick={() =>
                            window.location.href = "/doctors"
                        }
                    >
                        Find Doctors
                    </button>

                    <button
                        className="secondary-btn"
                        onClick={() =>
                            window.location.href = "/appointments"
                        }
                    >
                        My Appointments
                    </button>

                </div>

            </div>

        </section>

    );
}

export default DashboardHero;