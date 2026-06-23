import { useEffect, useState } from "react";
import api from "../services/api";
import "../style/Dashboard.css";

function ProfileCard() {

    const [user, setUser] = useState(null);

    useEffect(() => {

        const email =
            localStorage.getItem("userEmail");

        api.get(`/users/email/${email}`)
            .then((response) => {

                setUser(response.data);

            })
            .catch((error) => {

                console.error(error);

            });

    }, []);

    if (!user) {
        return <h3>Loading Profile...</h3>;
    }

    return (

        <section className="profile-section">

            <div className="profile-card">

                <div className="profile-avatar">
                    👤
                </div>

                <div className="profile-details">

                    <h2>
                        {user.name}
                    </h2>

                    <p>
                        📧 {user.email}
                    </p>

                    <p>
                        📱 {user.phoneNumber}
                    </p>

                    <p>
                        🩸 {user.bloodGroup}
                    </p>

                    <p>
                        🎂 {user.age} Years
                    </p>

                </div>

            </div>

        </section>

    );
}

export default ProfileCard;