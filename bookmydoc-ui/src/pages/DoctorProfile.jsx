import { useEffect, useState } from "react";
import api from "../services/api";

function DoctorProfile() {

    const doctorId =
        localStorage.getItem("doctorId");

    const [doctor, setDoctor] =
        useState({
            name: "",
            email: "",
            specialization: "",
            experience: "",
            hospitalName: "",
            location: "",
            availability: ""
        });

    const [isEditing, setIsEditing] =
        useState(false);

    useEffect(() => {

        fetchDoctor();

    }, []);

    const fetchDoctor = async () => {

        try {

            const response =
                await api.get(
                    `/doctors/${doctorId}`
                );

            setDoctor(
                response.data
            );

        } catch (error) {

            console.error(error);
        }
    };

    const handleChange = (e) => {

        setDoctor({
            ...doctor,
            [e.target.name]:
                e.target.value
        });
    };

    const saveProfile = async () => {

        try {

            await api.put(
                `/doctors/${doctorId}`,
                doctor
            );

            alert(
                "Profile Updated Successfully"
            );

            setIsEditing(false);

            fetchDoctor();

        } catch (error) {

            console.error(error);

            alert(
                "Failed To Update Profile"
            );
        }
    };

    return (

        <div
            style={{
                padding: "30px",
                maxWidth: "700px",
                margin: "auto"
            }}
        >

            <h2>
                Doctor Profile
            </h2>

            <div
                style={{
                    border: "1px solid #ddd",
                    padding: "20px",
                    borderRadius: "10px"
                }}
            >

                <label>
                    Name
                </label>

                <input
                    type="text"
                    name="name"
                    value={doctor.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                />

                <br /><br />

                <label>
                    Email
                </label>

                <input
                    type="email"
                    name="email"
                    value={doctor.email}
                    disabled
                />

                <br /><br />

                <label>
                    Specialization
                </label>

                <input
                    type="text"
                    name="specialization"
                    value={doctor.specialization}
                    onChange={handleChange}
                    disabled={!isEditing}
                />

                <br /><br />

                <label>
                    Experience
                </label>

                <input
                    type="number"
                    name="experience"
                    value={doctor.experience}
                    onChange={handleChange}
                    disabled={!isEditing}
                />

                <br /><br />

                <label>
                    Hospital Name
                </label>

                <input
                    type="text"
                    name="hospitalName"
                    value={doctor.hospitalName}
                    onChange={handleChange}
                    disabled={!isEditing}
                />

                <br /><br />

                <label>
                    Location
                </label>

                <input
                    type="text"
                    name="location"
                    value={doctor.location}
                    onChange={handleChange}
                    disabled={!isEditing}
                />

                <br /><br />

                {!isEditing ? (

                    <button
                        onClick={() =>
                            setIsEditing(true)
                        }
                    >
                        Edit Profile
                    </button>

                ) : (

                    <button
                        onClick={saveProfile}
                    >
                        Save Profile
                    </button>

                )}

            </div>

        </div>
    );
}

export default DoctorProfile;