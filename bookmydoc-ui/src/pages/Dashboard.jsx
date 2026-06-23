import DashboardHero from "../dashboard_components/DashboardHero";
import StatsCards from "../dashboard_components/StatsCards";
import QuickActions from "../dashboard_components/QuickActions";
import UpcomingAppointments from "../dashboard_components/UpcomingAppointments";
import RecommendedDoctors from "../dashboard_components/RecommendedDoctors";
import HealthTips from "../dashboard_components/HealthTips";
import Footer from "../dashboard_components/Footer";
import ProfileCard from "../dashboard_components/ProfileCard";
function Dashboard() {
    return (
        <>
            <DashboardHero />
            <ProfileCard/>
            <StatsCards />
            <QuickActions />
            <UpcomingAppointments />
            <RecommendedDoctors />
            <HealthTips/>
            <Footer/>
        </>
    );
}

export default Dashboard;