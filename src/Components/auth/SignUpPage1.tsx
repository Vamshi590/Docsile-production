import React, { useState } from "react";
import loginsidepic from "../../assets/icon/loginsidepic.svg";
import docsilelogo from "../../assets/landing/logo.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({ firstName: "", lastName: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  const userid = localStorage.getItem("Id") || '';
  const id = parseInt(userid)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if( !formData.firstName || !formData.lastName){
      toast.error("please enter all the details", {duration : 1000})
      return
    }

    const loading =  toast.loading("Noting your name");
    
    try {
      const response = await axios.post(`https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/user/profile/name/${id}`, {
        firstname : formData.firstName,
        lastname : formData.lastName,
      });

      toast.dismiss(loading)

      console.log(response)
      
      navigate(`/signup/student/profile/profesional-details/${id}`)
      


    } catch (e : any) {
      toast.dismiss(loading)
      toast.error(e.message)
      console.log(e);
    }

    console.log("User Data:", formData); // Replace with API call or state management logic
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full font-fontsm ">
      {/* Left Section (Hidden on Small Screens) */}
      <div className="hidden lg:flex  flex-1 justify-center items-center pl-8  bg-white">
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
      <div className="flex flex-1 lg:justify-start justify-center  lg:pr-4 px-2  ">
        <motion.div
          initial={{ x: "100%", opacity: 0 }} // Starts off-screen to the right
          animate={{ x: 0, opacity: 1 }} // Slides in to its position
          exit={{ x: "-100%", opacity: 0 }} // Slides out to the left
          transition={{ type: "tween", duration: 0.5 }} // Smooth transition
          className="w-full max-w-lg bg-white md:shadow-xl md:border border-gray-200  rounded-3xl p-6 flex flex-col justify-center lg:max-h-[90%] max-h-[80%]   lg:p-20 h-[90vh] my-auto "
        >
          <div className="flex items-center  text-center mb-14 lg:mb-10 w-full">
            <img src={docsilelogo} alt="Docsile Logo" className=" w-52  mr-2" />
          </div>
          <h2 className="lg:text-md text-lg   text-gray-800 mb-8">
            Tell us your name to personalize your professional profile
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border text-gray-800  border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-fillc mb-5"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border text-gray-800 border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-fillc mb-8"
            />
            <button
              type="submit"
              className="w-full mt-8 bg-maincl text-white p-3 rounded-3xl hover:bg-fillc transition"
            >
              Next
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
