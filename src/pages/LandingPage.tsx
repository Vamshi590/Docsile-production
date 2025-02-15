import logo from "../assets/landing/logo.svg"
import mockup from "../assets/landing/mockup_1.svg"


import WordRotate from "../Components/ui/word-rotate";



import Marquee from "react-fast-marquee";

import organisation1 from "../assets/landing/AMC-Logo.svg";
import organisation2 from "../assets/landing/Madras_Medical_College_Logo.svg";
import organisation3 from "../assets/landing/Nizam's_Institute_of_Medical_Sciences_Logo.svg.svg";
import organisation4 from "../assets/landing/afmc-logo2.svg";

import organisation5 from "../assets/landing/aiims.svg";
import organisation6 from "../assets/landing/logo11.svg";
import LandingFeatures from "../Components/LandingFeatures";
import LandingTestimonials from "../Components/LandingTestimonials";
import LandingFooter from "../Components/LandingFooter";
import { useNavigate } from "react-router-dom";



function LandingPage() {
  const logos = [
    organisation1,
    organisation2,
    organisation3,
    organisation4,
    organisation5,
    organisation6,
  ];

  const navigate = useNavigate()

  function handleJoinNow(){
    navigate("/category")
  }

  function handleSignin(){
    navigate("/signin")
  }

  console.log(import.meta.env)


  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-gray-50 to-white">
      {/* Navbar */}
      <header className="flex justify-between items-center px-4  lg:px-16 py-4 ">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Docsile Logo" className="h-8" />
        </div>
        <nav className="hidden md:flex space-x-6 lg:space-x-14">
          <a
            href="#"
            className="text-main text-base font-mainfont hover:text-gray-700"
          >
            About Us
          </a>
          <a
            href="#"
            className="text-main text-base font-mainfont hover:text-gray-700"
          >
            Contact
          </a>
          <a
            href="#"
            className="text-main text-base font-mainfont hover:text-gray-700"
          >
            FAQs
          </a>
        </nav>
        <div className="flex space-x-4">
          <button onClick={handleJoinNow} className="text-main hover:underline font-mainfont text-xs md:text-base">
            Join Now
          </button>
          <button onClick={handleSignin} className="border border-blue-700 text-main px-4 py-2 text-xs md:text-base font-mainfont rounded-full hover:bg-main hover:text-white">
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 md:px-20 lg:pl-40 lg:pr-0 py-12 flex flex-col md:flex-row justify-between items-center text-center md:text-left relative">
        <div className="md:w-1/2 lg:px-20 mb-20 text-center">
          <h2 className="text-2xl md:text-4xl  font-mainfont text-black leading-tight">
            Empowering the Medical Community
          </h2>

          <WordRotate
            className=" text-2xl lg:text-[40px] font-bold text-main pt-4 font-mainfont dark:text-white  "
            words={[
              "Find a Job",
              "Attend Events",
              "Discuss Cases",
              "Clinical Videos",
              "And Much More!",
            ]}
            duration={2000}
          />

          <p className="mt-4 text-sm lg:text-base font-mainfont text-gray-600 font-light">
            Docsile is the go-to platform for medical professionals to connect,
            collaborate, and grow. From finding jobs to attending events,
            sharing insights, and accessing clinical resources, Docsile brings
            the medical community together in one place.
          </p>
          <button onClick={handleJoinNow} className="mt-6 bg-main text-white px-6 py-2.5 lg:py-3 w-48 md:w-80 rounded-full shadow-lg hover:bg-blue-900">
            Join Now
          </button>
        </div>
        <div className="hidden mt-6 md:mt-0 md:w-1/2 lg:flex justify-center relative -top-20">
          <div className="absolute inset-0  rounded-lg"></div>

          <img
            src={mockup}
            alt="Mobile Mockup"
            className="relative w-4/5  md:w-1/2"
          />
          <img
            src={mockup}
            alt="mockup"
            className="absolute top-16 left-5 w-4/5 md:w-1/2"
          />
        </div>

        <div className="md:hidden container lg:py-16">

        <img
            src={mockup}
            alt="Mobile Mockup"
            className="relative w-full"
          />
     
        </div>
      </main>

      <section className="px-6 md:px-20 lg:px-20 py-12 ">
        <h3 className="text-center text-2xl font-medium font-mainfont text-gray-700">
          Trusted by over 100+ Organizations
        </h3>
        <div className="mt-10 overflow-hidden">
          <Marquee>
            {logos.map((link, index) => (
              <div
                key={index}
                className="flex flex-row items-center justify-center mx-10 lg:mx-20"
              >
                <img
                  src={link}
                  alt={`Organization ${index + 1}`}
                  className="h-16 w-auto"
                />
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      <section className="px-6 md:px-20 lg:px-20 py-0 lg:py-12 ">
        <LandingFeatures />
      </section>

      <section>
        <LandingTestimonials />
      </section>

      <LandingFooter />
    </div>
  );
}

export default LandingPage;
