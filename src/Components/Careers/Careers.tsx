import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Header } from '../common/Header';
import { X } from 'lucide-react';
import { SearchBar } from './SearchBar';
import rating from "../../assets/icon/rating.svg"
import job from "../../assets/icon/jobs.svg"
import job2 from "../../assets/icon/njob2.svg"
import resources from "../../assets/icon/resources.svg"
import resources2 from "../../assets/icon/nresources2.svg"
import cme from "../../assets/icon/cme.svg"
import cme2 from "../../assets/icon/ncme2.svg"
import membership from "../../assets/icon/membership.svg"
import membership2 from "../../assets/icon/nmembership2.svg"
import { BeAMentorModal } from './BeAMentorModal';
import profile from "../../assets/icon/profile.svg"
import { JobsPage } from './Jobs';
import ConferencePage from './ConferencePage';
import { ResourcesPage } from './ResourcePage';

interface Mentor {
    id: string;
    name: string;
    title: string;
    avatar: string;
    rating: number;
    mutualConnection: string;
    mutualCount: number;
    timeAgo?: string;
    region: string;
    institute: string;
    organization: string;
    speciality: string;
}

const MentorshipPage = () => {
    const [showAllRegions, setShowAllRegions] = useState(false);
    const [showAllInstitutes, setShowAllInstitutes] = useState(false);
    const [showAllOrganizations, setShowAllOrganizations] = useState(false);
    const [showAllSpeciality, setShowAllSpeciality] = useState(false);
    const [isBeAMentorModalOpen, setIsBeAMentorModalOpen] = useState(false);

    const scrollContainerRefs = useRef<{
        [key: string]: HTMLDivElement | null;
    }>({});

    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMentors() {
            setLoading(true);
            setError(null);
            console.log(loading);
            console.error(error);
            try {
                const response = await axios.get("/api/mentors");
                setMentors(response.data.mentors || []);
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || "Something went wrong");
                setMentors([]);
            } finally {
                setLoading(false);
            }
        }
        fetchMentors();
    }, []);

    const handleTouchScroll = (container: HTMLDivElement | null) => {
        let startX: number;
        let scrollLeft: number;

        if (!container) return;

        const onTouchStart = (e: TouchEvent) => {
            startX = e.touches[0].pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        };

        const onTouchMove = (e: TouchEvent) => {
            if (!startX) return;
            const x = e.touches[0].pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        };

        container.addEventListener('touchstart', onTouchStart);
        container.addEventListener('touchmove', onTouchMove);

        return () => {
            container.removeEventListener('touchstart', onTouchStart);
            container.removeEventListener('touchmove', onTouchMove);
        };
    };

    const toggleShowAll = (type: 'region' | 'organization' | 'institute' | 'speciality') => {
        if (type === 'region') {
            setShowAllRegions((prev) => !prev);
        } else if (type === 'institute') {
            setShowAllInstitutes((prev) => !prev);
        } else if (type === 'organization') {
            setShowAllOrganizations((prev) => !prev)
        } else {
            setShowAllSpeciality((prev) => !prev)
        }
    };

    const renderPeopleSection = (
        title: string,
   
        showAll: boolean,
        toggleShowAllCallback: () => void
    ) => {
        return (
            <div className="px-4 py-5 bg-white rounded-2xl  border border-gray-100">
                <div className="flex justify-between items-center mb-5">
                    <div className="text-base font-semibold text-gray-800">People you may know from {title}</div>
                    <button
                        onClick={toggleShowAllCallback}
                        className="text-xs font-semibold text-maincl hover:text-fillc px-3 py-1 rounded-lg transition-colors"
                    >
                        {showAll ? 'Show less' : 'See all'}
                    </button>
                </div>
                <div
                    ref={(el) => {
                        scrollContainerRefs.current[title] = el;
                        if (el) handleTouchScroll(el);
                    }}
                    className="flex space-x-6 overflow-x-auto scrollbar-hide relative scroll-smooth"
                >
                    {mentors.length === 0 ? (
                        <div className="flex bg-white flex-col items-center justify-center h-96 rounded-md w-full">
                            <svg width="160" height="160" viewBox="0 0 160 160" fill="none" className="mb-6 animate-float">
                                <ellipse cx="80" cy="140" rx="55" ry="12" fill="#E0E7FF" />
                                <rect x="45" y="40" width="70" height="60" rx="12" fill="#F3F4F6" />
                                <rect x="55" y="50" width="50" height="10" rx="5" fill="#C7D2FE" />
                                <rect x="55" y="66" width="35" height="8" rx="4" fill="#E0E7FF" />
                                <rect x="55" y="80" width="40" height="8" rx="4" fill="#E0E7FF" />
                                <circle cx="120" cy="60" r="7" fill="#A5B4FC" />
                                <circle cx="60" cy="90" r="5" fill="#A5B4FC" />
                            </svg>
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Mentors Found</h2>
                            <p className="text-gray-500 text-center max-w-xs mb-2">Be the first to join and inspire others as a mentor in the Docsile community!</p>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    };

    const handleSearch = (query: string) => {
        console.log("Searching for:", query);
    };

    const handleAddMentor = () => {
        console.log("Asking new question");
    };

    const [selectedOption, setSelectedOption] = useState<string>("mentorship");

    const handleOptionSelect = (option: string) => {
        setSelectedOption(option);
    };



    return (
        <div className="flex flex-col min-h-screen bg-mainbg font-fontsm">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-50">
                <Header
             
                />
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 px-4 max-w-7xl mx-auto w-full gap-4 pt-2 overflow-hidden">
                {/* Left Sidebar */}
                <div className="hidden lg:block min-w-[300px] max-w-[360px] flex-shrink-0 font-fontsm">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mt-2">
                        <p className="text-maincl font-medium mb-4 mt-2">Explore Careers</p>
                        <div className="space-y-2">
                            <div
                                className={`flex gap-2 p-2 cursor-pointer rounded-lg ${selectedOption === "jobs" ? "bg-fillc text-white" : "bg-buttonclr"}`}
                                onClick={() => handleOptionSelect("jobs")}
                            >
                                <img src={selectedOption === "jobs" ? job2 : job} alt="Jobs" />
                                <p>Jobs</p>
                            </div>
                            <div
                                className={`flex gap-2 p-2 cursor-pointer rounded-lg ${selectedOption === "cme" ? "bg-fillc text-white" : "bg-buttonclr"}`}
                                onClick={() => handleOptionSelect("cme")}
                            >
                                <img src={selectedOption === "cme" ? cme2 : cme} alt="Conference" />
                                <p>Conference</p>
                            </div>
                            <div
                                className={`flex gap-2 p-2 cursor-pointer rounded-lg ${selectedOption === "mentorship" ? "bg-fillc text-white" : "bg-buttonclr"}`}
                                onClick={() => handleOptionSelect("mentorship")}
                            >
                                <img className='w-5 h-5' src={selectedOption === "mentorship" ? membership2 : membership} alt="Mentorship" />
                                <p>Mentorship</p>
                            </div>
                            <div
                                className={`flex gap-2 p-2 cursor-pointer rounded-lg ${selectedOption === "resources" ? "bg-fillc text-white" : "bg-buttonclr"}`}
                                onClick={() => handleOptionSelect("resources")}
                            >
                                <img src={selectedOption === "resources" ? resources2 : resources} alt="Resources" />
                                <p>Resources</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex bg-white cursor-pointer mt-2 px-6 py-3 gap-3 items-center border border-gray-200 shadow-sm rounded-xl">
                        <img src={profile} alt="" className="w-10 h-10" />
                        <button
                            onClick={() => setIsBeAMentorModalOpen(true)}
                            className="bg-maincl text-white text-xs rounded-3xl py-1.5 px-3"
                        >
                            <span className="font-bold rounded-full px-1.5 text-white bg-fillc">+</span> be a Mentor
                        </button>
                    </div>
                    <BeAMentorModal
                        isOpen={isBeAMentorModalOpen}
                        onClose={() => setIsBeAMentorModalOpen(false)}
                    />
                </div>

                {/* Main Content (Full Width) */}
                <div className="flex-1 min-w-0 overflow-hidden w-full max-w-none">
                    {selectedOption === "jobs" && (
                        <JobsPage />
                    )}
                    {selectedOption === "cme" && (
                        <ConferencePage />
                    )}
                    {selectedOption === "resources" && (
                        <ResourcesPage />
                    )}
                    {selectedOption !== "jobs" && selectedOption !== "cme" && selectedOption !== "resources" && (
                        <>
                            {/* Search Bar (Mobile Only) */}
                            <div className="px-2 py-2 lg:hidden">
                                <div className="relative">
                                    <SearchBar onSearch={handleSearch} onAddMentor={handleAddMentor} />
                                </div>
                            </div>

                            {/* People Sections */}
                            <div className="space-y-6">
                                <div className=" rounded-2xl shadow-sm border border-gray-100 mb-4">
                                    {mentors.length === 0 ? (
                                        <div className="flex bg-white flex-col items-center justify-center h-96 rounded-md w-full mt-3">
                                            <svg width="160" height="160" viewBox="0 0 160 160" fill="none" className="mb-6 animate-float">
                                                <ellipse cx="80" cy="140" rx="55" ry="12" fill="#E0E7FF" />
                                                <rect x="45" y="40" width="70" height="60" rx="12" fill="#F3F4F6" />
                                                <rect x="55" y="50" width="50" height="10" rx="5" fill="#C7D2FE" />
                                                <rect x="55" y="66" width="35" height="8" rx="4" fill="#E0E7FF" />
                                                <rect x="55" y="80" width="40" height="8" rx="4" fill="#E0E7FF" />
                                                <circle cx="120" cy="60" r="7" fill="#A5B4FC" />
                                                <circle cx="60" cy="90" r="5" fill="#A5B4FC" />
                                            </svg>
                                            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Mentors Found</h2>
                                            <p className="text-gray-500 text-center max-w-xs mb-2">Be the first to join and inspire others as a mentor in the Docsile community!</p>
                                        </div>
                                    ) : (
                                        <>
                                            {(() => {
                                                const sections: { title: string; filterKey: keyof Mentor; filterValue: string; showAll: boolean; toggle: () => void }[] = [
                                                    {
                                                        title: 'Mumbai Metropolitan Region',
                                                        filterKey: 'region',
                                                        filterValue: 'Mumbai Metropolitan Region',
                                                        showAll: showAllRegions,
                                                        toggle: () => toggleShowAll('region')
                                                    },
                                                    {
                                                        title: 'Institute Name',
                                                        filterKey: 'institute',
                                                        filterValue: 'AIIMS Delhi',
                                                        showAll: showAllInstitutes,
                                                        toggle: () => toggleShowAll('institute')
                                                    },
                                                    {
                                                        title: 'Organization Name',
                                                        filterKey: 'organization',
                                                        filterValue: 'telangana organization',
                                                        showAll: showAllOrganizations,
                                                        toggle: () => toggleShowAll('organization')
                                                    },
                                                    {
                                                        title: 'speciality Name',
                                                        filterKey: 'speciality',
                                                        filterValue: 'Ophthalmology Speciality',
                                                        showAll: showAllSpeciality,
                                                        toggle: () => toggleShowAll('speciality')
                                                    }
                                                ];
                                                return sections.map(section => {
                                                    const filtered = mentors.filter(m => m[section.filterKey] === section.filterValue);
                                                    if (filtered.length === 0) return null;
                                                    return renderPeopleSection(
                                                        section.title,
                                                        section.showAll,
                                                        section.toggle
                                                    );
                                                });
                                            })()}
                                        </>
                                    )}
                                </div>

                                {/* More Suggestions */}
                                {mentors.length > 0 && (
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-6">
                                        <div className="mb-6">
                                            <h2 className="text-sm text-gray-700 mb-4">More Suggestions for you</h2>
                                        </div>
                                        <div className="overflow-x-auto grid grid-cols-2 gap-2">
                                            {mentors.slice(0, 4).map((mentor) => (
                                                <div
                                                    key={mentor.id}
                                                    className="flex bg-white rounded-xl shadow-sm border border-gray-100 flex-col text-center"
                                                >
                                                    <div className="relative">
                                                        <button
                                                            className="absolute right-2 top-2 bg-white rounded-full p-1.5 hover:bg-gray-100"
                                                            aria-label="Remove suggestion"
                                                        >
                                                            <X className="w-4 h-4 text-gray-400" />
                                                        </button>
                                                        <div className="flex justify-center pt-4 items-center">
                                                            <img src={mentor.avatar} alt="" className="w-16" />
                                                        </div>
                                                    </div>
                                                    <div className="ml-3 flex-1 mt-3">
                                                        <div className="flex justify-between">
                                                            <div>
                                                                <h3 className="font-medium text-sm">{mentor.name}</h3>
                                                                <p className="text-fontlit text-gray-500 mt-1 px-2 line-clamp-2">{mentor.title}</p>
                                                                <div className="flex justify-center flex-row items-center pt-1">
                                                                    <span><img src={rating} alt="" /></span>
                                                                    <p className="text-fontlit font-normal pl-1"> {mentor.rating} </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mb-3">
                                                            <button className="mt-2 py-1 px-5 text-xs text-fillc">View Profile</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>


            </div>

            {/* Mobile Navigation (if applicable) */}
            {/* <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
        <Navigation />
      </div> */}
        </div>
    );
};

export default MentorshipPage;