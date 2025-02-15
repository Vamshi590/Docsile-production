import doctor from "../assets/doctorWithPhone.svg";
import whiteLogo from "../assets/white logo.svg";
import logo from '../assets/landing/logo.svg'
import ellipse from "../assets/Ellipse.svg";
import { useState } from "react";
import * as z from "zod";
import { toast, Toaster } from "sonner";
import axios from "axios";
import DropDownWithSearch from "@/components/DropDownWithSearch";
import CountrySelector from "@/components/CountrySelector";
import StateCitySelector from "@/components/StateCitySelector";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Country } from "country-state-city";
import { doctorSpecialisations } from "@/doctorSpecialisations";
import { studentPrograms } from "@/studentPrograms";
import { motion } from "framer-motion";

function SignupStudent() {
  const location = useLocation();
  const navigate = useNavigate();

  const id = location.state || 0;
  const userid = parseInt(localStorage.getItem("Id") || "") || id;

  console.log(typeof userid);

  const [selectedSpecialization, setSelectedSpecialization] = useState<
    string | null
  >("Specialization");

  function handleSpecializationSelect(option: string) {
    setSelectedSpecialization(option);
  }

  //county and state and city

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

  const DoctorLocation = `${selectedCity},${selectedState}`;

  //zod schema

  const doctorDetailsSchema = z.object({
    hospitalname: z.string().min(4, { message: "Enter valid Hospital Name" }),
    selectedSpecialization: z
      .string()
      .min(4, { message: "Enter valid Specialization" }),
    doctorCountry: z.string().min(3, { message: "Enter valid Country" }),
    DoctorLocation: z.string().min(3, { message: " Enter valid City" }),
  });

  //details

  const [doctorDetails, setDoctorDetails] = useState("");

  //Handling Gender

  const [selectedProgram, setSelectedProgram] = useState<string>("");

  //handling input changes

  function handleChange(e: any) {
    setDoctorDetails(e);
  }

  function handleProgramSelect(option: string) {
    setSelectedProgram(option);
  }

  //Button click send details to backend

  const finalData = {
    hospitalname: doctorDetails,
    doctorCountry,
    DoctorLocation,
    selectedSpecialization,
  };

  //BACKEND Call

  async function handleClick(e: any) {
    e.preventDefault();

    const result = doctorDetailsSchema.safeParse(finalData);
    if (!result.success) {
      const firstError = result.error.errors[0];
      toast.error(`${firstError.path[0]}: ${firstError.message}`);
      return;
    }

    const loadingToast = toast.loading("Loading");

    try {
      const response = await axios.post(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/signup/student`,
        {
          country: doctorCountry,
          city: DoctorLocation,
          institute_name: doctorDetails,
          department: selectedSpecialization,
          degree: selectedProgram,
          userid,
        }
      );

      console.log(response);

      toast.dismiss(loadingToast);

      toast.success("User Created Successfully");

      navigate("/feed", { state: id });
    } catch (error: any) {
      toast.dismiss(loadingToast);

      if (error.response?.status === 401) {
        toast.error("Please sign in again");
        navigate("/signup");
        return;
      }

      if (error.response) {
        toast.error(`Error: ${error.response.data}`);
      } else if (error.request) {
        toast.error("No response from the server");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }

    console.log(doctorDetails);
  }

  return (
    <div className="flex items-center justify-center h-full min-h-screen bg-white lg:bg-gray-100">
      {/* Card Container */}
      <div className="relative flex flex-wrap w-full lg:w-[90%] xl:w-[80%] bg-white lg:shadow-2xl rounded-3xl h-full lg:h-[95vh] overflow-hidden">
        {/* Left Section */}
        <div className="hidden lg:flex w-1/2 bg-main flex-col justify-center items-center relative text-white p-10 overflow-hidden">
          {/* Logo */}
          <div className="absolute top-10 left-14 z-10">
            <img src={whiteLogo} alt="Logo" className="w-56" />
          </div>

          <div className="absolute top-28 left-14">
            <p className="font-mainfont text-2xl font-medium text-white">
              Empowering the medical community
            </p>
          </div>

          {/* Chat Bubbles */}

          <div className=" hidden xl:flex flex-col absolute bottom-40 left-[300px] bg-white text-gray-600 px-4 py-2 rounded-t-3xl rounded-br-3xl shadow-lg w-[190px] z-10">
            <p className="text-xs font-medium">
              Hey, It’s great connecting with you too.
            </p>
            <p className="text-xs text-gray-500">Lorem Ipsum dummy text.</p>
          </div>

          {/* Doctor Image */}
          <div>
            <img
              src={doctor}
              alt="Doctor"
              className="object-contain  w-[400px] xl:w-[450px] h-auto absolute -bottom-8 left-[-55px] z-10"
            />
          </div>

          <div className="absolute -bottom-36 -left-28 xl:-bottom-28 xl:-left-20">
            <img src={ellipse} alt="" />
          </div>
        </div>

        <Toaster />

        {/* Right Section */}
        <motion.div
          initial={{ x: "100%", opacity: 0 }} // Starts off-screen to the right
          animate={{ x: 0, opacity: 1 }} // Slides in to its position
          exit={{ x: "-100%", opacity: 0 }} // Slides out to the left
          transition={{ type: "tween", duration: 0.5 }} // Smooth transition
          className="w-full h-full lg:w-1/2 flex lg:px-24 flex-col justify-center items-center bg-white my-auto"
        >
          <div className="flex items-center justify-center  overflow-auto no-scrollbar">
            <div className="bg-white flex-col rounded-lg   w-full ">
              {/* Show logo on mobile */}
              <div className=" flex lg:hidden w-full items-center justify-center">
                <img src={logo} alt="" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold">
                  Tell us more about you
                </h1>
              </div>

              <div className="mt-4 sm:mt-6">
                <p className="  text-sm sm:text-base font-normal">
                  Join a network of experts commited to advancing healthcare
                  together
                </p>
              </div>

              <div className="space-y-4 mt-6">
                <DropDownWithSearch
                  place="Hospital / Institute Name"
                  onSelect={handleChange}
                  dropDownOptions={["vamshidhar", "sriprada"]}
                />

                <DropDownWithSearch
                  place="Specialization"
                  onSelect={handleSpecializationSelect}
                  dropDownOptions={doctorSpecialisations}
                />

                <DropDownWithSearch
                  place="Highest Degree (ex: MBBS)"
                  onSelect={handleProgramSelect}
                  dropDownOptions={studentPrograms}
                />

                <CountrySelector onCountrySelect={handleCountrySelect} />

                <StateCitySelector
                  selectedCountry={selectedCountry}
                  onStateCitySelect={handleStateCitySelect}
                />
              </div>

              <div className="mt-8 flex items-center justify-between">
                <Link to="/" className="text-gray-500 hover:text-gray-700">
                  Skip
                </Link>
                <button
                  onClick={handleClick}
                  className="bg-main text-white px-8 py-2 rounded-full hover:bg-opacity-90 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SignupStudent;
