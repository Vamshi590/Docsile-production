import { Key } from "react";

export interface User {
  name: string;
  profile_picture: string;
  organisation_name: string;
  department: string;
  date: string;
}

export interface Comment {
  id: string;
  text: string;
  likes: number;
  timestamp: string;
  isLiked?: boolean;
  isExpanded?: boolean;
  replies?: Reply[];
  user: {
    name: string;
    avatar: string;
  };
}

export interface Reply {
  id: string;
  text: string;
  likes: number;
  timestamp: string;
  user: {
    name: string;
    avatar: string;
  };
}

export interface ReelData {
  id: Key | null | undefined;
  reelId: string;
  reelMediaUrl: string;
  reelComments: Comment[];
  reelTitle: string;
  reelDescription: string;
  hashtags?: string[];
  likes: number;
  shares: number;
  user: User;
  userId: string;
  userDetails: Record<string, any>;
}

export interface ReelState {
  isPlaying: boolean;
  progress: number;
  isLiked: boolean;
  isSaved: boolean;
  isExpanded: boolean;
  showOptions: boolean;
  comments: Comment[];
  isError: boolean;
  showComments: boolean;
  showInteraction: boolean;
  hoverTime?: number;
}
