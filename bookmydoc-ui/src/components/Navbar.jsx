import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Stethoscope, LogOut } from "lucide-react";
import "../style/Navbar.css";

/* Links shown to each kind of visitor.
   `to`  = a normal page route
   `id`  = a section on the landing page (scrolls, or goes to /#id from other pages) */
const GUEST_LINKS = [
    { label: "Home", to: "/" },
    { label: "Specialities", id: "specialities" },
    { label: "Find doctors", to: "/doctors" },
    { label: "How it works", id: "about" },
    { label: "Contact", id: "contact" },
];

const PATIENT_LINKS = [
    { label: "Home", to: "/dashboard" },
    { label: "Find doctors", to: "/doctors" },
    { label: "Appointments", to: "/appointments" },
];

const DOCTOR_LINKS = [
    { label: "Dashboard", to: "/doctor-dashboard" },
    { label: "Appointments", to: "/doctor-appointments" },
    { label: "Slots", to: "/doctor-availability" },
    { label: "Profile", to: "/doctor-profile" },
];

function initialOf(text = "") {
    const clean = text.replace(/^dr\.?\s*/i, "").trim();
    return (clean[0] || "U").toUpperCase();
}

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    // Same sources as before, so existing login code keeps working
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const doctorId = localStorage.getItem("doctorId");
    const doctorName = localStorage.getItem("doctorName") || "Doctor";
    const userEmail = localStorage.getItem("userEmail") || "";

    const role = doctorId ? "doctor" : isLoggedIn ? "patient" : "guest";
    const links = role === "doctor" ? DOCTOR_LINKS : role === "patient" ? PATIENT_LINKS : GUEST_LINKS;

    const displayName =
        role === "doctor"
            ? /^dr\.?\s/i.test(doctorName) ? doctorName : `Dr. ${doctorName}`
            : userEmail.split("@")[0];
    const avatarLetter = initialOf(role === "doctor" ? doctorName : userEmail);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => setMenuOpen(false), [pathname]);

    const goSection = (id) => {
        setMenuOpen(false);
        if (pathname === "/") {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            navigate(`/#${id}`);
        }
    };

    const handleLogout = () => {
        ["isLoggedIn", "userEmail", "doctorId", "doctorName", "doctorEmail"].forEach((k) =>
            localStorage.removeItem(k)
        );
        window.location.href = "/";
    };

    const renderLink = (l) =>
        l.id ? (
            <button key={l.label} className="nb-link" onClick={() => goSection(l.id)}>
                {l.label}
            </button>
        ) : (
            <NavLink
                key={l.label}
                to={l.to}
                end={l.to === "/" || l.to === "/dashboard"}
                className={({ isActive }) => `nb-link ${isActive ? "is-active" : ""}`}
            >
                {l.label}
            </NavLink>
        );

    return (
        <header className={`nb ${scrolled ? "nb--scrolled" : ""}`}>
            <nav className="nb__bar" aria-label="Main">
                <Link to={role === "doctor" ? "/doctor-dashboard" : "/"} className="nb-brand">
                    <span className="nb-brand__mark"><Stethoscope size={18} strokeWidth={2.4} /></span>
                    <span className="nb-brand__name">BookMy<b>Doc</b></span>
                    {role === "doctor" && <span className="nb-badge">Doctor</span>}
                </Link>

                <div className="nb__links">{links.map((l) => <span key={l.label}>{renderLink(l)}</span>)}</div>

                <div className="nb__actions">
                    {role === "guest" ? (
                        <>
                            <Link to="/doctor-login" className="nb-text">For doctors</Link>
                            <Link to="/auth" className="nb-btn nb-btn--primary">Sign in</Link>
                        </>
                    ) : (
                        <>
                            <span className="nb-user" title={role === "patient" ? userEmail : displayName}>
                                <span className="nb-user__avatar">{avatarLetter}</span>
                                <span className="nb-user__name">{displayName}</span>
                            </span>
                            <button className="nb-btn nb-btn--ghost" onClick={handleLogout}>
                                <LogOut size={16} /> Log out
                            </button>
                        </>
                    )}
                </div>

                <button
                    className="nb__toggle"
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </nav>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="nb__drawer"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                    >
                        {role !== "guest" && (
                            <div className="nb-user nb-user--drawer">
                                <span className="nb-user__avatar">{avatarLetter}</span>
                                <span className="nb-user__name">{displayName}</span>
                            </div>
                        )}

                        <ul>
                            {links.map((l) => <li key={l.label}>{renderLink(l)}</li>)}
                            {role === "guest" ? (
                                <>
                                    <li><Link to="/doctor-login" className="nb-link">For doctors</Link></li>
                                    <li><Link to="/auth" className="nb-btn nb-btn--primary nb-btn--block">Sign in</Link></li>
                                </>
                            ) : (
                                <li>
                                    <button className="nb-btn nb-btn--ghost nb-btn--block" onClick={handleLogout}>
                                        <LogOut size={16} /> Log out
                                    </button>
                                </li>
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

export default Navbar;