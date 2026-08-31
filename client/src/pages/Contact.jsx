import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const faqs = [
  {
    q: "Can anyone post projects?",
    a: "Yes. Business owners can register and post software development projects.",
  },
  {
    q: "Is LocalConnect free?",
    a: "Developers can register and apply for projects without any registration fee.",
  },
  {
    q: "How do I apply?",
    a: "Create a developer account, browse available projects, and submit your application.",
  },
];

function Contact() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-[#FAF8F3] font-['IBM_Plex_Sans'] text-[#1B2430]">

      {/* ================= HERO ================= */}
      <section className="border-b border-[#D8D2C4]">
        <div className="max-w-3xl mx-auto px-6 py-20 md:py-24 text-center">
          <span className="inline-block font-['IBM_Plex_Mono'] text-[12px] tracking-widest uppercase bg-[#F5C445] px-2.5 py-1 rounded-[3px] mb-6">
            Get in touch
          </span>
          <h1 className="font-['Space_Grotesk'] font-bold text-[36px] sm:text-[46px] leading-[1.1] mb-4">
            Contact Us
          </h1>
          <p className="text-[16px] text-[#4A473F]">
            Have questions or feedback? We're here to help.
          </p>
        </div>
      </section>

      {/* ================= CONTACT INFO ================= */}
      <section className="py-16 border-b border-[#D8D2C4]">
        <div className="max-w-6xl mx-auto px-6 grid gap-5 sm:grid-cols-3">
          {[
            { label: "Email", value: "support@localconnect.com", tag: "TAG · MAIL" },
            { label: "Phone", value: "+91 73043 885XX", tag: "TAG · CALL" },
            { label: "Address", value: "Mumbai, India", tag: "TAG · VISIT" },
          ].map((c) => (
            <div
              key={c.label}
              className="bg-white border border-[#D8D2C4] rounded-[6px] p-6 text-center
                         shadow-[3px_3px_0px_#D8D2C4]"
            >
              <span className="font-['IBM_Plex_Mono'] text-[10px] tracking-widest text-[#9B9384]">
                {c.tag}
              </span>
              <h3 className="font-['Space_Grotesk'] font-bold text-lg mt-3 mb-1">
                {c.label}
              </h3>
              <p className="text-[14.5px] text-[#4A473F]">{c.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CONNECT SECTION ================= */}
      <section className="py-20 border-b border-[#D8D2C4]">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-8 sm:p-10 shadow-[6px_6px_0px_#1B2430]">
            <span className="font-['IBM_Plex_Mono'] text-[11px] tracking-widest uppercase text-[#0F6B5C]">
              Connect with me
            </span>
            <h2 className="font-['Space_Grotesk'] font-bold text-2xl sm:text-3xl mt-2 mb-7">
              Let's build something together
            </h2>

            <div className="space-y-4">
              {/* Gmail Link */}
              <a
                href="mailto:akashnadar.dev@gmail.com"
                className="flex items-center gap-4 p-4 border border-[#D8D2C4] rounded-[6px] bg-[#FAF8F3]
                           shadow-[3px_3px_0px_#D8D2C4] hover:shadow-[1px_1px_0px_#D8D2C4] hover:translate-x-[2px] hover:translate-y-[2px]
                           transition-all duration-150 group"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-[4px] bg-[#0F6B5C]/10 text-[#0F6B5C]">
                  <FontAwesomeIcon icon={faEnvelope} className="text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-['Space_Grotesk'] font-bold text-sm text-[#1B2430]">Email</h4>
                  <p className="text-xs sm:text-sm text-[#4A473F] truncate">akashnadar.dev@gmail.com</p>
                </div>
                <span className="font-['IBM_Plex_Mono'] text-xs text-[#0F6B5C] font-semibold group-hover:underline">
                  Write Email &rarr;
                </span>
              </a>

              {/* GitHub Link */}
              <a
                href="https://github.com/akashzone"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 border border-[#D8D2C4] rounded-[6px] bg-[#FAF8F3]
                           shadow-[3px_3px_0px_#D8D2C4] hover:shadow-[1px_1px_0px_#D8D2C4] hover:translate-x-[2px] hover:translate-y-[2px]
                           transition-all duration-150 group"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-[4px] bg-[#1B2430]/10 text-[#1B2430]">
                  <FontAwesomeIcon icon={faGithub} className="text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-['Space_Grotesk'] font-bold text-sm text-[#1B2430]">GitHub</h4>
                  <p className="text-xs sm:text-sm text-[#4A473F] truncate">github.com/akashzone</p>
                </div>
                <span className="font-['IBM_Plex_Mono'] text-xs text-[#1B2430] font-semibold group-hover:underline">
                  Visit Profile &rarr;
                </span>
              </a>

              {/* LinkedIn Link */}
              <a
                href="https://www.linkedin.com/in/akashnadar-dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 border border-[#D8D2C4] rounded-[6px] bg-[#FAF8F3]
                           shadow-[3px_3px_0px_#D8D2C4] hover:shadow-[1px_1px_0px_#D8D2C4] hover:translate-x-[2px] hover:translate-y-[2px]
                           transition-all duration-150 group"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-[4px] bg-[#0A66C2]/10 text-[#0A66C2]">
                  <FontAwesomeIcon icon={faLinkedin} className="text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-['Space_Grotesk'] font-bold text-sm text-[#1B2430]">LinkedIn</h4>
                  <p className="text-xs sm:text-sm text-[#4A473F] truncate">linkedin.com/in/akashnadar-dev</p>
                </div>
                <span className="font-['IBM_Plex_Mono'] text-xs text-[#0A66C2] font-semibold group-hover:underline">
                  Let's Connect &rarr;
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="py-20 border-b border-[#D8D2C4]">
        <div className="max-w-2xl mx-auto px-6">
          <span className="font-['IBM_Plex_Mono'] text-xs uppercase tracking-widest text-[#0F6B5C]">
            Common questions
          </span>
          <h2 className="font-['Space_Grotesk'] font-bold text-3xl mt-2 mb-10">
            FAQ
          </h2>

          <div className="space-y-3">
            {faqs.map((item, i) => (
              <div
                key={item.q}
                className="bg-white border border-[#D8D2C4] rounded-[6px] overflow-hidden shadow-[3px_3px_0px_#D8D2C4]"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-['Space_Grotesk'] font-bold text-[15px]">
                    {item.q}
                  </span>
                  <span
                    className={`font-['IBM_Plex_Mono'] text-[#0F6B5C] transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""
                      }`}
                  >
                    +
                  </span>
                </button>

                {openFaq === i && (
                  <div className="px-5 pb-4 border-t border-dashed border-[#D8D2C4] pt-3">
                    <p className="text-[14.5px] text-[#4A473F] leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}

export default Contact;