import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkStyle = ({ isActive }) =>
    `group relative font-['IBM_Plex_Sans'] text-[15px] font-medium py-1 whitespace-nowrap transition-colors ${isActive ? "text-[#1B2430]" : "text-[#6B6459] hover:text-[#1B2430]"
    }`;

  const Underline = ({ isActive }) => (
    <span
      className={`absolute left-0 -bottom-0.5 h-[2px] w-full bg-[#0F6B5C] origin-left transition-transform duration-200 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
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
      <div className="max-w-7xl mx-auto min-h-[68px] px-6 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <NavLink to={user?.role === "business" ? "/dashboard/business" : "/"} className="flex items-baseline gap-2 shrink-0">
          <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#1B2430]">
            Local<span className="text-[#0F6B5C]">Connect</span>
          </span>
          <span className="hidden sm:inline font-['IBM_Plex_Mono'] text-[11px] text-[#9B9384] tracking-wide">
            /dev-marketplace
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 flex-wrap justify-center lg:justify-start">
          {user?.role !== "business" && <NavItem to="/" label="Home" />}

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
              <NavItem to="/dashboard/business" label="Dashboard" />
              <NavItem to="/my-projects" label="My Projects" />
              <NavItem to="/applications/business" label="Applications" />
              <NavItem to="/profile" label="Profile" />
            </>
          )}
        </div>

        {/* Desktop Right side Actions */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
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

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-[#1B2430] hover:text-[#0F6B5C] p-2 focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#D8D2C4] bg-[#FAF8F3] px-6 py-4 space-y-4 animate-fadeIn">
          <div className="flex flex-col gap-3">
            {user?.role !== "business" && (
              <NavLink
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `font-['IBM_Plex_Sans'] text-[15px] font-medium py-1 transition-colors ${isActive ? "text-[#0F6B5C]" : "text-[#6B6459] hover:text-[#1B2430]"
                  }`
                }
              >
                Home
              </NavLink>
            )}

            {/* Guest Mobile Links */}
            {!user && (
              <>
                <NavLink
                  to="/projects"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `font-['IBM_Plex_Sans'] text-[15px] font-medium py-1 transition-colors ${isActive ? "text-[#0F6B5C]" : "text-[#6B6459] hover:text-[#1B2430]"
                    }`
                  }
                >
                  Projects
                </NavLink>
                <NavLink
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `font-['IBM_Plex_Sans'] text-[15px] font-medium py-1 transition-colors ${isActive ? "text-[#0F6B5C]" : "text-[#6B6459] hover:text-[#1B2430]"
                    }`
                  }
                >
                  About
                </NavLink>
                <NavLink
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `font-['IBM_Plex_Sans'] text-[15px] font-medium py-1 transition-colors ${isActive ? "text-[#0F6B5C]" : "text-[#6B6459] hover:text-[#1B2430]"
                    }`
                  }
                >
                  Contact
                </NavLink>
              </>
            )}

            {/* Developer Mobile Links */}
            {user?.role === "student" && (
              <>
                <NavLink
                  to="/projects"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `font-['IBM_Plex_Sans'] text-[15px] font-medium py-1 transition-colors ${isActive ? "text-[#0F6B5C]" : "text-[#6B6459] hover:text-[#1B2430]"
                    }`
                  }
                >
                  Projects
                </NavLink>
                <NavLink
                  to="/dashboard/developer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `font-['IBM_Plex_Sans'] text-[15px] font-medium py-1 transition-colors ${isActive ? "text-[#0F6B5C]" : "text-[#6B6459] hover:text-[#1B2430]"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/my-applications"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `font-['IBM_Plex_Sans'] text-[15px] font-medium py-1 transition-colors ${isActive ? "text-[#0F6B5C]" : "text-[#6B6459] hover:text-[#1B2430]"
                    }`
                  }
                >
                  My Applications
                </NavLink>
                <NavLink
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `font-['IBM_Plex_Sans'] text-[15px] font-medium py-1 transition-colors ${isActive ? "text-[#0F6B5C]" : "text-[#6B6459] hover:text-[#1B2430]"
                    }`
                  }
                >
                  Profile
                </NavLink>
              </>
            )}

            {/* Business Owner Mobile Links */}
            {user?.role === "business" && (
              <>
                <NavLink
                  to="/dashboard/business"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `font-['IBM_Plex_Sans'] text-[15px] font-medium py-1 transition-colors ${isActive ? "text-[#0F6B5C]" : "text-[#6B6459] hover:text-[#1B2430]"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/my-projects"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `font-['IBM_Plex_Sans'] text-[15px] font-medium py-1 transition-colors ${isActive ? "text-[#0F6B5C]" : "text-[#6B6459] hover:text-[#1B2430]"
                    }`
                  }
                >
                  My Projects
                </NavLink>
                <NavLink
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `font-['IBM_Plex_Sans'] text-[15px] font-medium py-1 transition-colors ${isActive ? "text-[#0F6B5C]" : "text-[#6B6459] hover:text-[#1B2430]"
                    }`
                  }
                >
                  Profile
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Action Buttons */}
          <div className="border-t border-[#D8D2C4]/60 pt-4 flex flex-col gap-3">
            {!user ? (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-['IBM_Plex_Sans'] text-center px-4 py-2 text-sm font-medium border border-[#D8D2C4] rounded-[4px] text-[#1B2430] hover:bg-[#1B2430]/5 transition-colors"
                >
                  Log in
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-['IBM_Plex_Sans'] text-center px-4 py-2.5 text-sm font-semibold bg-[#1B2430] text-[#FAF8F3] rounded-[4px]
                             shadow-[3px_3px_0px_#F5C445] active:shadow-[1px_1px_0px_#F5C445] transition-all duration-150"
                >
                  Post a project
                </NavLink>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="font-['IBM_Plex_Sans'] w-full text-center px-4 py-2.5 text-sm font-semibold bg-[#1B2430] text-[#FAF8F3] rounded-[4px]
                           shadow-[3px_3px_0px_#F5C445] transition-all duration-150"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;