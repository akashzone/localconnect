import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { useAuth } from "../context/AuthContext";

export const Footer = () => {
  const { user } = useAuth();

  return (
    <>
      <footer className="bg-[#1B2430] text-[#C9C4B7] mt-auto font-['IBM_Plex_Sans']">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-8">
          <div>
            <h2 className="font-['Space_Grotesk'] font-bold text-xl text-[#FAF8F3]">
              Local<span className="text-[#F5C445]">Connect</span>
            </h2>
            <p className="mt-2 text-sm max-w-xs">
              Connecting local businesses with talented student developers.
            </p>

            <div className="flex items-center gap-3 mt-5">
              {/* GitHub Link */}
              <a
                href="https://github.com/akashzone"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 flex items-center justify-center rounded-[4px] border border-[#333C4A]
                           text-[#C9C4B7] hover:text-[#1B2430] hover:bg-[#F5C445] hover:border-[#F5C445]
                           transition-colors duration-150"
              >
                <FontAwesomeIcon icon={faGithub} className="text-base" />
              </a>

              {/* LinkedIn Link */}
              <a
                href="https://www.linkedin.com/in/akashnadar-dev/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 flex items-center justify-center rounded-[4px] border border-[#333C4A]
                           text-[#C9C4B7] hover:text-[#1B2430] hover:bg-[#F5C445] hover:border-[#F5C445]
                           transition-colors duration-150"
              >
                <FontAwesomeIcon icon={faLinkedin} className="text-base" />
              </a>
            </div>
          </div>

          <div className="flex gap-8 text-sm">
            <Link
              to={
                user
                  ? user.role === "business"
                    ? "/dashboard/business"
                    : user.role === "student"
                    ? "/dashboard/student"
                    : "/admin/dashboard"
                  : "/"
              }
              className="hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
            {!user && (
              <>
                <Link to="/login" className="hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="hover:text-white transition-colors">Register</Link>
              </>
            )}
          </div>
        </div>

        <div className="border-t border-[#333C4A] py-4 text-center font-['IBM_Plex_Mono'] text-xs">
          © {new Date().getFullYear()} LocalConnect — built by students, for local business.
        </div>
      </footer>
    </>
  );
};

export default Footer;
