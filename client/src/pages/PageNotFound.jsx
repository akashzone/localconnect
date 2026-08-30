import { useNavigate } from "react-router-dom";

function PageNotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430] flex flex-col">
            {/* ================= 404 SECTION ================= */}
            <section className="flex-1 flex items-center justify-center py-20 px-6">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Decorative 404 */}
                    <div className="mb-8">
                        <span className="font-['Space_Grotesk'] font-bold text-[120px] sm:text-[160px] leading-none text-[#F5C445] opacity-20">
                            404
                        </span>
                    </div>

                    {/* Tag */}
                    <span className="inline-block font-['IBM_Plex_Mono'] text-[12px] tracking-widest uppercase bg-[#F5C445] px-2.5 py-1 rounded-[3px] mb-6">
                        Page Not Found
                    </span>

                    {/* Heading */}
                    <h1 className="font-['Space_Grotesk'] font-bold text-[42px] sm:text-[52px] leading-[1.1] mb-4">
                        Oops! Lost in Space
                    </h1>

                    {/* Description */}
                    <p className="text-[16px] text-[#4A473F] mb-8 max-w-md mx-auto leading-relaxed">
                        The page you're looking for seems to have wandered off. Don't worry, we'll help you find your way back.
                    </p>

                    {/* Login Section */}
                    <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-8 sm:p-10 shadow-[6px_6px_0px_#1B2430] max-w-md mx-auto">
                        <span className="font-['IBM_Plex_Mono'] text-[11px] tracking-widest uppercase text-[#0F6B5C]">
                            Get back in
                        </span>
                        <h2 className="font-['Space_Grotesk'] font-bold text-2xl mt-2 mb-6">
                            Sign In to Continue
                        </h2>

                        <button
                            type="button"
                            onClick={() => {
                                window.location.href = (import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/auth/google";
                            }}
                            className="w-full bg-[#1B2430] text-[#FAF8F3] py-3 rounded-[4px] font-semibold text-[15px]
                         shadow-[4px_4px_0px_#F5C445] mb-4 hover:shadow-[2px_2px_0px_#F5C445] hover:translate-x-[2px] hover:translate-y-[2px]
                         transition-all duration-150"
                        >
                            Continue with Google
                        </button>

                        <button
                            onClick={() => navigate("/")}
                            className="w-full bg-white border border-[#D8D2C4] text-[#1B2430] py-3 rounded-[4px] font-semibold text-[15px]
                         shadow-[4px_4px_0px_#D8D2C4] hover:shadow-[2px_2px_0px_#D8D2C4] hover:translate-x-[2px] hover:translate-y-[2px]
                         transition-all duration-150"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </section>

            {/* ================= HELPFUL LINKS ================= */}
            <section className="border-t border-[#D8D2C4] py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C]">
                            Quick Links
                        </span>
                        <h2 className="font-['Space_Grotesk'] font-bold text-2xl mt-2">
                            What can we help you with?
                        </h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 max-w-5xl mx-auto">
                        {[
                            { label: "Browse Projects", path: "/projects" },
                            { label: "Developer Profile", path: "/developers" },
                            { label: "Post a Project", path: "/post-project" },
                            { label: "Contact Support", path: "/contact" },
                        ].map((link) => (
                            <button
                                key={link.label}
                                onClick={() => navigate(link.path)}
                                className="bg-white border border-[#D8D2C4] rounded-[6px] p-5 text-center
                           shadow-[3px_3px_0px_#D8D2C4] hover:shadow-[5px_5px_0px_#D8D2C4]
                           hover:translate-x-[-1px] hover:translate-y-[-1px]
                           transition-all duration-150"
                            >
                                <p className="font-['Space_Grotesk'] font-bold text-[15px]">
                                    {link.label}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default PageNotFound;