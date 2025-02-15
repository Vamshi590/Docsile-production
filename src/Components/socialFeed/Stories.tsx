import * as React from "react";
import { StoriesPopup } from "./StoriesPopup";
import userconnect from "../../assets/icon/userconnect.svg"

type MediaType = "image" | "video";

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  media: {
    id: string;
    type: MediaType;
    url: string;
    duration: number;
  }[];
  uploadTime: string;
  isViewed: boolean;
  isLiked?: boolean;
}
interface UsersProfile {
  userId: string;
  userName: string;
  userAvatar: string;
}
interface StoriesProps {
  stories: Story[];
  usersProfiles: UsersProfile[];
  profile : string
}

interface ProfileData {
  userId: string;
  name: string;
  avatar: string;
}

interface MyStoryData  {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  media: {
    id: string;
    type: MediaType;
    url: string;
    duration: number;
  }[];
  uploadTime: string;
  isViewed: boolean;
  isLiked?: boolean;
}

export const Stories: React.FC<StoriesProps> = ({ stories , usersProfiles , profile}) => {
  const [selectedStoryIndex, setSelectedStoryIndex] = React.useState<number | null>(null);
  const [localStories, setLocalStories] = React.useState<Story[]>(stories);
  const MAX_STORIES = 10;


  const [profileData] = React.useState<ProfileData>({
    userId: "123",
    name: "Noah Anderson",
    avatar: "https://cdn.builder.io/api/v1/image/assets/TEMP/1d6a37aa68c806868e46fc0d99e42c21115610fa1b71c977a03eb08090c9e74c",
  });

  const [myStory, setMyStory] = React.useState<MyStoryData | null>({
    id: "my-story-1",
    userId: profileData.userId,
    userName: profileData.name,
    userAvatar: profileData.avatar,
    uploadTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isViewed: false,
    media: [
      {
        id: "my-media-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
        duration: 5,
      },
      {
        id: "my-media-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        duration: 5,
      },
    ],
  });

  // Compute hasMyStory based on myStory existence and expiration
  const hasMyStory = React.useMemo(() => {
    if (!myStory) return false;
    const now = new Date();
    return now ;
  }, [myStory]);



  const usersWithoutStories = React.useMemo(() => {
    const storyUserIds = new Set([...localStories.map(story => story.userId), profileData.userId]);
    return usersProfiles.filter(profile => !storyUserIds.has(profile.userId));
  }, [localStories, usersProfiles, profileData.userId]);

  // Calculate how many placeholder profiles to show
  const placeholdersToShow = React.useMemo(() => {
    const totalCurrentStories = localStories.length + (hasMyStory ? 1 : 1); // +1 for "my story" circle
    const remainingSlots = MAX_STORIES - totalCurrentStories;
    return Math.min(remainingSlots, usersWithoutStories.length);
  }, [localStories.length, hasMyStory, usersWithoutStories.length]);

  // Profile data
  

  // My story data
  

  // Combine my story with other stories
  const allStories = React.useMemo(() => {
    if (hasMyStory && myStory) {
      return [myStory, ...stories];
    }
    return stories;
  }, [hasMyStory, myStory, stories]);

  React.useEffect(() => {
    setLocalStories(allStories);
  }, [allStories]);

  const handleMyStoryClick = () => {
    if (hasMyStory) {
      setSelectedStoryIndex(0); // My story is always first in the list when present
    } else {
      console.log("Open story creation modal");
      // Here you would implement the story creation logic
      // Example:
      // openStoryCreationModal();
    }
  };

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
  };

  const handleCloseStories = () => {
    setSelectedStoryIndex(null);
  };

  const handleStoryView = (storyId: string) => {
    setLocalStories(prev => 
      prev.map(story => 
        story.id === storyId 
          ? { ...story, isViewed: true }
          : story 
      )
    );
    
    // Update myStory viewed status if it's my story
    if (myStory && storyId === myStory.id) {
      setMyStory(prev => prev ? { ...prev, isViewed: true } : null);
    }
  };

  const handleLikeStory = (storyId: string) => {
    setLocalStories(prev => 
      prev.map(story => 
        story.id === storyId 
          ? { ...story, isLiked: !story.isLiked }
          : story
      )
    );
  };

  // Function to add a new story (you would call this from your story creation modal)
  // const handleAddNewStory = (mediaUrl: string) => {
  //   const newStory: MyStoryData = {
  //     id: `my-story-${Date.now()}`,
  //     userId: profileData.userId,
  //     userName: profileData.name,
  //     userAvatar: profileData.avatar,
  //     uploadTime: new Date().toISOString(),
  //     isViewed: false,
  //     media: [
  //       {
  //         id: `my-media-${Date.now()}`,
  //         type: "image",
  //         url: mediaUrl,
  //         duration: 5,
  //       },
  //     ],
  //   };
  //   setMyStory(newStory);
  // };
  
  return (
    <>
      <div className="bg-white rounded-xl py-4 ">
        <div className="flex gap-4 overflow-x-auto no-scrollbar scrollbar-hide">
          <div
            className="flex-shrink-0 cursor-pointer transition-transform duration-200 hover:scale-105 relative"
            onClick={handleMyStoryClick}
          >
            <div 
              className={`w-16 h-16 rounded-full border-2 border-white relative ${
                hasMyStory 
                  ? `p-[2px] ${
                      myStory?.isViewed 
                        ? 'bg-gray-200' 
                        : 'bg-gradient-to-r from-yellow-600 via-yellow-600 to-yellow-600'
                    }`
                  : ''
              }`}
            >
              <img
                src={profile}
                alt="My Story"
                className="w-full h-full rounded-full object-cover"
              />
              {!hasMyStory && (
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center pb-1 justify-center border-2 border-white">
                  <span className="text-white text-xl leading-none">+</span>
                </div>
              )}
            </div>
            <p className="mt-1 text-[13px] text-gray-900 text-center truncate w-14">You</p>
          </div>
          
          {localStories.filter(story => story.userId !== profileData.userId).map((story, index) => (
            <div 
              key={story.id}
              className="flex-shrink-0 cursor-pointer transition-transform duration-200 hover:scale-105 relative" 
              onClick={() => handleStoryClick(hasMyStory ? index + 1 : index)}
            >
              <div 
                className={`w-16 h-16 rounded-full p-[2px] ${
                  story.isViewed 
                    ? 'bg-gray-200' 
                    : 'bg-gradient-to-r from-yellow-600 via-yellow-600 to-yellow-600'
                }`}
              >
                <img
                  src={story.userAvatar}
                  alt={story.userName}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>
              <p className="mt-1 text-[13px] text-gray-900 text-center truncate w-14">
                {story.userName}
              </p>
            </div>
          ))}

          {usersWithoutStories.slice(0, placeholdersToShow).map((profile) => (
            <div 
              key={profile.userId}
              className="flex-shrink-0 cursor-pointer transition-transform duration-200 hover:scale-105 relative"
              
            >
              <div className="w-16 h-16 rounded-full border-2 border-gray-200 relative">
                <img
                  src={profile.userAvatar}
                  alt={profile.userName}
                  className="w-full h-full rounded-full object-cover"
                />
             
                    <img src={userconnect} alt="userconnect" className="absolute -bottom-2 left-4 w-8" />
              
              </div>
              <p className="mt-1 text-[13px] text-gray-900 text-center truncate w-14">
                {profile.userName}
              </p>
            </div>
          ))}
        </div>
        
      </div>

      {selectedStoryIndex !== null && (
        <StoriesPopup
          stories={localStories}
          initialStoryIndex={selectedStoryIndex}
          onClose={handleCloseStories}
          onStoryView={handleStoryView}
          onLikeStory={handleLikeStory}
        />
      )}
    </>
  );
};