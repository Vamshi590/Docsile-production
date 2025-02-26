import { useState } from 'react';
import { X } from 'lucide-react';
import { Navigation } from './Navigation';

import { ChevronDown, ChevronUp } from 'lucide-react';



interface Organization {
  id: string;
  name: string;
  description: string;
  avatar:string;
  mutualConnection: string;
  mutualCount: number;
  image: string;
  region: string;
  speciality?: string;
  timeAgo?:string
}


interface ProfileData {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  stats: {
    followers: number;
    posts: number;
    questions: number;
  };
}

const OrganizationPage = () => {
  const [activeTab, setActiveTab] = useState('Organization');

  // Sample data for communities
  const OrganizationData: Organization[] = Array(6).fill(null).map((_, i) => ({
    id: `Organization-${i}`,
    name: 'Visionary Circle',
    avatar:"https://cdn.builder.io/api/v1/image/assets/TEMP/13d83c993760da19a222234c3cbcb356d551631f91a34653bf73ab3984455ff6?placeholderIfAbsent=true&apiKey=90dc9675c54b49f9aa0dc15eba780c08",

    description: 'Hub for eye care professionals to connect...',
    mutualConnection: 'Bruhath Nimmani ',
    mutualCount: 56,
    timeAgo:'3 days ago',
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/1f352924c9d23559e8c19e6d726091def0f7346d30feaddbf142d2c74bc2e05e?placeholderIfAbsent=true&apiKey=90dc9675c54b49f9aa0dc15eba780c08", // Replace with actual image URL
    region: 'Mumbai Metropolitan Region',
    speciality: i > 2 ? 'Ophthalmology' : undefined
  }));




     const StatItem: React.FC<{
        value: number;
        label: string;
        className?: string;
      }> = ({ value, label, className = "" }) => (
        <div className={className}>
          <div className="font-semibold text-fillc">
            {value.toLocaleString()}
          </div>
          <div className="text-xs text-gray-800">{label}</div>
        </div>
      );
    
  
         const [profileData] = useState<ProfileData>({
            name: "Seelam Yamshidhar Goud",
            title: "Ophthalmologist",
            bio: "AIIMS Delhi'25 | Aspiring Medical Professional",
            avatar: "https://cdn.builder.io/api/v1/image/assets/TEMP/1d6a37aa68c806868e46fc0d99e42c21115610fa1b71c977a03eb08090c9e74c",
            stats: {
              followers: 546,
              posts: 90,
              questions: 5
            }
          });

          const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Calculate how many items to show based on expanded state
  const displayedPeople = isExpanded ? OrganizationData : OrganizationData.slice(0, 2);
  
  const renderOrganizationSection = (title: string, organisations: Organization[]) => (
    <div className="mt-6 font-fontsm">
    <div className="flex justify-between items-center px-4 mb-4">
      <div className="text-sm text-gray-600">{title}</div>
      <button className="text-sm text-maincl">See all</button>
    </div>
    
    <div className="flex overflow-x-auto scrollbar-hide px-4 space-x-4">
      {organisations.map((Organization) => (
        <div 
          key={Organization.id} 
          className="min-w-[160px] bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="relative ">
            <img 
              src={Organization.image} 
              alt={Organization.name}
              className="w-full h-16 object-cover rounded-t-xl"
            />
            <button
              className="absolute right-2 top-2 bg-white rounded-full p-1.5 hover:bg-gray-100"
              aria-label="Remove suggestion"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
            <img src={Organization.avatar} alt="" className='absolute right-12 lg:left-24 top-8 w-16' />
          </div>
  
          <div className="p-3 text-center pt-10">
            <h3 className="font-medium text-sm">{Organization.name}</h3>
            
            {/* Description with line clamp */}
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {Organization.description}
            </p>
            
            {/* Mutual info with line clamp */}
            <div className="flex flex-row items-center mb-2 pt-2 px-3">
              <div className="w-7 h-7 rounded-full">
                <img src={Organization.avatar} alt="" />
              </div>
              <div className="text-fontlit text-gray-400 ml-2 line-clamp-2">
                {Organization.mutualConnection} and {Organization.mutualCount} mutual connections
              </div>
            </div>
            
            <button className="mt-2 py-1 px-6 text-sm text-white bg-maincl rounded-xl font-light">
              Join
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
  
  );

  return (
    <div className="flex flex-col min-h-screen  mx-auto font-fontsm p-4">


    <div className="bg-white border-b sticky top-0 z-50"> 
      {/* Header */}
      {/* <Header
        onNotification={() => console.log('Notification clicked')}
        onMessage={() => console.log('Message clicked')}
        onProfile={() => console.log('Profile clicked')}
        onSearch={() => console.log("Profile clicked")}

      /> */}
    </div>
      



       {/* Main Content Area */}
       <div className="flex flex-1 px-4 lg:px-16 max-w-7xl mx-auto w-full gap-8 pt-2">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-[300px] flex-shrink-0 font-fontsm">
          <div className="top-[calc(theme(spacing.24)+1px)] space-y-6">
            {/* Profile Card */}
            <div className="bg-fillc bg-opacity-10 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col items-center">
                <img
                  src={profileData.avatar}
                  alt={profileData.name}
                  className="w-20 h-20 rounded-full mb-3"
                />
                <h2 className="text-base font-semibold text-gray-900 mb-0.5"><span className="text-fillc font-semibold bg-fillc bg-opacity-30 px-2 mr-1 rounded-lg">Dr.</span>
                  {profileData.name}
                </h2>
                <p className="text-sm text-gray-600 mb-1">{profileData.title}</p>
                <p className="text-xs text-gray-500 text-center mb-5">
                  {profileData.bio}
                </p>

                <div className="grid grid-cols-3 w-full gap-4 text-center  border-t pt-4">
                  <StatItem 
                    value={profileData.stats.followers} 
                    label="Followers" 
                  />
                  <StatItem 
                    value={profileData.stats.posts} 
                    label="Posts" 
                    className="border-x px-4" 
                  />
                  <StatItem 
                    value={profileData.stats.questions} 
                    label="Questions" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>




                      {/* Main Feed */}

                      <div className="flex-1 max-w-[820px] mx-auto w-full ">

              {/* Search Bar */}

              <div className="px-2 py-2 lg:hidden ">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-3xl text-sm"
                />
              </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex px-2 space-x-4 mt-2 bg-white z-10">
                {['People', 'Community', 'Organization'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-2 text-sm rounded-full transition-colors  ${
                      activeTab === tab
                        ? 'text-white bg-maincl'
                        : 'text-maincl bg-buttonclr hover:bg-gray-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>


                  
              <div className="m-4 mt-6 container mx-auto">
      <div className="flex justify-between bg-buttonclr items-center px-3 rounded-t-2xl py-2">
        <div className="text-sm text-fillc">
          Invitations ({OrganizationData.length})
        </div>
        <div 
          className="text-xs text-gray-400 cursor-pointer flex items-center gap-1"
          onClick={toggleExpand}
        >
          {isExpanded ? (
            <span className="flex items-center">Show Less <ChevronUp className="w-4 h-4" /></span>
          ) : (
            <span className="flex items-center">See More <ChevronDown className="w-4 h-4" /></span>
          )}
        </div>
      </div>
      <div className={`border border-gray-100 rounded-b-2xl shadow-lg px-4 pt-4 transition-all duration-300 ${isExpanded ? 'max-h-[1000px]' : 'max-h-[200px]'} overflow-hidden`}>
        {displayedPeople.map((person) => (
          <div key={person.id} className="flex items-center justify-between mb-3 pb-3 border-b last:border-b-0">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img src={person.avatar} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="ml-3">
                <div className="text-xs font-medium">{person.name}</div>
                <div
                  className="text-xs text-gray-500 truncate"
                  style={{ maxWidth: '100px' }}
                >
                  {person.name}
                </div>
                <div className="text-xs text-gray-400">{person.timeAgo}</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-1 text-xs text-white bg-maincl rounded-xl transition-colors hover:bg-opacity-90">
                Confirm
              </button>
              <button className="px-4 py-1 text-xs text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                Deny
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>


                   {/* organizations by Region */}
                  {renderOrganizationSection(
                    'Communities you may know in Mumbai Metropolitan Region',
                    OrganizationData.slice(0, 3)
                  )}

                  {/* organizations by Speciality */}
                  {renderOrganizationSection(
                    'Communities in the Ophthalmology Speciality',
                    OrganizationData.slice(3, 6)
                  )}







                  {/* More Suggestions */}
      <div className="px-4 mt-8 ">
        <div className='mb-6'>
        <h2 className="text-sm text-gray-700 mb-4">More Suggestions for you</h2>
        </div>
        <div className="overflow-x-auto  grid grid-cols-2 gap-2 ">
          {OrganizationData.slice(0, 4).map((Organization) => (
            <div 
              key={Organization.id} 
              className="flex bg-white rounded-xl shadow-sm border border-gray-100  flex-col text-center"
            > <div className='relative'>

              
              <img 
                src={Organization.image}
                alt={Organization.name}
                className="w-full h-20 rounded-lg object-cover"
              />

               <button
                    className="absolute right-2 top-2 bg-white rounded-full p-1.5 hover:bg-gray-100"
                    aria-label="Remove suggestion"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>

                  <img src={Organization.avatar} alt="" className='absolute right-14 lg:right-40 top-10 w-16' />
              </div>
              
              <div className="ml-3 flex-1 mt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm">{Organization.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 px-4 line-clamp-2">{Organization.description}</p>
                    <div className="flex flex-row items-center  mb-2 pt-2 px-5 ">
                  <div className="w-7 h-7 rounded-full"><img src={Organization.avatar} alt="" /></div>
                  <div className="text-fontlit text-gray-400 line-clamp-2  ">
                    {Organization.mutualConnection} and {Organization.mutualCount} mutual connections
                  </div>
                </div>
                  </div>
                 
                </div >
                <div className='mb-3'>
                <button className="mt-2 py-1 px-5 text-sm text-white bg-maincl   rounded-xl">
                  Join
                </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
              </div>




            {/* Mobile Navigation */}
           <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
                  <Navigation />
                </div>      
      
      

      </div>

    
    </div>
  );
};

export default OrganizationPage; 