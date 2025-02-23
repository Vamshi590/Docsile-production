import React from 'react';
import { Search, X } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

interface RecentSearch {
  id: string;
  text: string;
  type: 'profile' | 'search';
  user?: {
    name: string;
    avatar: string;
  };
}






const useClickOutside = (ref: React.RefObject<HTMLDivElement>, handler: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler]);
};

const SearchPopup: React.FC<SearchPopupProps> = ({
  isOpen,
  onClose,
 
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  useClickOutside(popupRef, onClose);

  const popularSearches = [
    { id: '1', text: 'Clinical case studies' },
    { id: '2', text: 'How to build a medical CV' },
    { id: '3', text: 'Latest advancements' },
    { id: '4', text: 'Medical research articles' },
    { id: '5', text: 'Conferences 2023' },
    { id: '6', text: 'Live Q&A with specialists' },
  ];

  const recentSearches: RecentSearch[] = [
    {
      id: '1',
      text: 'Conferences 2025',
      type: 'search',
    },
    {
      id: '2',
      text: 'Conferences 2025',
      type: 'search',
    },
    {
      id: '3',
      text: 'Conferences 2025',
      type: 'search',
    },
    {
      id: '2',
      type: 'profile',
      text: 'Nampally Sriram',
      user: {
        name: 'Nampally Sriram',
        avatar: "https://cdn.builder.io/api/v1/image/assets/TEMP/13d83c993760da19a222234c3cbcb356d551631f91a34653bf73ab3984455ff6"
      }
    },
    // Add more recent searches as needed
  ];

  if (!isOpen) return null;

  return (
    <div ref={popupRef} className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-[480px] mx-auto">
      {/* Popular Searches Section */}
      <div className="mb-6">
        <h3 className="text-sm font-normal text-gray-900 mb-3">Popular Searches</h3>
       
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((item) => (
            <button
              key={item.id}
              className="px-3 py-2 border border-gray-200 hover:bg-gray-100 rounded-full text-sm font-light text-fillc"
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Searches Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Searches</h3>
        <div className="space-y-2">
          {recentSearches.map((search) => (
            <div
              key={search.id}
              className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {search.type === 'profile' && search.user ? (
                  <>
                    <img
                      src={search.user.avatar}
                      alt=""
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-gray-900">{search.user.name}</span>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className='w-4 text-gray-500'/>
                    <span className="text-sm font-light text-gray-600">{search.text}</span>
                  </div>
                )}
              </div>
              <button
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full"
                onClick={() => {/* Handle remove recent search */}}
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPopup; 