import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Hero from "../componentts/Hero";
import Stats from "../componentts/Stats";
import Specialities from "../componentts/Specialities";
import TopDoctors from "../componentts/TopDoctors";
import HowItWorks from "../componentts/HowItWorks";
import WhyChooseUs from "../componentts/WhyChooseUs";
import Testimonials from "../componentts/Testimonials";
import CTA from "../componentts/CTA";
import Footer from "../componentts/Footer";
function LandingPage() {
    const { hash } = useLocation();

    // Scroll to a section when arriving from another page via /#section
    useEffect(() => {
        if (!hash) return;
        const t = setTimeout(() => {
            document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
        }, 60);
        return () => clearTimeout(t);
    }, [hash]);

    return (
        <>
            <Hero />
            <Stats />
            <Specialities />
            <TopDoctors />
            <HowItWorks />
            <WhyChooseUs />
            <Testimonials />
            <CTA />
            <Footer />
        </>
    );
}

export default LandingPage;