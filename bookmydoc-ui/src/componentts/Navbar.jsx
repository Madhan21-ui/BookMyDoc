import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Stethoscope } from "lucide-react";
import "../style/LandingPage.css";

const NAV_LINKS = [
  { label: "Home", id: "home" },
  { label: "Specialities", id: "specialities" },
  { label: "Find doctors", id: "doctors" },
  { label: "How it works", id: "about" },
  { label: "Contact", id: "contact" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setMenuOpen(false);
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <nav className="nav__bar" aria-label="Main">
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand__mark"><Stethoscope size={18} strokeWidth={2.4} /></span>
          <span className="brand__name">BookMy<b>Doc</b></span>
        </Link>

        <ul className="nav__links">
          {NAV_LINKS.map((l) => (
            <li key={l.id}>
              <button className="nav__link" onClick={() => go(l.id)}>{l.label}</button>
            </li>
          ))}
        </ul>

        <div className="nav__actions">
          <Link to="/doctor-login" className="nav__ghost">For doctors</Link>
          <Link to="/auth" className="btn btn--primary btn--sm">Sign in</Link>
        </div>

        <button
          className="nav__toggle"
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
            className="nav__drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
          >
            <ul>
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <button onClick={() => go(l.id)}>{l.label}</button>
                </li>
              ))}
              <li><Link to="/doctor-login" onClick={() => setMenuOpen(false)}>For doctors</Link></li>
              <li>
                <Link to="/auth" className="btn btn--primary btn--block" onClick={() => setMenuOpen(false)}>
                  Sign in
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;