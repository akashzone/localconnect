import { useState } from "react";

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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      return alert("All fields are required");
    }

    // No backend wired up yet — swap this for an EmailJS call or an API request later.
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

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
            { label: "Phone", value: "+91 XXXXX XXXXX", tag: "TAG · CALL" },
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

      {/* ================= FORM ================= */}
      <section className="py-20 border-b border-[#D8D2C4]">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white border border-[#D8D2C4] rounded-[6px] p-8 sm:p-10 shadow-[6px_6px_0px_#1B2430]">
            <span className="font-['IBM_Plex_Mono'] text-[11px] tracking-widest uppercase text-[#0F6B5C]">
              Send a message
            </span>
            <h2 className="font-['Space_Grotesk'] font-bold text-2xl sm:text-3xl mt-2 mb-7">
              We'd love to hear from you
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wide text-[#6B6459] mb-1.5">
                    Full Name
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
              </div>

              <div>
                <label className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wide text-[#6B6459] mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  className="w-full border border-[#D8D2C4] rounded-[4px] px-3.5 py-2.5 text-[15px]
                             focus:outline-none focus:border-[#0F6B5C] focus:ring-2 focus:ring-[#0F6B5C]/15
                             transition-colors"
                />
              </div>

              <div>
                <label className="block font-['IBM_Plex_Mono'] text-[11px] uppercase tracking-wide text-[#6B6459] mb-1.5">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what's on your mind..."
                  rows={5}
                  className="w-full border border-[#D8D2C4] rounded-[4px] px-3.5 py-2.5 text-[15px] resize-none
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
                Send Message
              </button>
            </form>
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
                    className={`font-['IBM_Plex_Mono'] text-[#0F6B5C] transition-transform duration-200 ${
                      openFaq === i ? "rotate-45" : ""
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

      {/* ================= MAP PLACEHOLDER ================= */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border-2 border-dashed border-[#D8D2C4] rounded-[6px] h-64 flex flex-col items-center justify-center text-center bg-white/50">
            <span className="text-3xl mb-2">📍</span>
            <p className="font-['IBM_Plex_Mono'] text-[12px] text-[#9B9384]">
              Map placeholder — embed Google Maps here
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;