// Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowRight, FaBars, FaTimes, FaChevronDown, FaChartBar, FaChartLine, FaBrain, FaDatabase, FaHandsHelping } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownTimeoutRef = useRef(null);

  const navLinks = [
    { title: "Beranda", path: "/" },
    { title: "Tentang", path: "/about" },
    { title: "Galeri", path: "/gallery" },
  ];

  const featureLinks = [
    { title: "Eksplorasi", path: "/Eksplorasi", icon: FaChartBar, description: "Visualisasi karakteristik petani dan harga komoditas" },
    { title: "Prediksi", path: "/Prediksi", icon: FaChartLine, description: "Prediksi produksi, pendapatan, dan ketahanan pangan" },
    { title: "Rekomendasi", path: "/Rekomendasi", icon: FaBrain, description: "Rekomendasi ketahanan pangan berbasis Deep Q-Network" },
    { title: "Data Komoditas", path: "/cropdata", icon: FaDatabase, description: "Informasi dan data tanaman pertanian" },
    { title: "Konsultasi", path: "/Expert", icon: FaHandsHelping, description: "Konsultasi dengan penyuluh" },
  ];

  const featurePaths = featureLinks.map((f) => f.path.toLowerCase());
  const isOnFeaturePage = featurePaths.includes(location.pathname.toLowerCase());

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setIsDropdownOpen(false);
    setIsMobileDropdownOpen(false);
    setIsOpen(false);
  }, [location.pathname]);

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.1 }}
        className={`fixed top-0 left-0 right-0 z-50 mx-4 my-2 sm:mx-8 sm:my-4 transition-all duration-200
             ${scrolled ? "bg-black/90" : "bg-black/75"} 
             backdrop-blur-lg rounded-2xl border border-white/10 shadow-lg`}
      >
        <div className="flex items-center justify-between h-16 px-6 sm:px-8">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/" className="flex items-center gap-3">
              <img src="/assets/logo sage desa.png" alt="SAGE-Desa Logo" className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0" />

              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent whitespace-nowrap">SAGE-Desa</span>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center space-x-12">
            {/* Beranda */}
            <motion.div className="relative">
              <Link
                to={navLinks[0].path}
                className={`text-lg text-white/90 hover:text-green-400 transition-colors duration-300
                          ${location.pathname === navLinks[0].path ? "text-green-400" : ""}`}
              >
                {navLinks[0].title}
                {location.pathname === navLinks[0].path && (
                  <motion.div layoutId="activeTab" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-500" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
              </Link>
            </motion.div>

            {/* Fitur Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                className={`text-lg flex items-center gap-1.5 transition-colors duration-300 focus:outline-none
                          ${isOnFeaturePage ? "text-green-400" : "text-white/90 hover:text-green-400"}`}
              >
                Fitur
                <motion.span
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaChevronDown className="text-xs" />
                </motion.span>
                {isOnFeaturePage && (
                  <motion.div layoutId="activeTab" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-500" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
              </button>

              {/* Dropdown Panel */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 
                               backdrop-blur-xl bg-black/90 rounded-2xl border border-white/10 
                               shadow-2xl shadow-black/50 overflow-hidden"
                  >
                    {/* Arrow indicator */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black/90 border-l border-t border-white/10 rotate-45" />

                    <div className="relative py-2">
                      {featureLinks.map((feature, index) => {
                        const Icon = feature.icon;
                        const isActive = location.pathname.toLowerCase() === feature.path.toLowerCase();
                        return (
                          <Link
                            key={index}
                            to={feature.path}
                            className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 group
                                      ${isActive
                                ? "bg-gradient-to-r from-green-400/15 to-blue-500/15 text-green-400"
                                : "text-white/80 hover:bg-white/5 hover:text-white"}`}
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200
                                          ${isActive
                                ? "bg-gradient-to-br from-green-400/20 to-blue-500/20"
                                : "bg-white/5 group-hover:bg-white/10"}`}>
                              <Icon className={`text-base ${isActive ? "text-green-400" : "text-white/60 group-hover:text-green-400"}`} />
                            </div>
                            <div>
                              <div className={`text-sm font-medium ${isActive ? "text-green-400" : ""}`}>
                                {feature.title}
                              </div>
                              <div className="text-xs text-white/40 leading-tight">
                                {feature.description}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tentang & Galeri */}
            {navLinks.slice(1).map((link, index) => (
              <motion.div key={index + 1} className="relative">
                <Link
                  to={link.path}
                  className={`text-lg text-white/90 hover:text-green-400 transition-colors duration-300
                            ${location.pathname === link.path ? "text-green-400" : ""}`}
                >
                  {link.title}
                  {location.pathname === link.path && (
                    <motion.div layoutId="activeTab" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-500" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                  )}
                </Link>
              </motion.div>
            ))}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/contact"
                className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded-full 
                         flex items-center space-x-2 hover:shadow-lg hover:shadow-green-500/20 transition duration-300"
              >
                <span>Aspirasi</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsOpen(!isOpen)} className="sm:hidden text-white focus:outline-none">
            {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed top-20 left-4 right-4 z-40 sm:hidden"
          >
            <motion.div
              className="backdrop-blur-xl bg-black/90 rounded-2xl border border-white/10 shadow-2xl 
                        overflow-hidden divide-y divide-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Beranda */}
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ delay: 0 }}>
                <Link
                  to="/"
                  className={`block px-6 py-4 text-lg transition-all duration-300
                            ${location.pathname === "/" ? "text-green-400 bg-white/5" : "text-white/90 hover:bg-white/5"}`}
                  onClick={() => setIsOpen(false)}
                >
                  Beranda
                </Link>
              </motion.div>

              {/* Fitur (expandable) */}
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ delay: 0.1 }}>
                <button
                  onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                  className={`w-full flex items-center justify-between px-6 py-4 text-lg transition-all duration-300
                            ${isOnFeaturePage ? "text-green-400 bg-white/5" : "text-white/90 hover:bg-white/5"}`}
                >
                  <span>Fitur</span>
                  <motion.span
                    animate={{ rotate: isMobileDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaChevronDown className="text-sm" />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isMobileDropdownOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden bg-white/[0.02]"
                    >
                      {featureLinks.map((feature, index) => {
                        const Icon = feature.icon;
                        const isActive = location.pathname.toLowerCase() === feature.path.toLowerCase();
                        return (
                          <Link
                            key={index}
                            to={feature.path}
                            className={`flex items-center gap-3 px-8 py-3 transition-all duration-200
                                      ${isActive
                                ? "text-green-400 bg-green-400/10"
                                : "text-white/70 hover:bg-white/5 hover:text-white"}`}
                            onClick={() => setIsOpen(false)}
                          >
                            <Icon className={`text-base ${isActive ? "text-green-400" : "text-white/50"}`} />
                            <span className="text-base">{feature.title}</span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Tentang & Galeri */}
              {navLinks.slice(1).map((link, index) => (
                <motion.div key={index + 1} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ delay: (index + 2) * 0.1 }}>
                  <Link
                    to={link.path}
                    className={`block px-6 py-4 text-lg transition-all duration-300
                              ${location.pathname === link.path ? "text-green-400 bg-white/5" : "text-white/90 hover:bg-white/5"}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.title}
                  </Link>
                </motion.div>
              ))}

              {/* Aspirasi */}
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ delay: navLinks.length * 0.1 + 0.1 }}>
                <Link
                  to="/contact"
                  className="block px-6 py-4 text-lg text-white bg-gradient-to-r from-green-400 to-blue-500 
                           hover:opacity-90 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Aspirasi
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
