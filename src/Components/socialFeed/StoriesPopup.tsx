import React, { useState, useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import liked from "../../assets/icon/liked.svg"
import like from "../../assets/icon/like1.svg";
import { BsPlayFill } from 'react-icons/bs';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  media: StoryMedia[];
  uploadTime: string;
  isViewed: boolean;
  isLiked?: boolean;
  replies?: string[];
}

interface StoryMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  duration: number;
}

interface StoriesPopupProps {
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
  onStoryView: (storyId: string) => void;
  onLikeStory: (storyId: string) => void;
}

export const StoriesPopup: React.FC<StoriesPopupProps> = ({
  stories,
  initialStoryIndex,
  onClose,
  onStoryView,
  onLikeStory,
}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [progress, setProgress] = useState(0);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const currentStory = stories[currentStoryIndex];
  const currentMedia = currentStory?.media[currentMediaIndex];
  const videoRef = useRef<HTMLVideoElement>(null);

const [storyReplies, setStoryReplies] = useState<{ [key: string]: string[] }>({});

// Function to handle sending replies
const handleSendReply = () => {
  if (replyText.trim() !== '') {
    setStoryReplies(prev => ({
      ...prev,
      [currentStory.id]: [...(prev[currentStory.id] || []), replyText],
    }));
    setReplyText(''); // Clear the input after sending
  }
};

  
  useEffect(() => {
    startProgress();
    if (!currentStory.isViewed) {
      onStoryView(currentStory.id);
    }
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentStoryIndex, currentMediaIndex, isPaused]);

  const startProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    if (!isPaused) {
      setProgress(0);
      const duration = currentMedia.duration * 1000;
      const interval = 100;
      let elapsed = 0;
      
      progressInterval.current = setInterval(() => {
        elapsed += interval;
        const newProgress = (elapsed / duration) * 100;
        
        if (newProgress >= 100) {
          goToNextMedia();
        } else {
          setProgress(newProgress);
        }
      }, interval);
    }
  };

  useEffect(() => {
    const currentStory = stories[currentStoryIndex];
    // If there are existing replies for this story, keep the last reply text
    const existingReplies = storyReplies[currentStory.id] || [];
    if (existingReplies.length > 0) {
      setReplyText(existingReplies[existingReplies.length - 1]);
    } else {
      setReplyText('');
    }
  }, [currentStoryIndex, stories, storyReplies]);

  

  const goToNextMedia = () => {
    if (currentMediaIndex < currentStory.media.length - 1) {
      setCurrentMediaIndex(prev => prev + 1);
    } else if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setCurrentMediaIndex(0);
    } else {
      onClose();
    }
  };

  const goToPreviousMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(prev => prev - 1);
    } else if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setCurrentMediaIndex(stories[currentStoryIndex - 1].media.length - 1);
    }
  };

  const togglePause = () => {
    setShowMoreOptions(false);
    setIsPaused(!isPaused);
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      goToPreviousMedia();
    } else if (e.key === 'ArrowRight') {
      goToNextMedia();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentStoryIndex, currentMediaIndex]);

  const handleMoreOptionsClick = () => {
    setShowMoreOptions(!showMoreOptions);
    setIsPaused(true);
  };


  const TimeAgo:React.FC<{ timestamp: string }>  = ({ timestamp }) => {
    const getTimeAgo = (timestamp :string) => {
      const now = new Date();
      const uploadTime = new Date(timestamp);
      const diff = now.getTime() - uploadTime.getTime();

      

   
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
    
      
      if (days > 0) {
        return `${days}d ago`;
      }
      if (hours > 0) {
        return `${hours}h ago`;
      }
      if (minutes > 0) {
        return `${minutes}m ago`;
      }
      return 'Just now';
    };
  
    return (
      <p className="text-white text-sm opacity-75">
        {getTimeAgo(timestamp)}
      </p>
    );
  };


  
  return (
    <div className="fixed inset-0 bg-black rouned-lg bg-opacity-90 z-50 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute lg:top-4 top-5  lg:right-4 right-0 text-white z-10 p-2"
      >
        <IoClose size={28} />
      </button>

      {/* Previous Story Preview */}
      {currentStoryIndex > 0 && (
        <div className="absolute left-36 top-1/2 -translate-y-1/2 h-[60vh] w-[200px]  transform scale-75 transition-all duration-300">
          <img
            src={stories[currentStoryIndex - 1].media[0].url}
            alt="Previous story"
            className="w-full h-full object-cover rounded-lg opacity-50"
          />
          <img src={stories[currentStoryIndex - 1].userAvatar} alt="" className='rounded-full w-20 h-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 border-2 border-white' />

          <button
            onClick={()=>{
               goToPreviousMedia();
               setShowMoreOptions(false);
               setIsPaused(false);
               } }
            className="absolute left-96 top-1/2 -translate-y-1/2 text-white p-2"
          >
             <ChevronLeft className="w-12 h-12 text-gray-600 bg-white/80 rounded-full opacity-60 " />
          </button>
        </div>
      )}

      {/* Next Story Preview */}
      {currentStoryIndex < stories.length - 1 && (
        <div className="absolute right-36 top-1/2 -translate-y-1/2 h-[60vh] w-[200px]  transform scale-75 transition-all duration-300">
          <img
            src={stories[currentStoryIndex + 1].media[0].url}
            alt="Next story"
            className="w-full h-full object-cover rounded-lg opacity-50"
          />
          <img src={stories[currentStoryIndex + 1].userAvatar} alt="" className='rounded-full w-20 h-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 border-2 border-white' />
          <button
            onClick={()=>{
               goToNextMedia();
               setShowMoreOptions(false);
               setIsPaused(false);

               } }
            className="absolute right-96 top-1/2 -translate-y-1/2 text-white p-2"
          >
           <ChevronRight className="w-12 h-12 text-gray-600 bg-white/80 rounded-full opacity-60 " />
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="relative w-full lg:max-w-[400px]  h-[98vh] rounded-lg">
        {/* Story header */}
        <div className="absolute top-0 left-0 right-0 p-4 z-10 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={currentStory.userAvatar}
              alt={currentStory.userName}
              className="w-8 h-8 rounded-full mr-2"
            />
            <div>
              <p className="text-white font-semibold">{currentStory.userName}</p>
              <p className="text-white text-sm opacity-75"><TimeAgo timestamp={currentStory.uploadTime} /></p>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={handleMoreOptionsClick}
              className="text-white p-2"
            >
              <BsThreeDotsVertical size={20} className='absolute lg:right-2 lg:top-4 right-6 top-0' />
            </button>
            
            {showMoreOptions && (
              <div className="absolute right-0 mt-2 w-28 backdrop-blur-lg bg-opacity-70 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu">
                  <button
                    className="block px-4 py-2  text-sm text-red-700 hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                    onClick={() => {/* Handle Report */}}
                  >
                    Report
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                    onClick={() => {/* Handle Mute */}}
                  >
                    Mute
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                    onClick={() => {/* Handle Unfollow */}}
                  >
                    Unfollow
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Media content */}
        <div
          className="w-full h-full flex items-center justify-center cursor-pointer bg-black"
          onClick={togglePause}
        >
          {currentMedia.type === 'image' ? (
            <img
              src={currentMedia.url}
              alt=""
              className="h-full w-full object-contain"
            />
          ) : (
            <video
              ref={videoRef}
              src={currentMedia.url}
              autoPlay={!isPaused}
              loop={false}
              muted
              playsInline
              className="h-full w-full object-contain"
              style={{ backgroundColor: 'black' }}
            />
          )}
          {isPaused && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <BsPlayFill size={48} className="text-white" />
            </div>
          )}
        </div>

        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 flex gap-1 p-2">
          {currentStory.media.map((media, index) => (
            <div
              key={media.id}
              className="flex-1 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width: `${index === currentMediaIndex ? progress : index < currentMediaIndex ? '100' : '0'}%`
                }}
              />
            </div>
          ))}
        </div>

        {/* Reply section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-2 bg-black bg-opacity-50">
        <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Reply to story..."
              className="flex-1 bg-gray-100 bg-opacity-10 border border-white rounded-full px-4 py-1.5 text-white placeholder-white placeholder-opacity-75 focus:outline-none"
            />
            {replyText.trim() && (
              <button onClick={handleSendReply} className="text-white p-2">
                Send
              </button>
            )}
          <button
            onClick={() => onLikeStory(currentStory.id)}
            className="text-white p-2"
          >
            {currentStory.isLiked ? (
              <img src={liked} alt="" className='w-6 h-6' />
            ) : (
              <img src={like} alt="" className='w-6 h-6' />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
