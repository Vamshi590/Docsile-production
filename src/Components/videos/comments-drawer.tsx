"use client"

import type React from "react"
import axios from 'axios';
import { useState, useEffect } from "react"
import { toast } from 'sonner';
import { motion } from "framer-motion"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import { X, Send, Heart } from "lucide-react"
import type { Reel, Comment } from "./reel"
import profile from "../../assets/icon/profile.svg"

interface CommentsDrawerProps {
  reel: Reel
  onClose: () => void
  onCommentUpdate?: () => void
}

function getSafeLikes(likes: any, liked: boolean) {
  const base = typeof likes === 'number' && !isNaN(likes) ? likes : 0;
  return base + (liked ? 1 : 0);
}

export default function CommentsDrawer({ reel, onClose, onCommentUpdate }: CommentsDrawerProps) {
  const [comments, setComments] = useState<Comment[]>(reel.reelComments || [])
  const [newComment, setNewComment] = useState("")
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({})
  const [userId, setUserId] = useState<string>("");
  const [userDetails , setUserDetails] = useState<any>({})
  // Keep comments in sync with reel.reelComments only on initial load
  useEffect(() => {
    if (reel.reelComments && reel.reelComments.length > 0) {
      setComments(reel.reelComments);
    }
  }, []); // Empty dependency array to only run on mount

  useEffect(() => {
    const storedId = localStorage.getItem("Id");
    if (storedId) {
      setUserId(storedId);
    }
  }, []);

  useEffect(() => {
    setUserDetails(JSON.parse(localStorage.getItem("User") || ""))
  }, [])

  const handleSubmitComment = async (e: React.FormEvent, reel: Reel) => {
    e.preventDefault()

    if (!newComment.trim()) return

    // Create a temporary comment for optimistic update
    const tempComment: Comment = {
      id: `comment-${Date.now()}`,
      comment: newComment,
      user: {
        id: userId,
        name: userDetails?.name || "you",
        profile_picture: userDetails?.profile_picture || profile,
        department: userDetails?.department,
        organisation_name: userDetails?.organisation_name
      },
      commented_at: new Date().toISOString(),
      likes: 0,
    }

    // Optimistically add comment
    setComments(prev => Array.isArray(prev) ? [...prev, tempComment] : [tempComment])
    setNewComment("")

    try {
      const response = await axios.post(
        `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/commentreel`,
        {
          reelId: reel.id,
          userId: userId,
          comment: newComment,
        }
      );

      console.log("Comment response:", response.data);

      if (response.data.status === "success") {
        // Keep the optimistic update instead of trying to update with server data
        console.log("Comment added successfully");
        // Call the callback to update parent's comment count
        onCommentUpdate?.();
      } else {
        // Remove temp comment if failed
        setComments(prev => Array.isArray(prev) ? prev.filter(c => c.id !== tempComment.id) : [])
        toast.error("Failed to add comment")
      }
    } catch (error) {
      console.error("Comment error:", error);
      // Remove temp comment on error
      setComments(prev => Array.isArray(prev) ? prev.filter(c => c.id !== tempComment.id) : [])
      toast.error("Failed to add comment")
    }
  }

  const toggleLikeComment = (commentId: string) => {
    setLikedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }))
  }


  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="absolute bottom-0 left-0 right-0 h-[60%] bg-background z-20 flex flex-col rounded-t-xl overflow-hidden mx-2"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Handle bar for better UX */}
      <div 
        className="w-full flex justify-center pt-2 pb-1 cursor-pointer" 
        onClick={onClose}
      >
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
      </div>

      {/* Header */}
      <div className="p-4 bg-white rounded-t-xl flex items-center justify-between border-b">
        <h2 className="font-semibold text-lg">Comments</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      {/* Comments list */}
      <ScrollArea className="flex-1 p-4 bg-white">
        {Array.isArray(comments) && comments.length === 0 ? (
          <div className="flex flex-col items-center bg-white justify-center h-full text-muted-foreground rounded-xl">
            <p>No comments yet</p>
            <p className="text-sm">Be the first to comment</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Array.isArray(comments) && comments.map((comment) => (
              <motion.div
                key={comment.id}
                className="flex gap-3 bg-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                  <img className="h-9 w-9 rounded-full object-cover" src={comment?.user?.profile_picture || profile} alt={comment?.user?.name} />
                <div className="flex-1 bg-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-medium text-sm">{comment?.user?.name}</span>
                      <p className="text-sm mt-0.5">{comment?.comment}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleLikeComment(comment.id)}
                      className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-muted"
                    >
                      <Heart className={`h-4 w-4 ${likedComments[comment.id] ? "fill-red-500 text-red-500" : ""}`} />
                    </motion.button>
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{formatTimestamp(comment.commented_at)}</span>
                    <span>{getSafeLikes(comment.likes, likedComments[comment.id])} likes</span>
                    <button className="font-medium">Reply</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Comment input */}
      <form onSubmit={(e) => handleSubmitComment(e, reel)} className="border-t p-4 flex gap-3 bg-background/80 backdrop-blur-md bg-white">
        <img className="w-10 h-10 rounded-full object-cover" src={userDetails?.profile_picture || profile} alt="You" />
        
        <Input
          className="flex-1 rounded-full bg-muted border-gray-100"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!newComment.trim()}
          className={`flex items-center justify-center rounded-full w-10 h-10 ${
            newComment.trim() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Post</span>
        </motion.button>
      </form>
    </motion.div>
  )
}

// Helper function to format timestamps as relative time (1s, 1m, 1h, 1d, 1mo, 1y)
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return `${diffSecs}s`;
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 30) return `${diffDays}d`;
  if (diffMonths < 12) return `${diffMonths}mo`;
  return `${diffYears}y`;
}
