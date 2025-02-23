import save1 from "../../assets/icon/save1.svg";
import save2 from "../../assets/icon/save2.svg";
import money from "../../assets/icon/money.svg";
import locations from "../../assets/icon/location.svg";
import { useState } from "react";

export interface JobCardProps {
  job: {
    department: string;
    image: string;
    date: string;
    name: string;
    location: string;
    amount: string;
    startingDate: string;
    applyBy: string;
    numberOfApplicants: number;
  };
}

export const JobsCard: React.FC<JobCardProps> = ({ job }) => {
  const [isSaved, setIsSaved] = useState(false);
  return (
    <div className=" ">
      <div className="overflow-x-auto   gap-2 font-fontsm ">
        <div className="min-w-[250px] bg-white rounded-xl p-3   shadow-md mb-3 border border-gray-100 ">

          <div className="flex justify-between">
            <div className="flex">
              <div className="flex justify-center ">
                 <img src={job.image} alt="" className="w-14 h-14 rounded-full object-cover mt-1 mr-2" />
                </div>
              <div className="flex  flex-col justify-start items-start p-1  mb-1">
                  <p className="font-medium text-sm   text-fillc">{job.department}</p>
                 <p className="text-xs text-gray-600 font-light  line-clamp-1">{job.name}</p>
                   <p className="text-xs font-normal text-gray-500">{job.date} </p>
              </div>
            </div>

            <div className="flex justify-end pr-2">
               <img
                 src={isSaved ? save2 : save1}
                 onClick={() => setIsSaved(!isSaved)}
                 alt=""
                />
            </div>
          </div>
          <div className="p-3 text-start ">
            {/* Mutual info with line clamp */}
            <div className="flex flex-col items- mb-2 ">
              <div className="text-fontlit text-gray-400 pt-1 line-clamp-2 flex">
                <img src={locations} alt="" className="w-3 mr-1" /> {job.location}
              </div>
              <div className="text-fontlit text-gray-400 pt-1 line-clamp-2 flex">
                <img src={money} alt="" className="w-3 mr-1" /> {job.amount}
              </div>
            </div>
            <div className="flex gap-2 ">
                        <button 
                          onClick={() => {

                          }}
                          className="px-4 py-1 text-xs text-white bg-maincl rounded-xl hover:bg-blue-700"
                        >
                          Apply
                        </button>
                        <button 
                          onClick={() => {
                          }}
                          className="px-4 py-1 text-xs text-maincl border border-gray-200 rounded-xl hover:bg-gray-50"
                        >
                          View Details
                        </button>
                      </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};
