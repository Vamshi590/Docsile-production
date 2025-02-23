


import React, { useState } from 'react';
import save1 from "../../assets/icon/save1.svg"
import save2 from "../../assets/icon/save2.svg"
import time from "../../assets/icon/time.svg"
import location1 from "../../assets/icon/location.svg"
import money from "../../assets/icon/money.svg"

interface ConferenceCardProps {
  id: string;
  title: string;
  date: string;
  avatar: string;
  location: string;
  speaker: string;
  image: string;
  price?: string;
  speciality: string;
}



const ConferenceCard: React.FC<ConferenceCardProps> = ({
    id,
    title,
    date,
    avatar,
    location,
    speaker,
    speciality,
    image,
    price,
  }) => {

    const [isSaved, setIsSaved] = useState(false);

    return (
<div className="bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer">
  <div className="relative">
    <img
      src={image}
      alt={id}
      className="w-full h-24 object-cover rounded-t-xl"
    />
    <img
      src={avatar}
      alt=""
      className="absolute left-4 -bottom-8 lg:top-4 w-16 h-16 rounded-lg "
    />
  </div>

  <div className="p-4">
    <div className="flex justify-between items-start mt-4 lg:mt-1 mb-2">
      <p className="font-medium text-xs text-fillc">{speciality}</p>
      <img
        src={isSaved ? save2 : save1}
        onClick={() => setIsSaved(!isSaved)}
        alt=""
        className="cursor-pointer"
      />
    </div>

    <p className="text-sm font-medium text-gray-800 mb-3">{title}</p>

    <div className="space-y-2 mb-4">
      <div className="text-xs text-gray-500 flex items-center">
        <img src={time} alt="" className="w-3 mr-2" />
        {date}
      </div>
      <div className="text-xs text-gray-500 flex items-center">
        <img src={location1} alt="" className="w-3 mr-2" />
        {location}
      </div>
      <div className="text-xs text-gray-500 flex items-center">
        <img src={money} alt="" className="w-3 mr-2" />
        {price}
      </div>
    </div>

    <div className="mb-4">
      <p className="text-xs font-medium text-gray-700">Speaker: {speaker}</p>
    </div>

    <div className="flex gap-2">
      <button
        onClick={() => {}}
        className="px-4 py-1.5 text-xs text-white bg-maincl rounded-xl hover:bg-blue-700"
      >
        Register
      </button>
      <button
        onClick={() => {}}
        className="px-4 py-1.5 text-xs text-maincl border border-gray-200 rounded-xl hover:bg-gray-50"
      >
        View Details
      </button>
    </div>
  </div>
</div>

);
};

export default ConferenceCard;