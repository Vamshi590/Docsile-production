import * as React from "react";
import { useState } from "react";
import { NavItemProps } from "./types";
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
import logo from "../../assets/landing/logo.svg"


interface HeaderProps {
  onNotification: () => void;
  onMessage: () => void;
  onProfile: () => void;
  onSearch: (query: string) => void;
  items?: NavItemProps[];
}

const defaultNavItems: NavItemProps[] = [
  {
    activeIcon: <img src={home2} className="w-16 h-16" alt="" />,
    inactiveIcon: <img src={home1} className="w-16 h-16" alt="" />,
    label: "Home",
    path: "/home",
    isActive: false,
  },
  {
    activeIcon: <img src={questions2} className="w-16 h-16" alt="" />,
    inactiveIcon: <img src={questions1} className="w-16 h-16" alt="" />,
    label: "Questions",
    path: "/questionsfeed",
    isActive: true,
  },
  {
    activeIcon: <img src={videos2} className="w-16 h-16" alt="" />,
    inactiveIcon: <img src={videos1} className="w-16 h-16" alt="" />,
    label: "Videos",
    path: "/videos",
    isActive: false,
  },
  {
    activeIcon: <img src={connect2} className="w-16 h-16" alt="" />,
    inactiveIcon: <img src={connect1} className="w-16 h-16" alt="" />,
    label: "Connect",
    path: "/connect",
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
  onNotification,
  onMessage,
  onSearch,
  items = defaultNavItems,
}) => {
  const [navItems, setNavItems] = useState<NavItemProps[]>(items);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const profileButtonRef = React.useRef<HTMLButtonElement>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);



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
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Add your search logic here
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  return (
    <div className="flex flex-row items-center justify-between font-fontsm  w-full px-5 py-1 bg-white  ">
      {/* Logo and Search Section */}
      <div className="flex flex-row w-2/4 items-center gap-4 lg:pl-28 lg:ml-12 mx-auto ml-3">
        <div className="flex items-center gap-2 w-24 flex-shrink-0  lg:w-1/4">
          <img
            src={logo}
            alt=""
            
          />
         
        </div>

        <div className="hidden lg:block ml-8 w-3/4">
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
      <div className="flex items-center justify-end gap-2 lg:mr-28 w-2/4 ">
        <div className="hidden lg:flex items-center gap-3">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavClick(index)}
              className={`flex items-center w-16  gap-1 ${
                item.isActive ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {item.isActive ? item.activeIcon : item.inactiveIcon}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 ml-10 bg-buttonclr rounded-3xl">
          <button
            onClick={onNotification}
            className="p-1 hover:bg-gray-100 rounded-full flex shrink-0"
          >
            <img src={notifications} alt="" className="w-6 h-6  lg:hidden"  />
            <img src={notifications1} alt="" className="w-16 hidden lg:block" />
          </button>
          <button
            onClick={onMessage}
            className="p-1 hover:bg-gray-100 rounded-full flex shrink-0"
          >
            <img src={messages} alt="" className="w-6 h-6 lg:hidden " />
            <img src={messages1} alt="" className="w-16 hidden lg:block" />
          </button>
          <button
             ref={profileButtonRef}
           onClick={() => setIsProfileOpen(true)}
            className="p-1 hover:bg-gray-100 rounded-full flex shrink-0"
          >
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/1d6a37aa68c806868e46fc0d99e42c21115610fa1b71c977a03eb08090c9e74c?placeholderIfAbsent=true&apiKey=90dc9675c54b49f9aa0dc15eba780c08" alt="" className="w-7 h-7 rounded-full" />
          </button>
        </div>
      </div>
      <HomeButton
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        buttonRef={profileButtonRef}
      />
    </div>
  );
};
