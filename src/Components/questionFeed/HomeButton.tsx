import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import location1 from '../../assets/icon/location.svg';
import logout from '../../assets/icon/logout.svg';
import settings from '../../assets/icon/settings.svg';
import language from '../../assets/icon/language.svg';
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
    { label: 'Saved', onClick: () => navigate('/saved') },
    { label: 'Analytics', onClick: () => navigate('/analytics') },
    { label: 'Be a Mentor', onClick: () => navigate('/mentor') },
    { label: 'Settings', onClick: () => navigate('/settings'), icon: <img src={settings} alt="" /> },
    { label: 'Language', onClick: () => navigate('/language'), icon: <img src={language} alt="" /> },
    { label: 'Help', onClick: () => navigate('/help'), icon: <img src={help} alt="" /> },
    { label: 'Log Out', onClick: () => navigate('/logout'), icon: <img src={logout} alt="" /> }
  ];

  return (
    <div className="fixed inset-0 z-50" style={{ background: 'rgba(0, 0, 0, 0)' }}>
      <div
        ref={popupRef}
        style={{
          position: 'fixed',
          top: `${popupPosition.top}px`,
          right: `${popupPosition.right }px`,
          width: '280px'
        }}
        className="bg-buttonclr bg-opacity-80 backdrop-blur-md  rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-2">
          <div className="flex items-start space-x-2">
            <div className='flex flex-col' >

            <img
              src={userImage}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover ml-2 mt-2"
              />
            <button
                className="mt-2 px-1 py-1 bg-maincl rounded-3xl text-white  text-fontlit hover:bg-fillc transition-colors"
                onClick={() => navigate('/profile')}
                >
                View Profile
              </button>
                </div>
            <div className="flex-1 mt-2">
              <h2 className="text-xs font-semibold text-gray-800">{userName}</h2>
              <p className="text-fontlit text-gray-600 ">{userRole}</p>
              <div className="flex items-center mt-2 gap-1 text-gray-500">
              <img src={location1} alt=""  className='w-3'/>
                <span className="text-fontlit"> {location}</span>
              </div>
              
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pb-3">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="w-full px-6 py-1 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
            >
              {item.icon && <span className="text-sm">{item.icon}</span>}
              <span className="text-gray-700 text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeButton;
