import * as React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Header } from "../common/Header";
import { SearchBar } from "./SearchBar";
import { useState, useCallback, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import profile from "../../assets/icon/profile.svg";

// Add shimmer animation styles
const shimmerStyle = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.animate-shimmer {
  animation: shimmer 1.5s infinite linear;
}
`;

import { Navigation } from "./Navigation";
import { QuestionPost } from "./questionPost";
import JobFilterStatic from "./JobFilterCard";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import VerifyForm from "../VerifyForm";
import PostPopup from "../socialFeed/PostPopup";



interface VideoCardProps {
  videoImage: string;
  avatarImage: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ videoImage, avatarImage }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-28 xl:w-20 xl:h-36 rounded-lg overflow-hidden">
        <img
          src={videoImage}
          alt="Video Thumbnail"
          className="w-full h-full object-cover"
        />
      </div>
      <img
        src={avatarImage || profile}
        alt="Avatar"
        className="w-10 h-10 rounded-full object-cover z-10 -mt-6"
      />
    </div>
  );
};

export const QuestionFeed: React.FC = () => {
  // Add shimmer styles to the document
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = shimmerStyle;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  const location = useLocation();
  const id = location.state;
  const userId = localStorage.getItem("Id") || id;
  const [isVerifyFormOpen, setIsVerifyFormOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [postType1, setPostType1] = useState("Post");
  
  // Fetch reels with useInfiniteQuery
  const {
    data: reelsPages,
    isLoading: isReelsLoading,
  } = useInfiniteQuery<{ items: any[] }, Error>({
    queryKey: ['reels', userId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/clinical/reels/${userId}?page=${pageParam}&limit=5`
      );
      return {
        items: response.data.data.items.reelsToReturn || [],
      };
    },
    getNextPageParam: (lastPage: { items: any[] }, pages: { items: any[] }[]) =>
      lastPage?.items?.length === 5 ? pages?.length + 1 : undefined,
    enabled: !!userId,
    initialPageParam: 1,
  });
  
  if (!userId) {
    navigate("/")
  }

  const popupOpen = (type: string) => {
    setPostType1(type);
    setIsOpen(true);
  };

  const handleAskQuestion = async () => {
    const loading = toast.loading("Checking verification status");
    try {
      const response = await axios.get(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/api/check-verification`,
        {
          params: { id: userId },
        }
      );

      if (response.data.verified) {
        toast.dismiss(loading);
        toast.success("Verified redirecting to ask question");
        popupOpen("Question");
      } else {
        console.log(response);
        toast.dismiss(loading);
        toast.warning("Please complete your verification");
        setIsVerifyFormOpen(true);
      }
    } catch (e) {
      toast.dismiss(loading);
      toast.error("Something went wrong. Please try again later");
      console.error(e);
    }
  };



  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const [visible, setVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth <= 1024) {
        // Only apply for smaller screens
        if (window.scrollY > lastScrollY) {
          setVisible(false); // Hide header on scroll down
        } else {
          setVisible(true); // Show header on scroll up
        }
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const [visible2, setVisible2] = React.useState(true);
  const lastScrollY2 = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth <= 1024) {
        // Only apply for smaller screens
        if (window.scrollY > lastScrollY2.current) {
          setVisible2(false); // Hide nav on scroll down
        } else {
          setVisible2(true); // Show nav on scroll up
        }
      }
      lastScrollY2.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //BACKEND

  const [userDetails, setUserDetails] = useState<any>(localStorage.getItem("User"));
  const userid = localStorage.getItem("Id");
  

  // Track when we should force a fetch of the next page
  const [shouldForceFetch, setShouldForceFetch] = useState(false);
  // Track throttling to prevent multiple fetches
  const [isThrottled, setIsThrottled] = useState(false);
  // Track last fetch time to prevent excessive API calls
  const lastFetchTimeRef = useRef<number>(0);
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch: refetchQuestions
  } = useInfiniteQuery({
    queryKey: ['questions', userid],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const limit = 10; // Number of items per page
      
      // Update last fetch time
      lastFetchTimeRef.current = Date.now();

      try {
        const response = await axios.get(
          `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/questions/${userid}?page=${pageParam}&limit=${limit}`
        );

        if (response.data.status === 'success') {
          const items = response.data.data.items.finalQuestions || [];
          const userdetails = response.data.data.items.user;
          setUserDetails(userdetails);
          
          // IMPORTANT FIX: Force hasMore to true for testing infinite scroll
          // This will make the component always try to fetch more data
          const hasMore = pageParam < 3; // Allow up to 3 pages for testing
          
          // Reset force fetch flag after successful fetch
          setShouldForceFetch(false);
          
          // Reset throttling after a successful fetch
          setTimeout(() => {
            setIsThrottled(false);
          }, 500);

          return {
            items,
            hasMore,
            page: pageParam
          };
        } else {
          throw new Error(`API returned status: ${response.data.status}`);
        }
      } catch (error) {
        throw error;
      }
    },
    getNextPageParam: (lastPage: { items: any[]; hasMore: boolean; page: number }) => {
      // Always return the next page if hasMore is true
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5, // Match SocialFeed's stale time (5 minutes)
    refetchOnMount: false, // Match SocialFeed's behavior
    refetchOnWindowFocus: false, // Disable refetch on window focus to avoid disrupting user
    refetchInterval: false, // Keep this disabled
    enabled: !!userid, // Only run query if userid exists
    retry: 3,
    retryDelay: 1000
  });
  
  // Handle query errors separately
  if (isError) {
    // Error is already handled by the component's error state
  }



  // Extract and memoize questions data to match SocialFeed's approach
  const allQuestions = React.useMemo(() => {
    return data?.pages.flatMap(page => page.items) ?? [];
  }, [data]);
  
  // Track if we're in a fetch cooldown period
  const [fetchCooldown, setFetchCooldown] = useState(false);
  
  // Effect to handle empty questions data
  useEffect(() => {
    if (!isLoading && !isFetchingNextPage && (!allQuestions || allQuestions.length === 0)) {
      console.log('No questions found, triggering refetch');
      refetchQuestions();
    }
  }, [isLoading, isFetchingNextPage, allQuestions, refetchQuestions]);
  
  // Effect to handle force fetch when scrolling near the end
  useEffect(() => {    
    if (shouldForceFetch && hasNextPage && !isFetchingNextPage && !isThrottled && !fetchCooldown) {
      setIsThrottled(true); // Prevent multiple fetches
      setFetchCooldown(true);
      
      fetchNextPage()
        .finally(() => {
          setTimeout(() => {
            setFetchCooldown(false);
          }, 1000);
        });
    }
  }, [shouldForceFetch, hasNextPage, isFetchingNextPage, isThrottled, fetchCooldown, fetchNextPage]);
  
  // Effect to prefetch more questions when approaching the end of the list
  useEffect(() => {
    // Check if we're near the end of the list (within 3 items) and should fetch more
    const shouldFetchMore = 
      allQuestions.length >= 3 && // Have at least 3 items
      hasNextPage && // Have more pages
      !isFetchingNextPage && // Not already fetching
      !isThrottled && // Not throttled
      !fetchCooldown; // Not in cooldown period
      
    if (shouldFetchMore) {
      // Check if enough time has passed since last fetch (at least 1 second)
      const now = Date.now();
      if (now - lastFetchTimeRef.current > 1000) {
        console.log('Approaching end of questions list, prefetching more...');
        setIsThrottled(true);
        setFetchCooldown(true);
        fetchNextPage().finally(() => {
          // Add a small cooldown to prevent multiple rapid fetches
          setTimeout(() => {
            setIsThrottled(false);
            setFetchCooldown(false);
          }, 1000);
        });
      }
    }
  }, [allQuestions.length, hasNextPage, isFetchingNextPage, isThrottled, fetchCooldown, fetchNextPage]);
  
  // Monitor scroll position to trigger fetches - similar to SocialFeed's approach
  useEffect(() => {    
    const handleScroll = () => {
      // Check if we're near the bottom of the page
      const scrollPosition = window.innerHeight + window.scrollY;
      const totalHeight = document.body.offsetHeight;
      const scrollThreshold = totalHeight - 300; // 300px from bottom (more aggressive)
      
      if (scrollPosition >= scrollThreshold && hasNextPage && !isFetchingNextPage && !isThrottled && !fetchCooldown) {
        setShouldForceFetch(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasNextPage, isFetchingNextPage, isThrottled, fetchCooldown]);

  // Create a ref for the observer outside the callback
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);
  
  // Observer for the last item to trigger fetch when it becomes visible
  const observerRef = useCallback(
    (node: HTMLDivElement | null) => {
      // Clean up previous observer if it exists
      if (observerInstanceRef.current) {
        observerInstanceRef.current.disconnect();
        observerInstanceRef.current = null;
      }
      
      // If node is null, just return without setting up a new observer
      if (!node) return;
      
      // Create a new observer
      observerInstanceRef.current = new IntersectionObserver(
        (entries) => {
          const firstEntry = entries[0];
          
          if (firstEntry.isIntersecting && hasNextPage && !isFetchingNextPage && !isThrottled && !fetchCooldown) {
            setIsThrottled(true);
            setFetchCooldown(true);
            
            fetchNextPage()
              .finally(() => {
                // Reset throttle after a delay
                setTimeout(() => {
                  setIsThrottled(false);
                  setFetchCooldown(false);
                }, 1000);
              });
          }
        },
        { 
          threshold: 0.1, 
          rootMargin: '300px 0px' // Increased rootMargin to trigger even earlier
        }
      );
      
      // Start observing the node
      observerInstanceRef.current.observe(node);
    },
    [hasNextPage, isFetchingNextPage, isThrottled, fetchCooldown, fetchNextPage]
  );
  
  // Clean up the observer on component unmount
  useEffect(() => {
    return () => {
      if (observerInstanceRef.current) {
        observerInstanceRef.current.disconnect();
      }
    };
  }, []);

  if (isError) {
    toast.error("Failed to load questions");
    return null;
  }

  return (
    <div className="flex bg-mainbg flex-col min-h-screen  mx-auto  ">
      <div
        className={`bg-white border-b sticky top-0 z-50 transition-transform duration-300 ease-in-out ${visible ? "translate-y-0" : "-translate-y-full"
          } md:translate-y-0`}
      >
        <Header />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 px-4 lg:pl-1 max-w-7xl mx-auto w-full  pt-4">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-[300px] flex-shrink-0 font-fontsm">
          <div className=" sticky top-[calc(theme(spacing.20)+1px)] space-y-4">
            <JobFilterStatic />
          </div>
        </div>

        <Toaster />

        <div className="flex-1 lg:max-w-[50%] mx-auto  w-full ">
          {/* Show skeleton for input bar while loading */}
          {isLoading ? (
            <div className="bg-white font-fontsm flex justify-around rounded-xl p-4 mb-3">
              <div className="flex items-center gap-3 w-full">
                <Skeleton circle height={32} width={32} />
                <Skeleton height={24} width={180} />
              </div>
            </div>
          ) : (
            <>
              <div className="lg:hidden w-full">
                <SearchBar
                  onSearch={handleSearch}
                  onAddPost={handleAskQuestion}
                />
              </div>

              <div className="hidden lg:block w-full ">
                <div
                  className="border border-gray-100 bg-white flex justify-between px-5 items-center py-5 rounded-xl shadow-sm gap-4  "
                  onClick={handleAskQuestion}
                >
                  <div className="flex items-center gap-3">
                    <img src={userDetails?.profile_picture || profile} className="w-8 h-8 rounded-full object-cover " alt="" />
                    <p className="text-gray-400"> what would you like to ask?</p>
                  </div>

                  <button
                    className="flex gap-2 justify-center items-center self-stretch py-1.5 pr-3 pl-1.5 my-auto text-xs text-white rounded-2xl bg-maincl min-h-[29px] hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    aria-label="Add post"
                  >
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/2ee2fecfef7edf0f14d1ab33f1ada2f9d06a0c54e3ab3d353dc2c647c253134f?placeholderIfAbsent=true&apiKey=90dc9675c54b49f9aa0dc15eba780c08"
                      className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
                      alt="Add post icon"
                    />
                    <span>Ask Question</span>
                  </button>
                </div>

              </div>

              <PostPopup
                isOpen={isOpen}
                onTypeChange={setPostType1}
                onClose={() => setIsOpen(false)}
                userAvatar={userDetails?.profile_picture || profile}
                postType1={postType1}
              />
            </>
          )}


          <div className="flex-1">
            {/* Show skeletons for questions while loading */}
            {isLoading ? (
              <>
                {[1, 2, 3].map((n) => (
                  <div className="mb-4 bg-white rounded-lg p-4" key={n}>
                    <div className="flex items-center gap-3 mb-2">
                      <Skeleton circle height={36} width={36} />
                      <Skeleton height={16} width={120} />
                    </div>
                    <Skeleton height={20} width={`60%`} className="mb-2" />
                    <Skeleton height={16} width={`90%`} count={2} />
                  </div>
                ))}
              </>
            ) : allQuestions.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500">No questions found</p>
                <button 
                  onClick={() => refetchQuestions()}
                  className="mt-4 px-4 py-2 bg-maincl text-white rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Refresh
                </button>
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {/* Questions list */}
                {allQuestions.map((question, index) => {
                  // Mark multiple items near the end for observation to ensure early loading
                  const isNearEnd = index >= allQuestions.length - 3;
                  
                  // No logging needed here
                  
                  return (
                    <div
                      key={question.id}
                      ref={isNearEnd ? observerRef : null}
                      className="mb-4"
                      onClick={() => {
                        const questionData = {
                          id: question.id,
                          User: question.User,
                          asked_at: question.asked_at,
                          question: question.question,
                          question_description: question.question_description,
                          question_image_links: question.question_image_links,
                          answers: question.answers
                        };
                        navigate(`/question/questionpage/${question.id}`, {
                          state: { questionData }
                        });
                      }}
                    >
                      <QuestionPost
                        postId={question.id}
                        isUrgent={true}
                        userId={question.userId}
                        avatar={question.User?.profile_picture || profile}
                        name={question.User?.name || 'Anonymous User'}
                        bio={`${question.User?.department || ''} | ${question.User?.organisation_name || ''}`}
                        timeAgo={new Date(question.asked_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                        title={question.question}
                        content={question.question_description}
                        images={question.question_image_links}
                        agrees={question._count?.agrees || 0}
                        date={question?.asked_at}
                        shares={question._count?.shares || 0}
                        onShare={() => console.log("Share clicked")}
                        onReply={() => console.log("Reply clicked")}
                        answerImg={userDetails?.profile_picture || profile}
                        answers={question._count?.answers || 0}
                        disagrees={question._count?.disagrees || 0}
                      />
                    </div>
                  );
                })}
                
                {/* Loading indicator */}
                {isFetchingNextPage && (
                  <div className="flex justify-center py-4 mb-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                )}
                
                {/* No more questions indicator */}
                {!hasNextPage && allQuestions.length > 0 && (
                  <div className="text-center py-4 mb-8 text-gray-600">
                    No more questions to load
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block lg:max-w-[23%] xl:max-w-[25%] flex-shrink-0 font-fontsm">
          <div className="sticky top-[calc(theme(spacing.20)+1px)] space-y-4">
            {/* Explore Videos */}
            <div className="px-4 py-4 bg-fillc bg-opacity-10 rounded-xl">
              {/* Heading Section */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-base text-maincl font-medium">
                    Explore Videos
                  </h2>
                  <p className="text-gray-600 text-fontlit">
                    Videos to learn, connect, and grow in the medical field!
                  </p>
                </div>
                <button
                  onClick={handleScrollRight}
                  className="text-maincl hover:text-fillc focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              {/* Scrollable Video Cards */}
              <div
                ref={scrollContainerRef}
                className="flex space-x-4 overflow-x-auto scrollbar-hide"
                style={{
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                }}
              >
                {(() => {
                  const reels = (reelsPages?.pages as { items: any[] }[] | undefined)?.flatMap(page => page.items) || [];
                  if (isReelsLoading) {
                    return Array.from({ length: 5 }).map((_, idx) => (
                      <div key={idx} className="flex flex-col items-center animate-pulse">
                        <div className="w-16 h-28 xl:w-20 xl:h-36 rounded-lg bg-gray-100 mb-2 overflow-hidden">
                          <div className="h-full w-full bg-gradient-to-r from-gray-100 to-gray-200 animate-shimmer" 
                               style={{ backgroundSize: '200% 100%' }} />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full w-full bg-gradient-to-r from-gray-100 to-gray-200 animate-shimmer"
                               style={{ backgroundSize: '200% 100%' }} />
                        </div>
                      </div>
                    ));
                  }
                  if (!reels || reels.length === 0) {
                    return (
                      <div className="flex flex-col items-center w-full py-8">
                        <div className="w-16 h-28 xl:w-20 xl:h-36 rounded-lg bg-black mb-2" />
                        <span className="text-xs text-gray-500">No videos found</span>
                      </div>
                    );
                  }
                  return reels.map((reel: any, index: number) => (
                    <VideoCard
                      key={index}
                      videoImage={reel?.reelThumbnail || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="350"><rect width="100%" height="100%" fill="black"/></svg>'}
                      avatarImage={reel?.user?.profile_picture || profile}
                    />
                  ));
                })()}
              </div>
            </div>


          </div>
        </div>
      </div>


      <VerifyForm
        isOpen={isVerifyFormOpen}
        onClose={() => setIsVerifyFormOpen(false)}
      />

      <div
        className={`fixed lg:hidden bottom-0 left-0 z-40 w-full bg-white shadow-md p-8 transition-transform duration-300 ease-in-out ${visible2 ? "translate-y-0" : "translate-y-full"
          } md:translate-y-0`}
      >
        <Navigation />
      </div>
    </div>
  );
};
