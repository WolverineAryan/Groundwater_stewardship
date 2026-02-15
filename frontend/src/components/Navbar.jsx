import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      className="
      sticky top-0 z-50
      bg-[#9381FF]
      shadow-lg
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* ================= LOGO ================= */}
        <h1 className="text-xl font-bold text-white tracking-wide">
          💧 Groundwater Stewardship
        </h1>

        {/* ================= NAV LINKS ================= */}
        <div className="flex gap-8 text-white/90 font-medium">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition-all duration-200 ${
                isActive
                  ? "border-b-2 border-white pb-1 text-white"
                  : "hover:text-white/70"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `transition-all duration-200 ${
                isActive
                  ? "border-b-2 border-white pb-1 text-white"
                  : "hover:text-white/70"
              }`
            }
          >
            Analytics
          </NavLink>

          <NavLink
            to="/forecast"
            className={({ isActive }) =>
              `transition-all duration-200 ${
                isActive
                  ? "border-b-2 border-white pb-1 text-white"
                  : "hover:text-white/70"
              }`
            }
          >
            Forecast
          </NavLink>

        </div>
      </div>
    </nav>
  );
}
