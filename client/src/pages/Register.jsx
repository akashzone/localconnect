import api from "../api/api.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student"
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !formData.name ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            return alert("All fields are required");
        }
        if (formData.password !== formData.confirmPassword) {
            return alert("Passwords do not match");
        }

        const userData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
        };

        try {
            const response = await api.post("/auth/register", userData);
            console.log(response.data);

            // alert(response.data.message);

            navigate("/login");
        } catch (error) {
            console.log(error);

            alert(error.response.data.message);
        }
    };

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
                            Join the board
                        </p>
                        <h2 className="font-['Space_Grotesk'] font-bold text-3xl leading-tight mt-3">
                            Post the work.
                            <br />
                            Or go find it.
                        </h2>
                    </div>

                    <div className="flex gap-6 font-['IBM_Plex_Mono'] text-sm text-[#9B9384]">
                        <span><strong className="text-[#FAF8F3]">128</strong> postings</span>
                        <span><strong className="text-[#FAF8F3]">340</strong> developers</span>
                    </div>
                </div>

                {/* Right: form */}
                <div className="bg-white p-8 sm:p-10">
                    <span className="font-['IBM_Plex_Mono'] text-[11px] tracking-widest uppercase text-[#0F6B5C]">
                        Create account
                    </span>
                    <h1 className="font-['Space_Grotesk'] font-bold text-3xl mt-2 mb-1">
                        Join LocalConnect
                    </h1>
                    <p className="text-[14.5px] text-[#6B6459] mb-7">
                        Start posting projects or picking them up.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wide text-[#6B6459] mb-1.5">
                                Full name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                className="w-full border border-[#D8D2C4] rounded-[4px] px-3.5 py-2.5 text-[15px]
                                           focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                                           transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wide text-[#6B6459] mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full border border-[#D8D2C4] rounded-[4px] px-3.5 py-2.5 text-[15px]
                                           focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                                           transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wide text-[#6B6459] mb-1.5">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full border border-[#D8D2C4] rounded-[4px] px-3.5 py-2.5 text-[15px]
                                               focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                                               transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wide text-[#6B6459] mb-1.5">
                                    Confirm
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full border border-[#D8D2C4] rounded-[4px] px-3.5 py-2.5 text-[15px]
                                               focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                                               transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wide text-[#6B6459] mb-1.5">
                                Register as
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: "student" })}
                                    className={`px-4 py-2.5 rounded-[4px] border text-sm font-semibold transition-all duration-150 ${formData.role === "student"
                                            ? "bg-[#1B2430] border-[#1B2430] text-[#FAF8F3] shadow-[3px_3px_0px_#F5C445]"
                                            : "border-[#D8D2C4] text-[#6B6459] hover:border-[#1B2430]"
                                        }`}
                                >
                                    Student
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: "business" })}
                                    className={`px-4 py-2.5 rounded-[4px] border text-sm font-semibold transition-all duration-150 ${formData.role === "business"
                                            ? "bg-[#1B2430] border-[#1B2430] text-[#FAF8F3] shadow-[3px_3px_0px_#F5C445]"
                                            : "border-[#D8D2C4] text-[#6B6459] hover:border-[#1B2430]"
                                        }`}
                                >
                                    Business Owner
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#1B2430] text-[#FAF8F3] py-3 rounded-[4px] font-semibold text-[15px]
                                       shadow-[4px_4px_0px_#F5C445] hover:shadow-[2px_2px_0px_#F5C445] hover:translate-x-[2px] hover:translate-y-[2px]
                                       transition-all duration-150"
                        >
                            Create account
                        </button>
                    </form>

                    <p className="text-center text-sm text-[#6B6459] mt-7">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-[#0F6B5C] font-semibold hover:underline"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;