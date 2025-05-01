import { createContext, useContext, useCallback, useState, useEffect, type ReactNode } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { ReelData } from "./types";
import axios from "axios";

interface ReelsContextType {
  reels: ReelData[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  hasNextPage: boolean;
  fetchNextPage: () => Promise<void>;
}

interface ReelsResponse {
  data: {
    items: {
      reelsToReturn: ReelData[];
    };
  };
}

const ReelsContext = createContext<ReelsContextType | undefined>(undefined);

export function ReelsProvider({ children }: { children: ReactNode }) {
  const userId = localStorage.getItem("Id");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const {
    data,
    fetchNextPage: fetchNext,
    hasNextPage,
    isFetching,
    isLoading: isQueryLoading,
    error,
    refetch
  } = useInfiniteQuery<ReelsResponse>({
    queryKey: ["reels", userId],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/clinical/reels/${userId}?page=${pageParam}&limit=5`
      );
      
      return {
        data: {
          items: {
            reelsToReturn: response.data.data.items.reelsToReturn || []
          }
        }
      };
    },
    getNextPageParam: (lastPage, pages) => {
      // Add null check to prevent errors
      if (!lastPage?.data?.items?.reelsToReturn) return undefined;
      
      const reelsCount = lastPage.data.items.reelsToReturn.length || 0;
      
      // Force pagination to continue regardless of count
      // This ensures we always try to fetch more reels when needed
      const hasMore = reelsCount > 0;
      const nextPage = hasMore ? pages.length + 1 : undefined;
      
      return nextPage;
    },
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true,
    refetchOnWindowFocus: false, // Don't refetch on window focus to avoid disrupting user experience
    refetchInterval: false,
    enabled: !!userId, // Only run query if userId exists
    retry: 3,
    retryDelay: 1000
  });

  // Force a refetch on initial mount
  useEffect(() => {
    if (isInitialLoad && userId) {
      refetch();
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, refetch, userId]);

  // Flatten all pages into a single array of reels
  const reels = data?.pages?.flatMap(page => {
    const pageReels = page?.data?.items?.reelsToReturn?.filter((reel: unknown): reel is ReelData => reel !== null) ?? [];
    return pageReels;
  }) ?? [];
  

  // Determine loading state - true during initial load or when fetching more
  const loading = isQueryLoading || isFetching;

  const fetchNextPage = useCallback(async () => {
    if (!loading && hasNextPage) {
      await fetchNext();
    }
  }, [loading, hasNextPage, fetchNext]);

  const value = {
    reels,
    loading,
    error: error ? (error as Error).message : null,
    currentPage: (data?.pages?.length ?? 0) + 1,
    hasNextPage: Boolean(hasNextPage),
    fetchNextPage,
  };

  return <ReelsContext.Provider value={value}>{children}</ReelsContext.Provider>;
}

export function useReelsContext() {
  const context = useContext(ReelsContext);
  if (context === undefined) {
    throw new Error("useReelsContext must be used within a ReelsProvider");
  }
  return context;
}
