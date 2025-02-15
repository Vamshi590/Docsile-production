import React, { useState } from "react";
import loginsidepic from "../../assets/icon/loginsidepic.svg";
import docsilelogo from "../../assets/landing/logo.svg";
import DropDownWithSearch from "./Dropdownfilter";
import { studentDepartments } from "../../studentDepartments";
import { studentPrograms } from "../../studentPrograms";
import {motion } from "framer-motion"
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

const institutes = ["Gandhi", "AIIMS", "Osmania ", "Mayo Clinic College"];

const SignupPage2: React.FC = () => {
  const [formData, setFormData] = useState({
    institute: "",
    specialization: "",
    degree: "",
  });

  const userid = localStorage.getItem("Id") || "";
  const id = parseInt(userid)
  const navigate = useNavigate()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loading = toast.loading("We are almost there, adding your details")

    try{

      const response = await axios.post(`https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/user/profile/education/${id}`, {
        institute : formData.institute,
        department : formData.specialization,
        program : formData.degree
      })

      console.log(response)

      toast.dismiss(loading)

      if(response){
        navigate(`/signup/student/profile/location/${id}`)
      }

    }catch(e : any){
      toast.dismiss(loading);
      toast.error(e.message , {duration : 3000})
      console.log(e)
    }

    console.log("User Data:", formData); // Replace with API call or state management logic
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full font-fontsm ">
      {/* Left Section (Hidden on Small Screens) */}
      <div className="hidden md:flex  flex-1 justify-center items-center pl-8  bg-white">
        <div className="text-center max-w-lg">
          <p className="mt-4 text-xl  text-balance text-maincl">
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
      <Toaster/>
      {/* Right Section (Always Visible) */}
      <div className="flex flex-1 lg:justify-start  justify-center items-center lg:pr-4 p-2  ">
        <motion.div
        initial={{ x: "100%", opacity: 0 }} // Starts off-screen to the right
        animate={{ x: 0, opacity: 1 }} // Slides in to its position
        exit={{ x: "-100%", opacity: 0 }} // Slides out to the left
        transition={{ type: "tween", duration: 0.5 }} // Smooth transition
        
        className="w-full max-w-lg bg-white shadow-xl border border-gray-200  rounded-3xl p-6 flex flex-col justify-center lg:max-h-[90%] max-h-[80%]   lg:p-20 h-[90vh] my-auto ">
          <div className="flex items-center  text-center mb-14 lg:mb-10 w-full">
            <img src={docsilelogo} alt="Docsile Logo" className="w-52 mr-2" />
          </div>
          <h2 className="lg:text-md text-lg   text-gray-800 mb-4">
            Tell us about your medical education and learning journey
          </h2>

          <form onSubmit={handleSubmit}>
            <div className=" mb-4">
              {/* Institute Dropdown */}
              <DropDownWithSearch
                place={"Name of the Institute"}
                dropDownOptions={institutes}
                onSelect={(value) => {
                  setFormData({ ...formData, institute: value });
                }}
              />
            </div>

            <div className=" mb-4">
              {/* Specialization Dropdown */}
              <DropDownWithSearch
                place={"Department"}
                dropDownOptions={studentDepartments}
                onSelect={(value) => {
                  setFormData({ ...formData, specialization: value });
                }}
              />
            </div>

            <div className=" mb-8">
              {/* Degree Dropdown */}
              <DropDownWithSearch
                place={"Degree"}
                dropDownOptions={studentPrograms}
                onSelect={(value) => {
                  setFormData({ ...formData, degree: value });
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-maincl text-white p-3 mt-8 rounded-3xl hover:bg-fillc transition"
            >
              Next
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage2;
