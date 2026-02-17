import { useEffect, useState, useRef } from "react";
import api from "../api/client";

/* ── Animated counter ── */
function AnimatedCounter({ value }) {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    if (start === end) return;

    const duration = 800;
    let startTime = null;

    const tick = (ts) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else prevValue.current = end;
    };
    requestAnimationFrame(tick);
  }, [value]);

  return <span>{display}</span>;
}

/* ── SVG Icons ── */
const Icons = {
  users: (
    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  mentor: (
    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  volunteer: (
    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  donor: (
    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0, mentor: 0, volunteer: 0, donor: 0,
  });
  const [announcement, setAnnouncement] = useState(null);
  const ws = useRef(null);
  const announcementTimer = useRef(null);

  async function fetchStats() {
    try {
      const { data } = await api.get("/register/statistics");
      setStats(data);
    } catch {
      /* silent */
    }
  }

  function showAnnouncement(data) {
    // Clear any existing timer so a new registration resets the 5-min window
    if (announcementTimer.current) clearTimeout(announcementTimer.current);
    setAnnouncement(data);
    announcementTimer.current = setTimeout(() => setAnnouncement(null), 5 * 60 * 1000);
  }

  useEffect(() => {
    fetchStats();

    // Load last registered member on page load
    let lastSeenId = 0;
    async function fetchLatest() {
      try {
        const { data } = await api.get("/register/");
        if (data.length > 0) {
          const latest = data[0];
          if (latest.id !== lastSeenId) {
            lastSeenId = latest.id;
            showAnnouncement(latest);
          }
        }
      } catch { /* silent */ }
    }
    fetchLatest();

    // Poll every 15 seconds as a reliable fallback
    const pollInterval = setInterval(() => {
      fetchStats();
      fetchLatest();
    }, 15000);

    // WebSocket with auto-reconnect
    function connectWs() {
      const wsBase = import.meta.env.VITE_WS_URL || "ws://localhost:8000";
      ws.current = new WebSocket(`${wsBase}/ws`);

      ws.current.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.event === "new_registration") {
            showAnnouncement(data.data);
            if (data.data?.id) lastSeenId = data.data.id;
            if (data.statistics) setStats(data.statistics);
            else fetchStats();
          }
        } catch { /* ignore */ }
      };

      ws.current.onclose = () => {
        // Auto-reconnect after 5 seconds
        setTimeout(connectWs, 5000);
      };

      ws.current.onerror = () => {
        ws.current?.close();
      };
    }
    connectWs();

    return () => {
      clearInterval(pollInterval);
      ws.current?.close();
      if (announcementTimer.current) clearTimeout(announcementTimer.current);
    };
  }, []);

  const statCards = [
    { label: "Mentors", key: "mentor", icon: Icons.mentor, gradient: "from-[#3B5998] to-[#2C3E6B]", ring: "ring-[var(--unnati-primary)]/10" },
    { label: "Volunteers", key: "volunteer", icon: Icons.volunteer, gradient: "from-[#5A7FBF] to-[#3B5998]", ring: "ring-[var(--unnati-primary-light)]/10" },
    { label: "Donors", key: "donor", icon: Icons.donor, gradient: "from-[#D4A843] to-[#B8912C]", ring: "ring-[var(--unnati-accent)]/10" },
  ];

  const roleAccent = {
    mentor: { bg: "bg-[#3B5998]/10", border: "border-[#3B5998]/30", text: "text-[#3B5998]" },
    volunteer: { bg: "bg-[#5A7FBF]/10", border: "border-[#5A7FBF]/30", text: "text-[#5A7FBF]" },
    donor: { bg: "bg-[#D4A843]/10", border: "border-[#D4A843]/30", text: "text-[#B8912C]" },
  };

  return (
    <div className="space-y-6 sm:space-y-8 px-2 sm:px-0">

      {/* Header */}
      <div className="animate-fade-in text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-unnati-gradient">Live Dashboard</h1>
        <p className="text-sm sm:text-base text-[var(--unnati-text-muted)] mt-1">
          Real-time registration statistics &mdash; Unnati Society
        </p>
      </div>

      {/* Total */}
      <div className="glass-dark rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-5 animate-fade-in text-center sm:text-left">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[var(--unnati-accent)] to-[var(--unnati-accent-light)] flex items-center justify-center shadow-lg animate-pulse-gold flex-shrink-0">
          {Icons.users}
        </div>
        <div>
          <p className="text-xs sm:text-sm text-blue-200/70 font-medium">Total Registrations</p>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            <AnimatedCounter value={stats.total} />
          </p>
        </div>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card, i) => (
          <div
            key={card.key}
            className={`glass-card rounded-2xl p-5 group
              hover:shadow-lg hover:ring-2 ${card.ring}
              transition-all duration-300 cursor-default
              animate-slide-up
              flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-0`}
            style={{ animationDelay: `${(i + 1) * 120}ms` }}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-md sm:mb-3 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
              {card.icon}
            </div>
            <div className="flex-1 sm:flex-none">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--unnati-text-muted)] mb-0.5 sm:mb-1">
                {card.label}
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-[var(--unnati-text)]">
                <AnimatedCounter value={stats[card.key] || 0} />
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Announcement */}
      {announcement && (() => {
        const style = roleAccent[announcement.role] || roleAccent.volunteer;
        return (
          <div className={`relative overflow-hidden rounded-2xl border ${style.border} ${style.bg} p-4 sm:p-6 animate-announcement`}>
            <div className="relative flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--unnati-primary)] to-[var(--unnati-primary-dark)] flex items-center justify-center shadow-md flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--unnati-text-muted)]">
                  Latest Registration
                </p>
                <p className={`text-lg sm:text-xl font-bold ${style.text}`}>{announcement.name}</p>
                <p className="text-sm text-[var(--unnati-text-muted)]">
                  joined as <strong className="capitalize">{announcement.role}</strong>
                </p>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
