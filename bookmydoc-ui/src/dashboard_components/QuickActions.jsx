import "../style/Dashboard.css";

function QuickActions() {

    const actions = [
        {
            title: "Find Doctors",
            icon: "👨‍⚕️",
            path: "/doctors"
        },
        {
            title: "Book Appointment",
            icon: "📅",
            path: "/doctors"
        },
        {
            title: "My Appointments",
            icon: "📋",
            path: "/appointments"
        },
        {
            title: "Emergency Support",
            icon: "🚑",
            path: "#"
        }
    ];

    return (
        <section className="quick-actions">

            <h2>Quick Actions</h2>

            <div className="actions-grid">

                {actions.map((action, index) => (

                    <div
                        key={index}
                        className="action-card"
                        onClick={() =>
                            window.location.href = action.path
                        }
                    >

                        <div className="action-icon">
                            {action.icon}
                        </div>

                        <h3>{action.title}</h3>

                    </div>

                ))}

            </div>

        </section>
    );
}

export default QuickActions;