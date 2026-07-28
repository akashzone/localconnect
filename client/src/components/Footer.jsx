import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-[#1B2430] text-[#C9C4B7] mt-auto font-['IBM_Plex_Sans']">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-8">
        <div>
          <h2 className="font-['Space_Grotesk'] font-bold text-xl text-[#FAF8F3]">
            Local<span className="text-[#F5C445]">Connect</span>
          </h2>
          <p className="mt-2 text-sm max-w-xs">
            Connecting local businesses with talented student developers.
          </p>
        </div>

        <div className="flex gap-8 text-sm">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
          <Link to="/login" className="hover:text-white transition-colors">Login</Link>
          <Link to="/register" className="hover:text-white transition-colors">Register</Link>
        </div>
      </div>

      <div className="border-t border-[#333C4A] py-4 text-center font-['IBM_Plex_Mono'] text-xs">
        © {new Date().getFullYear()} LocalConnect — built by students, for local business.
      </div>
    </footer>
  );
};

export default Footer;