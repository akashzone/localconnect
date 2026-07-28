import { NavLink } from "react-router-dom";

function Navbar() {
  const navLinkStyle = ({ isActive }) =>
    `relative font-['IBM_Plex_Sans'] text-[15px] font-medium transition-colors ${
      isActive ? "text-[#1B2430]" : "text-[#6B6459] hover:text-[#1B2430]"
    }`;

  return (
    <nav className="bg-[#FAF8F3] border-b border-[#D8D2C4] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-[68px] px-6 flex items-center justify-between">

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
        <div className="hidden md:flex items-center gap-9">
          <NavLink to="/" className={navLinkStyle}>
            {({ isActive }) => (
              <span className="flex flex-col items-center gap-1">
                Home
                <span
                  className={`h-[3px] w-[3px] rounded-full bg-[#F5C445] transition-opacity ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
              </span>
            )}
          </NavLink>

          <NavLink to="/projects" className={navLinkStyle}>
            {({ isActive }) => (
              <span className="flex flex-col items-center gap-1">
                Projects
                <span
                  className={`h-[3px] w-[3px] rounded-full bg-[#F5C445] transition-opacity ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
              </span>
            )}
          </NavLink>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;