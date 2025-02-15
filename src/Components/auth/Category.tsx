// components
import doctor from "../../assets/doctorWithPhone.svg";
import whiteLogo from "../../assets/white logo.svg";
import ellipse from "../../assets/Ellipse.svg";
import logo from "../../assets/landing/logo.svg";

import CategoryCard from "./CategoryCard";

//logos

import organisationLogo from "../../assets/organisationlogo.svg";
import doctorLogo from "../../assets/doctorLogo.svg";
import studentLogo from "../../assets/studentLogo.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { getCategoryId } from "../../functions";

function Category() {
  //hooks

  const navigate = useNavigate();

  async function handleCategory(category: string) {
    const googleEmail = localStorage.getItem("googleEmail");
    const googlePassword = localStorage.getItem("googlePassword");

    if (googleEmail && googlePassword) {
      try {
        const response = await axios.post(`https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/auth/signup`, {
          email: googleEmail,
          password: googlePassword,
          category: category,
        });
        const userId = response.data.user.id;
        // Clear temporary Google data
        localStorage.removeItem("googleEmail");
        localStorage.removeItem("googlePassword");
        localStorage.setItem("Id" , userId);
        // Navigate to appropriate signup form
        navigate(`/signup/student/profile/name/${userId}`, { state: userId });
      } catch (e) {
        toast.error("Failed to create account");
        console.error(e);
      }
    } else {
      // Handle regular navigation to signup
      localStorage.setItem("category", category);
      navigate(`/signup`, { state: { id: getCategoryId(category) } });
    }
  }

  // handling category clicks

  function handleOrganisation() {
    handleCategory("organisation");
  }

  function handleDoctor() {
    handleCategory("doctor");
  }

  function handleStudent() {
    handleCategory("student");
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
        <div className=" px-8 sm:px-32  lg:px-16 xl:px-24  w-full h-full lg:w-1/2 flex flex-col justify-center items-center bg-white my-auto ">
          <div className="bg-white flex flex-col items-center justify-center rounded-lg w-full ">
            <div className="w-full">
              <div className=" flex lg:hidden w-full items-center justify-center">
                <img src={logo} alt="" />
              </div>

              <h2 className="lg:flex text-2xl sm:text-3xl lg:text-4xl  mt-20 lg:mt-0  font-medium text-gray-800">
                What describes you?
              </h2>

              <p className="text-gray-500 text-sm sm:text-base lg:mt-4 ">
                please select your role to join vibrant medical community.
              </p>
            </div>

            <CategoryCard
              title="Doctor"
              subtitle="Medical Professionals and practitioners"
              icon={doctorLogo}
              onClick={handleDoctor}
            />
            <CategoryCard
              title="Medical Student"
              subtitle="Future Healthcare Leaders and Innovaters"
              icon={studentLogo}
              onClick={handleStudent}
            />
            <CategoryCard
              title="Organisation"
              subtitle="Hospitals, Colleges and Societies"
              icon={organisationLogo}
              onClick={handleOrganisation}
            />

            <p className="text-sm text-gray-600 mt-8">
              Already have an account?{" "}
              <a href="/signin2" className="text-blue-500 hover:underline">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Category;
