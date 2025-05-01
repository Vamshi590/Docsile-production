import React, { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import backbutton from "../../assets/icon/backbutton.svg";
import more1 from "../../assets/icon/more1.svg";
import pmessage from "../../assets/icon/pmessage.svg";
import { FaLink } from "react-icons/fa";
import { Header } from "../common/Header";
import location from "../../assets/icon/location.svg";
import edit from "../../assets/icon/edit.svg";
import arrowright from "../../assets/icon/arrowright.svg";
import PostCard from "./PostCard";
import QuestionCard from "./QuestionCard";
import experience from "../../assets/icon/experience.svg";
import education from "../../assets/icon/education.svg";
import profile from "../../assets/icon/profile.svg";
import membership1 from "../../assets/icon/membership.svg";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, Toaster } from "sonner";



interface Workplace {
  id: number;
  organization: string;
  img: string;
}



interface Question {
  id: string;
  title: string;
  content: string;
  images: string[];
  question: string;
  question_description: string;
  question_image_links: string[];
  answers: number;
  shares: number;
  _count: {
    likes: number;
    answers: number;
  }
  author: {
    image: string;
    name: string;
    title: string;
  };
  timeAgo: string;
}




const ViewProfile: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);



  const [activeTab, setActiveTab] = useState("about");

  const [expanded, setExpanded] = useState(false);
  const [interestsexpanded, setInterestsExpanded] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [showAllCertifications, setShowAllCertifications] = useState(false);


  const [activeDesktopTab, setActiveDesktopTab] = useState<string>("activity");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // State for follow button
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setActiveDesktopTab("about");

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tabs = ["About", "Activity", "Memberships"];
  const Desktoptabs = ["About", "Activity", "Memberships"];

  const profileData = {
    name: "Seelam Vamshidhar Goud",
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/1d6a37aa68c806868e46fc0d99e42c21115610fa1b71c977a03eb08090c9e74c",
    role: "Ophthalmologist | AIIMS Delhi | Aspiring Medical Professional",
    locationText: "Mumbai, Maharashtra, India",
    followers: 546,
    following: 478,
    posts: 5,
    profileLink: "profile.seelam.vamshidhar.goud",
    isMentorAvailable: true,
  };



  const aboutText =
    "An experienced ophthalmologist passionate about advancing care through sustainable eye care. Specializing in cataract and refractive surgery with a focus on advanced surgical ophthalmology. I combine cutting-edge technology with a patient-centered approach...";




  const workplaces: Workplace[] = [
    {
      id: 1,
      organization: "Aravind Eye Hospital, Madurai, Tamil Nadu",
      img: "https://cdn.builder.io/api/v1/image/assets/TEMP/e6f21b8e48966c867e6781375245b708b2595a844a18bfe5cb5ae20e42019372?placeholderIfAbsent=true&apiKey=90dc9675c54b49f9aa0dc15eba780c08",
    },
    {
      id: 2,
      organization: "All India Institute of Medical Sciences, Delhi",
      img: "https://cdn.builder.io/api/v1/image/assets/TEMP/e6f21b8e48966c867e6781375245b708b2595a844a18bfe5cb5ae20e42019372?placeholderIfAbsent=true&apiKey=90dc9675c54b49f9aa0dc15eba780c08",
    },
  ];

  const questions: Question[] = [
    {
      id: "1",
      title: "Latest advancements in cataract surgery techniques?",
      question: "vsd",
      question_description: "fgfdgg",
      question_image_links: ["sdafgdfg"],
      _count: {
        likes: 12,
        answers: 12
      },
      content:
        "I'm interested in learning about the newest developments in cataract surgery. What are the most promising techniques being used or researched currently?",
      images: [
        "https://cdn.builder.io/api/v1/image/assets/TEMP/1f352924c9d23559e8c19e6d726091def0f7346d30feaddbf142d2c74bc2e05e?placeholderIfAbsent=true&apiKey=90dc9675c54b49f9aa0dc15eba780c08",
        "https://cdn.builder.io/api/v1/image/assets/TEMP/3179d893d2c64d78a71042d4bbe19d82929393a4cc746e57df0407426f7a4992?placeholderIfAbsent=true&apiKey=90dc9675c54b49f9aa0dc15eba780c08",
        "https://cdn.builder.io/api/v1/image/assets/TEMP/bacdf5b5cd530c209ad1b1cdb72874c3b55ba49a818704cd3a277725a590f529?placeholderIfAbsent=true&apiKey=90dc9675c54b49f9aa0dc15eba780c08",
        "https://cdn.builder.io/api/v1/image/assets/TEMP/6939df2c7edaf176e0907ced793a5e28a1df342e59d4610b8999ddc4aed782a9?placeholderIfAbsent=true&apiKey=90dc9675c54b49f9aa0dc15eba780c08",
      ],
      answers: 12,
      shares: 8,
      author: {
        image:
          "https://cdn.builder.io/api/v1/image/assets/TEMP/1d6a37aa68c806868e46fc0d99e42c21115610fa1b71c977a03eb08090c9e74c",
        name: "Dr. Seelam Vamshidhar",
        title: "Ophthalmologist | AIIMS Delhi",
      },
      timeAgo: "2 days ago",
    },



  ];



  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const ActivitySection = () => (
    <div className="space-y-3 mt-3 bg-mainbg">
      {/* Posts Section */}
      <div className=" bg-white relative group rounded-2xl p-2">
        <div className="flex bg-white justify-between items-center ">
          <h2 className="text-xl p-4 font-medium">
            Posts{" "}
            <span className="text-gray-500 text-md"> ({userDetails?.posts?.length})</span>
          </h2>
          {userDetails?.posts?.length > 1 && (
            <button
              onClick={() => setShowAllPosts(!showAllPosts)}
              className="text-fillc text-sm font-medium flex items-center gap-1"
            >
              {showAllPosts ? "Show Less" : "See all Posts"}
              <img
                src={arrowright}
                alt=""
                className={`transform ${showAllPosts ? "rotate-180" : ""
                  } w-4 h-4`}
              />
            </button>
          )}
        </div>

        {userDetails?.posts?.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">
              No posts yet. Share your first post to start engaging with your
              network!
            </p>
            <button className="mt-4 px-4 py-2 bg-maincl text-white rounded-full text-sm hover:bg-fillc">
              Create Post
            </button>
          </div>
        ) : (
          <div className="relative">
            <div
              id="posts-scroll-container"
              className={`flex ${showAllPosts ? "overflow-x-auto" : "overflow-x-hidden"
                } scroll-smooth`}
              style={{
                scrollSnapType: "x mandatory",
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <div className="flex gap-4 transition-transform duration-300">
                {userDetails?.posts?.map((post: any) => (
                  <div
                    key={post.id}
                    className="w-[450px] flex-none"

                  >
                    <PostCard
                      userTitle={`${userDetails?.department} | ${userDetails?.specialisation_field_of_study}`}
                      userImage={userDetails?.profile_picture}
                      userName={userDetails?.name}
                      postTitle={post.title}
                      timeAgo={post.time}
                      content={post.descreption}
                      likes={post._count.likes}
                      reposts={0}
                      comments={post._count.comments}
                      images={post.postImageLinks && post.postImageLinks.length > 0 ? post.postImageLinks : ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=600&q=80"]}
                      shares={0}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Questions Section */}
      <div className="mb-8 relative group">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">
            Questions{" "}
            <span className="text-gray-500 text-md"> ({questions.length})</span>
          </h2>
          {questions.length > 1 && (
            <button
              onClick={() => setShowAllQuestions(!showAllQuestions)}
              className="text-fillc text-sm font-medium flex items-center gap-1"
            >
              {showAllQuestions ? "Show Less" : "See all Questions"}
              <img
                src={arrowright}
                alt=""
                className={`transform ${showAllQuestions ? "rotate-180" : ""
                  } w-4 h-4`}
              />
            </button>
          )}
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">
              No questions yet. Ask your first question to start engaging with
              your network!
            </p>
            <button className="mt-4 px-4 py-2 bg-maincl text-white rounded-full text-sm hover:bg-fillc">
              Ask Question
            </button>
          </div>
        ) : (
          <div className="relative">
            <div
              id="questions-scroll-container"
              className={`flex ${showAllQuestions ? "overflow-x-auto" : "overflow-x-hidden"
                } scroll-smooth`}
              style={{
                scrollSnapType: "x mandatory",
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <div className="flex gap-4 pb-4 transition-transform duration-300">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="w-[calc(52%)] flex-none"
                    style={{
                      scrollSnapAlign: "start",
                    }}
                  >
                    <QuestionCard
                      userImage={question.author.image}
                      userName={question.author.name}
                      userTitle={question.author.title}
                      timeAgo={question.timeAgo}
                      questionTitle={question.title}
                      questionContent={question.content}
                      images={question.images}
                      answers={question.answers}
                      shares={question.shares}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>


    </div>
  );

  //backend

  const { id } = useParams() || ""; // Get user ID from URL params
  const userid = localStorage.getItem("Id");

  useEffect(() => {
    if (userid) {
      fetchUserData(id || "");
    }
  }, [id]);

  const [userDetails, setUserDetails] = useState<any>(
    localStorage.getItem("User")
  );

  const fetchUserData = async (userId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/profile/${userId}`
      );
      console.log(response.data.data);
      setUserDetails(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data: ", error);
      setLoading(false);
    }
  };



  async function handleFollowClick(followingId: string) {

    try {
      const response = await axios.post(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/follow/${userid}/${followingId}`
      );

      const invalidateCache = await axios.post(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/connections/${userid}/invalidate-cache`
      );

      console.log("Invalidate cache response:", invalidateCache);
      if(response){
        setIsFollowLoading(false);
        setIsFollowing(true);
      }
     
    } catch (error) {
      toast.error("Failed to follow user");
      console.error(error);
    }
  }


  return (
    <div className="min-h-screen font-fontsm mx-auto bg-mainbg ">
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-white">
          <DotLoader color="#1E40AF" size={50} />
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      )}
      {/* Mobile Header - Only visible on mobile */}
      <div className="lg:hidden flex items-center justify-between p-4  bg-white ">
        <div className="flex items-center gap-3">
          <img src={backbutton} alt="" className="w-5" />
          <span className="text-xl font-medium text-maincl ">Profile</span>
        </div>
        <div className="flex items-center gap-4">
          <img src={pmessage} alt="" />
          <button className="w-8 h-8">
            <img
              src={more1}
              alt="Profile"
              className="w-full h-full rounded-full"
            />
          </button>
        </div>
      </div>

      <Toaster />
      {/* Desktop Header - Only visible on desktop */}
      <div className="hidden lg:block bg-white border-b sticky top-0 z-50">
        <Header
    
        />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl lg:max-w-7xl mx-auto px-4  bg-mainbg  lg:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 lg:gap-6 ">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-3 py-2  ">
            <div className="  ">
              <div className="flex flex-col  items-center text-center">
                <div className="lg:border p-3 lg:py-8 bg-white shadow-sm rounded-xl w-full border-gray-200">
                  <div className="flex flex-row lg:flex-col   items-center">


                    <div className="relative shrink-0 ">
                      <img
                        src={userDetails?.profile_picture || profile}
                        alt="Profile"
                        className=" w-20 h-20 md:w-28 md:h-28 shrink-0 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col lg:items-center lg:space-y-2">
                      <h1 className=" text-lg font-semibold text-gray-900 lg:mt-2 ">
                        {userDetails?.name}
                      </h1>

                      <p className="text-gray-600 px-2 text-sm lg:text-center text-left">
                        {`${userDetails?.department} | ${userDetails?.organisation_name} | ${userDetails?.specialisation_field_of_study}`}
                      </p>
                      <p className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1">
                        <img src={location} alt="" className="w-4" />
                        {userDetails?.city}
                      </p>
                    </div>
                  </div>

                  <div className="hidden lg:block">
                    <div className="flex justify-between  mt-6 mx-3">
                      <div className="text-center">
                        <div className="font-semibold text-sm text-fillc">
                          0
                        </div>
                        <div className="text-sm text-gray-700">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-sm text-fillc">
                          {userDetails?.posts?.length}
                        </div>
                        <div className="text-sm text-gray-700">Posts</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-sm text-fillc">
                          {userDetails?.questions?.length}
                        </div>
                        <div className="text-sm text-gray-700">Questions</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 w-full text-sm  font-normal">
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        if (isFollowLoading || isFollowing) return;
                        setIsFollowLoading(true);
                        await handleFollowClick(id || "");
                       
                      }}
                      className={`px-3 py-1 rounded-3xl font-medium flex items-center justify-center gap-2 ${isFollowing ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-maincl text-white hover:bg-fillc'}`}
                      disabled={isFollowLoading || isFollowing}
                    >
                      {isFollowLoading ? (
                        <DotLoader color="#fff" size={18} />
                      ) : isFollowing ? (
                        'Request sent'
                      ) : (
                        'Follow'
                      )}
                    </button>
                    <button className="flex justify-center px-3 py-1 border rounded-3xl hover:bg-gray-50">
                      Message
                    </button>
                  </div>
                </div>

                <div className="w-full bg-white rounded-xl lg:hidden sm:block max-w-4xl mx-auto relative mt-2 h-[180px] overflow-hidden ">
                  {/* First Custom Section */}
                  <div
                    className={`absolute border rounded-xl   p-4 w-full h-full transform transition-transform duration-700 ease-in-out ${activeIndex === 0 ? "translate-x-0" : "-translate-x-full"
                      }`}
                  >
                    <div className=" ">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-semibold">About</h2>
                        <button className="text-gray-500">
                          <img src={edit} alt="edit" className="w-5 h-5" />
                        </button>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 ">{aboutText}</p>
                      </div>
                    </div>
                  </div>



                  {/* Third Custom Section */}
                  <div
                    className={`absolute  w-full h-full transform transition-transform duration-700 ease-in-out ${activeIndex === 2
                      ? "translate-x-0"
                      : activeIndex < 2
                        ? "translate-x-full"
                        : "-translate-x-full"
                      }`}
                  >
                    <div className="p-4 border h-[200px] border-gray-200 rounded-lg">
                      {/* recent positions */}
                      <div className="flex flex-col items-center gap-2 pt-2 border-b last:border-none  pb-">
                        <div className="flex items-center justify-between w-full">
                          <p className="text-sm">Recent positions</p>
                          <img src={edit} alt="" />
                        </div>

                        {workplaces.map((work) => (
                          <div
                            key={work.id}
                            className="flex justify-start items-center  gap-3 mb-2"
                          >
                            <img
                              src={work.img}
                              alt={work.organization}
                              className="w-8 h-8 rounded-full"
                            />
                            <p className="text-sm text-left">
                              {work.organization}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Dots */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {[0, 1, 2].map((index) => (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`w-1 h-1 rounded-full transition-colors duration-300 ${index === activeIndex ? "bg-maincl" : "bg-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                </div>


                {/* Mentorship Section */}
                {profileData.isMentorAvailable && (
                  <div className="w-full bg-white mt-4 rounded-xl shadow-sm border border-gray-100 hidden lg:block overflow-hidden">
                    <div className="p-3 border-l-4 border-maincl">
                      <div className="flex items-start">
                        <div className="mr-2 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-maincl" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 mb-1 text-start ">
                            <span className="font-medium">{userDetails.name}</span> is available as a mentor
                          </p>
                          <div className="flex justify-between items-center">
                            <button className="text-xs text-maincl hover:text-fillc font-medium transition-colors py-1">
                              Apply for mentorship
                            </button>
                            <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                              <img src={arrowright} alt="Arrow" className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Profile Link */}
                <div className="mt-3 w-full text-left bg-white border border-gray-100 rounded-xl shadow-sm hidden lg:block overflow-hidden">
                  <div className="p-3 border-l-4 border-maincl">
                    <div className="flex items-start">
                      <div className="mr-2 mt-0.5">
                        <FaLink className="h-4 w-4 text-maincl" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-700">Profile Link</p>
                          <div className="text-xs bg-gray-50 text-maincl px-2 py-0.5 rounded-full">Public</div>
                        </div>

                        <div className="flex items-center justify-between bg-gray-50 rounded-lg overflow-hidden border border-gray-100 group">
                          <p className="text-sm text-gray-600 px-3 py-2 overflow-hidden whitespace-nowrap overflow-ellipsis flex-grow">
                            {`www.docsile.com/profile/${userid}`}
                          </p>
                          <button
                            className="bg-gray-100 group-hover:bg-gray-200 px-2.5 py-2 text-gray-600 group-hover:text-maincl transition-colors"
                            onClick={() => {
                              navigator.clipboard.writeText(`www.docsile.com/profile/${userid}`);
                              const el = document.getElementById('copy-tooltip');
                              if (el) {
                                el.classList.remove('opacity-0');
                                el.classList.add('opacity-100');
                                setTimeout(() => {
                                  el.classList.remove('opacity-100');
                                  el.classList.add('opacity-0');
                                }, 2000);
                              }
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                            </svg>
                            <div id="copy-tooltip" className="absolute -mt-8 right-4 transition-opacity duration-300 opacity-0 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                              Copied!
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-9">
            {/* Mobile Tabs - Only visible on mobile */}
            <div className="lg:hidden border-b bg-white rounded-xl">
              <div className="flex overflow-x-hidden no-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`px-4 py-3 text-sm whitespace-nowrap ${activeTab === tab.toLowerCase()
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : "text-gray-500"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg  lg:hidden">
              {/* Show ActivitySection for both mobile and desktop when activity tab is active */}
              {(activeTab === "activity" ||
                (!isMobile && activeDesktopTab === "activity")) && (
                  <ActivitySection />
                )}
            </div>

            <div className="rounded-lg shadow-sm">
              {/* Content Sections */}
              <div className="divide-">
                {/* tabs for the desktop */}
                <div className=" mt-2 mb-6">
                  <div className="border-b hidden lg:block bg-white rounded-xl">
                    <div className="flex space-x-8">
                      {Desktoptabs.map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveDesktopTab(tab.toLowerCase())}
                          className={`px-4 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${activeDesktopTab === tab.toLowerCase()
                            ? "border-maincl text-maincl"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab content sections will be added here later */}

                  <div className="mt-2 lg:mt-3">
                    {(activeDesktopTab === "About" ||
                      activeDesktopTab === "about") && (
                        <div>
                          {/* About Section - Only visible when About tab is active on mobile */}
                          <div
                            className={`${activeTab === "about" || activeTab === "About"
                              ? "block"
                              : "hidden lg:block"
                              }`}
                          >
                            <div className="p-6 border bg-white border-gray-200 rounded-xl my-3 ">
                              <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-medium">About</h2>
                              </div>
                              <p className="text-gray-600">{aboutText}</p>
                            </div>
                          </div>

                          {/* Experience Section */}
                          {userDetails?.professionalExperience?.length > 0 && (
                            <div
                              className={`p-6 border bg-white border-gray-100 rounded-xl mt-3 group relative ${activeTab === "about" || activeTab === "About"
                                ? "block"
                                : "hidden lg:block"
                                }`}
                            >
                              <div className="flex gap-4 justify-between items-center mb-6">
                                <h2 className="text-xl font-medium">Experience</h2>
                                <div className="flex items-center gap-4"></div>
                              </div>

                              <div className="relative">

                                <>
                                  {/* Desktop View */}
                                  <div className="hidden lg:block">
                                    {userDetails?.professionalExperience?.length > 3 && (
                                      <>
                                        <button
                                          className="absolute left-0 top-1/3 z-50 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
                                          onClick={() => {
                                            const container =
                                              document.getElementById(
                                                "experience-scroll"
                                              );
                                            if (container)
                                              container.scrollLeft -= 300;
                                          }}
                                        >
                                          <img
                                            src={arrowright}
                                            alt="Previous"
                                            className="w-4 h-4 transform rotate-180"
                                          />
                                        </button>
                                        <button
                                          className="absolute right-0 top-1/3 -translate-y-1/2 z-10 bg-gray-200 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
                                          onClick={() => {
                                            const container =
                                              document.getElementById(
                                                "experience-scroll"
                                              );
                                            if (container)
                                              container.scrollLeft += 300;
                                          }}
                                        >
                                          <img
                                            src={arrowright}
                                            alt="Next"
                                            className="w-4 h-4"
                                          />
                                        </button>
                                      </>
                                    )}

                                    <ol
                                      id="experience-scroll"
                                      className="flex overflow-x-hidden no-scrollbar scroll-smooth"
                                    >
                                      {userDetails?.professionalExperience?.map((exp: any, index: number) => (
                                        <li
                                          key={index}
                                          className="relative flex-none w-72 mb-6 mr-8 last:mr-0"
                                        >
                                          <div className="flex items-center">
                                            <div className="z-10 flex items-center justify-center w-12 h-12 bg-white rounded-full ring-0 ring-white sm:ring-8 shrink-0 overflow-hidden border-2 border-gray-100">
                                              <img
                                                src={exp.img || experience}
                                                alt={`${exp.company} logo`}
                                                className="w-12 h-12 object-cover"
                                              />
                                            </div>
                                            {index < userDetails?.professionalExperience?.length - 1 && (
                                              <div className="hidden sm:flex w-full bg-gray-200 h-0.5"></div>
                                            )}
                                          </div>
                                          <div className="mt-3 sm:pe-8 relative">
                                            <h3 className="text-sm w-72 overflow-hidden text-ellipsis whitespace-wrap font-medium text-black">
                                              {exp.title}
                                            </h3>
                                            <p className="text-sm font-light text-gray-900">
                                              {exp.organisation}
                                            </p>
                                            <time className="block  text-xs font-normal text-gray-900">
                                              {exp.startDate}
                                            </time>
                                            {exp.description && (
                                              <p className="text-xs font-normal text-gray-900">
                                                {exp.description}
                                              </p>
                                            )}
                                            <p className=" text-xs font-normal text-gray-900">
                                              {exp.location}
                                            </p>
                                          </div>
                                        </li>
                                      ))}
                                    </ol>
                                  </div>

                                  {/* Mobile View */}
                                  <div className="lg:hidden flex flex-col space-y-8">
                                    {userDetails?.professionalExperience
                                      ?.slice(0, expanded ? userDetails?.professionalExperience?.length : 3)
                                      ?.map((exp: any, index: number) => (
                                        <div
                                          key={index}
                                          className="flex items-start gap-4"
                                        >
                                          <div className="flex-shrink-0">
                                            <img
                                              src={exp.img || experience}
                                              alt={`${exp.company} logo`}
                                              className="w-12 h-12 rounded-full border-2 border-gray-100"
                                            />
                                          </div>
                                          <div className="flex-grow relative">
                                            <h3 className="text-sm font-normal text-gray-900">
                                              {exp.title}
                                            </h3>
                                            <p className="text-xs font-light text-gray-600">
                                              {exp.organisation}
                                            </p>
                                            <time className="block text-xs font-normal text-gray-500">
                                              {exp.date}
                                            </time>
                                            {exp.description && (
                                              <p className="text-sm font-normal text-gray-500">
                                                {exp.description}
                                              </p>
                                            )}
                                            <p className="text-xs font-normal text-gray-500">
                                              {exp.location}
                                            </p>
                                          </div>
                                        </div>
                                      ))}

                                    {userDetails?.professionalExperience?.length > 3 && (
                                      <button
                                        onClick={() => setExpanded(!expanded)}
                                        className="text-fillc text-sm font-medium flex items-center gap-1 lg:hidden"
                                      >
                                        {expanded
                                          ? "Show Less"
                                          : "See all Experience"}
                                        <img
                                          src={arrowright}
                                          alt=""
                                          className={`transform ${expanded ? "rotate-180" : ""
                                            } w-4 h-4`}
                                        />
                                      </button>
                                    )}
                                  </div>
                                </>
                                
                              </div>
                            </div>


                          )}

                          {/* Education Section */}

                          {userDetails?.education?.length > 0 && (
                            <div
                              className={`p-6 border bg-white border-gray-100 rounded-xl overflow-hidden mt-3 group relative ${activeTab === "about" || activeTab === "About"
                                ? "block"
                                : "hidden lg:block"
                                }`}
                            >
                              <div className="flex gap-4  justify-between items-center mb-6">
                                <h2 className="text-xl  font-medium">Education</h2>
                              </div>

                              <div className="relative">
                                {userDetails?.education?.length === 0 ? (
                                  <div className="text-center py-8">
                                    <p className="text-gray-600 text-sm">
                                      Adding your educational background will help
                                      demonstrate your qualifications and expertise,
                                      making your profile more well-rounded and
                                      informative!
                                    </p>
                                  </div>
                                ) : (
                                  <>
                                    {/* Desktop View */}
                                    <div className="hidden lg:block">
                                      {/* Left scroll button - Only show if more than 3 items */}
                                      {userDetails?.education?.length > 3 && (
                                        <button
                                          className="absolute left-0 top-1/3 z-50 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
                                          onClick={() => {
                                            const container =
                                              document.getElementById(
                                                "education-scroll"
                                              );
                                            if (container)
                                              container.scrollLeft -= 300;
                                          }}
                                        >
                                          <img
                                            src={arrowright}
                                            alt="Previous"
                                            className="w-4 h-4 transform rotate-180"
                                          />
                                        </button>
                                      )}

                                      {/* Right scroll button - Only show if more than 3 items */}
                                      {userDetails?.education?.length > 3 && (
                                        <button
                                          className="absolute right-0 top-1/3 -translate-y-1/2 z-10 bg-gray-200 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
                                          onClick={() => {
                                            const container =
                                              document.getElementById(
                                                "education-scroll"
                                              );
                                            if (container)
                                              container.scrollLeft += 300;
                                          }}
                                        >
                                          <img
                                            src={arrowright}
                                            alt="Next"
                                            className="w-4 h-4"
                                          />
                                        </button>
                                      )}

                                      <ol
                                        id="education-scroll"
                                        className="flex overflow-x-hidden no-scrollbar scroll-smooth"
                                      >
                                        {userDetails?.education?.map((edu: any, index: number) => (
                                          <li
                                            key={index}
                                            className="relative flex-none w-72 mb-6 mr-8 last:mr-0"
                                          >
                                            <div className="flex items-center">
                                              <div className="z-10 flex items-center justify-center w-12 h-12 bg-white rounded-full ring-0 ring-white sm:ring-8 shrink-0 overflow-hidden border-2 border-gray-100">
                                                <img
                                                  src={edu.logo || education}
                                                  alt={`${edu.institution} logo`}
                                                  className="w-12 h-12 object-cover"
                                                />
                                              </div>
                                              {index < userDetails?.education?.length - 1 && (
                                                <div className="hidden sm:flex w-full bg-gray-200 h-0.5"></div>
                                              )}
                                            </div>
                                            <div className="mt-3 sm:pe-8 relative">
                                              <h3 className="text-sm w-72 overflow-hidden text-ellipsis whitespace-wrap font-normal text-gray-900">
                                                {edu.schoolName}
                                              </h3>
                                              <p className="text-xs font-light text-gray-900 line-clamp-1">
                                                {edu.degree}
                                              </p>
                                              <p className="text-xs  text-gray-900 line-clamp-1">
                                                {edu.department}
                                              </p>
                                              <time className="block text-xs font-normal text-gray-900">
                                                {edu.startDate}
                                              </time>
                                              <p className="text-xs font-light text-gray-900 line-clamp-1">
                                                {edu.grade}
                                              </p>

                                            </div>
                                          </li>
                                        ))}
                                      </ol>
                                    </div>

                                    {/* Mobile View */}
                                    <div className="lg:hidden flex flex-col space-y-8">
                                      {userDetails?.education
                                        ?.slice(
                                          0,
                                          expanded ? userDetails?.education?.length : 3
                                        )
                                        ?.map((edu: any, index: number) => (
                                          <div
                                            key={index}
                                            className="flex items-start gap-4"
                                          >
                                            <div className="flex-shrink-0">
                                              <img
                                                src={edu.logo || education}
                                                alt={`${edu.institution} logo`}
                                                className="w-12 h-12 rounded-full border-2 border-gray-100"
                                              />
                                            </div>
                                            <div className="flex-grow relative">
                                              <h3 className="text-sm font-normal text-gray-900">
                                                {edu.schoolName}
                                              </h3>
                                              <p className="text-xs font-light text-gray-600 line-clamp-1 ">
                                                {edu.degree}
                                              </p>
                                              <p className="text-xs  text-gray-700 line-clamp-1">
                                                {edu.department}
                                              </p>
                                              <p className="text-xs font-light text-gray-700 line-clamp-1">
                                                {edu.grade}
                                              </p>
                                              <time className="block text-xs font-normal text-gray-500">
                                                {edu.startDate}
                                              </time>
                                            </div>
                                          </div>
                                        ))}

                                      {/* Show "See all" button only on mobile if more than 3 items */}
                                      {userDetails?.education?.length > 3 && (
                                        <button
                                          onClick={() => setExpanded(!expanded)}
                                          className="text-fillc text-sm font-medium flex items-center gap-1 lg:hidden"
                                        >
                                          {expanded
                                            ? "Show Less"
                                            : "See all Education"}
                                          <img
                                            src={arrowright}
                                            alt=""
                                            className={`transform ${expanded ? "rotate-180" : ""
                                              } w-4 h-4`}
                                          />
                                        </button>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          )}

                          {(userDetails?.skill?.length > 0 || userDetails?.certifications?.length > 0) && (

                            <div
                              className={`flex flex-col mt-3 lg:flex-row gap-3 lg:gap-6 ${activeTab === "about" || activeTab === "About"
                                ? "block"
                                : "hidden lg:block"
                                }`}
                            >
                              {/* Areas of Interest Card */}
                              <div className="w-full lg:w-1/2 flex flex-col justify-between bg-white  rounded-xl p-6">
                                <div>
                                  <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-medium">Skills</h2>
                                  </div>

                                  {/* Interest List */}
                                  {userDetails?.skills?.length === 0 ? (
                                    <div className="text-center py-8">
                                      <p className="text-gray-600 text-sm">
                                        Adding your skills will help showcase your
                                        expertise and strengths, making your profile
                                        more personalized and impactful!
                                      </p>
                                    </div>
                                  ) : (
                                    <ul className="space-y-3">
                                      {userDetails?.skills
                                        ?.slice(
                                          0,
                                          interestsexpanded
                                            ? userDetails?.skills?.length
                                            : 4
                                        )
                                        ?.map((interest: any, index: number) => (
                                          <li
                                            key={index}
                                            className="border-b py-2 last:border-none"
                                          >
                                            <div className="flex justify-between items-center">
                                              <p className="text-sm text-gray-600">
                                                {interest.skill}
                                              </p>
                                            </div>
                                          </li>
                                        ))}
                                    </ul>
                                  )}
                                </div>

                                {/* Footer Link - Only show if there are more than 4 interests */}
                                {userDetails?.skills?.length > 4 && (
                                  <button
                                    onClick={() =>
                                      setInterestsExpanded(!interestsexpanded)
                                    }
                                    className="mt-4 text-blue-600 text-sm font-medium cursor-pointer flex items-center gap-1"
                                  >
                                    {interestsexpanded ? "Show Less" : "See Skills"}{" "}
                                    →
                                  </button>
                                )}
                              </div>

                              {/* Licenses and Certification Card */}
                              <div
                                className={`w-full lg:w-1/2 bg-white  rounded-xl p-6 ${activeTab === "about" || activeTab === "About"
                                  ? "block"
                                  : "hidden lg:block"
                                  }`}
                              >
                                <div className="flex justify-between items-center mb-4">
                                  <h2 className="text-lg font-medium">
                                    Licenses and Certification
                                  </h2>
                                </div>

                                {/* Certification List */}
                                {userDetails?.certifications?.length === 0 ? (
                                  <div className="text-center py-8">
                                    <p className="text-gray-600 text-sm">
                                      Including your licenses and certifications
                                      highlights your expertise and qualifications,
                                      boosting your profile's credibility and
                                      professionalism.
                                    </p>
                                  </div>
                                ) : (
                                  <>
                                    <ul className="space-y-4">
                                      {userDetails?.certifications
                                        ?.slice(
                                          0,
                                          showAllCertifications
                                            ? userDetails?.certifications?.length
                                            : 2
                                        )
                                        ?.map((cert: any) => (
                                          <li
                                            key={cert.id}
                                            className="border-b pb-2 last:border-none"
                                          >
                                            <div className="flex items-start gap-4 relative">
                                              <div className="w-12 h-12 bg-gray-200 rounded-full">
                                                <img
                                                  src={cert.logo || experience}
                                                  alt={cert.title}
                                                  className="w-full h-full rounded-full"
                                                />
                                              </div>
                                              <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                  <div>
                                                    <p className="font-normal text-sm line-clamp-1">
                                                      {cert.certificateName}
                                                    </p>
                                                    <p className="text-xs font-normal text-gray-700 line-clamp-1">
                                                      {cert.issuingOrganisation}
                                                    </p>
                                                    <p className="text-xs text-gray-700">
                                                      Issued: {cert.issueDate}
                                                    </p>
                                                    <button className="mt-2 px-2 py-1 border text-xs rounded-3xl text-maincl border-gray-200 hover:bg-blue-50">
                                                      Show Credential
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </li>
                                        ))}
                                    </ul>

                                    {/* Footer Link - Only show if there are more than 2 certifications */}
                                    {userDetails?.certifications?.length > 2 && (
                                      <button
                                        onClick={() =>
                                          setShowAllCertifications(
                                            !showAllCertifications
                                          )
                                        }
                                        className="mt-4 text-blue-600 text-sm font-medium cursor-pointer flex items-center gap-1"
                                      >
                                        {showAllCertifications
                                          ? "Show Less"
                                          : "See all Licenses and Certification"}{" "}
                                        →
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>

                          )}




                          {/* Memberships */}
                          {userDetails?.memberships?.length > 0 && (
                            <div
                              className={`bg-white  rounded-xl py-8 lg:px-6 px-4 mt-3 ${activeTab === "memberships" ||
                                activeTab === "Memberships"
                                ? "block"
                                : "hidden lg:block"
                                }`}
                            >
                              <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-medium">Memberships</h2>
                              </div>

                              {/* Membership List */}
                              {userDetails?.memberships?.length === 0 ? (
                                <div className="text-center py-8">
                                  <p className="text-gray-600 text-sm">
                                    Adding your memberships will showcase your
                                    professional affiliations and involvement,
                                    helping to strengthen your profile and
                                    credibility!
                                  </p>
                                </div>
                              ) : (
                                <div className="relative group">
                                  {/* Scroll buttons - Only show on desktop */}
                                  {!isMobile && userDetails?.memberships?.length > 4 && (
                                    <>
                                      <button
                                        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => {
                                          const container =
                                            document.getElementById(
                                              "memberships-scroll"
                                            );
                                          if (container) {
                                            container.scrollLeft -= 200;
                                          }
                                        }}
                                      >
                                        <img
                                          src={arrowright}
                                          alt="Previous"
                                          className="w-4 h-4 transform rotate-180"
                                        />
                                      </button>

                                      <button
                                        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => {
                                          const container =
                                            document.getElementById(
                                              "memberships-scroll"
                                            );
                                          if (container) {
                                            container.scrollLeft += 200;
                                          }
                                        }}
                                      >
                                        <img
                                          src={arrowright}
                                          alt="Next"
                                          className="w-4 h-4"
                                        />
                                      </button>
                                    </>
                                  )}

                                  {/* Content container with different layouts for mobile and desktop */}
                                  <div
                                    id="memberships-scroll"
                                    className={`${isMobile
                                      ? "flex flex-col space-y-4"
                                      : "overflow-x-hidden no-scrollbar scroll-smooth"
                                      }`}
                                  >
                                    <div
                                      className={`${isMobile ? "space-y-4" : "flex gap-6"
                                        }`}
                                    >
                                      {userDetails?.memberships?.map((membership: any) => (
                                        <div
                                          key={membership.id}
                                          className={`flex items-center  justify-between pb-4 border-b   ${!isMobile && " min-w-[200px] "
                                            }`}
                                        >
                                          <div className="flex items-center gap-3">
                                            <img
                                              src={membership1}
                                              alt={membership.societyname}
                                              className="w-10 h-10 rounded-full"
                                            />
                                            <div>
                                              <p className="font-medium text-sm">
                                                {membership.societyname}
                                              </p>
                                              <p className="text-xs text-gray-500">
                                                {membership.relatedDepartment}
                                              </p>
                                              <p className="text-xs text-gray-500">
                                                {membership.position}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}


                          {/* Awards and Achievements */}

                          {userDetails?.achievementsAwards?.length > 0 && (
                            <div
                              className={`bg-white  rounded-xl p-6 mt-3 ${activeTab === "about" || activeTab === "About"
                                ? "block"
                                : "hidden lg:block"
                                }`}
                            >
                              <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium">
                                  Awards and Achievements
                                </h2>
                              </div>

                              {/* Awards List */}
                              <div>
                                {userDetails?.achievementsAwards?.length === 0 ? (
                                  <div className="text-center py-8">
                                    <p className="text-gray-600 text-sm">
                                      Adding your awards and achievements highlights
                                      your accomplishments and sets you apart,
                                      making your profile more impressive and
                                      memorable.
                                    </p>
                                  </div>
                                ) : (
                                  <>
                                    {userDetails?.achievementsAwards
                                      ?.slice(0, expanded ? userDetails?.achievementsAwards.length : 2)
                                      ?.map((award: any) => (
                                        <div
                                          key={award.id}
                                          className="border-b pb-4 mb-4 last:border-none"
                                        >
                                          <div className="flex justify-between">
                                            <div>
                                              <h3 className="text-base font-semibold">
                                                {award.awardName}
                                              </h3>
                                              <p className="text-gray-600 font-light text-sm">
                                                {award.awardedBy} ({award.awardedOn})
                                              </p>
                                              <p className="text-gray-700 text-normal text-sm">
                                                {award.descreption}
                                              </p>
                                              {award.awardMedia && (
                                                <a
                                                  href={award.awardMedia}
                                                  className="mt-2 inline-block text-maincl border border-gray-200 rounded-3xl px-3 py-1 text-xs"
                                                >
                                                  Show Credential
                                                </a>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      ))}

                                    {/* Expand Button - Only show if there are more than 2 awards */}
                                    {userDetails?.achievementsAwards?.length > 2 && (
                                      <button
                                        onClick={() => setExpanded(!expanded)}
                                        className="w-full text-blue-600 text-sm font-medium flex items-center mt-2"
                                      >
                                        {expanded
                                          ? "Show Less"
                                          : "See all Awards and Achievements"}{" "}
                                        →
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          )}


                          {(!userDetails?.professionalExperience?.length && !userDetails?.education?.length && !userDetails?.achievementsAwards?.length && !userDetails?.memberships?.length && !userDetails?.skills?.length && !userDetails?.certifications?.length) && (
                            <div className="py-8 flex flex-col items-center justify-center bg-white rounded-xl mt-3 px-4 text-center animate-fadeIn">
                              <div className="w-40 h-40 mb-4 opacity-80">
                                <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 647.63626 632.17383" className="w-full h-full">
                                  <path d="M687.3279,276.08691H512.81813a15.01828,15.01828,0,0,0-15,15v387.85l-2,.61005-42.81006,13.11a8.00676,8.00676,0,0,1-9.98974-5.31L315.678,271.39691a8.00313,8.00313,0,0,1,5.31006-9.99l65.97022-20.2,191.25-58.54,65.96972-20.2a7.98927,7.98927,0,0,1,9.99024,5.3l32.5498,106.32Z" transform="translate(-276.18187 -133.91309)" fill="#f2f2f2" />
                                  <path d="M398.86279,261.73389a9.0157,9.0157,0,0,1-8.61133-6.3667l-12.88037-42.07178a8.99884,8.99884,0,0,1,5.9712-11.24023l175.939-53.86377a9.00867,9.00867,0,0,1,11.24072,5.9707l12.88037,42.07227a9.01029,9.01029,0,0,1-5.9707,11.24072L401.49219,261.33887A8.976,8.976,0,0,1,398.86279,261.73389Z" transform="translate(-276.18187 -133.91309)" fill="currentColor" className="text-maincl" />
                                  <circle cx="190.15351" cy="24.95465" r="20" fill="currentColor" className="text-maincl" />
                                </svg>
                              </div>
                              <h3 className="text-xl font-semibold text-gray-800 mb-2 animate-pulse">Profile in Progress</h3>
                              <p className="text-gray-600 text-sm max-w-xs mx-auto">
                                No professional details added yet. Check back later for updates.
                              </p>
                              <div className="mt-4 flex space-x-2 justify-center">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200"></span>
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-300"></span>
                              </div>
                            </div>
                          )}

                        </div>
                      )}

                    {activeDesktopTab === "activity" && (
                      <div className="space-y-3">
                        {/* Posts Section */}

                        {userDetails?.posts?.length > 0 && (
                          <div className=" bg-white relative group p-2 rounded-2xl">
                            <div className="flex bg-white justify-between items-center">
                              <h2 className="text-xl p-4 font-medium">
                                Posts{" "}
                                <span className="text-gray-500 text-md">
                                  {" "}
                                  ({userDetails?.posts?.length})
                                </span>
                              </h2>
                              {userDetails?.posts?.length > 2 && (
                                <button
                                  onClick={() => setShowAllPosts(!showAllPosts)}
                                  className="text-fillc text-sm font-medium flex items-center gap-1"
                                >
                                  {showAllPosts ? "Show Less" : "See all Posts"}
                                  <img
                                    src={arrowright}
                                    alt=""
                                    className={`transform ${showAllPosts ? "rotate-180" : ""
                                      } w-4 h-4`}
                                  />
                                </button>
                              )}
                            </div>

                            {userDetails?.posts?.length === 0 ? (
                              <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <p className="text-gray-600 text-sm">
                                  No posts yet. Share your first post to start
                                  engaging with your network!
                                </p>
                                <button className="mt-4 px-4 py-2 bg-maincl text-white rounded-full text-sm hover:bg-fillc">
                                  Create Post
                                </button>
                              </div>
                            ) : (
                              <div className="relative">
                                <button
                                  className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${showAllPosts ? "opacity-100" : "opacity-0"
                                    } group-hover: transition-opacity`}
                                  onClick={() => {
                                    const container = document.getElementById(
                                      "posts-scroll-container1"
                                    );
                                    if (container) {
                                      container.scrollLeft -=
                                        container.offsetWidth;
                                    }
                                  }}
                                >
                                  <img
                                    src={arrowright}
                                    alt="Previous"
                                    className="w-4 h-4 transform rotate-180"
                                  />
                                </button>

                                <button
                                  className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${showAllPosts ? "opacity-100" : "opacity-0"
                                    } group-hover: transition-opacity`}
                                  onClick={() => {
                                    const container = document.getElementById(
                                      "posts-scroll-container1"
                                    );
                                    if (container) {
                                      container.scrollLeft +=
                                        container.offsetWidth;
                                    }
                                  }}
                                >
                                  <img
                                    src={arrowright}
                                    alt="Next"
                                    className="w-4 h-4"
                                  />
                                </button>

                                <div
                                  id="posts-scroll-container1"
                                  className="flex overflow-x-hidden scroll-smooth"
                                  style={{ scrollBehavior: "smooth" }}
                                >
                                  <div className="flex gap-4 transition-transform duration-300">
                                    {userDetails?.posts?.map((post: any) => (
                                      <div
                                        key={post.id}
                                        className="w-[450px] flex-none"
                                      >
                                        <PostCard
                                          userTitle={`${userDetails?.department} | ${userDetails?.specialisation_field_of_study}`}
                                          userImage={userDetails?.profile_picture}
                                          userName={userDetails?.name}
                                          timeAgo={post.time}
                                          postTitle={post.title}
                                          content={post.content}
                                          likes={post._count.likes}
                                          reposts={0}
                                          comments={post._count.comments}
                                          images={post.postImageLinks && post.postImageLinks.length > 0 ? post.postImageLinks : ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=600&q=80"]}
                                          shares={0}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                        )}


                        {/* Questions Section */}

                        {userDetails?.questions?.length > 0 && (
                          <div className="bg-white p-2 rounded-2xl relative group">
                            <div className="flex bg-white justify-between items-center ">
                              <h2 className="text-xl p-4 font-medium">
                                Questions{" "}
                                <span className="text-gray-500 text-md">
                                  {" "}
                                  ({userDetails?.questions?.length})
                                </span>
                              </h2>
                              {userDetails?.questions?.length > 2 && (
                                <button
                                  onClick={() =>
                                    setShowAllQuestions(!showAllQuestions)
                                  }
                                  className="text-fillc text-sm font-medium flex items-center gap-1"
                                >
                                  {showAllQuestions
                                    ? "Show Less"
                                    : "See all Questions"}
                                  <img
                                    src={arrowright}
                                    alt=""
                                    className={`transform ${showAllQuestions ? "rotate-180" : ""
                                      } w-4 h-4`}
                                  />
                                </button>
                              )}
                            </div>

                            {userDetails?.questions?.length === 0 ? (
                              <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <p className="text-gray-600 text-sm">
                                  No questions posted yet. Start engaging with
                                  your network by asking your first question!
                                </p>
                                <button className="mt-4 px-4 py-2 bg-maincl text-white rounded-full text-sm hover:bg-fillc">
                                  Ask Question
                                </button>
                              </div>
                            ) : (
                              <div className="relative">
                                {/* Arrow buttons - Show on hover */}
                                <button
                                  className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${showAllQuestions ? "opacity-100" : "opacity-0"
                                    }  transition-opacity`}
                                  onClick={() => {
                                    const container = document.getElementById(
                                      "questions-scroll-container1"
                                    );
                                    if (container) {
                                      container.scrollLeft -=
                                        container.offsetWidth;
                                    }
                                  }}
                                >
                                  <img
                                    src={arrowright}
                                    alt="Previous"
                                    className="w-4 h-4 transform rotate-180"
                                  />
                                </button>

                                <button
                                  className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${showAllQuestions ? "opacity-100" : "opacity-0"
                                    } transition-opacity`}
                                  onClick={() => {
                                    const container = document.getElementById(
                                      "questions-scroll-container1"
                                    );
                                    if (container) {
                                      container.scrollLeft +=
                                        container.offsetWidth;
                                    }
                                  }}
                                >
                                  <img
                                    src={arrowright}
                                    alt="Next"
                                    className="w-4 h-4"
                                  />
                                </button>

                                <div
                                  id="questions-scroll-container1"
                                  className="flex overflow-x-hidden scroll-smooth"
                                  style={{ scrollBehavior: "smooth" }}
                                >
                                  <div className="flex gap-4 transition-transform duration-300">
                                    {userDetails?.questions?.map((question: any) => (
                                      <div
                                        key={question.id}
                                        className="w-[450px] flex-none"
                                      >
                                        <QuestionCard
                                          userImage={userDetails?.profile_picture}
                                          userName={userDetails?.name}
                                          userTitle={`${userDetails?.department} | ${userDetails?.specialisation_field_of_study}`}
                                          timeAgo={question.timeAgo}
                                          questionTitle={question?.question}
                                          questionContent={question?.question_description}
                                          images={question?.question_image_links && question?.question_image_links.length > 0 ? question?.question_image_links : [{ question_image_link: "https://images.unsplash.com/photo-1511174511562-5f97f4f4eab6?fit=crop&w=600&q=80" }]}
                                          answers={question?._count.answers}
                                          shares={0}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {(userDetails?.posts?.length === 0 && userDetails?.questions?.length === 0) && (
                          <div className="py-10 flex flex-col items-center justify-center bg-white rounded-xl mt-3 px-4 text-center animate-fadeIn">
                            <div className="w-40 h-40 mb-4 opacity-80">
                              <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 64 64" className="w-full h-full">
                                <circle cx="32" cy="32" r="30" fill="#f2f2f2" />
                                <path d="M32 10c-12.15 0-22 9.85-22 22s9.85 22 22 22 22-9.85 22-22-9.85-22-22-22zm8 23h-7v7c0 .55-.45 1-1 1s-1-.45-1-1v-7h-7c-.55 0-1-.45-1-1s.45-1 1-1h7v-7c0-.55.45-1 1-1s1 .45 1 1v7h7c.55 0 1 .45 1 1s-.45 1-1 1z" fill="currentColor" className="text-maincl" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2 animate-pulse">No Activity Yet</h3>
                            <p className="text-gray-600 text-sm max-w-xs mx-auto">
                              This profile doesn't have any posts or questions yet. Activity will appear here once created.
                            </p>
                            <div className="mt-4 flex space-x-2 justify-center">
                              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-100"></span>
                              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200"></span>
                              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-300"></span>
                            </div>
                          </div>
                        )}


                      </div>
                    )}

                    {activeTab === "drafts" && (
                      <div>Drafts content will go here</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
