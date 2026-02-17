import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import RegistrationForm from "./components/RegistrationForm";
import Dashboard from "./pages/Dashboard";
import DonorTiers from "./pages/DonorTiers";
import api from "./api/client";
import "./App.css";

/* ── SVG Icons ── */
const IconForm = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const IconDashboard = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const IconHeart = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

function NavBar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const links = [
    { to: "/", label: "Register", icon: <IconForm /> },
    { to: "/dashboard", label: "Dashboard", icon: <IconDashboard /> },
    { to: "/donor-tiers", label: "Contribute", icon: <IconHeart /> },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-unnati shadow-lg border-b border-blue-200/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/unnati-logo.jpg"
              alt="Unnati Society"
              className="w-10 h-10 rounded-full object-cover shadow-md group-hover:shadow-lg transition-all duration-300"
            />
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-unnati-gradient tracking-tight">
                Unnati
              </span>
              <span className="block text-[10px] font-medium text-gray-500 -mt-1 tracking-widest uppercase">
                Registration System
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  inline-flex items-center gap-2
                  ${isActive(l.to)
                    ? "nav-link-active font-semibold"
                    : "text-gray-600 hover:text-[var(--unnati-primary)] hover:bg-blue-50/60"
                  }`}
              >
                {l.icon} {l.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-blue-50 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-48 pb-3" : "max-h-0"}`}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium mb-1 transition-all ${isActive(l.to) ? "nav-link-active" : "text-gray-600 hover:bg-blue-50/60"
                }`}
            >
              {l.icon} {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}


export default function App() {
  async function handleSubmit(formData) {
    try {
      const { data } = await api.post("/register/", formData);
      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || "Registration failed";
      toast.error(msg, {
        style: {
          background: "#2C3E6B",
          color: "#fff",
          borderRadius: "12px",
        },
      });
      return null;
    }
  }

  return (
    <Router>
      <div className="min-h-screen bg-unnati-surface">
        <NavBar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<RegistrationForm onSubmit={handleSubmit} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/donor-tiers" element={<DonorTiers />} />
          </Routes>
        </main>
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      </div>
    </Router>
  );
}
