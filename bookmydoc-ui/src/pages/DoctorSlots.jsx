import { useEffect, useState } from "react";
import api from "../services/api";

function DoctorSlots() {

    const [slots, setSlots] = useState([]);

    const doctorId =
        localStorage.getItem("doctorId");

    useEffect(() => {

        fetchSlots();

    }, []);

    const fetchSlots = async () => {

        try {

            const response = await api.get(
                `/availability/doctor/${doctorId}`
            );

            setSlots(
                response.data
            );

        } catch (error) {

            console.error(error);
        }
    };

    return (

        <div
            style={{
                padding: "30px"
            }}
        >

            <h2>
                My Availability Slots
            </h2>

            {slots.length === 0 ? (

                <h3>
                    No Slots Found
                </h3>

            ) : (

                slots.map((slot) => (

                    <div
                        key={slot.id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            padding: "15px",
                            marginBottom: "15px",
                            background: "#fff"
                        }}
                    >

                        <h3>
                            📅 {slot.date}
                        </h3>

                        <p>
                            ⏰ {slot.slotTime}
                        </p>

                        <p>
                            Status:
                            {" "}
                            <strong
                                style={{
                                    color:
                                        slot.available
                                            ? "green"
                                            : "red"
                                }}
                            >
                                {
                                    slot.available
                                        ? "Available"
                                        : "Booked"
                                }
                            </strong>
                        </p>

                    </div>

                ))

            )}

        </div>
    );
}

export default DoctorSlots;