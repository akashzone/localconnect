import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faLaptopCode,
  faHandshake,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import { Footer } from "../components/Footer";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "business") {
      navigate("/dashboard/business", { replace: true });
    } else if (user?.role === "student") {
      navigate("/dashboard/student", { replace: true });
    } else if (user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const isBusiness = user?.role === "business";

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430]">

      {/* ================= HERO ================= */}
      <section className="border-b border-[#D8D2C4]">
        {isBusiness ? (
          // Business owner hero
          <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
            <span className="inline-block font-['IBM_Plex_Mono'] text-[12px] tracking-widest uppercase bg-[#F5C445] px-2.5 py-1 rounded-[3px] mb-6">
              Welcome back
            </span>

            <h1 className="font-['Space_Grotesk'] font-bold text-[36px] sm:text-[48px] leading-[1.1] tracking-tight mb-4">
              Welcome back, {user.name?.split(" ")[0]}
            </h1>

            <p className="text-[19px] text-[#4A473F] mb-10">
              Need another developer?
            </p>

            <Link
              to="/create-project"
              className="inline-block font-semibold px-7 py-3.5 rounded-[4px] bg-[#1B2430] text-[#FAF8F3]
                         shadow-[4px_4px_0px_#0F6B5C] hover:shadow-[2px_2px_0px_#0F6B5C] hover:translate-x-[2px] hover:translate-y-[2px]
                         transition-all duration-150"
            >
              + Create New Project
            </Link>
          </div>
        ) : (
          // Default / developer hero
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-[1.1fr_0.9fr] gap-16 items-center">

            {/* Left: copy */}
            <div>
              <span className="inline-block font-['IBM_Plex_Mono'] text-[12px] tracking-widest uppercase bg-[#F5C445] px-2.5 py-1 rounded-[3px] mb-6">
                Now posting in 40+ cities
              </span>

              <h1 className="font-['Space_Grotesk'] font-bold text-[44px] sm:text-[56px] md:text-[64px] leading-[1.04] tracking-tight">
                Real projects.
                <br />
                Real students.
                <br />
                <span className="text-[#0F6B5C]">No middlemen.</span>
              </h1>

              <p className="mt-6 max-w-md text-[17px] text-[#4A473F] leading-relaxed">
                Local businesses post the work they need done. Student developers
                pick it up, build it, and get paid — while you get a portfolio
                instead of a certificate.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  to="/projects"
                  className="font-semibold px-6 py-3.5 rounded-[4px] bg-[#1B2430] text-[#FAF8F3]
                             shadow-[4px_4px_0px_#0F6B5C] hover:shadow-[2px_2px_0px_#0F6B5C] hover:translate-x-[2px] hover:translate-y-[2px]
                             transition-all duration-150"
                >
                  Browse projects
                </Link>

                {!user && (
                  <Link
                    to="/register"
                    className="font-semibold px-6 py-3.5 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430]
                               hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150"
                  >
                    Join as a developer
                  </Link>
                )}
              </div>

              <div className="mt-10 flex gap-8 font-['IBM_Plex_Mono'] text-sm text-[#6B6459]">
                <span><strong className="text-[#1B2430]">128</strong> open postings</span>
                <span><strong className="text-[#1B2430]">340</strong> developers</span>
              </div>
            </div>

            {/* Right: mock posting card */}
            <div className="relative hidden md:block">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#1B2430] z-10" />
              <div
                className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 rotate-[-2.5deg]
                           shadow-[6px_6px_0px_#1B2430]"
              >
                <div className="flex items-center justify-between font-['IBM_Plex_Mono'] text-[11px] text-[#9B9384] mb-4">
                  <span>POSTING #014</span>
                  <span className="text-[#0F6B5C]">● OPEN</span>
                </div>

                <h3 className="font-['Space_Grotesk'] font-bold text-lg mb-2">
                  E-commerce site redesign
                </h3>
                <p className="text-sm text-[#4A473F] mb-5 leading-relaxed">
                  Rebuild our storefront on React, need cart + checkout flow.
                  Flexible on timeline.
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {["React", "Stripe", "Tailwind"].map((tag) => (
                    <span
                      key={tag}
                      className="font-['IBM_Plex_Mono'] text-[11px] px-2 py-1 border border-[#D8D2C4] rounded-[3px] text-[#4A473F]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-dashed border-[#D8D2C4] pt-4">
                  <span className="font-['Space_Grotesk'] font-bold text-[#0F6B5C]">₹2500 budget</span>
                  <span className="font-['IBM_Plex_Mono'] text-[11px] text-[#9B9384]">2 weeks</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="py-20 border-b border-[#D8D2C4]">
        <div className="max-w-7xl mx-auto px-6">
          <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C]">
            The board
          </span>
          <h2 className="font-['Space_Grotesk'] font-bold text-3xl md:text-4xl mt-2 mb-12">
            What you get
          </h2>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: faBriefcase, tag: "TAG · REAL", title: "Real projects", text: "Businesses post genuine work with budgets, deadlines, and required skills — not busywork." },
              { icon: faLaptopCode, tag: "TAG · GROW", title: "Student developers", text: "Gain practical experience, build a portfolio, and get paid while you learn." },
              { icon: faHandshake, tag: "TAG · SIMPLE", title: "One place", text: "Postings, applications, and messages, all in a single, uncluttered dashboard." },
              { icon: faRocket, tag: "TAG · RESUME", title: "Career growth", text: "Ship real work for real clients — the kind of line item that gets a callback." },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white border border-[#D8D2C4] rounded-[6px] p-6
                           shadow-[3px_3px_0px_#D8D2C4] hover:shadow-[3px_3px_0px_#F5C445]
                           hover:-translate-y-0.5 transition-all duration-150"
              >
                <span className="font-['IBM_Plex_Mono'] text-[10px] tracking-widest text-[#9B9384]">
                  {f.tag}
                </span>

                <div className="text-[#0F6B5C] text-2xl mt-3 mb-4">
                  <FontAwesomeIcon icon={f.icon} />
                </div>

                <h3 className="font-['Space_Grotesk'] font-bold text-lg mb-2">
                  {f.title}
                </h3>

                <p className="text-[14.5px] text-[#4A473F] leading-relaxed">
                  {f.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-b border-[#D8D2C4]">
        <div className="max-w-6xl mx-auto px-6">
          <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C]">
            The process
          </span>
          <h2 className="font-['Space_Grotesk'] font-bold text-3xl md:text-4xl mt-2 mb-14">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-10 relative">
            {[
              { n: "01", title: "Post the work", text: "Create a listing with budget, timeline, and the skills you need." },
              { n: "02", title: "Developers apply", text: "Student developers browse open postings and send proposals." },
              { n: "03", title: "Build together", text: "Pick a developer and collaborate until the project ships." },
            ].map((s, i) => (
              <div key={s.n} className="relative">
                <div
                  className="w-14 h-14 flex items-center justify-center rounded-[6px] bg-[#1B2430] text-[#F5C445]
                             font-['IBM_Plex_Mono'] font-medium text-lg rotate-[-3deg] mb-6
                             shadow-[3px_3px_0px_#D8D2C4]"
                >
                  {s.n}
                </div>

                <h3 className="font-['Space_Grotesk'] font-bold text-lg mb-2">
                  {s.title}
                </h3>

                <p className="text-[14.5px] text-[#4A473F] leading-relaxed max-w-xs">
                  {s.text}
                </p>

                {i < 2 && (
                  <div className="hidden md:block absolute top-7 left-[calc(100%-8px)] w-10 border-t-2 border-dashed border-[#D8D2C4]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;