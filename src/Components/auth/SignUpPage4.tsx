import React, { useState } from "react";
import docsilelogo from "../../assets/landing/logo.svg";
import loginprofile from "../../assets/icon/loginprofile.svg";
import loginprofpic from "../../assets/icon/loignprofpic.svg";
import plus from "../../assets/icon/plus.svg";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUpPage4: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [src , setSrc] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSrc(reader.result as string)
        setImage(file);

      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSrc(null)
    setImage(null); // Remove uploaded image
  };

  const userid = localStorage.getItem("Id") || ""
  const id = parseInt(userid)
  const navigate = useNavigate()

  async function handleFinish(e: React.FormEvent){
    e.preventDefault();

    if(!image){
      toast.error("please select image")
    }

    const loading = toast.loading("Done, let's get to your network")

    try{

      const {data} = await  axios.get(`https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/uploads/url`);

      console.log(data)
      await axios.put(data.uploadURL, image, {
        headers: { 
          "Content-Type": image?.type || " " 
        },
        withCredentials: false
      });

      const response = await axios.post(`https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/user/update-profile-picture/${id}`, {
        imageUrl : data.imageURL
      })

      console.log(response)

      toast.dismiss(loading)
      if(response){
        navigate("/feed")
      }


    }catch(e : any){
      toast.dismiss(loading)
      toast.error(e.message)
      console.log(e)
    }



  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-full font-fontsm ">
      {/* Left Section (Hidden on Small Screens) */}
      <div className="hidden md:flex  flex-1 justify-center items-center pl-8  bg-white">
        <div className="text-center max-w-lg">
          <p className="mt-4 mb-14 text-xl  text-balance text-maincl">
            Upload your photo to enhance your profile and build meaningful
            connections!{" "}
          </p>
          <div className="lg:p-8">
            <img
              src={loginprofile}
              alt="Medical Network"
              className="w-[70%] flex-shrink max-w-md mx-auto "
            />
          </div>
        </div>
      </div>

      <Toaster/>

      {/* Right Section (Always Visible) */}
      <div className="flex flex-1 justify-start items-center lg:pr-4 p-2  ">
        <div className="w-full max-w-lg bg-white shadow-xl border border-gray-200  rounded-3xl p-6 flex flex-col justify-center lg:max-h-[90%] max-h-[80%]   lg:p-24 h-[90vh] my-auto ">
          <div className="flex items-center  text-center mb-14 lg:mb-10 w-full">
            <img
              src={docsilelogo}
              alt="Docsile Logo"
              className="w-52 mr-2"
            />
          
          </div>
          <h2 className="lg:text-md text-lg   text-gray-800 mb-4">
            Upload profile photo
          </h2>
          <p className="text-xs text-gray-600 mb-6">
            Upload your best shot! A clear profile picture helps others
            recognize you.
          </p>
          <div>
            <div className="flex justify-center items-center">
              {/* Profile Upload Section */}
              <div className="relative mt-6 mb-6 w-32 h-32 ">
                <label htmlFor="file-input" className="cursor-pointer ">
                  <img
                    src={src || loginprofpic} // Default image when no file is uploaded
                    alt="Profile"
                    className="w-32 h-32 rounded-full border border-gray-300 object-cover"
                  />

                  <img
                    src={image ? "" : plus}
                    className="absolute bottom-0  right-0"
                    alt=""
                  />
                  {/* Upload Icon */}
                </label>
                {image && (
                  <button
                    onClick={removeImage}
                    className="absolute top-0 right-0 bg-gray-600 text-white w-6 h-6 flex items-center justify-center rounded-full shadow-md hover:bg-red-700"
                  >
                    ✕
                  </button>
                )}
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <button
            onClick={handleFinish}
              type="submit"
              className="w-full bg-maincl text-white p-3 mt-10 rounded-3xl hover:bg-fillc transition"
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage4;
