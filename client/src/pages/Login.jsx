import api from "../api/api.js";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !formData.email ||
            !formData.password) {
            return alert("All fields are required");
        }

        try {
            const res = await api.post("/auth/login", formData);
            login(res.data.user);
            if (res.data.user?.role === "business") {
                navigate("/dashboard/business");
            } else {
                navigate("/");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F3] px-4 py-12 font-['IBM_Plex_Sans'] text-[#1B2430]">
            <div className="w-full max-w-4xl grid md:grid-cols-[0.9fr_1.1fr] rounded-[6px] border border-[#D8D2C4] shadow-[6px_6px_0px_#1B2430] overflow-hidden">

                {/* Left: brand panel */}
                <div className="hidden md:flex flex-col justify-between bg-[#1B2430] text-[#FAF8F3] p-10">
                    <div>
                        <span className="font-['Space_Grotesk'] text-2xl font-bold">
                            Local<span className="text-[#F5C445]">Connect</span>
                        </span>
                        <p className="mt-6 font-['IBM_Plex_Mono'] text-[11px] tracking-widest uppercase text-[#9B9384]">
                            Access your account
                        </p>
                        <h2 className="font-['Space_Grotesk'] font-bold text-3xl leading-tight mt-3">
                            Pick up where
                            <br />
                            you left off.
                        </h2>
                    </div>

                    <div className="bg-[#252F41] border border-[#333C4A] rounded-[6px] p-4 rotate-[-1.5deg]">
                        <div className="flex items-center justify-between font-['IBM_Plex_Mono'] text-[10px] text-[#9B9384] mb-2">
                            <span>POSTING #014</span>
                            <span className="text-[#F5C445]">● OPEN</span>
                        </div>
                        <p className="text-sm font-medium">E-commerce site redesign</p>
                        <p className="text-xs text-[#9B9384] mt-1">₹4000 budget · 2 weeks</p>
                    </div>
                </div>

                {/* Right: form */}
                <div className="bg-white p-8 sm:p-10">
                    <span className="font-['IBM_Plex_Mono'] text-[11px] tracking-widest uppercase text-[#0F6B5C]">
                        Sign in
                    </span>
                    <h1 className="font-['Space_Grotesk'] font-bold text-3xl mt-2 mb-1">
                        Welcome back
                    </h1>
                    <p className="text-[14.5px] text-[#6B6459] mb-7">
                        Sign in to continue to LocalConnect.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wide text-[#6B6459] mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-[#D8D2C4] rounded-[4px] px-3.5 py-2.5 text-[15px]
                                           focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                                           transition-colors"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wide text-[#6B6459]">
                                    Password
                                </label>
                                <span className="font-['IBM_Plex_Mono'] text-[11px] text-[#0F6B5C] cursor-pointer hover:underline">
                                    Forgot?
                                </span>
                            </div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full border border-[#D8D2C4] rounded-[4px] px-3.5 py-2.5 text-[15px]
                                           focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                                           transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#1B2430] text-[#FAF8F3] py-3 rounded-[4px] font-semibold text-[15px]
                                       shadow-[4px_4px_0px_#F5C445] hover:shadow-[2px_2px_0px_#F5C445] hover:translate-x-[2px] hover:translate-y-[2px]
                                       transition-all duration-150"
                        >
                            Sign in
                        </button>
                    </form>

                    <p className="text-center text-sm text-[#6B6459] mt-7">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-[#0F6B5C] font-semibold hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;