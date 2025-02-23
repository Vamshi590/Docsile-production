import React from 'react';
import share from "../../assets/icon/share.svg";
import like from "../../assets/icon/like1.svg";
import comment from "../../assets/icon/comment1.svg";
import repost from "../../assets/icon/repost.svg";
import more1 from "../../assets/icon/more1.svg";

interface MentionedCardProps {
  userImage: string;
  userName: string;
  userTitle: string;
  timeAgo: string;
  title: string;
  content: string;
  images: string[];
  likes: number;
  comments:number;
  shares: number;
  reposts: number;
}

const MentionedCard: React.FC<MentionedCardProps> = ({
  userImage,
  userName,
  userTitle,
  comments,
  timeAgo,
  title,
  content,
  images,
  likes,
  shares,
  reposts
}) => {
  return (
    <div className="bg-white rounded-lg p-4 overflow-hidden shadow-sm border border-gray-100">
      {/* Header section */}
      <div className="">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            <div>
              <img src={userImage} alt={`${userName}'s profile`} className="w-10 h-10 rounded-full" />
            </div>
            <div>
              <h3 className="text-[15px] font-medium text-gray-900">{userName}</h3>
              <p className="text-xs text-gray-500 line-clamp-1">{userTitle}</p>
              <p className="text-xs text-gray-500">{timeAgo}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-gray-400 hover:text-gray-500">
              <img src={more1} className="w-6 h-6" alt="More options" />
            </button>
          </div>
        </div>

        {/* Content section */}
        <div className="mt-3">
          <h4 className="text-base font-medium text-gray-900">{title}</h4>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {content}
          </p>
        </div>
      </div>


      

              {/* Image grid section */}
              <div  className="relative w-full mb-4 group" >
                    
            
            
        
            <div className="relative overflow-hidden">
              <div className="flex transition-transform duration-300" >
                {images.map((image, index) => (
                  <div key={index} className="flex-none w-full lg:h-52 rounded-lg bg-gray-200">
                    <img  src={image} alt={`Post image ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
            
          </div>

      {/* Interaction buttons section */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-300">
        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
            <img src={like} alt="" className="w-5 h-5" />
            <span className="text-sm">{likes}</span>
          </button>
        </div>

        <div className="flex">
              <div className="flex">
                <button
                  className="flex items-center gap-1 text-xs text-neutral-500 hover:text-slate-700"
                >
                  <img src={comment} alt="" className="w-5 h-5" />
                </button>
              </div>

             
              <div className="flex flex-col justify-start text-xs pl-1">
                <p className="text-neutral-500 hover:text-slate-700">comments</p>
                  
                  <span>{comments}</span>
              </div>
            </div>

        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
            <img src={share} alt="" className="w-5 h-5" />
            <span className="text-sm">{shares}</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
            <img src={repost} alt="" className="w-5 h-5" />
            <span className="text-sm">{reposts}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentionedCard;
