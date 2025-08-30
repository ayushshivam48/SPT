import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const closeMobileMenu = (e: Event) => {
    if (e.target instanceof HTMLElement) {
      if (!e.target.closest("#mobileMenu") && !e.target.closest("#menuBtn")) {
        setMobileMenuOpen(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeMobileMenu);
    return () => document.removeEventListener("click", closeMobileMenu);
  }, []);

  return (
    <div
      id="root"
      className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 text-gray-700 scroll-smooth min-h-screen"
    >
      {/* Navbar */}
      <header className="w-full fixed top-0 bg-white/80 backdrop-blur-lg z-50 transition-all border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Edulytix
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center text-sm font-medium">
            <a
              href="#about"
              className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-600 after:left-0 after:-bottom-1 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              About
            </a>
            <a
              href="#features"
              className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-600 after:left-0 after:-bottom-1 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              Features
            </a>
            <a
              href="#roles"
              className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-600 after:left-0 after:-bottom-1 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              Roles
            </a>
            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-full hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              Login
            </Link>
          </nav>

          {/* Hamburger Menu */}
          <div className="md:hidden relative text-black">
            <button
              id="menuBtn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-2xl text-gray-700 hover:text-blue-600 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobileMenu"
              aria-label="Toggle Mobile Menu"
            >
              &#9776;
            </button>
            <div
              id="mobileMenu"
              role="menu"
              className={`absolute right-0 mt-3 w-48 bg-[#f0f8ff] shadow-lg rounded-lg py-3 px-4 z-50 ${
                mobileMenuOpen ? "" : "hidden"
              }`}
            >
              <a
                href="#about"
                className="block py-2 text-sm hover:text-blue-700 transition-colors"
              >
                About
              </a>
              <a
                href="#features"
                className="block py-2 text-sm hover:text-blue-700 transition-colors"
              >
                Features
              </a>
              <a
                href="#roles"
                className="block py-2 text-sm hover:text-blue-700 transition-colors"
              >
                Roles
              </a>
              <Link
                to="/login"
                className="block py-2 text-sm bg-blue-700 text-white rounded text-center mt-2 hover:bg-blue-800 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="min-h-screen flex items-center justify-center pt-32 px-6 text-gray-800 relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/Study.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-blue-200/20"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div
          className="text-center max-w-4xl relative z-10 px-4"
          data-aos="fade-up"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg text-blue-900">
            Empowering Education
            <br />
            Through Smart Performance Insights
          </h2>
          <p className="text-lg md:text-xl mb-8 text-blue-800 leading-relaxed max-w-2xl mx-auto">
            Edulytix helps schools, students, and educators visualize progress,
            discover trends, and make better decisions with data-driven insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-blue-600/25 hover:scale-105 transition-all transform"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="px-8 py-4 rounded-full font-semibold text-lg border border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 transition-all"
            >
              Learn More →
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="py-24 px-6 bg-[#f0f8ff] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50"></div>
        <div
          className="max-w-5xl mx-auto text-center relative"
          data-aos="fade-right"
        >
          <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            What is Edulytix?
          </h3>
          <p className="text-blue-900 text-xl leading-relaxed max-w-3xl mx-auto">
            Edulytix is a role-based education analytics platform for schools and
            institutions to track student performance, streamline feedback, and
            generate meaningful academic insights.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="font-semibold text-blue-700">Analytics</h4>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
              <h4 className="font-semibold text-indigo-700">Performance</h4>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <h4 className="font-semibold text-purple-700">Insights</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="bg-gradient-to-br from-blue-50 to-indigo-50 py-24 px-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <h3
              className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent"
              data-aos="fade-down"
            >
              Platform Features
            </h3>
            <p className="text-blue-900 max-w-2xl mx-auto text-lg">
              Everything you need to track and improve academic performance
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "Visual Analytics",
                text: "Track trends with charts, performance graphs, and subject-wise comparisons.",
                color: "blue",
              },
              {
                icon: "📄",
                title: "CSV & PDF Reports",
                text: "Upload data in bulk using CSV and download styled PDF academic reports.",
                color: "indigo",
              },
              {
                icon: "💬",
                title: "Feedback Channels",
                text: "Teachers provide student-specific feedback to guide learning outcomes.",
                color: "purple",
              },
              {
                icon: "⚡",
                title: "Real-Time Progress",
                text: "Get instant performance updates across terms, subjects, and courses.",
                color: "pink",
              },
              {
                icon: "🎯",
                title: "Role-Based Dashboards",
                text: "Students, Teachers, and Admins have personalized portals & tools.",
                color: "cyan",
              },
              {
                icon: "🤖",
                title: "Automated Insights",
                text: "Edulytix delivers trend alerts and learning insights via analytics engines.",
                color: "teal",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                data-aos={[
                  "zoom-in",
                  "fade-right",
                  "fade-left",
                  "zoom-in-up",
                  "fade-right",
                  "fade-left",
                ][idx]}
              >
                <div
                  className={`w-14 h-14 mb-6 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform ${
                    feature.color === "blue"
                      ? "bg-blue-100"
                      : feature.color === "indigo"
                      ? "bg-indigo-100"
                      : feature.color === "purple"
                      ? "bg-purple-100"
                      : feature.color === "pink"
                      ? "bg-pink-100"
                      : feature.color === "cyan"
                      ? "bg-cyan-100"
                      : "bg-teal-100"
                  }`}
                >
                  {feature.icon}
                </div>
                <h4
                  className={`text-xl font-semibold mb-3 ${
                    feature.color === "blue"
                      ? "text-blue-600"
                      : feature.color === "indigo"
                      ? "text-indigo-600"
                      : "text-purple-600"
                  }`}
                >
                  {feature.title}
                </h4>
                <p className="text-gray-700 leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="bg-[#f0f8ff] py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/50 to-transparent"></div>
        <div className="max-w-6xl mx-auto text-center relative">
          <h3
            className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent"
            data-aos="fade-up"
          >
            User Roles
          </h3>
          <p className="text-blue-900 max-w-2xl mx-auto text-lg mb-12">
            Tailored experiences for every stakeholder in the educational journey
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            {[{
                emoji: "🎓",
                role: "Students",
                text: "View grades, analyze subject performance, download reports, and read teacher feedback – all in one place.",
                gradient: "from-blue-500 to-cyan-500",
                bg: "blue",
              },
              {
                emoji: "👩‍🏫",
                role: "Teachers",
                text: "Upload marks, monitor class performance, provide student feedback, and generate visual insights effortlessly.",
                gradient: "from-indigo-500 to-purple-500",
                bg: "indigo",
              },
              {
                emoji: "🛠️",
                role: "Admins",
                text: "Manage users, track platform activity, oversee all data flows, and maintain institutional academic standards.",
                gradient: "from-purple-500 to-pink-500",
                bg: "purple",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group relative p-8 rounded-2xl bg-[#f0f8ff] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                data-aos={["fade-right", "zoom-in", "fade-left"][idx]}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    item.gradient === "from-blue-500 to-cyan-500"
                      ? "from-blue-500 to-cyan-500"
                      : item.gradient === "from-indigo-500 to-purple-500"
                      ? "from-indigo-500 to-purple-500"
                      : "from-purple-500 to-pink-500"
                  } opacity-0 group-hover:opacity-5 transition-opacity`}
                ></div>
                <div
                  className={`w-16 h-16 mb-6 rounded-xl flex items-center justify-center text-2xl mx-auto group-hover:scale-110 transition-transform ${
                    item.bg === "blue"
                      ? "bg-blue-100"
                      : item.bg === "indigo"
                      ? "bg-indigo-100"
                      : "bg-purple-100"
                  }`}
                >
                  {item.emoji}
                </div>
                <h4
                  className={`text-xl font-semibold mb-4 bg-gradient-to-r ${
                    item.gradient === "from-blue-500 to-cyan-500"
                      ? "from-blue-500 to-cyan-500"
                      : item.gradient === "from-indigo-500 to-purple-500"
                      ? "from-indigo-500 to-purple-500"
                      : "from-purple-500 to-pink-500"
                  } bg-clip-text text-transparent`}
                >
                  {item.role}
                </h4>
                <p className="text-blue-900 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-[#f0f8ff] to-blue-50 border-t border-blue-200 py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-center md:text-left">
          <div>
            <h4 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Edulytix
            </h4>
            <p className="text-blue-900 leading-relaxed">
              Smart academic tracking platform for students, teachers, and
              institutions.
            </p>
          </div>
          <div>
            <h4 className="text-base font-semibold text-blue-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#about"
                  className="text-blue-900 hover:text-blue-700 transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-blue-900 hover:text-blue-700 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#roles"
                  className="text-blue-900 hover:text-blue-700 transition-colors"
                >
                  Roles
                </a>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-blue-900 hover:text-blue-700 transition-colors"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-600 mb-2">Platform</h4>
            <ul className="space-y-1">
              <li>
                <Link to="/dashboard" className="hover:text-blue-500">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-blue-500">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/upload-csv" className="hover:text-blue-500">
                  Upload CSV
                </Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-blue-500">
                  Download Reports
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-600 mb-2">Contact</h4>
            <p className="text-blue-900">
              📧 edulytix@gmail.in
              <br />
              📍 Patna, India
            </p>
          </div>
        </div>
        <div className="text-center text-xs mt-6 text-blue-600">
          &copy; 2025 Edulytix. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
