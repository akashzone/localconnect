import { useState, useEffect, useContext, useRef } from "react";
import { NavLink, useNavigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBriefcase,
  faColumns,
  faClipboardList,
  faSignOutAlt,
  faBars,
  faTimes,
  faGear,
  faSearch,
  faComments,
  faUser
} from "@fortawesome/free-solid-svg-icons";

function DashboardLayout() {
  const { user, logout, profile } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [imageError, setImageError] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    setImageError(false);
  }, [profile?.profileImage]);

  // Close sidebar on path change (useful for mobile)
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  // Close mobile sidebar on click outside
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

  if (!user) {
    // If not logged in, just let the child routes render directly
    return <Outlet />;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const hasProfileImage =
    profile?.profileImage &&
    profile.profileImage.startsWith("http") &&
    !profile.profileImage.includes("unsplash.com/illustrations");

  const showProfileImage = hasProfileImage && !imageError;

  const avatarInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "U";

  // Navigation configurations
  const studentNavItems = [
    { label: "Dashboard", to: "/dashboard/student", icon: faHome },
    { label: "Browse Projects", to: "/projects", icon: faSearch },
    { label: "My Applications", to: "/my-applications", icon: faClipboardList },
    { label: "My Work", to: "/my-projects", icon: faBriefcase },
    { label: "Messages", to: "/messages", icon: faComments }
  ];

  const businessNavItems = [
    { label: "Dashboard", to: "/dashboard/business", icon: faColumns },
    { label: "My Projects", to: "/my-projects", icon: faBriefcase },
    { label: "Applications", to: "/applications/business", icon: faClipboardList },
    { label: "Messages", to: "/messages", icon: faComments }
  ];

  const navItems = user.role === "business" ? businessNavItems : studentNavItems;

  const logoUrl =
    user.role === "business"
      ? "/dashboard/business"
      : user.role === "student"
      ? "/dashboard/student"
      : "/";

  const getLinkClass = ({ isActive }) => {
    return `flex items-center gap-3 px-6 py-3 font-['IBM_Plex_Sans'] text-sm font-medium transition-all border-l-4 ${
      isActive
        ? "bg-[#0F6B5C]/5 text-[#0F6B5C] border-[#0F6B5C] font-semibold"
        : "text-[#6B6459] border-transparent hover:bg-[#1B2430]/5 hover:text-[#1B2430]"
    }`;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#FAF8F3] border-r border-[#D8D2C4]">
      {/* Branding */}
      <div className="px-6 py-6 border-b border-[#D8D2C4]">
        <NavLink to={logoUrl} className="flex flex-col gap-0.5">
          <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#1B2430]">
            Local<span className="text-[#0F6B5C]">Connect</span>
          </span>
          <span className="font-['IBM_Plex_Mono'] text-[11px] text-[#9B9384] tracking-wide">
            /student-marketplace
          </span>
        </NavLink>
      </div>

      {/* Role Navigation Links */}
      <nav className="flex-1 py-6 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={getLinkClass} end={item.to === "/"}>
            <FontAwesomeIcon icon={item.icon} className="w-5 text-center shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* Divider and Secondary Navigation */}
        <div className="border-t border-[#D8D2C4] my-4 mx-6"></div>

        {/* Profile */}
        <NavLink to="/profile" className={getLinkClass}>
          <FontAwesomeIcon icon={faUser} className="w-5 text-center shrink-0" />
          <span>Profile</span>
        </NavLink>

        {/* Settings - disabled placeholder */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            alert("Settings is currently under development.");
          }}
          className="flex items-center gap-3 px-6 py-3 font-['IBM_Plex_Sans'] text-sm font-medium transition-all border-l-4 text-[#9B9384] border-transparent cursor-not-allowed"
          title="Settings is under development"
        >
          <FontAwesomeIcon icon={faGear} className="w-5 text-center shrink-0" />
          <span>Settings</span>
        </a>
      </nav>

      {/* User Section and Logout */}
      <div className="mt-auto border-t border-[#D8D2C4] bg-[#FAF8F3]">
        <div className="p-4 bg-[#FAF8F3]">
          <div className="flex items-center gap-3 mb-3 bg-white p-3 rounded-[6px] border border-[#D8D2C4] shadow-[2px_2px_0px_#D8D2C4]">
            <div className="w-10 h-10 rounded-full bg-[#1B2430] text-[#FAF8F3] font-['IBM_Plex_Sans'] font-semibold text-sm
                            flex items-center justify-center border-2 border-[#F5C445] overflow-hidden shrink-0">
              {showProfileImage ? (
                <img
                  src={profile.profileImage}
                  alt={user?.name || "Profile"}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                avatarInitial
              )}
            </div>
            <div className="min-w-0">
              <p className="font-['Space_Grotesk'] font-bold text-sm text-[#1B2430] truncate">
                {user?.name || "User"}
              </p>
              <span className="font-['IBM_Plex_Mono'] text-[9px] text-[#0F6B5C] bg-[#E9F5F1] font-bold px-1.5 py-0.5 rounded-[3px] uppercase tracking-wider block w-max mt-0.5">
                {user.role === "business" ? "BUSINESS" : "STUDENT"}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full font-['IBM_Plex_Sans'] font-semibold text-xs py-2.5 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430] hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-all duration-150 flex items-center justify-center gap-2 bg-white cursor-pointer shadow-[2px_2px_0px_#D8D2C4] hover:shadow-[1px_1px_0px_#D8D2C4] hover:translate-x-[1px] hover:translate-y-[1px]"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAF8F3]">
      {/* Desktop Sidebar (Fixed/Sticky) */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-[#FAF8F3] border-b border-[#D8D2C4] sticky top-0 z-30 w-full min-h-[64px]">
        <NavLink to={logoUrl} className="flex items-baseline gap-1.5">
          <span className="font-['Space_Grotesk'] text-xl font-bold text-[#1B2430]">
            Local<span className="text-[#0F6B5C]">Connect</span>
          </span>
        </NavLink>

        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="text-[#1B2430] hover:text-[#0F6B5C] p-1.5 focus:outline-none transition-colors"
          aria-label="Open navigation menu"
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
      </header>

      {/* Mobile Sidebar Slide-out Drawer Overlay */}
      <div className={`md:hidden fixed inset-0 z-50 flex ${isMobileSidebarOpen ? "visible" : "invisible"}`}>
        {/* Backdrop overlay */}
        <div
          className={`fixed inset-0 bg-[#1B2430]/40 transition-opacity duration-300 ${
            isMobileSidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileSidebarOpen(false)}
        />

        {/* Drawer content */}
        <div
          ref={sidebarRef}
          className={`relative flex flex-col w-64 max-w-xs h-full bg-[#FAF8F3] border-r border-[#D8D2C4] shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Close button inside mobile menu */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="text-[#1B2430] hover:text-[#0F6B5C] p-1 focus:outline-none transition-colors"
              aria-label="Close menu"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>

          <div className="h-full flex-1">
            <SidebarContent />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
