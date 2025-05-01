import * as React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Header } from "../common/Header";
import { Post } from "./Post";
import { Navigation } from "./Navigation";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PostPopup from "./PostPopup";
import { Stories } from "./Stories";
import ConnectionCard1 from "./ConnectionCard1";
import ConnectionCard2 from "./ConnectionCard2";
import Slider from "./Slider";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { QuestionPost } from "../questionFeed/questionPost";
import VerifyForm from "../VerifyForm";
import askQ from "../../assets/icon/askQ.svg";
import addp from "../../assets/icon/addP.svg";
import profile from "../../assets/icon/profile.svg"
import addr from "../../assets/icon/addR.svg";

interface VideoCardProps {
  videoImage: string;
  avatarImage: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ videoImage, avatarImage }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative  w-16 h-28 xl:w-20 xl:h-36 rounded-lg overflow-hidden">
        <img
          src={videoImage}
          alt="Video Thumbnail"
          className="w-full h-full object-cover"
        />
      </div>
      <img
        src={avatarImage || profile}
        alt="Avatar"
        className="w-10 h-10 rounded-full object-cover  z-10  -mt-6"
      />
    </div>
  );
};




export const SocialFeed: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const storiesContainerRef = useRef<HTMLDivElement>(null);
  // const [isPostPopupOpen, setIsPostPopupOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [postType1, setPostType1] = useState("Post");
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const location = useLocation();
  const navigate = useNavigate()

  //id
  const id = location.state;
  const userId = localStorage.getItem("Id") || id;

  // Fetch reels with useInfiniteQuery (top-level)
  const {
    data: reelsPages,
    isLoading: isReelsLoading,
    isFetching: isReelsFetching,
    refetch: refetchReels
  } = useInfiniteQuery<{ items: any[] }, Error>({
    queryKey: ['reels', userId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/clinical/reels/${userId}?page=${pageParam}&limit=5`
      );
      console.log('Reels data fetched:', response.data.data.items.reelsToReturn);
      return {
        items: response.data.data.items.reelsToReturn || [],
      };
    },
    getNextPageParam: (lastPage: { items: any[] }, pages: { items: any[] }[]) => {
      // Add null check to prevent 'Cannot read properties of undefined (reading 'length')' error
      if (!lastPage || !lastPage.items) return undefined;
      return lastPage.items.length === 5 ? pages.length + 1 : undefined;
    },
    enabled: !!userId,
    initialPageParam: 1,
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: 1000
  });
  
  // Extract reels data for use in the component and effect hooks
  const reelsData = React.useMemo(() => {
    return (reelsPages?.pages as { items: any[] }[] | undefined)?.flatMap(page => page.items) || [];
  }, [reelsPages]);

  if (!userId) {
    navigate("/")
  }
  
  // Effect to handle empty reels data - moved from render function to component level
  useEffect(() => {
    if (!isReelsLoading && !isReelsFetching && (!reelsData || reelsData.length === 0)) {
      console.log('No reels found, triggering refetch');
      refetchReels();
    }
  }, [isReelsLoading, isReelsFetching, reelsData, refetchReels]);

  useEffect(() => {
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

  const [visible2, setVisible2] = useState(true);
  const lastScrollY2 = useRef(0);

  useEffect(() => {
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

  const popupOpen = (type: string) => {
    setPostType1(type);
    setIsOpen(true);
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleStoriesScroll = () => {
    if (storiesContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        storiesContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollStories = (direction: "left" | "right") => {
    if (storiesContainerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      storiesContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Navigation items for desktop header
  // Video data state for Explore Videos








  const StatItem: React.FC<{
    value: number;
    label: string;
    className?: string;
  }> = ({ value, label, className = "" }) => (
    <div className={className}>
      <div className="font-semibold text-fillc">{value?.toString()}</div>
      <div className="text-xs text-gray-800">{label}</div>
    </div>
  );



  //BACKEND




  const intid = parseInt(userId);
  //feed items
  const [feedItems, setFeedItems] = useState<any[]>([]);
  //recommended users
  //user details
  const [userDetails, setUserDetails] = useState<any>({});
  //verifyform popup
  const [isVerifyFormOpen, setIsVerifyFormOpen] = useState(false);

  interface FeedPage {
    items: any[];
    recommendedUsers?: any[];
  }

  //get feed with React Query
  const {
    data: queryData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<FeedPage>({
    initialPageParam: 1,
    queryKey: ["feed", userId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/feed/${userId}?page=${pageParam}&limit=7`
      );
      console.log("here it is going");
      return response.data.data;
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.items?.length === 7 ? pages.length + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false, // Only refetch when explicitly needed
    refetchInterval: false, // Disable automatic refetching
  });

  // Prefetch questions data
  const queryClient = useQueryClient();
  React.useEffect(() => {
    // Prefetch first page of questions
    queryClient.prefetchInfiniteQuery({
      queryKey: ['questions', userId],
      initialPageParam: 1,
      queryFn: async ({ pageParam = 1 }) => {
        const limit = 10;
        const response = await axios.get(
          `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/questions/${userId}?page=${pageParam}&limit=${limit}`
        );
        if (response.data.status === 'success') {
          const items = response.data.data.items.finalQuestions || [];
          const hasMore = items.length === limit;
          return {
            items,
            hasMore,
            page: pageParam
          };
        }
        throw new Error('Failed to fetch questions');
      },
      staleTime: 1000 * 60 * 5, // Match the questions page stale time
    });

    // Prefetch reels data for the reels page (using the same structure as reels-context.tsx)
    queryClient.prefetchInfiniteQuery({
      queryKey: ['reels', userId],
      initialPageParam: 1,
      queryFn: async ({ pageParam = 1 }) => {
        const response = await axios.get(
          `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/clinical/reels/${userId}?page=${pageParam}&limit=5`
        );
        // No console log needed here

        // Important: Return in the EXACT same format as used in reels-context.tsx
        return {
          data: {
            items: {
              reelsToReturn: response.data.data.items.reelsToReturn || []
            }
          }
        };
      },
      staleTime: 0, // Always fetch fresh data
    });
    
    // We don't need to prefetch page 2 for the social feed
    
    // Set the reels data to be fresh when navigating to the videos page
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['reels', userId] });
    }, 300);
  }, [userId, queryClient]);

  // Get user details with React Query - optimized to reduce calls
  const { data: userQueryData } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await axios.get(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/connections/${userId}`
      );
      console.log(response)
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // Keep data fresh for 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  // Update feed items when query data changes
  useEffect(() => {
    if (queryData) {
      const allItems = queryData.pages.flatMap((page) => page.items || []);
      setFeedItems(allItems); // Remove the conditional update to ensure new items are always added
      console.log(allItems)

    }
  }, [queryData]);

  // Update user details and connections when data changes
  useEffect(() => {
    if (userQueryData) {
      setUserDetails(userQueryData.response.user || {});
      setSuggestedConnections(userQueryData.response);
    }
  }, [userQueryData]);

  // Create a ref for the observer outside the callback
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);
  
  // Intersection Observer for infinite scroll
  const observerRef = useCallback(
    (node: HTMLDivElement) => {
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
          if (firstEntry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            console.log("Loading next page...");
            fetchNextPage();
          }
        },
        { threshold: 0.1 }
      );
      
      // Start observing the node
      observerInstanceRef.current.observe(node);
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );
  
  // Clean up the observer on component unmount
  useEffect(() => {
    return () => {
      if (observerInstanceRef.current) {
        observerInstanceRef.current.disconnect();
      }
    };
  }, []);

  const [suggestedConnections, setSuggestedConnections] = useState<{
    organization_matches: any[];
    location_matches: any[];
    department_matches: any[];
    other_users: any[];
  }>({
    organization_matches: [],
    location_matches: [],
    department_matches: [],
    other_users: [],
  });

  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());

  // Initialize liked posts from feed data
  useEffect(() => {
    if (feedItems) {
      const initialLikedPosts = new Set(
        feedItems
          .filter((item) => item?.likes?.length > 0)
          .map((item) => item.id)
      );
      setLikedPosts(initialLikedPosts);

      const initialsavedPosts = new Set(
        feedItems
          .filter((item) => item?.saves?.length > 0)
          .map((item) => item.id)
      );
      setSavedPosts(initialsavedPosts);
    }
  }, [feedItems]);

  async function handleLikeClick(postId: number) {
    // Optimistically update UI

    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });

    try {
      if (likedPosts.has(postId)) {
        await axios.delete(
          `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/dislike`,
          {
            data: { userId, postId },
          }
        );

        console.log("removed like");
      } else {
        await axios.post(
          `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/like`,
          {
            userId,
            postId,
          }
        );
        console.log("added like");
      }
    } catch (e) {
      // Revert UI on error
      setLikedPosts((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(postId)) {
          newSet.delete(postId);
        } else {
          newSet.add(postId);
        }
        return newSet;
      });
      toast.error("Failed to update like status");
    }
  }

  async function handlesave(postId: number) {
    // Optimistically update UI
    setSavedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });

    try {
      if (savedPosts.has(postId)) {
        await axios.delete(
          "https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/unsave/post",
          {
            data: {
              postId,
              userId,
              type: "post",
            },
          }
        );
      } else {
        await axios.post(
          "https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/save/post",
          {
            userId,
            postId,
            type: "post",
          }
        );
      }
    } catch (e) {
      // Revert UI on error
      setSavedPosts((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(postId)) {
          newSet.delete(postId);
        } else {
          newSet.add(postId);
        }
        return newSet;
      });
      toast.error("Failed to update save status");
    }
  }

  // Add state for comments
  // const [comments, setComments] = useState<Record<number, Array<any>>>({});

  // Add comment handler
  async function handleComment(postId: number, content: string) {
    try {
      const response = await axios.post(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/comment`,
        {
          postId,
          userId: intid,
          comment: content,
        }
      );

      if (response.data.status === "success") {
        toast.success("Comment added successfully");
      } else {
        // Only update UI on failure
        setFeedItems(prevItems =>
          prevItems.map(item => {
            if (item.id === postId) {
              return {
                ...item,
                comments: item.comments.filter(
                  (c: { comment: string; user?: { name: string } }) =>
                    !(c.comment === content && c.user?.name === userDetails.name)
                )
              };
            }
            return item;
          })
        );
        toast.error("Failed to add comment");
      }
    } catch (error) {
      // Only update UI on failure
      setFeedItems(prevItems =>
        prevItems.map(item => {
          if (item.id === postId) {
            return {
              ...item,
              comments: item.comments.filter(
                (c: { comment: string; user?: { name: string } }) =>
                  !(c.comment === content && c.user?.name === userDetails.name)
              )
            };
          }
          return item;
        })
      );
      toast.error("Failed to add comment");
    }
  }

  //add post

  async function handleAddPost() {
    const loading = toast.loading("Checking verification status");

    console.log(typeof userId);

    try {
      const response = await axios.get(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/api/check-verification`,
        {
          params: { id: userId },
        }
      );
      const verified = response.data.verified;

      if (verified) {
        toast.dismiss(loading);
        toast.success("Verified redirecting to add post");
        popupOpen("Post");
      } else {
        toast.dismiss(loading);
        toast.warning("Please verify your medical registration first");
        setIsVerifyFormOpen(true);
      }
    } catch (e) {
      toast.dismiss(loading);
      toast.error("Something went wrong. Please try again later");
      console.error(e);
    }
  }

  //ask question

  async function handleAskQuestion() {
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
  }

  async function handleAddVideo() {
    const loading = toast.loading("Checking verification status")
    try {
      const response = await axios.get(`https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/api/check-verification`, {
        params: { id: userId }
      })

      if (response.data.verified) {
        toast.dismiss(loading)
        toast.success("Verified reirecting to add video")
        popupOpen("Video")
      } else {
        console.log(response)
        toast.dismiss(loading)
        toast.warning("Please complete your verification")
        setIsVerifyFormOpen(true)
      }
    } catch (e) {
      toast.dismiss(loading)
      toast.error("Something went wrong. please try again later")
      console.error(e);
    }
  }

  // Show skeletons when feedItems are empty and query is loading
  const isInitialLoading = (!feedItems || feedItems.length === 0) && isLoading;

  return (
    <div className="flex bg-mainbg flex-col min-h-screen  mx-auto ">
      {/* Header */}
      <div
        className={`bg-white  border-b sticky top-0 z-50 transition-transform duration-300 ease-in-out ${visible ? "translate-y-0" : "-translate-y-full"
          } md:translate-y-0`}
      >
        <Header />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 lg:px-4  max-w-7xl mx-auto w-full gap-3  pt-4">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-[27%] xl:w-[23%] flex-shrink-0 font-fontsm">
          <div className="  top-[calc(theme(spacing.24)+1px)] space-y-3">
            {/* Profile Card Skeleton */}
            {isInitialLoading ? (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col items-center">
                  <Skeleton circle height={80} width={80} className="mb-3" />
                  <Skeleton height={18} width={120} className="mb-1" />
                  <Skeleton height={14} width={80} className="mb-1" />
                  <Skeleton height={14} width={140} className="mb-5" />
                  <div className="grid grid-cols-3 w-full gap-4 text-center text-sm border-t pt-4">
                    <Skeleton height={16} width={40} />
                    <Skeleton height={16} width={40} />
                    <Skeleton height={16} width={40} />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white  rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col items-center">
                    <img
                      src={userDetails.profile_picture || profile}
                      alt={userDetails.name}
                      className=" lg:w-16 xl:w-20 xl:h-20 rounded-full object-cover mb-3"
                    />
                    <h2 className="text-sm font-semibold text-gray-900 mb-0.5">
                      <span className="text-fillc font-semibold bg-fillc bg-opacity-30 px-2 mr-1 rounded-lg">
                        Dr.
                      </span>
                      {userDetails.name}
                    </h2>
                    <p className="text-xs text-gray-600 mb-1">
                      {userDetails?.department}
                    </p>
                    <p className="text-xs text-gray-500 text-center mb-5">
                      {`${userDetails?.specialisation_field_of_study} | ${userDetails?.organisation_name}`}
                    </p>

                    <div className="grid grid-cols-3 w-full gap-4 text-center text-sm  border-t pt-4">
                      <StatItem
                        value={userDetails._count?.followers}
                        label="Followers"
                      />
                      <StatItem
                        value={userDetails._count?.posts}
                        label="Posts"
                        className="border-x px-4"
                      />
                      <StatItem
                        value={userDetails._count?.questions}
                        label="Questions"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <Slider />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Feed */}
        <div className="flex-1 lg:max-w-[50%]     w-full ">
          {/* Stories Section */}
          <div className="bg-white rounded-2xl  mb-2  relative">
            {/* Left Arrow */}
            {canScrollLeft && (
              <button
                onClick={() => scrollStories("left")}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white opacity-70 rounded-full p-1 shadow-md hover:bg-gray-50"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}

            {/* Stories Container */}
            <div
              ref={storiesContainerRef}
              className="flex gap-4 p-2 overflow-x-auto  scrollbar-hide relative"
              style={{
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
              onScroll={handleStoriesScroll}
            >
              <Stories
                stories={[]}
                usersProfiles={suggestedConnections.organization_matches.map(user => ({
                  userId: user.id,
                  userName: user.name,
                  profile: userDetails.profile_picture || profile,
                  userAvatar: user.profile_picture || profile
                }))}
                profile={userDetails.profile_picture || profile}
              />
            </div>

            {/* Right Arrow */}
            {canScrollRight && (
              <button
                onClick={() => scrollStories("right")}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white opacity-70 rounded-full p-1 shadow-md hover:bg-gray-50"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>

          {/*Posting Section */}

          {/* Posting Section Skeleton */}
          {isInitialLoading ? (
            <div className="bg-white font-fontsm flex justify-around py-2 w-full rounded-xl mb-3">
              <Skeleton height={40} width={100} className="mx-2 rounded-xl" />
              <Skeleton height={40} width={100} className="mx-2 rounded-xl" />
              <Skeleton height={40} width={100} className="mx-2 rounded-xl" />
            </div>
          ) : (
            <div className=" bg-white font-fontsm flex justify-around py-1  w-full rounded-xl">
              <button
                className="flex items-center hover:bg-gray-50 rounded-xl  px-2 py-3"
                onClick={handleAskQuestion}
              >
                <img src={askQ} className="lg::w-5 lg:h-5" alt="" />
                <p className="text-xs pl-1 font-medium  text-gray-600">Ask Question </p>
              </button>

              <button
                className="flex items-center hover:bg-gray-50 rounded-xl px-2 py-3"
                onClick={handleAddPost}
              >
                <img src={addp} className="lg:w-5 lg:h-5" alt="" />
                <p className="text-xs pl-1 font-medium text-gray-600">Add Post</p>
              </button>

              <button
                className="flex items-center hover:bg-gray-50 rounded-xl px-2 py-3"
                onClick={handleAddVideo}
              >
                <img src={addr} className="lg:w-5 lg:h-5" alt="" />
                <p className="text-xs font-medium text-gray-600 pl-1">Add Video</p>
              </button>

              <PostPopup
                isOpen={isOpen}
                onTypeChange={setPostType1}
                onClose={() => setIsOpen(false)}
                userAvatar={userDetails?.profile_picture}
                postType1={postType1}
              />
            </div>
          )}

          <Toaster />

          <div className=" lg:space-y-4 mb-16 lg:mb-1">
            {/* Feed Skeletons or Actual Feed */}
            {isInitialLoading ? (
              <div className="space-y-3 xl:space-y-3">
                {[1, 2, 3].map((n) => (
                  <div className="bg-white rounded-xl p-4" key={n}>
                    <div className="flex items-center gap-3 mb-2">
                      <Skeleton circle height={36} width={36} />
                      <Skeleton height={16} width={120} />
                    </div>
                    <Skeleton height={20} width={`60%`} className="mb-2" />
                    <Skeleton height={16} width={`90%`} count={2} />
                  </div>
                ))}
              </div>
            ) : feedItems?.length > 0 ? (
              <div className=" space-y-3 xl:space-y-3">
                {/* First 3 posts */}
                {feedItems.slice(0, 3).map((item: any, index: number) => {
                  return item.posted_at ? (
                    <div key={`post-${item.id}-${index}`}>
                      <Post
                        id={item.id}
                        userId={item?.userId}
                        avatar={item.User?.profile_picture}
                        name={item.User.name}
                        bio={`${item.User.department} | ${item.User.specialisation_field_of_study} | ${item.User.organisation_name}`}
                        timeAgo={new Date(item.posted_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                        title={item.title}
                        content={item.description}
                        images={item.postImageLinks}
                        likes={item._count.likes}
                        comments={item._count.comments}
                        readcomments={item.comments}
                        shares={item._count.shares}
                        liked={likedPosts.has(item.id)}
                        reposts={0}
                        onLike={() => handleLikeClick(item.id)}
                        onComment={(postId, content) =>
                          handleComment(postId, content)
                        }
                        currentUser={userDetails}
                        handlesavepost={() => handlesave(item.id)}
                        isSaved={savedPosts.has(item.id)}
                        onShare={() => console.log("Share clicked")}
                        onRepost={() => console.log("Repost clicked")}
                        onMoreOptions={() =>
                          console.log("More options clicked")
                        }
                      />
                    </div>
                  ) : (
                    <div onClick={() => {
                      const questionData = {
                        id: item.id,
                        User: item.User,
                        asked_at: item.asked_at,
                        question: item.question,
                        question_description: item.question_description,
                        question_image_links: item.question_image_links,
                        answers: item.answers
                      };

                      navigate(`/question/questionpage/${item.id}`, { state: { questionData } })
                    }} key={`question-${item.id}-${index}`}>
                      <QuestionPost
                        postId={item.id}
                        isUrgent={true}
                        userId={item.userId}
                        avatar={item.User?.profile_picture}
                        name={item.User.name}
                        bio={`${item.User.department} | ${item.User.organisation_name}`}
                        timeAgo={new Date(item.asked_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                        title={item.question}
                        content={item.question_description}
                        images={item.question_image_links}
                        agrees={12}
                        date={item?.asked_at}
                        shares={0}
                        onShare={() => console.log("Share clicked")}
                        onReply={() => console.log("Repost clicked")}
                        answerImg={userDetails?.profile_picture}
                        answers={item?._count?.answers}
                        disagrees={4}
                      />
                    </div>
                  );
                })}

                {/* ConnectionCard1 */}
                <div className="w-full">
                  <ConnectionCard1
                    connections={suggestedConnections?.organization_matches}
                  />
                </div>

                {/* Next set of posts */}
                {feedItems.slice(3).map((item: any, index: number) => {
                  const isLastItem = index === feedItems.slice(3).length - 1;
                  return item.posted_at ? (
                    <div
                      key={`post-${item.id}-${index + 3}`}
                      ref={isLastItem ? observerRef : null}
                    >
                      <Post
                        id={item.id}
                        userId={item?.userId}
                        avatar={item.User?.profile_picture}
                        name={item.User.name}
                        bio={`${item.User.department} | ${item.User.organisation_name}`}
                        timeAgo={new Date(item.posted_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                        title={item.title}
                        content={item.description}
                        currentUser={userDetails}
                        images={item.postImageLinks}
                        likes={item._count.likes}
                        comments={item._count.comments}
                        readcomments={item.comments}
                        shares={item._count.shares}
                        liked={likedPosts.has(item.id)}
                        reposts={0}
                        onLike={() => handleLikeClick(item.id)}
                        onComment={(postId, content) =>
                          handleComment(postId, content)
                        }
                        handlesavepost={() => handlesave(item.id)}
                        isSaved={savedPosts.has(item.id)}
                        onShare={() => console.log("Share clicked")}
                        onRepost={() => console.log("Repost clicked")}
                        onMoreOptions={() =>
                          console.log("More options clicked")
                        }
                      />
                    </div>
                  ) : (
                    <div
                      key={`question-${item.id}-${index + 3}`}
                      ref={isLastItem ? observerRef : null}

                      onClick={() => {
                        const questionData = {
                          id: item.id,
                          User: item.User,
                          asked_at: item.asked_at,
                          question: item.question,
                          question_description: item.question_description,
                          question_image_links: item.question_image_links,
                          answers: item.answers
                        };

                        navigate(`/question/questionpage/${item.id}`, { state: { questionData } })
                      }}
                    >
                      <QuestionPost
                        postId={item.id}
                        isUrgent={true}
                        userId={item?.userId}
                        avatar={item.User?.profile_picture}
                        name={item.User.name}
                        bio={`${item.User.department} | ${item.User.organisation_name}`}
                        timeAgo={new Date(item.asked_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                        title={item.question}
                        content={item.question_description}
                        images={item.question_image_links}
                        agrees={12}
                        date={item?.asked_at}
                        shares={0}
                        onShare={() => console.log("Share clicked")}
                        onReply={() => console.log("Repost clicked")}
                        answerImg={userDetails?.profile_picture}
                        answers={item?._count?.answers}
                        disagrees={4}
                      />
                    </div>
                  );
                })}

                {/* ConnectionCard2 */}
                <ConnectionCard2
                  connections={[
                    suggestedConnections.location_matches,
                    suggestedConnections.department_matches,
                    suggestedConnections.other_users,
                  ].reduce((a, b) => (a.length > b.length ? a : b))}
                />

                {/* Loading indicator */}
                {isFetchingNextPage && (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                )}

                {/* No more posts indicator */}
                {!hasNextPage && feedItems.length > 0 && (
                  <div className="text-center py-4 text-gray-600">
                    No more posts to load
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center py-4">No items available</p>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block lg:max-w-[23%] xl:max-w-[25%] flex-shrink-0 font-fontsm">
          <div className=" sticky top-[calc(theme(spacing.20)+1px)] space-y-4">
            {/* Explore Videos */}
            <div className="px-4 py-4 bg-fillc bg-opacity-10 rounded-xl">
              {/* Heading Section */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-base  text-maincl font-medium">
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
                  // Use the memoized reels data from the component level
                  // Show loading skeletons when loading or fetching
                  if (isReelsLoading || isReelsFetching) {
                    return Array.from({ length: 5 }).map((_, idx) => (
                      <div key={idx} className="flex flex-col items-center animate-pulse">
                        <div className="w-16 h-28 xl:w-20 xl:h-36 rounded-lg bg-gray-200 mb-2" />
                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                      </div>
                    ));
                  }
                  
                  // If we have reels data, show it
                  if (reelsData && reelsData.length > 0) {
                    return reelsData.map((reel: any, index: number) => (
                      <VideoCard
                        key={index}
                        videoImage={reel.reelThumbnail || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="350"><rect width="100%" height="100%" fill="black"/></svg>'}
                        avatarImage={reel.user?.profile_picture || profile}
                      />
                    ));
                  }
                  
                  // Show loading skeletons as fallback while we refetch
                  return Array.from({ length: 5 }).map((_, idx) => (
                    <div key={`fallback-${idx}`} className="flex flex-col items-center animate-pulse">
                      <div className="w-16 h-28 xl:w-20 xl:h-36 rounded-lg bg-gray-200 mb-2" />
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>

        <VerifyForm
          isOpen={isVerifyFormOpen}
          onClose={() => setIsVerifyFormOpen(false)}
        />

        {/* Mobile Navigation */}
        <div
          className={`fixed lg:hidden bottom-0 left-0 z-40 w-full bg-white shadow-md p-8 transition-transform duration-300 ease-in-out ${visible2 ? "translate-y-0" : "translate-y-full"
            } md:translate-y-0`}
        >
          <Navigation />
        </div>
      </div>
    </div>
  );
};
