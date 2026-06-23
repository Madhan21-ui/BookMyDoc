import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Stethoscope } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Find Doctors", href: "#doctors" },
  { label: "Specialities", href: "#specialities" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-lg shadow-sm border-b border-slate-100"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white shadow-md shadow-blue-200 transition-transform group-hover:scale-105">
            <Stethoscope size={18} strokeWidth={2.4} />
          </span>
          <span className="text-lg md:text-xl font-bold tracking-tight text-slate-900">
            BookMy<span className="text-blue-600">Doc</span>
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-9">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <button
                onClick={() => handleNavClick(link.href)}
                className="text-[15px] font-medium text-slate-600 hover:text-blue-600 transition-colors relative after:absolute after:left-0 after:-bottom-1.5 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <button
            onClick={() => handleNavClick("#get-started")}
            className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-[15px] font-semibold shadow-md shadow-blue-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300 active:scale-95 transition-all"
          >
            Get Started
          </button>
        </div>

        <button
          className="lg:hidden p-2 text-slate-700"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <ul className="flex flex-col px-5 py-4 gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="w-full text-left py-3 text-[15px] font-medium text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li className="pt-2">
                <button
                  onClick={() => handleNavClick("#get-started")}
                  className="w-full py-3 rounded-full bg-blue-600 text-white font-semibold"
                >
                  Get Started
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
