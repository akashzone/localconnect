import { useState, useContext, useRef, useEffect } from "react";
import { NavLink, useNavigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faUsers,
  faBriefcase,
  faClipboardList,
  faFileCode,
  faStar,
  faFlag,
  faSignOutAlt,
  faBars,
  faTimes,
  faShieldHalved,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  // Close mobile sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsMobileSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileSidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", to: "/admin/dashboard", icon: faChartPie, active: true },
    { label: "Users", to: "/admin/users", icon: faUsers, active: true },
    { label: "Projects", to: "/admin/projects", icon: faBriefcase, active: true },
    { label: "Applications", to: "/admin/applications", icon: faClipboardList, active: true },
    { label: "Work Submissions", to: "/admin/submissions", icon: faFileCode, active: true },
    { label: "Reviews", to: "/admin/reviews", icon: faStar, active: true },
    { label: "Reports", to: "/admin/reports", icon: faFlag, active: false, badge: "Soon" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-[#D8D2C4]">
      {/* Brand header */}
      <div className="h-16 px-6 border-b border-[#D8D2C4] flex items-center justify-between">
        <NavLink to="/admin/dashboard" className="flex items-baseline gap-2">
          <span className="font-['Space_Grotesk'] font-bold text-xl tracking-tight text-[#1B2430]">
            LocalConnect
          </span>
          <span className="font-['IBM_Plex_Mono'] text-[10px] font-semibold bg-[#1B2430] text-[#F5C445] px-1.5 py-0.5 rounded-[3px] tracking-wider uppercase">
            Admin
          </span>
        </NavLink>

        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileSidebarOpen(false)}
          className="md:hidden text-[#6B6459] hover:text-[#1B2430] p-1"
          aria-label="Close Sidebar"
        >
          <FontAwesomeIcon icon={faTimes} className="text-lg" />
        </button>
      </div>

      {/* Admin tag bar */}
      <div className="px-6 py-3 bg-[#FAF8F3] border-b border-[#D8D2C4]/70 flex items-center gap-2">
        <FontAwesomeIcon icon={faShieldHalved} className="text-[#0F6B5C] text-xs" />
        <span className="font-['IBM_Plex_Mono'] text-xs font-medium text-[#0F6B5C] tracking-wide uppercase">
          Administration Portal
        </span>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 py-4 overflow-y-auto space-y-1 px-3">
        {navItems.map((item) => {
          if (item.active) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-[4px] font-['IBM_Plex_Sans'] text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#0F6B5C] text-white shadow-sm"
                      : "text-[#1B2430] hover:bg-[#FAF8F3]"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={item.icon} className="w-4 text-center" />
                  <span>{item.label}</span>
                </div>
              </NavLink>
            );
          }

          return (
            <div
              key={item.to}
              className="flex items-center justify-between px-3 py-2.5 rounded-[4px] font-['IBM_Plex_Sans'] text-sm font-medium text-[#6B6459]/60 cursor-not-allowed select-none"
              title="Coming soon"
            >
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={item.icon} className="w-4 text-center text-[#6B6459]/40" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-wider bg-[#FAF8F3] border border-[#D8D2C4] text-[#6B6459] px-1.5 py-0.5 rounded-[3px]">
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Admin Profile & Logout Footer */}
      <div className="p-4 border-t border-[#D8D2C4] bg-[#FAF8F3]/50">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#1B2430] text-[#FAF8F3] font-['Space_Grotesk'] font-bold text-xs flex items-center justify-center shrink-0">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <p className="font-['IBM_Plex_Sans'] text-xs font-semibold text-[#1B2430] truncate">
                {user?.name || "Administrator"}
              </p>
              <p className="font-['IBM_Plex_Mono'] text-[10px] text-[#6B6459] truncate">
                {user?.email || "admin@localconnect.com"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-[#B3452F]/10 text-[#B3452F] border border-[#D8D2C4] hover:border-[#B3452F]/40 rounded-[4px] font-['IBM_Plex_Sans'] text-xs font-semibold transition-all shadow-sm"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="text-xs" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex font-['IBM_Plex_Sans'] text-[#1B2430]">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block w-64 fixed top-0 bottom-0 left-0 z-30 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs transition-opacity" />
      )}

      {/* Mobile Drawer Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out md:hidden ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>

      {/* Main Container */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#D8D2C4] sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden text-[#1B2430] p-1.5 rounded-[4px] hover:bg-[#FAF8F3] border border-[#D8D2C4]"
              aria-label="Open Navigation"
            >
              <FontAwesomeIcon icon={faBars} className="text-base" />
            </button>
            <div className="flex items-center gap-2">
              <h2 className="font-['Space_Grotesk'] font-bold text-lg text-[#1B2430]">
                Admin Management
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NavLink
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 font-['IBM_Plex_Mono'] text-xs text-[#6B6459] hover:text-[#0F6B5C] transition-colors"
            >
              <span>View Marketplace</span>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
            </NavLink>

            <div className="h-4 w-px bg-[#D8D2C4] hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0F6B5C]" />
              <span className="font-['IBM_Plex_Mono'] text-xs text-[#6B6459]">
                System Online
              </span>
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;