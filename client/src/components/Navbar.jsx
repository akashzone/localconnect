import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout, profile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [profile?.profileImage]);

  const hasProfileImage = profile?.profileImage && 
                          profile.profileImage.startsWith("http") && 
                          !profile.profileImage.includes("unsplash.com/illustrations");

  const showProfileImage = hasProfileImage && !imageError;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close profile dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Get initial for avatar (falls back to "U")
  const avatarInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email
      ? user.email.charAt(0).toUpperCase()
      : "U";

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

          {/* Student */}
          {user?.role === "student" && (
            <>
              <NavItem to="/projects" label="Projects" />
              <NavItem to="/dashboard/student" label="Dashboard" />
              <NavItem to="/my-applications" label="My Applications" />
            </>
          )}

          {/* Business Owner */}
          {user?.role === "business" && (
            <>
              <NavItem to="/dashboard/business" label="Dashboard" />
              <NavItem to="/my-projects" label="My Projects" />
              <NavItem to="/applications/business" label="Applications" />
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
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-[#1B2430] text-[#FAF8F3] font-['IBM_Plex_Sans'] font-semibold text-sm
                           flex items-center justify-center border-2 border-[#F5C445] hover:opacity-90
                           transition-opacity focus:outline-none overflow-hidden"
                aria-label="Open profile menu"
                aria-expanded={isProfileMenuOpen}
              >
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
              </button>

              {isProfileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 bg-[#FAF8F3] border border-[#D8D2C4] rounded-[4px]
                             shadow-[3px_3px_0px_#D8D2C4] py-1 animate-fadeIn"
                >
                  <NavLink
                    to="/profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2 font-['IBM_Plex_Sans'] text-sm transition-colors ${isActive ? "text-[#0F6B5C] bg-[#1B2430]/5" : "text-[#1B2430] hover:bg-[#1B2430]/5"
                      }`
                    }
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 font-['IBM_Plex_Sans'] text-sm text-[#1B2430] hover:bg-[#1B2430]/5 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
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

            {/* Student Mobile Links */}
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
                  to="/dashboard/student"
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
                  to="/applications/business"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `font-['IBM_Plex_Sans'] text-[15px] font-medium py-1 transition-colors ${isActive ? "text-[#0F6B5C]" : "text-[#6B6459] hover:text-[#1B2430]"
                    }`
                  }
                >
                  Applications
                </NavLink>
              </>
            )}

            {/* Profile link shown for all logged-in roles on mobile */}
            {user && (
              <NavLink
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 font-['IBM_Plex_Sans'] text-[15px] font-medium py-1 transition-colors ${isActive ? "text-[#0F6B5C]" : "text-[#6B6459] hover:text-[#1B2430]"
                  }`
                }
              >
                <span className="w-6 h-6 rounded-full bg-[#1B2430] text-[#FAF8F3] text-[11px] font-semibold flex items-center justify-center border border-[#F5C445] overflow-hidden">
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
                </span>
                Profile
              </NavLink>
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