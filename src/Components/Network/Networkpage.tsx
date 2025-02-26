import { useState, useRef, useEffect } from "react";
import { Header } from "./Header";
import profile from "../../assets/icon/profile.svg";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
// import seemore from "../../assets/icon/seemore.svg";
import { Navigation } from "./Navigation";
import axios from "axios";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { truncateString } from "@/functions";



const Networkpage = () => {


  const scrollContainerRefs = useRef<{
    [key: string]: HTMLDivElement | null;
  }>({});

  

  const handleTouchScroll = (container: HTMLDivElement | null) => {
    let startX: number;
    let scrollLeft: number;

    if (!container) return;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!startX) return;
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener("touchstart", onTouchStart);
    container.addEventListener("touchmove", onTouchMove);

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
    };
  };

  const StatItem: React.FC<{
    value: number;
    label: string;
    className?: string;
  }> = ({ value, label, className = "" }) => (
    <div className={className}>
      <div className="font-semibold text-fillc">{value}</div>
      <div className="text-xs text-gray-800">{label}</div>
    </div>
  );

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };


  const renderPeopleSection = (title: string, users: any[]) => {
    const handleScroll = (direction: "left" | "right", containerId: string) => {
      const container = document.getElementById(containerId);
      if (container) {
        const scrollAmount = 300;
        const scrollPosition =
          direction === "left"
            ? container.scrollLeft - scrollAmount
            : container.scrollLeft + scrollAmount;
        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    };

    return (
      <div className="border border-gray-100 rounded-2xl mt-3">
        <div className="flex justify-between bg-buttonclr items-center px-3 rounded-t-2xl py-2">
          <div className="text-sm font-medium text-main">
            People you may know from {title}
          </div>
        </div>

        <div className="relative group">
          <button
            onClick={() => handleScroll("left", `people-section-${title}`)}
            className="absolute left-3 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all duration-200 opacity-0 group-hover:opacity-100 lg:flex items-center justify-center hidden"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div
            id={`people-section-${title}`}
            ref={(el) => {
              scrollContainerRefs.current[`people-section-${title}`] = el;
              if (el) {
                handleTouchScroll(el);
              }
            }}
            className="flex space-x-3 pl-2 py-3 bg-white overflow-x-auto no-scrollbar rounded-b-xl relative scroll-smooth"
          >
            {users.map((user) => (
              <div
                key={user.id}
                className="max-w-[200px] min-h-[240px] md:min-h-[270px] relative flex-shrink-0 items-center justify-center border border-gray-100 rounded-2xl"
              >
                <button
                  className="absolute right-1 top-1 bg-white rounded-full p-1 hover:bg-gray-100 transition-colors"
                  aria-label="Remove suggestion"
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>

                <div className="w-full text-center rounded-2xl flex flex-col justify-center items-center mb-2 px-2 py-3">
                  <div>
                    <img
                      src={user.profile_picture || profile}
                      alt=""
                      className="w-20 md:w-24 md:h-24 h-20 rounded-full object-cover"
                    />
                  </div>
                  <div className="text-sm md:text-base font-medium pt-4">
                    {truncateString(user.name , 20)}
                  </div>
                  <p className="text-xs text-gray-500 my-1">
                    {truncateString(`${user.department} | ${user.organisation_name} |
                    ${user.specialisation_field_of_study}`, 75)} 
                  </p>
                  <div className="flex flex-row items-center mb-2 pt-3">
                    <div className="text-fontvlit text-gray-400">
                      {user.mutuals} mutual connections
                    </div>
                  </div>
                  <button
                    onClick={() => handleFollowClick(user.id)}
                    className={`py-1.5 px-3 w-1/2 text-xs absolute bottom-2 ${
                      followingStatus[user.id]
                        ? "text-black bg-white border border-main "
                        : "text-white bg-main border border-main"
                    } rounded-3xl transition-colors`}
                  >
                    {followingStatus[user.id] ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleScroll("right", `people-section-${title}`)}
            className="absolute right-4 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all duration-200 opacity-0 group-hover:opacity-100 lg:flex items-center justify-center hidden"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    );
  };

  //Backend

  const [userDetails, setUserDetails] = useState<any>({});

  const [suggestedConnections, setSuggestedConnections] = useState<{
    organization_matches: any[];
    location_matches: any[];
    department_matches: any[];
    invitations: any[];
    other_users: any[];
  }>({
    organization_matches: [],
    location_matches: [],
    department_matches: [],
    other_users: [],
    invitations: [],
  });

  
  const displayedPeople = isExpanded ? suggestedConnections?.invitations : suggestedConnections?.invitations?.slice(0, 2);

  const { id } = useParams();
  const userid = localStorage.getItem("Id") || id;

  const [followingStatus, setFollowingStatus] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    async function fetchConnections() {
      try {
        // Fetch suggested connections
        const suggestedResponse = await axios.get(
          `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/connections/${userid}`
        );
        setSuggestedConnections(suggestedResponse.data.response);
        setUserDetails(suggestedResponse.data.response.user);

        console.log("Suggested connections:", suggestedResponse.data);

        // Fetch network connections (followers/following)
      } catch (e) {
        console.error("Error fetching connections:", e);
      }
    }

    fetchConnections();
  }, [userid]);

  async function handleFollowClick(followingId: string) {
    setFollowingStatus((prev) => ({ ...prev, [followingId]: true }));

    try {
      const response = await axios.post(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/follow/${userid}/${followingId}`
      );

      const invalidateCache = await axios.post(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/connections/${userid}/invalidate-cache`
      );

      console.log("Invalidate cache response:", invalidateCache);

      if (response) {
        toast.success("Successfully followed!");
      }
    } catch (error) {
      setFollowingStatus((prev) => ({ ...prev, [followingId]: false }));
      toast.error("Failed to follow user");
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-mainbg  font-fontsm">
      <div className="bg-white border-b sticky top-0 z-50">
        {/* Header */}
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

      {/* Main Content Area */}
      <div className="flex flex-1 px-4 bg-mainbg max-w-7xl mx-auto w-full gap-4 pt-2 overflow-hidden">
        {/* Left Sidebar */}
        <div className="hidden lg:block min-w-[250px] max-w-[300px] flex-shrink-0 font-fontsm">
          <div className="top-[calc(theme(spacing.24)+1px)] space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-6 flex shrink shadow-sm">
              <div className="flex flex-col items-center">
                <img
                  src={userDetails?.profile_picture || profile}
                  alt={userDetails?.name}
                  className="w-20 md:w-24 md:h-24 h-20 rounded-full mb-3"
                />
                <h2 className="text-base font-semibold text-gray-900 mb-0.5">
                  <span className="text-fillc font-semibold bg-fillc bg-opacity-30 px-2 mr-1 rounded-lg">
                    Dr.
                  </span>
                  {userDetails?.name}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  {userDetails?.department}
                </p>
                <p className="text-xs text-gray-500 text-center mb-5">
                  {`${userDetails?.specialisation_field_of_study} | ${userDetails.organisation_name}`}
                </p>

                <div className="grid grid-cols-3 w-full gap-4 text-center  border-t pt-4">
                  <StatItem
                    value={userDetails?._count?.followers}
                    label="Followers"
                  />
                  <StatItem
                    value={userDetails?._count?.posts}
                    label="Posts"
                    className="border-x px-4"
                  />
                  <StatItem
                    value={userDetails?._count?.questions}
                    label="Questions"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="flex-1 min-w-0 overflow-hidden">
          {/* Search Bar */}
          <div className="px-2 py-2 lg:hidden ">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 bg-white rounded-3xl text-sm"
              />
            </div>
          </div>

          { suggestedConnections?.invitations?.length > 0 &&  <div className="w-full">
            <div className="flex justify-between bg-buttonclr items-center px-3 rounded-t-2xl py-2">
              <div className="text-sm font-medium text-main">
                Invitations ({suggestedConnections?.invitations?.length})
              </div>
              <div
                className="text-xs text-gray-400 cursor-pointer flex items-center gap-1"
                onClick={toggleExpand}
              >
                {isExpanded ? (
                  <span className="flex items-center">
                    Show Less <ChevronUp className="w-4 h-4" />
                  </span>
                ) : (
                  <span className="flex items-center">
                    See More <ChevronDown className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>
            <div
              className={`border bg-white border-gray-100 rounded-b-2xl  px-4 pt-4 transition-all duration-300 ${
                isExpanded ? "max-h-[1000px]" : "max-h-[200px]"
              } overflow-hidden`}
            >
              {displayedPeople?.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between mb-3 pb-3 border-b last:border-b-0"
                >
                  <div className="flex items-center">
                    <div className="w-12 md:w-16 md:h-16 h-12 rounded-full shrink-0">
                      <img
                        src={person?.follower?.profile_picture || profile}
                        alt=""
                        className="w-full h-full rounded-full shrink-0 object-cover"
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-xs md:text-sm font-medium">
                        {person?.follower?.name}
                      </div>
                      <div
                        className=" text-fontlit md:text-xs text-gray-500"
                        
                      >
                        {truncateString(`${person?.follower?.department} | ${person?.follower?.specialisation_field_of_study} | ${person?.follower?.organisation_name}`, 50)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {person.timeAgo}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-1 text-xs text-white bg-maincl rounded-xl transition-colors hover:bg-opacity-90">
                      Confirm
                    </button>
                    <button className="px-4 py-1 text-xs text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                      Deny
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>}

          {suggestedConnections.organization_matches?.length > 0 &&
            renderPeopleSection(
              userDetails.organisation_name,
              suggestedConnections.organization_matches
            )}

          {suggestedConnections.location_matches?.length > 0 &&
            renderPeopleSection(
              userDetails?.location,
              suggestedConnections.location_matches
            )}

          {suggestedConnections.department_matches?.length > 0 &&
            renderPeopleSection(
              userDetails?.department,
              suggestedConnections.department_matches
            )}
          {suggestedConnections.other_users?.length > 0 && (
            <div className="rounded-xl py-3 bg-white mt-3">
              <div className="text-base text-main pl-4 pb-2">
                More suggestions for you
              </div>
              {suggestedConnections.other_users.map((user) => (
                <div
                  key={user.id}
                  className="rounded-2xl bg-white border border-gray-150 my-2 m-3"
                >
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <img
                          src={user?.profile_picture || profile}
                          alt=""
                          className="w-12 md:w-16 md:h-16 h-12 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="text-sm font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500">
                          {user.department} | {user.organisation_name}
                        </div>
                        <div className="text-xs text-gray-400 mt-1 flex items-center">
                          {user.mutuals} mutual connections
                        </div>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => handleFollowClick(user.id)}
                        className={`py-1.5 px-3 text-xs ${
                          followingStatus[user.id]
                            ? "text-black bg-white border border-main "
                            : "text-white bg-maincl"
                        } rounded-3xl transition-colors`}
                      >
                        {followingStatus[user.id] ? "Following" : "Follow"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
          <Navigation />
        </div>
      </div>
    </div>
  );
};

export default Networkpage;
