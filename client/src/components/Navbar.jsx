import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkStyle = ({ isActive }) =>
    `group relative font-['IBM_Plex_Sans'] text-[15px] font-medium py-1 whitespace-nowrap transition-colors ${
      isActive ? "text-[#1B2430]" : "text-[#6B6459] hover:text-[#1B2430]"
    }`;

  const Underline = ({ isActive }) => (
    <span
      className={`absolute left-0 -bottom-0.5 h-[2px] w-full bg-[#0F6B5C] origin-left transition-transform duration-200 ${
        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
      }`}
    />
  );

  const NavItem = ({ to, label }) => (
    <NavLink to={to} className={navLinkStyle}>
      {({ isActive }) => (
        <>
          {label}
          <Underline isActive={isActive} />
        </>
      )}
    </NavLink>
  );

  return (
    <nav className="bg-[#FAF8F3] border-b border-[#D8D2C4] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto min-h-[68px] px-6 py-3 flex items-center justify-between gap-6 flex-wrap lg:flex-nowrap">

        {/* Logo */}
        <NavLink to="/" className="flex items-baseline gap-2 shrink-0">
          <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#1B2430]">
            Local<span className="text-[#0F6B5C]">Connect</span>
          </span>
          <span className="hidden sm:inline font-['IBM_Plex_Mono'] text-[11px] text-[#9B9384] tracking-wide">
            /dev-marketplace
          </span>
        </NavLink>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 flex-wrap order-3 lg:order-2 basis-full lg:basis-auto justify-center lg:justify-start">
          <NavItem to="/" label="Home" />

          {/* Guest */}
          {!user && (
            <>
              <NavItem to="/projects" label="Projects" />
              <NavItem to="/about" label="About" />
              <NavItem to="/contact" label="Contact" />
            </>
          )}

          {/* Developer */}
          {user?.role === "student" && (
            <>
              <NavItem to="/projects" label="Projects" />
              <NavItem to="/dashboard/developer" label="Dashboard" />
              <NavItem to="/my-applications" label="My Applications" />
              <NavItem to="/profile" label="Profile" />
            </>
          )}

          {/* Business Owner */}
          {user?.role === "business" && (
            <>
              <NavItem to="/my-projects" label="My Projects" />
              <NavItem to="/dashboard/business" label="Dashboard" />
              <NavItem to="/profile" label="Profile" />
            </>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0 order-2 lg:order-3">
          {!user ? (
            <>
              <NavLink
                to="/login"
                className="font-['IBM_Plex_Sans'] px-4 py-2 text-sm font-medium text-[#1B2430] hover:text-[#0F6B5C] transition-colors"
              >
                Log in
              </NavLink>

              <NavLink
                to="/register"
                className="font-['IBM_Plex_Sans'] px-4 py-2 text-sm font-semibold bg-[#1B2430] text-[#FAF8F3] rounded-[4px]
                           shadow-[3px_3px_0px_#F5C445] hover:shadow-[1px_1px_0px_#F5C445] hover:translate-x-[2px] hover:translate-y-[2px]
                           transition-all duration-150"
              >
                Post a project
              </NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="font-['IBM_Plex_Sans'] px-4 py-2 text-sm font-semibold bg-[#1B2430] text-[#FAF8F3] rounded-[4px]
                         shadow-[3px_3px_0px_#F5C445] hover:shadow-[1px_1px_0px_#F5C445] hover:translate-x-[2px] hover:translate-y-[2px]
                         transition-all duration-150"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;