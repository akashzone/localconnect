import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";

const howItWorks = [
  { n: "01", title: "Business Owners", text: "Create an account and post your software requirements." },
  { n: "02", title: "Student Developers", text: "Browse projects and apply with your skills and proposal." },
  { n: "03", title: "Project Selection", text: "Business owners review applications and select the best developer." },
  { n: "04", title: "Project Completion", text: "Collaborate to complete the project successfully." },
];

const whyChoose = [
  "Affordable Solutions",
  "Verified Student Developers",
  "Real-world Experience",
  "Simple Application Process",
  "Role-based Dashboard",
  "Secure Authentication",
];

const techStack = ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "JWT Authentication"];

function About() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430]">

      {/* ================= HERO ================= */}
      <section className="border-b border-[#D8D2C4]">
        <div className="max-w-4xl mx-auto px-6 py-20 md:py-24 text-center">
          <span className="inline-block font-['IBM_Plex_Mono'] text-[12px] tracking-widest uppercase bg-[#F5C445] px-2.5 py-1 rounded-[3px] mb-6">
            About LocalConnect
          </span>

          <h1 className="font-['Space_Grotesk'] font-bold text-[36px] sm:text-[46px] leading-[1.1] mb-6">
            Connecting Local Businesses
            <br />
            with Student Developers
          </h1>

          <p className="max-w-2xl mx-auto text-[16px] text-[#4A473F] leading-relaxed">
            LocalConnect is a marketplace designed to connect local businesses with
            talented student developers. The platform enables businesses to post
            software development projects while giving students an opportunity to
            gain practical experience, build their portfolios, and earn through
            real-world work.
          </p>
        </div>
      </section>

      {/* ================= MISSION ================= */}
      <section className="py-16 border-b border-[#D8D2C4]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-8 sm:p-10 shadow-[5px_5px_0px_#1B2430]">
            <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C]">
              Why we built this
            </span>
            <h2 className="font-['Space_Grotesk'] font-bold text-2xl sm:text-3xl mt-2 mb-4">
              Our Mission
            </h2>
            <p className="text-[15px] text-[#4A473F] leading-relaxed">
              Our mission is to bridge the gap between local businesses that need
              affordable digital solutions and students seeking hands-on software
              development experience. We aim to create opportunities for
              collaboration, learning, and growth for both communities.
            </p>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20 border-b border-[#D8D2C4]">
        <div className="max-w-6xl mx-auto px-6">
          <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C]">
            The process
          </span>
          <h2 className="font-['Space_Grotesk'] font-bold text-3xl md:text-4xl mt-2 mb-14">
            How It Works
          </h2>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((s) => (
              <div key={s.n}>
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
                <p className="text-[14.5px] text-[#4A473F] leading-relaxed">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE ================= */}
      <section className="py-20 border-b border-[#D8D2C4]">
        <div className="max-w-7xl mx-auto px-6">
          <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C]">
            The pitch
          </span>
          <h2 className="font-['Space_Grotesk'] font-bold text-3xl md:text-4xl mt-2 mb-12">
            Why Choose LocalConnect?
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyChoose.map((item) => (
              <div
                key={item}
                className="bg-white border border-[#D8D2C4] rounded-[6px] p-5 flex items-center gap-3
                           shadow-[3px_3px_0px_#D8D2C4] hover:shadow-[3px_3px_0px_#F5C445]
                           hover:-translate-y-0.5 transition-all duration-150"
              >
                <span className="text-[#0F6B5C] text-lg leading-none">✓</span>
                <span className="font-medium text-[15px]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TECH STACK ================= */}
      <section className="py-20 border-b border-[#D8D2C4]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C]">
            Under the hood
          </span>
          <h2 className="font-['Space_Grotesk'] font-bold text-3xl md:text-4xl mt-2 mb-10">
            Technologies Used
          </h2>

          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="font-['IBM_Plex_Mono'] text-[13px] px-4 py-2 bg-white border border-[#D8D2C4] rounded-[4px]
                           text-[#1B2430] shadow-[2px_2px_0px_#D8D2C4]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-['Space_Grotesk'] font-bold text-3xl md:text-4xl mb-8">
            Ready to get started?
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/projects"
              className="font-semibold px-6 py-3.5 rounded-[4px] bg-[#1B2430] text-[#FAF8F3]
                         shadow-[4px_4px_0px_#0F6B5C] hover:shadow-[2px_2px_0px_#0F6B5C] hover:translate-x-[2px] hover:translate-y-[2px]
                         transition-all duration-150"
            >
              Browse Projects
            </Link>

            <Link
              to="/register"
              className="font-semibold px-6 py-3.5 rounded-[4px] border-2 border-[#1B2430] text-[#1B2430]
                         hover:bg-[#1B2430] hover:text-[#FAF8F3] transition-colors duration-150"
            >
              Register
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;