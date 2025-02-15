import doctor from "../../assets/doctorWithPhone.svg";
import whiteLogo from "../../assets/white logo.svg";
import ellipse from "../../assets/Ellipse.svg";
import googleIcon from "../../assets/googleicon.svg";
import appleIcon from "../../assets/appleicon.svg";
import logo from "../../assets/landing/logo.svg";
import { useState } from "react";
import { motion } from "framer-motion";
import { LuEye, LuEyeOff } from "react-icons/lu";
import * as z from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth, signInWithGooglePopup } from "../../firebase";

function LoginPage() {
  //input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 

 

  const [passwordVisiblity, setPasswordVisibilty] = useState(false);

  function handlePasswordVisibility() {
    setPasswordVisibilty((prev) => !prev);
  }

  const values = { email, password };

  const navigate = useNavigate();

  const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  });

  async function handleLogin(e: any) {
    e.preventDefault();
    const result = loginSchema.safeParse(values);
    if (!result.success) {
      const firstError = result.error.errors[0]; // Only the first error
      toast.error(`${firstError.path[0]}: ${firstError.message}`);
      return;
    }

    const loggingIn = toast.loading("Logging in");

    try {
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        const response = await axios.post(
          `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/auth/signin`,
          {
            date: new Date().toISOString(),
            email: values.email,
            password: values.password,
          }
        );


        const { redirectUrl, id } = response.data;

        localStorage.setItem("Id", id);

        navigate(redirectUrl);
      } catch (e: any) {
        toast.error(e.error || "something went wrong");
      }

      toast.dismiss(loggingIn);
    } catch (error: any) {
      toast.dismiss(loggingIn);
      if (error.response) {
        toast.error(`Error: ${error.response.data}`);
      } else if (error.request) {
        toast.error("No response from the server");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  }

  const handleGoogleSignin = async () => {
    try {
      const loading = toast.loading("signing in");
      const result = await signInWithGooglePopup();
      const user = result.user;
      const email = user.email;
      const password = result.user.uid;

      const response = await axios.post(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/auth/signin`,
        {
          email,
          password: password,
        }
      );


      const { exists, token, id, redirectUrl } = response.data;

      if (exists) {
        toast.dismiss(loading);
        toast.success("Sign in successful!");
        localStorage.setItem("Id", id);
        localStorage.setItem("token", token);
        navigate(redirectUrl);
      } else {
        if (email) {
          toast.dismiss(loading);
          localStorage.setItem("googleEmail", email);
          localStorage.setItem("googlePassword", password);
          toast.info("Please select your category to complete registration");
          navigate("/category");
        }
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error(
          "This email is already registered. Please sign in instead."
        );
      } else {
        toast.error("Sign-in failed. Please try again.");
      }
      console.error("Error during Google sign-in:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      {/* Card Container */}
      <div className="relative flex flex-wrap w-full lg:w-[90%] xl:w-[80%] bg-white shadow-2xl rounded-3xl h-[95vh] overflow-hidden">
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

          <Toaster />

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

        <motion.div
          initial={{ x: "100%", opacity: 0 }} // Starts off-screen to the right
          animate={{ x: 0, opacity: 1 }} // Slides in to its position
          exit={{ x: "-100%", opacity: 0 }} // Slides out to the left
          transition={{ type: "tween", duration: 0.5 }} // Smooth transition
          className="w-full h-full lg:w-1/2 flex flex-col justify-center items-center bg-white my-auto"
        >
          {/* Logo for smaller screens */}

          {/* Sign In Header */}
          <div className="flex flex-col justify-center  rounded-2xl items-center">
            <div className=" w-full">
              <div className=" flex lg:hidden w-full items-center justify-center">
                <img src={logo} alt="" />
              </div>

              <h2 className="lg:flex text-2xl sm:text-3xl lg:text-4xl  mt-20 lg:mt-0  font-medium text-gray-800">
                Welcome Back!
              </h2>

              <p className="text-gray-500 text-sm sm:text-base lg:mt-4 ">
                It's nice to see you again, Ready to connect?
              </p>
            </div>

            <div className=" flex flex-col space-y-4 w-full mt-6 items-center justify-center">
              <input
                type="text"
                className="bg-white border border-gray-500 px-3 py-3 placeholder:text-slate-400 rounded-xl w-full text-gray-800  transition duration-300 ease  focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="Email"
                value={email}
                onChange={(e: any) => {
                  setEmail(e.target.value);
                }}
              />

              <div className="flex flex-row bg-white border border-gray-500  items-center w-full max-w-sm min-w-[200px] mt-5 rounded-xl  transition duration-300 ease  focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow">
                <input
                  className="w-full bg-transparent text-base placeholder:text-slate-400 text-slate-700 px-3 py-3 focus:outline-none"
                  placeholder="Password (8 or more characters)"
                  type={passwordVisiblity ? "text" : "password"}
                  onChange={(e: any) => {
                    setPassword(e.target.value);
                  }}
                  name="password"
                  value={password}
                />
                <div
                  className="px-3 text-slate-400 cursor-pointer"
                  onClick={handlePasswordVisibility}
                >
                  {passwordVisiblity ? <LuEye /> : <LuEyeOff />}
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs sm:text-sm w-full max-w-xs sm:max-w-sm md:max-w-md mt-6">
              <label className="flex items-center text-gray-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <a href="#" className="text-blue-500 hover:underline">
                Forgot password?
              </a>
            </div>

            <div
              onClick={handleLogin}
              className="bg-main rounded-full px-3 py-3 w-full text-center mt-6 cursor-pointer"
            >
              <p className="text-white text-sm">Sign In</p>
            </div>

            <div className="flex items-center mt-8 mb-4">
              <div className="w-32 h-px bg-gradient-to-l from-gray-300 to-white"></div>
              <span className="mx-4 text-gray-500 text-sm">or</span>
              <div className="w-32 h-px bg-gradient-to-r from-gray-300 to-white"></div>
            </div>

            <div className="flex space-x-16">
              <button
                type="button"
                onClick={handleGoogleSignin}
                className="w-10 h-10 flex justify-center items-center rounded-full"
              >
                <img src={googleIcon} alt="Google" className="w-10 h-10" />
              </button>
              <button
                type="button"
                className="w-10 h-10 flex justify-center items-center rounded-full"
              >
                <img src={appleIcon} alt="Apple" className="w-10 h-10" />
              </button>
            </div>

            {/* Sign-Up Link */}
            <p className="text-sm text-gray-600 mt-10">
              Don’t have an account?{" "}
              <a href="/category" className="text-blue-500 hover:underline">
                Create Account
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;
