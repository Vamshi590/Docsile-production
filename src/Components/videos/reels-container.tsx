"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "react-intersection-observer"
import ReelItem from "./reel-item"
import { ReelsProvider } from "./reels-context"
import { Loader2 } from "lucide-react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css";

export default function ReelsContainer() {
  return (
    <ReelsProvider>
      <ReelsContent />
    </ReelsProvider>
  )
}

function ReelsContent() {
  const { reels, loading, fetchNextPage, hasNextPage } = useReelsContext()
  const [currentReelIndex, setCurrentReelIndex] = useState(0)
  const [initialRender, setInitialRender] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  // Force a re-render once after component mounts to ensure reels are displayed
  useEffect(() => {
    if (initialRender) {
      // Small timeout to allow React Query to process any cached data
      const timer = setTimeout(() => {
        setInitialRender(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [initialRender]);

  // Reference for the last item to detect when to load more
  const { ref: lastReelRef, inView: lastReelInView } = useInView({
    threshold: 0.1, // Lower threshold to trigger earlier
    triggerOnce: false,
    rootMargin: "100px" // Add margin to trigger before fully in view
  })

  // Load more reels when reaching near the end or when approaching the third reel
  useEffect(() => {
    // Calculate how close we are to the end of available reels
    const isNearEnd = currentReelIndex >= Math.max(0, reels.length - 3);
    
    // Trigger fetch when either the last reel is in view OR we're near the end
    if ((lastReelInView && hasNextPage && !loading) || 
        (isNearEnd && hasNextPage && !loading)) {
      fetchNextPage();
    }
  }, [lastReelInView, hasNextPage, loading, fetchNextPage, currentReelIndex, reels.length])
  
  // Track reels data changes
  useEffect(() => {
    // No logging needed here
  }, [reels])

  // Handle scroll events to determine current reel
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const scrollTop = containerRef.current.scrollTop
      const reelHeight = window.innerHeight
      const index = Math.round(scrollTop / reelHeight)

      if (index !== currentReelIndex) {
        setCurrentReelIndex(index)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
    }
  }, [currentReelIndex])

  return (
    <div
      ref={containerRef}
      className="h-screen w-full lg:w-[420px] overflow-y-scroll snap-y snap-mandatory"
      style={{ scrollbarWidth: "none" }}
    >
      {/* Show skeletons if loading and no reels have loaded yet */}
      {(loading && reels.length === 0) ? (
        <div className="flex flex-col gap-0 w-full px-0 py-0">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="relative h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center overflow-hidden"
            >
              {/* Minimal video area skeleton with soft gradient */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/80 to-gray-900/60 z-0" />
              <div className="relative flex flex-col items-center justify-center h-full w-full z-10">
                {/* Avatar and single line for username */}
                <div className="flex flex-col items-center gap-2 mb-8">
                  <Skeleton circle width={56} height={56} className="mb-2" />
                  <Skeleton width={80} height={14} borderRadius={8} />
                </div>
                {/* Main content line (caption) */}
                <Skeleton width={180} height={18} borderRadius={8} className="mb-2" />
                {/* Subtle bar for actions */}
                <div className="flex flex-row gap-4 mt-8">
                  <Skeleton circle width={36} height={36} />
                  <Skeleton circle width={36} height={36} />
                  <Skeleton circle width={36} height={36} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : reels.length > 0 ? (
        reels.map((reel: any, index) => {
          // Make multiple reels observable to ensure we catch scrolling events
          // This helps with different scroll speeds and behaviors
          const shouldObserve = index >= Math.max(0, reels.length - 4);
          
          // Check if this reel is currently active
          const isActive = index === currentReelIndex;
          
          // Proactively fetch more when viewing reels near the end
          if (isActive && index >= reels.length - 3 && hasNextPage && !loading) {
            fetchNextPage();
          }

          return (
            <div 
              key={reel.id || index} 
              ref={shouldObserve ? lastReelRef : null} 
              className="h-screen w-full snap-start snap-always"
            >
              <ReelItem reel={reel} isActive={isActive} />
            </div>
          )
        })
      ) : (
        // Fallback when not loading but no reels are available
        <div className="flex flex-col items-center justify-center h-screen w-full">
          <div className="text-center p-4">
            <p className="text-lg text-gray-400 mb-4">No videos available</p>
            <button 
              onClick={() => fetchNextPage()} 
              className="px-4 py-2 bg-primary/80 text-white rounded-lg hover:bg-primary transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* Show loader at the bottom when fetching more reels */}
      {loading && reels.length > 0 && (
        <div className="flex justify-center items-center h-24 w-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      <div className="lg:hidden">
        <Navigation />
      </div>      
    </div>
  )
}

// Import the context hook
import { useReelsContext } from "./reels-context"
import { Navigation } from "./Navigation"

