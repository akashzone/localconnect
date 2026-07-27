import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faLaptopCode,
  faHandshake,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-28 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Connect Local Businesses
            <br />
            with Student Developers
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-200">
            LocalConnect is a platform where businesses can post projects and
            students can gain real-world experience by working on them.
          </p>

          <div className="mt-10 flex justify-center gap-5 flex-wrap">
            <Link
              to="/projects"
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Browse Projects
            </Link>

            <Link
              to="/register"
              className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition"
            >
              Join as Developer
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Choose LocalConnect?
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition">
              <div className="text-blue-600 text-5xl mb-5">
                <FontAwesomeIcon icon={faBriefcase} />
              </div>

              <h3 className="text-xl font-semibold mb-3">
                Real Projects
              </h3>

              <p className="text-gray-600">
                Businesses post genuine software projects with budgets,
                deadlines, and required skills.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition">
              <div className="text-green-600 text-5xl mb-5">
                <FontAwesomeIcon icon={faLaptopCode} />
              </div>

              <h3 className="text-xl font-semibold mb-3">
                Student Developers
              </h3>

              <p className="text-gray-600">
                Students gain practical experience, build portfolios, and earn
                while learning.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition">
              <div className="text-purple-600 text-5xl mb-5">
                <FontAwesomeIcon icon={faHandshake} />
              </div>

              <h3 className="text-xl font-semibold mb-3">
                Easy Collaboration
              </h3>

              <p className="text-gray-600">
                Businesses and developers connect through one platform to manage
                projects efficiently.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition">
              <div className="text-red-500 text-5xl mb-5">
                <FontAwesomeIcon icon={faRocket} />
              </div>

              <h3 className="text-xl font-semibold mb-3">
                Career Growth
              </h3>

              <p className="text-gray-600">
                Gain experience, strengthen your resume, and work on impactful
                local business projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-14">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">
                1
              </div>

              <h3 className="text-xl font-semibold mb-3">
                Businesses Post Projects
              </h3>

              <p className="text-gray-600">
                Create a project with budget, timeline, and required skills.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">
                2
              </div>

              <h3 className="text-xl font-semibold mb-3">
                Developers Apply
              </h3>

              <p className="text-gray-600">
                Student developers browse projects and submit applications with
                proposals.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">
                3
              </div>

              <h3 className="text-xl font-semibold mb-3">
                Collaborate & Deliver
              </h3>

              <p className="text-gray-600">
                Businesses choose a developer and work together until the
                project is completed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-300 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">LocalConnect</h2>

            <p className="mt-2 text-sm">
              Connecting local businesses with talented student developers.
            </p>
          </div>

          <div className="flex gap-6 mt-6 md:mt-0">
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>

            <Link to="/projects" className="hover:text-white transition">
              Projects
            </Link>

            <Link to="/login" className="hover:text-white transition">
              Login
            </Link>

            <Link to="/register" className="hover:text-white transition">
              Register
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-700 py-4 text-center text-sm">
          © {new Date().getFullYear()} LocalConnect. All rights reserved.
        </div>
      </footer>
    </div>
  );
}



export default Home;