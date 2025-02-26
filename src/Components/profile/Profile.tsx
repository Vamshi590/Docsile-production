import React, { useEffect, useState } from "react";
import MembershipForm from "./forms/MembershipForm";
import membershipIcon from "../../assets/icon/membership.svg";
import add from "../../assets/icon/add.svg";
import backbutton from "../../assets/icon/backbutton.svg";
import more1 from "../../assets/icon/more1.svg";
import pmessage from "../../assets/icon/pmessage.svg";
import add2 from "../../assets/icon/add2.svg";
import { FaLink, FaPlus } from "react-icons/fa";
import { Header } from "./Header";
import location from "../../assets/icon/location.svg";
import edit from "../../assets/icon/edit.svg";
import arrowright from "../../assets/icon/arrowright.svg";
import PostCard from "./PostCard";
import QuestionCard from "./QuestionCard";
import { JobsCard } from "./JobCard";
import EventCalendar from "./EventCalendar";
import AwardForm, { AwardFormData } from "./forms/AwardForm";
import InterestForm, { InterestFormData } from "./forms/InterestForm";
import EducationForm from "./forms/EducationForm";
import ExperienceForm from "./forms/ExperienceForm";
import CertificationForm, {
  CertificationFormData,
} from "./forms/CertificationForm";
import { State } from "country-state-city";
import experience from "../../assets/icon/experience.svg";
import education from "../../assets/icon/education.svg";
import { useParams } from "react-router-dom";
import axios from "axios";
import profile from "../../assets/icon/profile.svg";
import {
  handleaddaward,
  handleaddCertificate,
  handleAddEducations,
  handleAddExperiences,
  handleaddMemberships,
  handleaddskills,
} from "@/api/profile";
import { toast, Toaster } from "sonner";

interface ExperienceItem {
  id: number;
  title: string;
  organisation: string;
  startDate: string;
  description?: string;
  location?: string;
  city?: string;
  state?: string;
  img: string;
}

interface Education {
  id: number;
  schoolName: string;
  degree: string;
  department: string;
  startDate: string;
  grade?: string;
  logo: string;
}

interface Interest {
  id: string;
  skill: string;
}

interface Certification {
  certificateName: any;
  id: string;
  issuingOrganisation: string;
  issueDate: string;
  logo: string;
}

interface Membership {
  id: number;
  name: string;
  category: string;
  position?: string;
  membershipId?: string;
}

interface Award {
  id: number;
  title: string;
  organization: string;
  year: string;
  description: string;
  credentialLink?: string;
}

interface Workplace {
  id: number;
  organization: string;
  img: string;
}

interface Job {
  id: number;
  image: string;
  date: string;
  name: string;
  location: string;
  amount: string;
  department: string;
}

interface MembershipFormData {
  name: string;
  category: string;
  position?: string;
  membershipId?: string;
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [isAddMembershipFormOpen, setIsAddMembershipFormOpen] = useState(false);
  const [editingMembership, setEditingMembership] = useState<Membership | null>(
    null
  );
  const [showEditExperience, setShowEditExperience] = useState(false);
  const [isExperienceFormOpen, setIsExperienceFormOpen] = useState(false);
  const [editingExperience, setEditingExperience] =
    useState<ExperienceItem | null>(null);

  const [expanded, setExpanded] = useState(false);
  const [interestsexpanded, setInterestsExpanded] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [showAllCertifications, setShowAllCertifications] = useState(false);

  const [showAllJobs, setShowAllJobs] = useState(false);
  const [activeDesktopTab, setActiveDesktopTab] = useState<string>("activity");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isAwardFormOpen, setIsAwardFormOpen] = useState(false);

  const [editingAward, setEditingAward] = useState<Award | null>(null);

  const [isAddInterestFormOpen, setIsAddInterestFormOpen] = useState(false);
  const [editingInterest, setEditingInterest] = useState<{
    id: string;
    skill: string;
  } | null>(null);
  const [showInterestEditButtons, setShowInterestEditButtons] = useState(false);

  const [isEducationFormOpen, setIsEducationFormOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setActiveDesktopTab("about");

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tabs = ["About", "Activity", "Events", "Memberships", "Saved", "Draft"];
  const Desktoptabs = ["About", "Activity", "Jobs", "Events", "Saved", "Draft"];

  // Sample data for posts and questions

  const aboutText =
    "An experienced ophthalmologist passionate about advancing care through sustainable eye care. Specializing in cataract and refractive surgery with a focus on advanced surgical ophthalmology. I combine cutting-edge technology with a patient-centered approach...";

  const [experiences, setExperiences] = useState<ExperienceItem[]>([
    {
      id: 1,
      title: "Ophthalmology Clinical Intern",
      organisation: "Aravind Eye Hospital, Madurai, Tamil Nadu",
      startDate: "Jun 2023 - Present",
      location: "Madurai, Tamil Nadu",
      description: "",
      img: "https://cdn.builder.io/api/v1/image/assets/TEMP/e6f21b8e48966c867e6781375245b708b2595a844a18bfe5cb5ae20e42019372?placeholderIfAbsent=true&apiKey=90dc9675c54b49f9aa0dc15eba780c08",
    },
  ]);

  const [educationData, setEducationData] = useState<Education[]>([]);
  const [interestsData, setInterestsData] = useState<Interest[]>([]);

  const [certificationData, setCertificationData] = useState<Certification[]>(
    []
  );

  const [memberships, setMemberships] = useState<Membership[]>([]);

  const [awards, setAwards] = useState<Award[]>([]);

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

  const jobs: Job[] = [];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const ActivitySection = () => (
    <div className="space-y-3 mt-3 bg-mainbg ">
      {/* Posts Section */}
      <div className=" bg-white  relative group p-2 rounded-2xl">
        <div className="flex bg-white justify-between items-center ">
          <h2 className="text-xl p-4 font-medium">
            Posts{" "}
            <span className="text-gray-500 text-md">
              {" "}
              ({userDetails?.posts.length})
            </span>
          </h2>
          {userDetails?.posts.length > 1 && (
            <button
              onClick={() => setShowAllPosts(!showAllPosts)}
              className="text-fillc text-sm font-medium flex items-center gap-1"
            >
              {showAllPosts ? "Show Less" : "See all Posts"}
              <img
                src={arrowright}
                alt=""
                className={`transform ${
                  showAllPosts ? "rotate-180" : ""
                } w-4 h-4`}
              />
            </button>
          )}
        </div>

        {userDetails?.posts.length === 0 ? (
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
          <div className="Z">
            <button
              className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${
                showAllPosts ? "opacity-100" : "opacity-0"
              } group-hover: transition-opacity`}
              onClick={() => {
                const container = document.getElementById(
                  "posts-scroll-container1"
                );
                if (container) {
                  container.scrollLeft -= container.offsetWidth;
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
              className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${
                showAllPosts ? "opacity-100" : "opacity-0"
              } group-hover: transition-opacity`}
              onClick={() => {
                const container = document.getElementById(
                  "posts-scroll-container1"
                );
                if (container) {
                  container.scrollLeft += container.offsetWidth;
                }
              }}
            >
              <img src={arrowright} alt="Next" className="w-4 h-4" />
            </button>

            <div
              id="posts-scroll-container1"
              className="flex overflow-x-hidden scroll-smooth"
              style={{ scrollBehavior: "smooth" }}
            >
              <div className="flex gap-4 transition-transform duration-300">
                {userDetails?.posts.map((post: any) => (
                  <div key={post.id} className="w-[450px] flex-none">
                    <PostCard
                      userTitle={post.title}
                      userImage={userDetails?.profile_picture}
                      userName={userDetails.name}
                      timeAgo={post.time}
                      content={post.description}
                      likes={post._count.likes}
                      reposts={0}
                      comments={post._count.comments}
                      images={post.postImageLinks}
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
      <div className=" bg-white p-2 rounded-2xl relative group">
        <div className="flex  justify-between items-center">
          <h2 className="text-xl p-4 font-medium">
            Questions{" "}
            <span className="text-gray-500 text-md">
              {" "}
              ({userDetails?.questions?.length})
            </span>
          </h2>
          {userDetails?.questions?.length > 1 && (
            <button
              onClick={() => setShowAllQuestions(!showAllQuestions)}
              className="text-fillc text-sm font-medium flex items-center gap-1"
            >
              {showAllQuestions ? "Show Less" : "See all Questions"}
              <img
                src={arrowright}
                alt=""
                className={`transform ${
                  showAllQuestions ? "rotate-180" : ""
                } w-4 h-4`}
              />
            </button>
          )}
        </div>

        {userDetails?.questions?.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">
              No questions posted yet. Start engaging with your network by
              asking your first question!
            </p>
            <button className="mt-4 px-4 py-2 bg-maincl text-white rounded-full text-sm hover:bg-fillc">
              Ask Question
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Arrow buttons - Show on hover */}
            <button
              className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${
                showAllQuestions ? "opacity-100" : "opacity-0"
              }  transition-opacity`}
              onClick={() => {
                const container = document.getElementById(
                  "questions-scroll-container1"
                );
                if (container) {
                  container.scrollLeft -= container.offsetWidth;
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
              className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${
                showAllQuestions ? "opacity-100" : "opacity-0"
              } transition-opacity`}
              onClick={() => {
                const container = document.getElementById(
                  "questions-scroll-container1"
                );
                if (container) {
                  container.scrollLeft += container.offsetWidth;
                }
              }}
            >
              <img src={arrowright} alt="Next" className="w-4 h-4" />
            </button>

            <div
              id="questions-scroll-container1"
              className="flex overflow-x-hidden scroll-smooth"
              style={{ scrollBehavior: "smooth" }}
            >
              <div className="flex gap-4 transition-transform duration-300">
                {userDetails?.questions?.map((question: any) => (
                  <div key={question.id} className="w-[450px] flex-none">
                    <QuestionCard
                      userImage={userDetails?.profile_picture}
                      userName={userDetails?.name}
                      userTitle={`${userDetails?.bio}`}
                      timeAgo={question.timeAgo}
                      questionTitle={question.question}
                      questionContent={question.question_description}
                      images={question?.question_image_links}
                      answers={question._count.answers}
                      shares={0}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resources Section */}
      {/* <div className="mb-8 relative group">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">
            Resources{" "}
            <span className="text-gray-500 text-md"> ({resources.length})</span>
          </h2>
          {resources.length > 1 && (
            <button
              onClick={() => setShowAllResources(!showAllResources)}
              className="text-fillc text-sm font-medium flex items-center gap-1"
            >
              {showAllResources ? "Show Less" : "See all Resources"}
              <img
                src={arrowright}
                alt=""
                className={`transform ${
                  showAllResources ? "rotate-180" : ""
                } w-4 h-4`}
              />
            </button>
          )}
        </div>

        {resources.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-sm">
              No resources yet. Share your first resource to start engaging with
              your network!
            </p>
            <button className="mt-4 px-4 py-2 bg-maincl text-white rounded-full text-sm hover:bg-fillc">
              Share Resource
            </button>
          </div>
        ) : (
          <div className="relative">
            <div
              id="resources-scroll-container"
              className={`flex ${
                showAllResources ? "overflow-x-auto" : "overflow-x-hidden"
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
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="w-[calc(50%)] flex-none"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    <ResourceCard
                      type={resource.type}
                      title={resource.title}
                      description={resource.description}
                      image={resource.image}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div> */}
    </div>
  );

  const [showEditButtons, setShowEditButtons] = useState(false);
  const [showCertEditButtons, setShowCertEditButtons] = useState(false);
  const [editingCertification, setEditingCertification] =
    useState<Certification | null>(null);
  const [isCertificationFormOpen, setIsCertificationFormOpen] = useState(false);

  //Backend

  const { id } = useParams(); // Get user ID from URL params
  const userid = localStorage.getItem("Id") || id;

  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    if (userid) {
      // First, check localStorage for data
      const storedUser = localStorage.getItem("User");
      if (storedUser) {
        // If data exists, render it immediately
        setUserDetails(JSON.parse(storedUser));

        // Then fetch new data from the server and compare
        fetchUserData(userid, JSON.parse(storedUser));
        console.log("ikkada okasari ochindhi");
      } else {
        // If no data in localStorage, fetch data from the backend
        fetchUserData(userid);
        console.log("ikkada inkokasari ochindhi");
      }
    }
  }, [id]);

  // Function to fetch user data from the backend
  const fetchUserData = async (userId: string, storedUserData: any = null) => {
    try {
      const response = await axios.get(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/profile/${userId}`
      );
      const userData = response.data.data; // New response structure

      console.log(response.data);

      const fetchedUser = {
        name: userData.name,
        bio: `${userData.department} | ${userData.specialisation_field_of_study}`,
        department: userData.department,
        userLocation: userData.city,
        questionCount: userData.questions.length,
        questions: userData.questions,
        postsCount: userData.posts.length,
        profile_picture: userData.profile_picture,
        posts: userData.posts,
        certificates: userData.certifications,
        awards: userData.achievementsAwards,
        experiences: userData.professionalExperience,
        educations: userData.education,
        memberships: userData.memberships,
        skills: userData.skills,
      };

      if (storedUserData) {
        if (JSON.stringify(fetchedUser) !== JSON.stringify(storedUserData)) {
          localStorage.setItem("User", JSON.stringify(fetchedUser));
          setUserDetails(fetchedUser);
        }
      } else {
        localStorage.setItem("User", JSON.stringify(fetchedUser));
        setUserDetails(fetchedUser);
      }
    } catch (err: any) {
      console.error("Error fetching data:", err.response?.data?.message || err);
    }
  };

  const handleProfilePicUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const loading = toast.loading("Updating profile photo");
    try {
      // Get presigned URL from backend
      const { data } = await axios.get(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/uploads/url`
      );

      // Upload to S3 without credentials
      await axios.put(data.uploadURL, file, {
        headers: {
          "Content-Type": file.type,
        },
        withCredentials: false,
      });

      // Save image URL to database
      await axios.post(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/user/update-profile-picture/${id}`,
        {
          userId: id,
          imageUrl: data.imageURL,
        }
      );

      toast.dismiss(loading);

      toast.success("Profile picture uploaded successfully");
      // Optionally refresh the page or update the UI
      window.location.reload();
    } catch (error) {
      toast.dismiss(loading);
      toast.error("Failed to upload profile picture");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen font-fontsm mx-auto bg-mainbg ">
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

      {/* Desktop Header - Only visible on desktop */}
      <div className="hidden lg:block bg-white border-b sticky top-0 z-50">
        <Header
          onNotification={() => console.log("Notification clicked")}
          onMessage={() => console.log("Message clicked")}
          onProfile={() => console.log("Profile clicked")}
          onSearch={() => console.log("Profile clicked")}
          profile={userDetails?.profile_picture || profile}
          user={userDetails?.name}
          userRole={`${userDetails?.department} | ${userDetails?.organisation_name}`}
          userLocation={userDetails?.city}
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
                  <div className="flex flex-row lg:flex-col space-x-6  items-center">
                    {/* <div className="relative w-20 h-20  mx-auto rounded-full overflow-hidden shadow-lg">
                      <img
                        src={userDetails?.profile_picture || profile}
                        alt="Profile"
                        className="w-full h-full object-cover "
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white opacity-20 rounded-full" />

                      <label className="absolute bottom-0 right-0 p-2 bg-main rounded-full cursor-pointer hover:bg-opacity-90 transition-all">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleProfilePicUpload}
                        />
                        <FaPlus className="w-4 h-4 text-white" />
                      </label>
                    </div> */}

                    <div className="relative shrink-0 ">
                      <img
                        src={userDetails?.profile_picture || profile}
                        alt="Profile"
                        className=" w-20 h-20 md:w-28 md:h-28 shrink-0 rounded-full object-cover"
                      />
                      <label className="absolute bottom-0 right-0  w-6 h-6 flex items-center cursor-pointer justify-center text-xs">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleProfilePicUpload}
                        />
                        <img src={add} alt="" />
                      </label>
                    </div>
                    <div className="flex flex-col lg:items-center lg:space-y-2">
                      <h1 className=" text-lg font-semibold text-gray-900 lg:mt-2 ">
                        {userDetails?.name}
                      </h1>

                      <p className="text-gray-600 text-sm">
                        {userDetails?.bio}
                      </p>
                      <p className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1">
                        <img src={location} alt="" className="w-4" />
                        {userDetails?.userLocation}
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
                          {userDetails?.postsCount}
                        </div>
                        <div className="text-sm text-gray-700">Posts</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-sm text-fillc">
                          {userDetails?.questionCount}
                        </div>
                        <div className="text-sm text-gray-700">Questions</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 w-full text-sm  font-normal">
                    <button className=" px-3  py-1 bg-maincl text-white rounded-3xl hover:bg-fillc">
                      Edit Profile
                    </button>
                    <button className="flex justify-center px-3 py-1 border rounded-3xl hover:bg-gray-50">
                      <img src={add2} alt="" />
                      Be Mentor
                    </button>
                  </div>
                </div>

                <div className="w-full bg-white rounded-xl lg:hidden sm:block max-w-4xl mx-auto relative mt-2 h-[180px] overflow-hidden ">
                  {/* First Custom Section */}
                  <div
                    className={`absolute border rounded-xl   p-4 w-full h-full transform transition-transform duration-700 ease-in-out ${
                      activeIndex === 0 ? "translate-x-0" : "-translate-x-full"
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

                  {/* Second Custom Section */}
                  <div
                    className={`absolute w-full h-full transform transition-transform duration-700 ease-in-out ${
                      activeIndex === 1
                        ? "translate-x-0"
                        : activeIndex < 1
                        ? "translate-x-full"
                        : "-translate-x-full"
                    }`}
                  >
                    <div className="w-full  h-[200px] border border-gray-200 p-4 rounded-lg">
                      <div className="flex   justify-between items-start mb-4">
                        <div className="mr-4">
                          <h2 className="text-sm flex items-start font-medium text-gray-800">
                            Profile Completion
                          </h2>
                          <div className="space-y-1 grid grid-cols-2 ">
                            <button className=" flex  items-center  bg-gray-50 rounded-full py-2 px-2">
                              <span className="text-xs text-gray-700">
                                Education
                              </span>
                              <span className="text-sm">+</span>
                            </button>
                            <button className=" flex items-center justify-between bg-gray-50 rounded-full py-2 px-4">
                              <span className="text-xs text-gray-700">
                                Experience
                              </span>
                              <span className="text-sm">+</span>
                            </button>
                            <button className=" flex items-center justify-between bg-gray-50 rounded-full py-2 px-4">
                              <span className="text-xs text-gray-700">
                                Skills
                              </span>
                              <span className="text-sm">+</span>
                            </button>
                            <button className=" flex items-center justify-between bg-gray-50 rounded-full py-2 px-4">
                              <span className="text-xs text-gray-700">
                                Awards
                              </span>
                              <span className="text-sm">+</span>
                            </button>
                          </div>
                        </div>
                        <div className="relative mt-4">
                          <div className="w-14 h-14 rounded-full border-2 border-gray-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-maincl">
                              75%
                            </span>
                          </div>
                          <svg className="absolute top-0 left-0 w-14 h-14 -rotate-90">
                            <circle
                              cx="28"
                              cy="28"
                              r="26"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              className="text-maincl"
                              strokeDasharray="163.36"
                              strokeDashoffset="40.84"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Third Custom Section */}
                  <div
                    className={`absolute  w-full h-full transform transition-transform duration-700 ease-in-out ${
                      activeIndex === 2
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
                        className={`w-1 h-1 rounded-full transition-colors duration-300 ${
                          index === activeIndex ? "bg-maincl" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Profile Completion */}
                <div className="w-full mt-3 hidden lg:block bg-white border border-gray-200 p-4 rounded-lg">
                  <div className="flex   justify-between items-start mb-4">
                    <div className="mr-4">
                      <h2 className="text-sm flex items-start font-medium text-gray-800">
                        Profile Completion
                      </h2>
                      <div className="space-y-1 grid grid-cols-2 ">
                        <button className=" flex  items-center  bg-gray-50 rounded-full py-2 px-2">
                          <span className="text-xs text-gray-700">
                            Education
                          </span>
                          <span className="text-sm">+</span>
                        </button>
                        <button className=" flex items-center justify-between bg-gray-50 rounded-full py-2 px-4">
                          <span className="text-xs text-gray-700">
                            Experience
                          </span>
                          <span className="text-sm">+</span>
                        </button>
                        <button className=" flex items-center justify-between bg-gray-50 rounded-full py-2 px-4">
                          <span className="text-xs text-gray-700">Skills</span>
                          <span className="text-sm">+</span>
                        </button>
                        <button className=" flex items-center justify-between bg-gray-50 rounded-full py-2 px-4">
                          <span className="text-xs text-gray-700">Awards</span>
                          <span className="text-sm">+</span>
                        </button>
                      </div>
                    </div>
                    <div className="relative mt-4">
                      <div className="w-14 h-14 rounded-full border-2 border-gray-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-maincl">
                          75%
                        </span>
                      </div>
                      <svg className="absolute top-0 left-0 w-14 h-14 -rotate-90">
                        <circle
                          cx="28"
                          cy="28"
                          r="26"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          className="text-maincl"
                          strokeDasharray="163.36"
                          strokeDashoffset="40.84"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Profile Link */}
                <div className="mt-3 w-full text-left bg-white border border-gray-200 p-4 rounded-lg hidden lg:block">
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <FaLink className="text-gray-400" />
                    Profile Link
                  </p>
                  <p className="text-xs text-gray-600 mt-1 cursor-pointer">
                    {`www.docsile.com/profile/${userid}`}
                  </p>
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
                    className={`px-4 py-3 text-sm whitespace-nowrap ${
                      activeTab === tab.toLowerCase()
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
            <div className="bg-white mt-3 rounded-lg  lg:hidden">
              {/* Show ActivitySection for both mobile and desktop when activity tab is active */}
              {(activeTab === "events" ||
                (!isMobile && activeDesktopTab === "events")) && (
                <EventCalendar />
              )}
            </div>
            <div className="bg-white rounded-lg shadow-sm lg:hidden">
              {/* Show ActivitySection for both mobile and desktop when activity tab is active */}
              {(activeTab === "saved" ||
                (!isMobile && activeDesktopTab === "saved")) && (
                <div className="space-y-3 bg-mainbg">
                  {/* Saved Posts Section */}
                  <div className=" bg-white relative group p-2 rounded-2xl">
                    <div className="flex bg-white justify-between items-center ">
                      <h2 className="text-xl p-4 font-medium">
                        Saved Posts{" "}
                        <span className="text-gray-500 text-md">
                          {" "}
                          ({userDetails?.posts.length})
                        </span>
                      </h2>
                      {userDetails?.posts.length > 2 && (
                        <button
                          onClick={() => setShowAllPosts(!showAllPosts)}
                          className="text-fillc text-sm font-medium flex items-center gap-1"
                        >
                          {showAllPosts ? "Show Less" : "See all Posts"}
                          <img
                            src={arrowright}
                            alt=""
                            className={`transform ${
                              showAllPosts ? "rotate-180" : ""
                            } w-4 h-4`}
                          />
                        </button>
                      )}
                    </div>

                    {userDetails?.posts.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 text-sm">
                          No posts yet. Share your first post to start engaging
                          with your network!
                        </p>
                        <button className="mt-4 px-4 py-2 bg-maincl text-white rounded-full text-sm hover:bg-fillc">
                          Create Post
                        </button>
                      </div>
                    ) : (
                      <div className="Z">
                        <button
                          className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${
                            showAllPosts ? "opacity-100" : "opacity-0"
                          } group-hover: transition-opacity`}
                          onClick={() => {
                            const container = document.getElementById(
                              "posts-scroll-container1"
                            );
                            if (container) {
                              container.scrollLeft -= container.offsetWidth;
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
                          className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${
                            showAllPosts ? "opacity-100" : "opacity-0"
                          } group-hover: transition-opacity`}
                          onClick={() => {
                            const container = document.getElementById(
                              "posts-scroll-container1"
                            );
                            if (container) {
                              container.scrollLeft += container.offsetWidth;
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
                            {userDetails?.posts.map((post: any) => (
                              <div
                                key={post.id}
                                className="w-[450px] flex-none"
                              >
                                <PostCard
                                  userTitle={post.title}
                                  userImage={userDetails?.profile_picture}
                                  userName={userDetails.name}
                                  timeAgo={post.time}
                                  content={post.description}
                                  likes={post._count.likes}
                                  reposts={0}
                                  comments={post._count.comments}
                                  images={post.postImageLinks}
                                  shares={0}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Saved Questions Section */}
                  <div className=" bg-white p-2 rounded-2xl relative group">
                    <div className="flex bg-white  justify-between items-center">
                      <h2 className="text-xl p-4 font-medium">
                        Saved Questions{" "}
                        <span className="text-gray-500 text-md">
                          {" "}
                          ({userDetails?.questions?.length})
                        </span>
                      </h2>
                      {userDetails?.questions?.length > 2 && (
                        <button
                          onClick={() => setShowAllQuestions(!showAllQuestions)}
                          className="text-fillc text-sm font-medium flex items-center gap-1"
                        >
                          {showAllQuestions ? "Show Less" : "See all Questions"}
                          <img
                            src={arrowright}
                            alt=""
                            className={`transform ${
                              showAllQuestions ? "rotate-180" : ""
                            } w-4 h-4`}
                          />
                        </button>
                      )}
                    </div>

                    {userDetails?.questions?.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 text-sm">
                          No questions posted yet. Start engaging with your
                          network by asking your first question!
                        </p>
                        <button className="mt-4 px-4 py-2 bg-maincl text-white rounded-full text-sm hover:bg-fillc">
                          Ask Question
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        {/* Arrow buttons - Show on hover */}
                        <button
                          className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${
                            showAllQuestions ? "opacity-100" : "opacity-0"
                          }  transition-opacity`}
                          onClick={() => {
                            const container = document.getElementById(
                              "questions-scroll-container1"
                            );
                            if (container) {
                              container.scrollLeft -= container.offsetWidth;
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
                          className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${
                            showAllQuestions ? "opacity-100" : "opacity-0"
                          } transition-opacity`}
                          onClick={() => {
                            const container = document.getElementById(
                              "questions-scroll-container1"
                            );
                            if (container) {
                              container.scrollLeft += container.offsetWidth;
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
                                  userTitle={`${userDetails?.bio}`}
                                  timeAgo={question.timeAgo}
                                  questionTitle={question.question}
                                  questionContent={
                                    question.question_description
                                  }
                                  images={question?.question_image_links}
                                  answers={question._count.answers}
                                  shares={0}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className=" rounded-lg shadow-sm">
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
                          className={`px-4 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                            activeDesktopTab === tab.toLowerCase()
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
                        <Toaster />

                        {/* About Section - Only visible when About tab is active on mobile */}
                        <div
                          className={`${
                            activeTab === "about" || activeTab === "About"
                              ? "block"
                              : "hidden lg:block"
                          }`}
                        >
                          <div className="p-6 border bg-white border-gray-200 rounded-xl my-3 ">
                            <div className="flex justify-between items-center mb-4">
                              <h2 className="text-xl font-medium">About</h2>
                              <button className="text-gray-500">
                                <img src={edit} alt="" />
                              </button>
                            </div>
                            <p className="text-gray-600">{aboutText}</p>
                          </div>
                        </div>

                        {/* Experience Section */}
                        <div
                          className={`p-6 border bg-white border-gray-100 rounded-xl mt-3 group relative ${
                            activeTab === "about" || activeTab === "About"
                              ? "block"
                              : "hidden lg:block"
                          }`}
                        >
                          <div className="flex gap-4 justify-between items-center mb-6">
                            <h2 className="text-xl font-medium">Experience</h2>
                            <div className="flex items-center gap-4">
                              <button
                                className="text-gray-500"
                                onClick={() =>
                                  setShowEditExperience(!showEditExperience)
                                }
                              >
                                <img src={edit} alt="" />
                              </button>
                              <button
                                className="flex items-center space-x-1 bg-maincl text-white px-1 py-1 rounded-full hover:bg-fillc text-sm"
                                onClick={() => {
                                  setEditingExperience(null);
                                  setIsExperienceFormOpen(true);
                                }}
                              >
                                <FaPlus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <div className="relative">
                            {userDetails?.experiences.length === 0 ? (
                              <div className="text-center py-8">
                                <p className="text-gray-600 text-sm">
                                  Adding your work experience will highlight
                                  your professional journey and showcase your
                                  skills, making your profile more compelling
                                  and complete!
                                </p>
                              </div>
                            ) : (
                              <>
                                {/* Desktop View */}
                                <div className="hidden lg:block">
                                  {userDetails?.experiences.length > 3 && (
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
                                    {userDetails?.experiences.map(
                                      (exp: any, index: number) => (
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
                                            {index <
                                              userDetails?.experiences.length -
                                                1 && (
                                              <div className="hidden sm:flex w-full bg-gray-200 h-0.5"></div>
                                            )}
                                          </div>
                                          <div className="mt-3 sm:pe-8 relative">
                                            {showEditExperience && (
                                              <button
                                                onClick={() => {
                                                  setEditingExperience(exp);
                                                  setIsExperienceFormOpen(true);
                                                }}
                                                className="absolute right-0 top-0 p-1 bg-gray-100 rounded-full hover:bg-gray-200"
                                              >
                                                <img
                                                  src={edit}
                                                  alt="Edit"
                                                  className="w-3 h-3"
                                                />
                                              </button>
                                            )}
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
                                            <p className="text-xs font-normal text-gray-900">
                                              {exp.location}
                                            </p>
                                          </div>
                                        </li>
                                      )
                                    )}
                                  </ol>
                                </div>

                                {/* Mobile View */}
                                <div className="lg:hidden flex flex-col space-y-8">
                                  {userDetails?.experiences
                                    ?.slice(
                                      0,
                                      expanded ? experiences.length : 3
                                    )
                                    .map((exp: any, index: number) => (
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
                                          {showEditExperience && (
                                            <button
                                              onClick={() => {
                                                setEditingExperience(exp);
                                                setIsExperienceFormOpen(true);
                                              }}
                                              className="absolute right-0 top-0 p-1 bg-gray-100 rounded-full hover:bg-gray-200"
                                            >
                                              <img
                                                src={edit}
                                                alt="Edit"
                                                className="w-3 h-3"
                                              />
                                            </button>
                                          )}
                                          <h3 className="text-sm font-normal text-gray-900">
                                            {exp.title}
                                          </h3>
                                          <p className="text-xs font-light text-gray-600">
                                            {exp.company}
                                          </p>
                                          <time className="block text-xs font-normal text-gray-500">
                                            {exp.date}
                                          </time>
                                          {exp.description && (
                                            <p className="text-sm font-normal text-gray-500">
                                              {exp.description}
                                            </p>
                                          )}
                                          <p className="text-sm font-normal text-gray-500">
                                            {exp.location}
                                          </p>
                                        </div>
                                      </div>
                                    ))}

                                  {userDetails?.experiences.length > 3 && (
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
                                        className={`transform ${
                                          expanded ? "rotate-180" : ""
                                        } w-4 h-4`}
                                      />
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Experience Form Modal */}
                        {isExperienceFormOpen && (
                          <ExperienceForm
                            isOpen={isExperienceFormOpen}
                            onClose={() => {
                              setIsExperienceFormOpen(false);
                              setEditingExperience(null);
                            }}
                            onSubmit={(data) => {
                              if (editingExperience) {
                                const updatedExperiences = experiences.map(
                                  (exp) =>
                                    exp.id === editingExperience.id
                                      ? {
                                          ...exp,
                                          title: data.title,
                                          organisation: data.organisation,
                                          startDate: data.startDate,
                                          city: data.city,
                                          state: data.state,
                                          location: `${data.city}${
                                            data.state
                                              ? ", " +
                                                State.getStateByCodeAndCountry(
                                                  data.state,
                                                  "IN"
                                                )?.name
                                              : ""
                                          }`,
                                          description: data.description,
                                          img:
                                            data.img instanceof File
                                              ? URL.createObjectURL(data.img)
                                              : exp.img,
                                        }
                                      : exp
                                );
                                setExperiences(updatedExperiences);
                                handleAddExperiences(data, editingExperience);
                              } else {
                                const newExperience: ExperienceItem = {
                                  id: Date.now(),
                                  title: data.title,
                                  organisation: data.organisation,
                                  startDate: data.startDate,
                                  city: data.city,
                                  state: data.state,
                                  location: `${data.city}${
                                    data.state
                                      ? ", " +
                                        State.getStateByCodeAndCountry(
                                          data.state,
                                          "IN"
                                        )?.name
                                      : ""
                                  }`,
                                  description: data.description,
                                  img:
                                    data.img instanceof File
                                      ? URL.createObjectURL(data.img)
                                      : "https://cdn.builder.io/api/v1/image/assets/TEMP/e6f21b8e48966c867e6781375245b708b2595a844a18bfe5cb5ae20e42019372",
                                };
                                setExperiences([...experiences, newExperience]);
                                handleAddExperiences(data, editingExperience);
                              }
                              setIsExperienceFormOpen(false);
                              setEditingExperience(null);
                            }}
                            initialData={
                              editingExperience
                                ? {
                                    title: editingExperience.title,
                                    organisation:
                                      editingExperience.organisation,
                                    startDate: editingExperience.startDate,
                                    description:
                                      editingExperience.description ?? "",
                                    city: editingExperience.city ?? "",
                                    state: editingExperience.state ?? "",
                                    img: editingExperience.img,
                                    notifyFollowers: false,
                                  }
                                : undefined
                            }
                            isEditing={!!editingExperience}
                            key={
                              editingExperience
                                ? `edit-${editingExperience.title}`
                                : "new-experience"
                            }
                          />
                        )}

                        {/* Education Section */}
                        <div
                          className={`p-6 border bg-white border-gray-100 rounded-xl overflow-hidden mt-3 group relative ${
                            activeTab === "about" || activeTab === "About"
                              ? "block"
                              : "hidden lg:block"
                          }`}
                        >
                          <div className="flex gap-4  justify-between items-center mb-6">
                            <h2 className="text-xl  font-medium">Education</h2>
                            <div className="flex items-center gap-4">
                              <button
                                className="text-gray-500"
                                onClick={() => setIsEditMode(!isEditMode)}
                              >
                                <img src={edit} alt="" />
                              </button>
                              <button
                                className="flex items-center space-x-1 bg-maincl text-white px-1 py-1 rounded-full hover:bg-fillc text-sm"
                                onClick={() => {
                                  setEditingEducation(null);
                                  setIsEducationFormOpen(true);
                                }}
                              >
                                <FaPlus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <div className="relative">
                            {userDetails?.educations?.length === 0 ? (
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
                                  {userDetails?.educations?.length > 3 && (
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
                                  {userDetails?.educations.length > 3 && (
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
                                    {userDetails?.educations.map(
                                      (edu: any, index: number) => (
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
                                            {index <
                                              educationData.length - 1 && (
                                              <div className="hidden sm:flex w-full bg-gray-200 h-0.5"></div>
                                            )}
                                          </div>
                                          <div className="mt-3 sm:pe-8 relative">
                                            {isEditMode && (
                                              <button
                                                onClick={() => {
                                                  setEditingEducation(edu);
                                                  setIsEducationFormOpen(true);
                                                }}
                                                className="absolute right-0 -top-12 p-1  bg-gray-100 rounded-full hover:bg-gray-200"
                                              >
                                                <img
                                                  src={edit}
                                                  alt="Edit"
                                                  className="w-3  h-3"
                                                />
                                              </button>
                                            )}
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
                                      )
                                    )}
                                  </ol>
                                </div>

                                {/* Mobile View */}
                                <div className="lg:hidden flex flex-col space-y-8">
                                  {userDetails?.educations
                                    ?.slice(
                                      0,
                                      expanded ? educationData.length : 3
                                    )
                                    .map((edu: any, index: number) => (
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
                                          {isEditMode && (
                                            <button
                                              onClick={() => {
                                                setEditingEducation(edu);
                                                setIsEducationFormOpen(true);
                                              }}
                                              className="absolute right-0 top-0 p-1 bg-gray-100 rounded-full hover:bg-gray-200"
                                            >
                                              <img
                                                src={edit}
                                                alt="Edit"
                                                className="w-3 h-3"
                                              />
                                            </button>
                                          )}
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
                                  {userDetails?.educations?.length > 3 && (
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
                                        className={`transform ${
                                          expanded ? "rotate-180" : ""
                                        } w-4 h-4`}
                                      />
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        {/* Education Form */}
                        {isEducationFormOpen && (
                          <EducationForm
                            isOpen={isEducationFormOpen}
                            onClose={() => {
                              setIsEducationFormOpen(false);
                              setEditingEducation(null);
                            }}
                            onSubmit={(data) => {
                              if (editingEducation) {
                                // Update existing education
                                const updatedEducation = educationData.map(
                                  (edu) =>
                                    edu.id === editingEducation.id
                                      ? {
                                          ...edu,
                                          schoolName: data.schoolName,
                                          degree: data.degree,
                                          department: data.department || "",
                                          startDate: data.startDate,
                                          grade: data.grade || "",
                                          logo:
                                            data.logo instanceof File
                                              ? URL.createObjectURL(data.logo)
                                              : edu.logo,
                                        }
                                      : edu
                                );
                                setEducationData(updatedEducation);
                                handleAddEducations(data, editingEducation);
                              } else {
                                // Add new education
                                const logoUrl =
                                  data.logo instanceof File
                                    ? URL.createObjectURL(data.logo)
                                    : data.logo ||
                                      "https://cdn.builder.io/api/v1/image/assets/TEMP/e6f21b8e48966c867e6781375245b708b2595a844a18bfe5cb5ae20e42019372";

                                const newEducation: Education = {
                                  id: Date.now(),
                                  schoolName: data.schoolName || "",
                                  degree: data.degree || "",
                                  department: data.department || "",
                                  startDate: data.startDate || "",
                                  grade: data.grade || "",
                                  logo: logoUrl,
                                };
                                setEducationData([
                                  ...educationData,
                                  newEducation,
                                ]);

                                handleAddEducations(data, editingEducation);
                              }
                              setIsEducationFormOpen(false);
                              setEditingEducation(null);
                            }}
                            initialData={
                              editingEducation
                                ? {
                                    schoolName:
                                      editingEducation.schoolName ?? "",
                                    degree: editingEducation.degree ?? "",
                                    startDate: editingEducation.startDate ?? "",
                                    grade: editingEducation.grade ?? "",
                                    department:
                                      editingEducation.department ?? "",
                                    logo: editingEducation.logo ?? "",
                                    notifyFollowers: false,
                                  }
                                : undefined
                            }
                            isEditing={!!editingEducation}
                            key={
                              editingEducation
                                ? editingEducation.schoolName
                                : "new-education"
                            }
                          />
                        )}

                        <div
                          className={`flex flex-col mt-3 lg:flex-row gap-3 lg:gap-6 ${
                            activeTab === "about" || activeTab === "About"
                              ? "block"
                              : "hidden lg:block"
                          }`}
                        >
                          {/* Areas of Interest Card */}
                          <div className="w-full lg:w-1/2 flex flex-col justify-between bg-white rounded-xl p-6">
                            <div>
                              <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium">Skills</h2>
                                <div className="flex gap-4">
                                  <button
                                    onClick={() =>
                                      setShowInterestEditButtons(
                                        !showInterestEditButtons
                                      )
                                    }
                                    className="text-gray-500 hover:text-blue-500"
                                  >
                                    <img src={edit} alt="" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingInterest(null); // Clear any existing editing interest
                                      setIsAddInterestFormOpen(true);
                                    }}
                                    className="flex items-center space-x-1 bg-maincl text-white px-1 py-1 rounded-full hover:bg-fillc text-sm"
                                  >
                                    <FaPlus className="w-3 h-3" />
                                  </button>
                                </div>
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
                                    .map((interest: any, index: number) => (
                                      <li
                                        key={index}
                                        className="border-b py-2 last:border-none"
                                      >
                                        <div className="flex justify-between items-center">
                                          <p className="text-sm text-gray-600">
                                            {interest.skill}
                                          </p>
                                          {showInterestEditButtons && (
                                            <button
                                              onClick={() => {
                                                setEditingInterest({
                                                  id: interest.id,
                                                  skill: interest.skill,
                                                });
                                                setIsAddInterestFormOpen(true);
                                              }}
                                              className="text-gray-400 hover:text-gray-600"
                                            >
                                              <img
                                                src={edit}
                                                alt="Edit"
                                                className="w-4 h-4"
                                              />
                                            </button>
                                          )}
                                        </div>
                                      </li>
                                    ))}
                                </ul>
                              )}
                            </div>

                            {/* Footer Link - Only show if there are more than 4 interests */}
                            {userDetails?.skills.length > 4 && (
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
                          <InterestForm
                            isOpen={isAddInterestFormOpen}
                            onClose={() => {
                              setIsAddInterestFormOpen(false);
                              setEditingInterest(null);
                            }}
                            onSubmit={(data: InterestFormData) => {
                              if (editingInterest) {
                                // Update existing interest
                                const updatedInterests = interestsData.map(
                                  (interest) =>
                                    interest.id === editingInterest.id
                                      ? { ...interest, skill: data.skill }
                                      : interest
                                );
                                setInterestsData(updatedInterests);
                                handleaddskills(data, editingInterest);
                              } else {
                                // Add new interest
                                const newInterest = {
                                  id: String(Date.now()),
                                  skill: data.skill,
                                };
                                setInterestsData((prevInterests) => [
                                  ...prevInterests,
                                  newInterest,
                                ]);
                                handleaddskills(data, editingInterest);
                              }
                              setIsAddInterestFormOpen(false);
                              setEditingInterest(null);
                            }}
                            initialData={{
                              skill: editingInterest
                                ? editingInterest.skill
                                : "",
                              notifyFollowers: false,
                            }}
                            isEditing={!!editingInterest}
                            key={editingInterest ? editingInterest.id : "new"}
                          />

                          {/* Licenses and Certification Card */}
                          <div
                            className={`w-full lg:w-1/2 bg-white  rounded-xl p-6 ${
                              activeTab === "about" || activeTab === "About"
                                ? "block"
                                : "hidden lg:block"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-4">
                              <h2 className="text-lg font-medium">
                                Licenses and Certification
                              </h2>
                              <div className="flex gap-4">
                                <button
                                  onClick={() =>
                                    setShowCertEditButtons(!showCertEditButtons)
                                  }
                                  className="text-gray-500 hover:text-blue-500"
                                >
                                  <img src={edit} alt="" />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingCertification(null);
                                    setIsCertificationFormOpen(true);
                                  }}
                                  className="flex items-center space-x-1 bg-maincl text-white px-1 py-1 rounded-full hover:bg-fillc text-sm"
                                >
                                  <FaPlus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Certification List */}
                            {userDetails?.certificates.length === 0 ? (
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
                                  {userDetails?.certificates
                                    ?.slice(
                                      0,
                                      showAllCertifications
                                        ? certificationData.length
                                        : 2
                                    )
                                    .map((cert: any) => (
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
                                              {showCertEditButtons && (
                                                <button
                                                  onClick={() => {
                                                    setEditingCertification(
                                                      cert
                                                    );
                                                    setIsCertificationFormOpen(
                                                      true
                                                    );
                                                  }}
                                                  className="text-gray-400 hover:text-gray-600"
                                                >
                                                  <img
                                                    src={edit}
                                                    alt="Edit"
                                                    className="w-4 h-4"
                                                  />
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </li>
                                    ))}
                                </ul>

                                {/* Footer Link - Only show if there are more than 2 certifications */}
                                {userDetails?.certificates.length > 2 && (
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
                        {/* Certification Form */}
                        <CertificationForm
                          isOpen={isCertificationFormOpen}
                          onClose={() => {
                            setIsCertificationFormOpen(false);
                            setEditingCertification(null);
                          }}
                          onSubmit={(data: CertificationFormData) => {
                            if (editingCertification) {
                              // Update existing certification
                              const updatedCertifications =
                                certificationData.map((cert) =>
                                  cert.id === editingCertification.id
                                    ? {
                                        ...cert,
                                        certificateName: data.certificateName,
                                        issuingOrganisation:
                                          data.issuingOrganisation,
                                        issueDate: data.issueDate,
                                        logo:
                                          data.logo instanceof File
                                            ? URL.createObjectURL(data.logo)
                                            : cert.logo,
                                      }
                                    : cert
                                );
                              setCertificationData(updatedCertifications);
                              handleaddCertificate(data, editingCertification);
                            } else {
                              // Add new certification
                              const newCertification = {
                                id: String(Date.now()),
                                certificateName: data.certificateName,
                                issuingOrganisation: data.issuingOrganisation,
                                issueDate: data.issueDate,
                                logo:
                                  data.logo instanceof File
                                    ? URL.createObjectURL(data.logo)
                                    : "https://cdn.builder.io/api/v1/image/assets/TEMP/e6f21b8e48966c867e6781375245b708b2595a844a18bfe5cb5ae20e42019372",
                              };
                              setCertificationData([
                                ...certificationData,
                                newCertification,
                              ]);
                              handleaddCertificate(data, editingCertification);
                            }
                            setIsCertificationFormOpen(false);
                            setEditingCertification(null);
                          }}
                          initialData={
                            editingCertification
                              ? {
                                  certificateName:
                                    editingCertification.certificateName,
                                  issuingOrganisation:
                                    editingCertification.issuingOrganisation,
                                  issueDate: editingCertification.issueDate,
                                  logo: editingCertification.logo,
                                  notifyFollowers: false,
                                }
                              : undefined
                          }
                          isEditing={!!editingCertification}
                        />

                        {/* Memberships */}
                        <div
                          className={`bg-white rounded-xl py-8 lg:px-6 px-4 mt-3 ${
                            activeTab === "memberships" ||
                            activeTab === "Memberships"
                              ? "block"
                              : "hidden lg:block"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-medium">Memberships</h2>
                            <div className="flex gap-4">
                              <button
                                onClick={() =>
                                  setShowEditButtons(!showEditButtons)
                                }
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <img src={edit} alt="" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingMembership(null); // Clear any existing editing membership
                                  setIsAddMembershipFormOpen(true);
                                }}
                                className="flex items-center space-x-1 bg-maincl text-white px-1 py-1 rounded-full hover:bg-fillc text-sm"
                              >
                                <FaPlus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Membership List */}
                          {userDetails?.memberships.length === 0 ? (
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
                              {!isMobile &&
                                userDetails?.memberships.length > 4 && (
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
                                className={`${
                                  isMobile
                                    ? "flex flex-col space-y-4"
                                    : "overflow-x-hidden no-scrollbar scrollbar-hide scroll-smooth"
                                }`}
                              >
                                <div
                                  className={`${
                                    isMobile ? "space-y-4" : "flex gap-6"
                                  }`}
                                >
                                  {userDetails?.memberships.map(
                                    (membership: any) => (
                                      <div
                                        key={membership.id}
                                        className={`flex items-center  justify-between pb-4 border-b   ${
                                          !isMobile && " min-w-[200px] "
                                        }`}
                                      >
                                        <div className="flex items-center gap-3">
                                          <img
                                            src={membershipIcon}
                                            alt={membership.name}
                                            className="w-10 h-10 rounded-full"
                                          />
                                          <div>
                                            <p className="font-medium text-sm">
                                              {membership.societyname}
                                            </p>
                                            <p className=" text-xs text-gray-500">
                                              {membership.relatedDepartment}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              {membership.position}
                                            </p>
                                          </div>
                                        </div>
                                        {showEditButtons && (
                                          <button
                                            onClick={() => {
                                              setEditingMembership(membership);
                                              setIsAddMembershipFormOpen(true);
                                            }}
                                            className="text-gray-400 hover:text-gray-600"
                                          >
                                            <img
                                              src={edit}
                                              alt="Edit"
                                              className="w-4 h-4"
                                            />
                                          </button>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        {/* Membership Form Modal */}
                        {isAddMembershipFormOpen && (
                          <MembershipForm
                            isOpen={isAddMembershipFormOpen}
                            onClose={() => {
                              setIsAddMembershipFormOpen(false);
                              setEditingMembership(null);
                            }}
                            onSubmit={(data: MembershipFormData) => {
                              if (editingMembership) {
                                // Update existing membership
                                const updatedMemberships = memberships.map(
                                  (membership) =>
                                    membership.id === editingMembership.id
                                      ? {
                                          ...membership,
                                          name: data.name,
                                          category: data.category,
                                          position: data.position,
                                          membershipId: data.membershipId,
                                          // Keep the existing image if no new file is provided
                                        }
                                      : membership
                                );

                                setMemberships(updatedMemberships);
                                handleaddMemberships(data, editingMembership);
                              } else {
                                // Add new membership
                                const newMembership: Membership = {
                                  id: Date.now(),
                                  name: data.name,
                                  category: data.category,
                                  position: data.position,
                                  membershipId: data.membershipId,
                                };
                                setMemberships([...memberships, newMembership]);
                                handleaddMemberships(data, editingMembership);
                              }
                              setIsAddMembershipFormOpen(false);
                              setEditingMembership(null);
                            }}
                            initialData={
                              editingMembership
                                ? {
                                    name: editingMembership.name || "",
                                    category: editingMembership.category || "",
                                    position: editingMembership.position || "",
                                    membershipId:
                                      editingMembership.membershipId || "",
                                    notifyFollowers: false,
                                  }
                                : undefined
                            }
                            isEditing={!!editingMembership}
                          />
                        )}

                        {/* Awards and Achievements */}
                        <div
                          className={`bg-white rounded-xl p-6 mt-3 ${
                            activeTab === "about" || activeTab === "About"
                              ? "block"
                              : "hidden lg:block"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium">
                              Awards and Achievements
                            </h2>
                            <div className="flex gap-4">
                              <button
                                onClick={() =>
                                  setShowEditButtons(!showEditButtons)
                                }
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <img src={edit} alt="" /> {/* Edit Icon */}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingAward(null); // Clear any existing editing award
                                  setIsAwardFormOpen(true);
                                }}
                                className="flex items-center space-x-1 bg-maincl text-white px-1 py-1 rounded-full hover:bg-fillc text-sm"
                              >
                                <FaPlus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Awards List */}
                          <div>
                            {userDetails?.awards.length === 0 ? (
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
                                {userDetails?.awards
                                  .slice(0, expanded ? awards.length : 2)
                                  .map((award: any) => (
                                    <div
                                      key={award.id}
                                      className="border-b pb-4 mb-4 last:border-none"
                                    >
                                      <div className="flex justify-between">
                                        <div>
                                          <h3 className="text-base font-semibold ">
                                            {award.awardName}
                                          </h3>
                                          <p className="text-gray-600 font-light text-sm">
                                            {award.awardedBy} ({award.awardedOn}
                                            )
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
                                        {showEditButtons && (
                                          <button
                                            onClick={() => {
                                              // Set the award data to edit
                                              setEditingAward({
                                                id: award.id,
                                                title: award.awardName,
                                                organization: award.awardedBy,
                                                year: award.awardedOn,
                                                description: award.descreption,
                                                credentialLink:
                                                  award.awardMedia || "",
                                              });
                                              setIsAwardFormOpen(true);
                                            }}
                                            className="text-gray-400 hover:text-gray-600"
                                          >
                                            <img
                                              src={edit}
                                              alt="Edit"
                                              className="w-4 h-4"
                                            />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  ))}

                                {/* Expand Button - Only show if there are more than 2 awards */}
                                {userDetails?.awards.length > 2 && (
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
                        {/* Award Form Modal */}
                        <AwardForm
                          isOpen={isAwardFormOpen}
                          onClose={() => {
                            setIsAwardFormOpen(false);
                            setEditingAward(null);
                          }}
                          onSubmit={(data: AwardFormData) => {
                            if (editingAward) {
                              // Update existing award
                              const updatedAwards = awards.map((award) =>
                                award.id === editingAward.id
                                  ? { ...award, ...data }
                                  : award
                              );
                              setAwards(updatedAwards);
                              handleaddaward(data, editingAward);
                            } else {
                              // Add new award
                              const newAward = {
                                id: Date.now(),
                                ...data,
                              };
                              setAwards([...awards, newAward]);
                              handleaddaward(data, editingAward);
                            }
                            setIsAwardFormOpen(false);
                            setEditingAward(null);
                          }}
                          initialData={
                            editingAward
                              ? {
                                  title: editingAward.title,
                                  organization: editingAward.organization,
                                  year: editingAward.year,
                                  description: editingAward.description,
                                  notifyFollowers: false,
                                  credentialLink:
                                    editingAward.credentialLink || "",
                                }
                              : undefined
                          } // Transform Award to AwardFormData
                          isEditing={!!editingAward}
                        />
                      </div>
                    )}
                    {activeDesktopTab === "activity" && (
                      <div className="space-y-3">
                        {/* Posts Section */}
                        <div className=" bg-white relative group p-2 rounded-2xl">
                          <div className="flex bg-white justify-between items-center ">
                            <h2 className="text-xl p-4 font-medium">
                              Posts{" "}
                              <span className="text-gray-500 text-md">
                                {" "}
                                ({userDetails?.posts.length})
                              </span>
                            </h2>
                            {userDetails?.posts.length > 2 && (
                              <button
                                onClick={() => setShowAllPosts(!showAllPosts)}
                                className="text-fillc text-sm font-medium flex items-center gap-1"
                              >
                                {showAllPosts ? "Show Less" : "See all Posts"}
                                <img
                                  src={arrowright}
                                  alt=""
                                  className={`transform ${
                                    showAllPosts ? "rotate-180" : ""
                                  } w-4 h-4`}
                                />
                              </button>
                            )}
                          </div>

                          {userDetails?.posts.length === 0 ? (
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
                            <div className="Z">
                              <button
                                className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${
                                  showAllPosts ? "opacity-100" : "opacity-0"
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
                                className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${
                                  showAllPosts ? "opacity-100" : "opacity-0"
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
                                  {userDetails?.posts.map((post: any) => (
                                    <div
                                      key={post.id}
                                      className="w-[450px] flex-none"
                                    >
                                      <PostCard
                                        userTitle={post.title}
                                        userImage={userDetails?.profile_picture}
                                        userName={userDetails.name}
                                        timeAgo={post.time}
                                        content={post.description}
                                        likes={post._count.likes}
                                        reposts={0}
                                        comments={post._count.comments}
                                        images={post.postImageLinks}
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
                        <div className=" bg-white p-2 rounded-2xl relative group">
                          <div className="flex bg-white  justify-between items-center">
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
                                  className={`transform ${
                                    showAllQuestions ? "rotate-180" : ""
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
                                className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${
                                  showAllQuestions ? "opacity-100" : "opacity-0"
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
                                className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${
                                  showAllQuestions ? "opacity-100" : "opacity-0"
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
                                  {userDetails?.questions?.map(
                                    (question: any) => (
                                      <div
                                        key={question.id}
                                        className="w-[450px] flex-none"
                                      >
                                        <QuestionCard
                                          userImage={
                                            userDetails?.profile_picture
                                          }
                                          userName={userDetails?.name}
                                          userTitle={`${userDetails?.bio}`}
                                          timeAgo={question.timeAgo}
                                          questionTitle={question.question}
                                          questionContent={
                                            question.question_description
                                          }
                                          images={
                                            question?.question_image_links
                                          }
                                          answers={question._count.answers}
                                          shares={0}
                                        />
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Events Section */}
                    {activeDesktopTab === "events" && (
                      <div>
                        <div className="w-full">
                          <EventCalendar />
                        </div>
                      </div>
                    )}
                    {activeDesktopTab === "jobs" && (
                      <div className="bg-white rounded-2xl">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className=" p-4 text-xl font-medium">
                            Jobs{" "}
                            {jobs.length > 0 && (
                              <span className="text-gray-500 text-md">
                                {" "}
                                ({jobs.length})
                              </span>
                            )}
                          </h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {jobs.map((job) => (
                            <JobsCard
                              key={job.id}
                              job={{
                                ...job,
                                startingDate: "",
                                applyBy: "",
                                numberOfApplicants: 0,
                              }}
                            />
                          ))}
                        </div>
                        {jobs.length > 0 && (
                          <button
                            onClick={() => setShowAllJobs(!showAllJobs)}
                            className="text-fillc text-sm font-medium flex just  items-center gap-1"
                          >
                            {showAllJobs ? "Show Less" : "See all Jobs"}
                            <img
                              src={arrowright}
                              alt=""
                              className={`transform ${
                                showAllJobs ? "rotate-180" : ""
                              } w-4 h-4`}
                            />
                          </button>
                        )}
                        {jobs.length < 1 && (
                          <div className="h-40 w-full bg-white flex justify-center items-center rounded-2xl ">
                            <h2 className="text-main">
                              No applications yet! Discover jobs that match your
                              skills and take the first step.
                            </h2>
                          </div>
                        )}
                      </div>
                    )}
                    {activeDesktopTab === "saved" && (
                      <div className="space-y-3">
                        {/* Saved Posts Section */}
                        <div className="bg-white relative group p-2 rounded-2xl">
                          <div className="flex bg-white justify-between items-center ">
                            <h2 className="text-xl p-4 font-medium">
                              Saved Posts{" "}
                              <span className="text-gray-500 text-md">
                                {" "}
                                ({userDetails?.posts.length})
                              </span>
                            </h2>
                            {userDetails?.posts.length > 2 && (
                              <button
                                onClick={() => setShowAllPosts(!showAllPosts)}
                                className="text-fillc text-sm font-medium flex items-center gap-1"
                              >
                                {showAllPosts ? "Show Less" : "See all Posts"}
                                <img
                                  src={arrowright}
                                  alt=""
                                  className={`transform ${
                                    showAllPosts ? "rotate-180" : ""
                                  } w-4 h-4`}
                                />
                              </button>
                            )}
                          </div>

                          {userDetails?.posts.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                              <p className="text-gray-600 text-sm">
                                No Questions yet. Save your first question to
                                not miss the Question.
                              </p>
                            </div>
                          ) : (
                            <div className="Z">
                              <button
                                className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${
                                  showAllPosts ? "opacity-100" : "opacity-0"
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
                                className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${
                                  showAllPosts ? "opacity-100" : "opacity-0"
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
                                  {userDetails?.posts.map((post: any) => (
                                    <div
                                      key={post.id}
                                      className="w-[450px] flex-none"
                                    >
                                      <PostCard
                                        userTitle={post.title}
                                        userImage={userDetails?.profile_picture}
                                        userName={userDetails.name}
                                        timeAgo={post.time}
                                        content={post.description}
                                        likes={post._count.likes}
                                        reposts={0}
                                        comments={post._count.comments}
                                        images={post.postImageLinks}
                                        shares={0}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Saved Questions Section */}
                        <div className="bg-white p-2 rounded-2xl relative group">
                          <div className="flex bg-white  justify-between items-center">
                            <h2 className="text-xl p-4 font-medium">
                              Saved Questions{" "}
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
                                  className={`transform ${
                                    showAllQuestions ? "rotate-180" : ""
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
                                className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${
                                  showAllQuestions ? "opacity-100" : "opacity-0"
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
                                className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${
                                  showAllQuestions ? "opacity-100" : "opacity-0"
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
                                  {userDetails?.questions?.map(
                                    (question: any) => (
                                      <div
                                        key={question.id}
                                        className="w-[450px] flex-none"
                                      >
                                        <QuestionCard
                                          userImage={
                                            userDetails?.profile_picture
                                          }
                                          userName={userDetails?.name}
                                          userTitle={`${userDetails?.bio}`}
                                          timeAgo={question.timeAgo}
                                          questionTitle={question.question}
                                          questionContent={
                                            question.question_description
                                          }
                                          images={
                                            question?.question_image_links
                                          }
                                          answers={question._count.answers}
                                          shares={0}
                                        />
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Saved Jobs Section */}
                        {/* <div className="space-y-4 relative group">
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-medium">
                              Saved Jobs{" "}
                              <span className="text-gray-500 text-md">
                                {" "}
                                ({savedJobs.length})
                              </span>
                            </h2>
                            {savedJobs.length > 2 && (
                              <button
                                onClick={() =>
                                  setShowAllSavedJobs(!showAllSavedJobs)
                                }
                                className="text-fillc text-sm font-medium flex items-center gap-1"
                              >
                                {showAllSavedJobs
                                  ? "Show Less"
                                  : "See all Jobs"}
                                <img
                                  src={arrowright}
                                  alt=""
                                  className={`transform ${
                                    showAllSavedJobs ? "rotate-180" : ""
                                  } w-4 h-4`}
                                />
                              </button>
                            )}
                          </div>

                          {savedJobs.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                              <p className="text-gray-600 text-sm">
                                No saved jobs yet. Start saving jobs that
                                interest you!
                              </p>
                            </div>
                          ) : (
                            <div className="relative">
                              <button
                                className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${
                                  showAllSavedJobs ? "opacity-100" : "opacity-0"
                                } transition-opacity`}
                                onClick={() => {
                                  const container = document.getElementById(
                                    "saved-jobs-scroll-container2"
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
                                className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${
                                  showAllSavedJobs ? "opacity-100" : "opacity-0"
                                } transition-opacity`}
                                onClick={() => {
                                  const container = document.getElementById(
                                    "saved-jobs-scroll-container2"
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
                                id="saved-jobs-scroll-container2"
                                className="flex overflow-x-hidden scroll-smooth"
                                style={{ scrollBehavior: "smooth" }}
                              >
                                <div className="flex gap-4 w-full  transition-transform duration-300">
                                  {savedJobs.map((job) => (
                                    <div
                                      key={job.id}
                                      className="w-[calc(50%-8px)]  flex-none"
                                    >
                                      <JobsCard
                                        job={{
                                          ...job,
                                          startingDate: "",
                                          applyBy: "",
                                          numberOfApplicants: 0,
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div> */}

                        {/* Saved Conferences Section */}
                        {/* <div className="space-y-4 relative group">
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-medium">
                              Saved Conferences{" "}
                              <span className="text-gray-500 text-md">
                                {" "}
                                ({savedConferences.length})
                              </span>
                            </h2>
                            {savedConferences.length > 2 && (
                              <button
                                onClick={() =>
                                  setShowAllConferences(!showAllConferences)
                                }
                                className="text-fillc text-sm font-medium flex items-center gap-1"
                              >
                                {showAllConferences
                                  ? "Show Less"
                                  : "See all Conferences"}
                                <img
                                  src={arrowright}
                                  alt=""
                                  className={`transform ${
                                    showAllConferences ? "rotate-180" : ""
                                  } w-4 h-4`}
                                />
                              </button>
                            )}
                          </div>

                          {savedConferences.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                              <p className="text-gray-600 text-sm">
                                No saved conferences yet. Start saving
                                conferences you're interested in!
                              </p>
                            </div>
                          ) : (
                            <div className="relative">
                              <button
                                className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${
                                  showAllConferences
                                    ? "opacity-100"
                                    : "opacity-0"
                                } transition-opacity`}
                                onClick={() => {
                                  const container = document.getElementById(
                                    "saved-conferences-scroll-container2"
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
                                className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md ${
                                  showAllConferences
                                    ? "opacity-100"
                                    : "opacity-0"
                                } transition-opacity`}
                                onClick={() => {
                                  const container = document.getElementById(
                                    "saved-conferences-scroll-container2"
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
                                id="saved-conferences-scroll-container2"
                                className="flex overflow-x-hidden  scroll-smooth"
                                style={{ scrollBehavior: "smooth" }}
                              >
                                <div className="flex gap-4 transition-transform w-full duration-300">
                                  {savedConferences.map((conference) => (
                                    <div
                                      key={conference.id}
                                      className="w-[calc(50%-8px)] flex-none"
                                    >
                                      <ConferenceCard
                                        title={conference.title}
                                        date={conference.date}
                                        speaker={conference.speaker}
                                        price={conference.price}
                                        location={conference.location}
                                        speciality={conference.speciality}
                                        image={conference.image}
                                        avatar={conference.avatar}
                                        id={conference.id}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div> */}
                      </div>
                    )}
                    {activeTab === "drafts" && (
                      <div className="text-black text-lg">
                        Drafts content will go here
                      </div>
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

export default Profile;
