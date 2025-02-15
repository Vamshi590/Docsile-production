import React, { useState } from "react";
import loginsidepic from "../../assets/icon/loginsidepic.svg";
import docsilelogo from "../../assets/landing/logo.svg";
import { Country } from "country-state-city";
import { motion } from "framer-motion";
import CountrySelector from "../CountrySelector";
import StateCitySelector from "../StateCitySelector";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

const SignupPage3: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [doctorCountry, setDoctorCountry] = useState("");

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
    const country = Country.getCountryByCode(countryCode);
    const countryName = country?.name || "";
    console.log(countryName);
    setDoctorCountry(countryName);
  };

  const handleStateCitySelect = (city: string, state: string) => {
    setSelectedCity(city);
    setSelectedState(state);
  };

  const userid = localStorage.getItem("Id") || "";
  const id = parseInt(userid);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loading = toast.loading("Pefect, let us add your location");

    try {
      const response = await axios.post(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/user/profile/location/${id}`,
        {
          country: doctorCountry,
          city: `${selectedCity}, ${selectedState}`,
        }
      );

      console.log(response);

      toast.dismiss(loading);

      if (response) {
        navigate(`/signup/student/profile/profile-picture/${id}`);
      }
    } catch (e: any) {
      toast.dismiss(loading);
      toast.error(e.message);
      console.log(e);
    }

    console.log("User Data:"); // Replace with API call or state management logic
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full font-fontsm">
      {/* Left Section (Hidden on Small Screens) */}
      <div className="hidden md:flex flex-1 justify-center items-center pl-8 bg-white">
        <div className="text-center max-w-lg">
          <p className="mt-4 text-xl text-balance text-maincl">
            Step into a network where medical students learn, connect with
            mentors, and prepare for a future in healthcare
          </p>
          <div className="lg:p-4">
            <img
              src={loginsidepic}
              alt="Medical Network"
              className="w-[70%] max-w-md mx-auto"
            />
          </div>
        </div>
      </div>

      <Toaster />

      {/* Right Section (Always Visible) */}
      <div className="flex flex-1 lg:justify-start justify-center items-center lg:pr-4 p-2">
        <motion.div
          initial={{ x: "100%", opacity: 0 }} // Starts off-screen to the right
          animate={{ x: 0, opacity: 1 }} // Slides in to its position
          exit={{ x: "-100%", opacity: 0 }} // Slides out to the left
          transition={{ type: "tween", duration: 0.5 }} // Smooth transition
          className="w-full max-w-lg bg-white shadow-xl border border-gray-200 rounded-3xl p-6 flex flex-col justify-center lg:max-h-[90%] max-h-[80%] lg:p-20 h-[90vh] my-auto"
        >
          <div className="flex items-center text-center mb-14 lg:mb-10 w-full">
            <img src={docsilelogo} alt="Docsile Logo" className="w-52 mr-2" />
          </div>
          <h2 className="lg:text-md text-lg text-gray-800 mb-4">
            Help us match you with the right medical community by sharing your
            location
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Country Dropdown */}
            <CountrySelector onCountrySelect={handleCountrySelect} />

            {/* City Dropdown */}
            <StateCitySelector
              selectedCountry={selectedCountry}
              onStateCitySelect={handleStateCitySelect}
            />

            {/* Next Button */}
            <button
              className={`mt-16 w-full py-3 rounded-3xl ${
                selectedCountry && selectedCity
                  ? "bg-maincl hover:bg-fillc  text-white"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              disabled={!selectedCountry || !selectedCity}
            >
              Next
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage3;
