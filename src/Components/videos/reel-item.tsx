"use client";

import type React from "react";
import profile from "../../assets/icon/profile.svg";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Reel } from "./reel";
import CommentsDrawer from "./comments-drawer";
import { toast } from "sonner";
import axios from "axios";

interface ReelItemProps {
  reel: Reel;
  isActive: boolean;
}

export default function ReelItem({ reel, isActive }: ReelItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(reel?.reelComments?.length || 0);
  const [userId, setUserId] = useState<string>("");

  // Update comment count when reel.reelComments changes
  useEffect(() => {
    setCommentCount(reel?.reelComments?.length || 0);
  }, [reel?.reelComments]);

  const handleCommentUpdate = () => {
    setCommentCount(prev => prev + 1);
  };

  // Handle video playback based on visibility
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);

    // Clean up
    return () => {
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
    };
  }, []);

  // Control playback when reel becomes active/inactive
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isActive) {
      // Only play if user hasn't manually paused
      if (!userPaused) {
        videoElement
          .play()
          .catch((err) => console.error("Error playing video:", err));
      }

      // Apply mute state
      videoElement.muted = isMuted;
    } else {
      videoElement.pause();
    }
  }, [isActive, userPaused, isMuted]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("Id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const togglePlay = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.pause();
      setUserPaused(true);
    } else {
      videoElement
        .play()
        .catch((err) => console.error("Error playing video:", err));
      setUserPaused(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering play/pause

    const videoElement = videoRef.current;
    if (!videoElement) return;

    const newMutedState = !isMuted;
    videoElement.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  async function handleLike(e: React.MouseEvent) {
    e.stopPropagation(); // Prevent triggering play/pause
    
    // Optimistically update UI
    setIsLiked(prev => !prev);

    try {
      if (isLiked) {
        await axios.delete(
          `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/dislikereel`,
          {
            data: { userId, reelId: reel.id },
          }
        );
        console.log("removed like");
      } else {
        await axios.post(
          `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/likereel`,
          {
            userId,
            reelId: reel.id,
          }
        );
        console.log("added like");
      }
    } catch (e) {
      // Revert UI on error
      setIsLiked(prev => !prev);
      toast.error("Failed to update like status");
    }
  }

  const toggleLike = (e: React.MouseEvent) => {
    handleLike(e);
  };

  const openComments = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering play/pause
    setShowComments(true);
  };

  const closeComments = () => {
    setShowComments(false);
  };

  return (
    <div className="relative h-full w-full bg-black">
      {/* Video */}
      <video
        ref={videoRef}
        src={reel.reelMediaUrl}
        className="h-full w-full object-cover"
        loop
        muted={isMuted}
        playsInline
        onClick={togglePlay}
        preload="auto"
      />

      {/* Overlay for controls */}
      <div className="absolute inset-0 flex" onClick={togglePlay}>
        {/* Play/Pause indicator (shows briefly when toggling) */}
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="m-auto bg-black/30 rounded-full p-4"
          >
            <svg
              className="w-12 h-12 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Right side actions */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleLike}
          className="flex flex-col items-center"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-black/20 backdrop-blur-md rounded-full shadow-lg">
            <Heart
              className={cn(
                "h-6 w-6 transition-all",
                isLiked ? "fill-red-500 text-red-500 scale-110" : "text-white"
              )}
            />
          </div>
          <span className="text-white text-xs mt-1 font-medium">
            {(reel?.reelLikes?.length + (isLiked ? 1 : 0)).toLocaleString()}
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={openComments}
          className="flex flex-col items-center"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-black/20 backdrop-blur-md rounded-full shadow-lg">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <span className="text-white text-xs mt-1 font-medium">
            {commentCount.toLocaleString()}
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-black/20 backdrop-blur-md rounded-full shadow-lg">
            <Share2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-white text-xs mt-1 font-medium">Share</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
          className="flex flex-col items-center"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-black/20 backdrop-blur-md rounded-full shadow-lg">
            {isMuted ? (
              <VolumeX className="h-6 w-6 text-white" />
            ) : (
              <Volume2 className="h-6 w-6 text-white" />
            )}
          </div>
        </motion.button>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-9 lg:bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="">
            <img
              className="w-12 h-12 rounded-full object-cover shrink-0"
              src={reel.user?.profile_picture || profile}
              alt={reel.user?.name}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-white">{reel?.user?.name}</span>
            <span className="text-xs text-white/70">{`${reel?.user?.department} | ${reel?.user?.organisation_name}`}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className=" px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-medium border border-white/20 shadow-lg hover:bg-white/20 transition-colors"
          >
            Follow
          </motion.button>
        </div>

        <p className="text-white text-sm mb-3 line-clamp-2">
          {reel?.reelDescription }
        </p>
      </div>

      {/* Comments Drawer */}
      <AnimatePresence>
        {showComments && (
          <CommentsDrawer 
            reel={reel} 
            onClose={closeComments} 
            onCommentUpdate={handleCommentUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
