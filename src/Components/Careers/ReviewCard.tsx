import React from 'react';

interface ReviewCardProps {
  name: string;
  date: string;
  rating: number;
  description: string;
  designation: string;
  avatar:string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ name, date, rating, description, designation,avatar }) => {
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`text-yellow-500 ${i < rating ? 'font-bold' : 'opacity-30'}`}>
      ★
    </span>
  ));

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
      <div className="flex items-start gap-4">
        <img
          src={avatar}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start pb-2">
            <div> 
              <h3 className="font-medium text-sm text-black">{name} <span className="text-gray-500 text-xs ml-2">{date} </span></h3>
              <p className="text-gray-600 text-xs">{designation}</p>
            </div>
          </div>
          <p className="text-gray-700 text-xs font-normal  leading-relaxed">"{description}"</p>
          <div className="flex items-center mt-2 mb-3">
            <div className="flex">
              {stars}
            </div>
            <span className="ml-2 text-fillc text-sm">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;