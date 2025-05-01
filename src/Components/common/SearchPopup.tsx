import React, { useState } from 'react';
import { Search, X, UserPlus, Loader2 } from 'lucide-react';
import { useRef, useEffect } from 'react';
import profile from "../../assets/icon/profile.svg"
import { useNavigate } from 'react-router-dom';
interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelectUser?: (user: UserSearchResult) => void;
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

interface UserSearchResult {
  id: number;
  name: string;
  email: string;
  profilePicture: string | null;
  organisation: string | null;
  department: string | null;
  specialisation: string | null;
  category: string;
  online: boolean;
  lastSeen: string | null;
  relationshipStatus: {
    isFollowing: boolean;
    isFollower: boolean;
    isFriend: boolean;
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
  searchQuery,
  onSearchChange,
  onSelectUser
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  useClickOutside(popupRef, onClose);
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchQuery);
  
  // Store recent searches in local storage
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();


  const popularSearches = [
    { id: '1', text: 'Clinical case studies' },
    { id: '2', text: 'How to build a medical CV' },
    { id: '3', text: 'Latest advancements' },
    { id: '4', text: 'Medical research articles' },
    { id: '5', text: 'Conferences 2023' },
    { id: '6', text: 'Live Q&A with specialists' },
  ];

  // Add a search to recent searches
  const addToRecentSearches = (search: string, type: 'search' | 'profile', user?: { name: string, avatar: string }) => {
    const newSearch: RecentSearch = {
      id: Date.now().toString(),
      text: search,
      type,
      user
    };
    
    // Add to the beginning, remove duplicates, and limit to 5 items
    const updatedSearches = [newSearch, ...recentSearches.filter(s => 
      !(s.type === type && s.text.toLowerCase() === search.toLowerCase())
    )].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };
  
  // Remove a search from recent searches
  const removeRecentSearch = (id: string) => {
    const updatedSearches = recentSearches.filter(search => search.id !== id);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Perform search when debounced search term changes
  useEffect(() => {
    const searchUsers = async () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      
      setIsSearching(true);
      setSearchError(null);
      
      try {
        const currentUserId = localStorage.getItem('Id');
        if (!currentUserId) {
          setSearchError('User not authenticated');
          setIsSearching(false);
          return;
        }
        
        const response = await fetch(
          `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/messaging/search-users?query=${encodeURIComponent(debouncedSearchTerm)}&currentUserId=${currentUserId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        const data = await response.json();
        
        if (data.status === 'success') {
          setSearchResults(data.data);
        } else {
          setSearchError(data.error || 'Failed to search users');
        }
      } catch (error) {
        console.error('Error searching users:', error);
        setSearchError('Error connecting to server');
      } finally {
        setIsSearching(false);
      }
    };
    
    searchUsers();
  }, [debouncedSearchTerm]);
  
  const handleUserClick = (user: UserSearchResult) => {
    // Add to recent searches
    addToRecentSearches(user.name, 'profile', {
      name: user.name,
      avatar: user.profilePicture || 'https://via.placeholder.com/40'
    });
    navigate(`/connect/profile/${user.id}`)
    // Call the onSelectUser callback if provided
    if (onSelectUser) {
      onSelectUser(user);
    }
    
    // Close the popup
    onClose();
  };
  
  const handleSearchClick = (searchText: string) => {
    onSearchChange(searchText);
    addToRecentSearches(searchText, 'search');
  };
  
  if (!isOpen) return null;

  return (
    <div ref={popupRef} className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-[480px] max-h-[70vh] overflow-y-auto mx-auto">
      {/* Search Results Section */}
      {debouncedSearchTerm && debouncedSearchTerm.length >= 2 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Search Results</h3>
          
          {isSearching ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <span className="ml-2 text-sm text-gray-600">Searching...</span>
            </div>
          ) : searchError ? (
            <div className="text-red-500 text-sm py-2">{searchError}</div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between group hover:bg-gray-50 p-3 rounded-lg cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={user.profilePicture || profile}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {user.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">
                        {user.organisation || user.department || user.specialisation || user.category}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!user.relationshipStatus.isFollowing && (
                      <button 
                        className="p-1 text-blue-500 hover:bg-blue-50 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle follow action
                          console.log('Follow user:', user.id);
                        }}
                      >
                        <UserPlus className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      className="p-1 text-blue-500 hover:bg-blue-50 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUserClick(user);
                      }}
                    >
                      
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-sm py-2">No users found matching '{debouncedSearchTerm}'</div>
          )}
        </div>
      )}
      
      {/* Popular Searches Section */}
      {(!debouncedSearchTerm || debouncedSearchTerm.length < 2) && (
        <div className="mb-6">
          <h3 className="text-sm font-normal text-gray-900 mb-3">Popular Searches</h3>
         
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((item) => (
              <button
                key={item.id}
                className="px-3 py-2 border border-gray-200 hover:bg-gray-100 rounded-full text-sm font-light text-fillc"
                onClick={() => handleSearchClick(item.text)}
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches Section */}
      {(!debouncedSearchTerm || debouncedSearchTerm.length < 2) && recentSearches.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Searches</h3>
          <div className="space-y-2">
            {recentSearches.map((search) => (
              <div
                key={search.id}
                className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg cursor-pointer"
                onClick={() => {
                  if (search.type === 'search') {
                    handleSearchClick(search.text);
                  }
                }}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    removeRecentSearch(search.id);
                  }}
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPopup; 