import "../style/Dashboard.css";
function HealthTips() {
    const tips = [
        {
            icon: "💧",
            title: "Stay Hydrated",
            description: "Drink at least 2-3 litres of water daily for better health",
        },
        {
            icon: "🚶",
            title: "Daily Exercise",
            description: "Walk or Exercise for at least 30 minutes every day. "
        },
        {
            icon: "😴",
            title: "Quality Sleep",
            description: "Get 7-8 hours of sleep to improve recovery and focus."
        },
        {
            icon: "🥗",
            title: "Healthy Diet",
            description: "Include fruits, vegetables, and proteins in your meals."
        }
    ];

    return (
        <section className="health-tips-section">

            <div className="section-header">
                <h2>Health Tips</h2>
                <p>Simple habits for a healthier lifestyle</p>
            </div>

            <div className="health-tips-grid">

                {tips.map((tip, index) => (

                    <div
                        key={index}
                        className="health-tip-card"
                    >

                        <div className="tip-icon">
                            {tip.icon}
                        </div>

                        <h3>{tip.title}</h3>

                        <p>{tip.description}</p>

                    </div>

                ))}

            </div>

        </section>
    );
}

export default HealthTips;