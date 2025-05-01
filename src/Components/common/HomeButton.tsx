import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import location1 from '../../assets/icon/location.svg';
import logout from '../../assets/icon/logout.svg';
import settings from '../../assets/icon/settings.svg';
import help from '../../assets/icon/help.svg';


interface HomeButtonProps {
  isOpen: boolean;
  onClose: () => void;
  userImage?: string;
  userName?: string;
  userRole?: string;
  location?: string;
  buttonRef?: React.RefObject<HTMLButtonElement>;
}

const HomeButton: React.FC<HomeButtonProps> = ({
  isOpen,
  onClose,
  userImage = "https://cdn.builder.io/api/v1/image/assets/TEMP/1d6a37aa68c806868e46fc0d99e42c21115610fa1b71c977a03eb08090c9e74c?placeholderIfAbsent=true&apiKey=90dc9675c54b49f9aa0dc15eba780c08",
  userName = "Seelam Vamshidhar Goud",
  userRole = "Ophthalmologist | AIIMS Delhi'25| Aspiring Medical Professional",
  location = "Mumbai, Maharashtra, India",
  buttonRef
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [popupPosition, setPopupPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const updatePosition = () => {
      if (buttonRef?.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        setPopupPosition({
          top: buttonRect.bottom + 8,
          right: window.innerWidth - buttonRect.right
        });
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      updatePosition();
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen) return null;

  const menuItems = [
   
    { label: 'Analytics', onClick: () => navigate('/analytics') },
    { label: 'Be a Mentor', onClick: () => navigate('/mentor') },
    { label: 'Settings', onClick: () => navigate('/settings'), icon: <img src={settings} alt="" /> },

    { label: 'Help', onClick: () => navigate('/help'), icon: <img src={help} alt="" /> },
    { label: 'Log Out', onClick: () => {
      localStorage.removeItem("Id"),
      navigate('/')}, icon: <img src={logout} alt="" /> }
  ];
  const userId = localStorage.getItem("Id")

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        ref={popupRef}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: `${popupPosition.top}px`,
          right: `${popupPosition.right}px`,
          width: '240px'
        }}
        className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
      >
        {/* Profile Section */}
        <div className="p-3 bg-gradient-to-r from-maincl/5 to-fillc/5">
          <div className="flex items-center gap-2">
            <img
              src={userImage}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover ring-1 ring-white shadow-sm"
            />
            <div className="flex-1 overflow-hidden">
              <h2 className="text-xs font-semibold text-gray-800 truncate">{userName}</h2>
              <p className="text-xs text-gray-600 truncate">{userRole}</p>
              {location && (
                <div className="flex items-center mt-0.5 gap-1 text-gray-500">
                  <img src={location1} alt="Location" className="w-2.5 h-2.5" />
                  <span className="text-xs truncate">{location}</span>
                </div>
              )}
            </div>
          </div>
          <button
            className="mt-2 w-full py-1 bg-maincl rounded text-white text-xs font-medium hover:bg-fillc transition-all duration-200 shadow-sm"
            onClick={() => navigate(`/profile/${userId}`)}
          >
            View Profile
          </button>
        </div>

        {/* Menu Items */}
        <div className="py-0.5">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              {item.icon && (
                <span className="text-gray-500 w-4 h-4 flex items-center justify-center">
                  {item.icon}
                </span>
              )}
              <span className="text-gray-700 text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeButton;
