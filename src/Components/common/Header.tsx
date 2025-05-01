// Centralized Header component for Docsile
// (Moved from socialFeed/profile/questionFeed/videos/Network)

import * as React from "react";
import { useState, useEffect } from "react";
import { NavItemProps } from "../socialFeed/types";
import home1 from "../../assets/icon/homel.svg";
import home2 from "../../assets/icon/lhome2.svg";
import questions1 from "../../assets/icon/lquestions1.svg";
import questions2 from "../../assets/icon/lquestion2.svg";
import videos1 from "../../assets/icon/lvideos1.svg";
import videos2 from "../../assets/icon/lvideos2.svg";
import connect1 from "../../assets/icon/lconnect1.svg";
import connect2 from "../../assets/icon/lconnect2.svg";
import notifications1 from "../../assets/icon/lnotifications1.svg"
import notifications from "../../assets/icon/notifications.svg"
import messages1 from "../../assets/icon/lmessages1.svg"
import messages from "../../assets/icon/messages.svg"
import careers1 from "../../assets/icon/lcareers1.svg";
import careers2 from "../../assets/icon/lcareers2.svg";
import SearchPopup from "./SearchPopup";
import { Search} from 'lucide-react';
import HomeButton from "./HomeButton";
import docsile from '../../assets/landing/logo.svg';
import profile from "../../assets/icon/profile.svg";
import { useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  onSearch?: (query: string) => void;
  items?: NavItemProps[];
  // All user-related props have been removed as they're now fetched directly from localStorage
}

const id = localStorage.getItem('Id');

const defaultNavItems: NavItemProps[] = [
  {
    activeIcon: <img src={home2} className="w-16 h-16" alt="" />, 
    inactiveIcon: <img src={home1} className="w-16 h-16" alt="" />, 
    label: "Home",
    path: "/feed",
    isActive: false,
  },
  {
    activeIcon: <img src={questions2} className="w-16 h-16" alt="" />, 
    inactiveIcon: <img src={questions1} className="w-16 h-16" alt="" />, 
    label: "Questions",
    path: `/question/${id}`,
    isActive: false,
  },
  {
    activeIcon: <img src={videos2} className="w-16 h-16" alt="" />, 
    inactiveIcon: <img src={videos1} className="w-16 h-16" alt="" />, 
    label: "Videos",
    path: `/videos/${id}`,
    isActive: false,
  },
  {
    activeIcon: <img src={connect2} className="w-16 h-16" alt="" />, 
    inactiveIcon: <img src={connect1} className="w-16 h-16" alt="" />, 
    label: "Connect",
    path: `/network/${id}`,
    isActive: false,
  },
  {
    activeIcon: <img src={careers2} className="w-16 h-16" alt="" />, 
    inactiveIcon: <img src={careers1} className="w-16 h-16" alt="" />, 
    label: "Careers",
    path: "/careers",
    isActive: false,
  },
];

export const Header: React.FC<HeaderProps> = ({
  onSearch = () => {},
  items = defaultNavItems,
}) => {
  // Get user details from localStorage
  const [userDetails, setUserDetails] = useState<any>(null);
  
  useEffect(() => {
    try {
      // Try to get user details from localStorage
      const storedUser = localStorage.getItem("User");
      if (storedUser) {
        setUserDetails(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error parsing user details:", error);
    }
  }, []);
  
  // Default profile image if none is available
  const profileImage = userDetails?.profile_picture || profile;
  const userName = userDetails?.name || "";
  const userRole = userDetails?.department && userDetails?.organisation_name ? 
    `${userDetails.department} | ${userDetails.organisation_name}` : "";
  const userLocation = userDetails?.city || "";
  const location = useLocation();
const [navItems, setNavItems] = useState<NavItemProps[]>(() => {
  return items.map(item => ({
    ...item,
    isActive: location.pathname === item.path
  }));
});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const profileButtonRef = React.useRef<HTMLButtonElement>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleNavClick = (index: number) => {
  const updatedItems = navItems.map((item, i) => ({
    ...item,
    isActive: i === index,
  }));
  setNavItems(updatedItems);
  navigate(updatedItems[index].path);
};

// Sync navItems' isActive with current location
React.useEffect(() => {
  setNavItems(prevItems =>
    prevItems.map(item => ({
      ...item,
      isActive: location.pathname === item.path
    }))
  );
}, [location.pathname]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Add your search logic here
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  return (
    <div className="flex flex-row items-center py-4  max-w-7xl mx-auto  justify-between font-fontsm  w-full px-5 lg:py-1 bg-white  ">
      {/* Logo and Search Section */}
      <div className="flex flex-row w-2/4 items-center gap-4   mx-auto ">
        <div className="flex items-center gap-2 w-24 lg:w-1/4 xl:w-2/12">
          <img src={docsile} alt="" />
        </div>

        <div className="hidden lg:block flex-shrink w-2/4 ">
          <form onSubmit={handleSubmit} className="relative ">
            <div className="relative">
              <input
                type="search"
                placeholder="Search"
                className="w-full px-10 py-2 bg-gray-100 rounded-full text-sm outline-none focus:bg-white focus:border focus:border-gray-300 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
              />
              {!isSearchOpen && !searchQuery && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Search className="w-4 h-4" />
                </div>
              )}
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                </button>
              )}
              <SearchPopup
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                searchQuery={searchQuery}
                onSearchChange={handleSearch}
              />
            </div>
          </form>
        </div>
      </div>

      {/* Navigation and Actions */}
      <div className="flex items-center justify-end gap-2  w-2/4  shrink ">
        <div className="hidden lg:flex items-center  lg:gap-3">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavClick(index)}
              className={`flex hover:bg-gray-100 rounded-full items-center w-14 xl:w-16  gap-1 ${
                item.isActive ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {item.isActive ? item.activeIcon : item.inactiveIcon}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-white rounded-3xl">
          <button
          
            className={`p-1 rounded-full flex shrink-0 transition-colors duration-100 ${
              location.pathname.startsWith('/notifications') ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <img src={notifications} alt="" className="w-6 h-6  lg:hidden"  />
            <img src={notifications1} alt="" className="w-14 xl:w-16 hidden lg:block" />
          </button>
          <button
            onClick={() => navigate('/messages')}
            className={`p-1 rounded-full flex shrink-0 transition-colors duration-100 ${
              location.pathname.startsWith('/messages') ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <img src={messages} alt="" className="w-6 h-6 lg:hidden " />
            <img src={messages1} alt="" className="w-14 xl:w-16 hidden lg:block" />
          </button>
          <button
             ref={profileButtonRef}
           onClick={() => setIsProfileOpen(true)}
            className={`p-1 rounded-full flex shrink-0 transition-colors duration-100 ${
              location.pathname.startsWith('/profile') ? 'bg-gray-100' : 'hover:bg-gray-100'
            }`}
          >
            <img src = {profile} alt="" className="w-7 h-7 xl:w-8 xl:h-8 rounded-full object-cover " />
          </button>
        </div>
      </div>
      <HomeButton
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        buttonRef={profileButtonRef}
        userImage={profileImage}
        userName={userName}
        userRole={userRole}
        location={userLocation}
      />
    </div>
  );
};
