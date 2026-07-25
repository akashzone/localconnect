import { NavLink } from "react-router-dom";

function Navbar() {
    const navLinkStyle = ({ isActive }) =>
        `transition-colors duration-200 font-medium ${
            isActive
                ? "text-blue-600"
                : "text-slate-600 hover:text-blue-600"
        }`;

    return (
        <nav className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto h-16 px-6 flex items-center">

                {/* Logo */}
                <div className="w-1/4">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Local<span className="text-blue-600">Connect</span>
                    </h1>
                </div>

                {/* Navigation */}
                <div className="w-2/4 flex justify-center gap-10">
                    <NavLink to="/" className={navLinkStyle}>
                        Home
                    </NavLink>

                    <NavLink to="/projects" className={navLinkStyle}>
                        Projects
                    </NavLink>
                </div>

                {/* Auth Buttons */}
                <div className="w-1/4 flex justify-end gap-3">
                    <NavLink
                        to="/login"
                        className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 transition-all duration-200"
                    >
                        Login
                    </NavLink>

                    <NavLink
                        to="/register"
                        className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-200"
                    >
                        Register
                    </NavLink>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;