import { ReactNode } from "react";

export interface StoryProps {
  imageUrl: string;
  name: string;
  onClick?: () => void;
}

export interface PostProps {
  avatar: string;
  name: string;
  bio: string;
  timeAgo: string;
  title: string;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  shares: number;
  liked : boolean;
  reposts: number;
  readcomments : any[];
  currentUser : any;
  onLike?: () => void;
  onComment: (postId: number, content: string) => void;
  onShare?: () => void;
  onRepost?: () => void;
  onMoreOptions?: () => void;
  sendComment?: (comment: string) => void;
  handlesavepost? : () => void;
  isSaved: boolean;
  id: number;
}

export interface NavItemProps {
  activeIcon: ReactNode;
  inactiveIcon: ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  onClick?: () => void;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  onAddPost: () => void;
}

export interface HeaderProps {
  onNotification: () => void;
  onMessage: () => void;
  onProfile: () => void;
}

export interface SocialMetric {
  icon: string;
  label: string;
  count: number;
}

export interface PostImage {
  src: string;
  alt: string;
}

export interface UserProfile {
  avatar: string;
  name: string;
  bio: string;
  postedTime: string;
}

export interface SocialPostProps {
  user: UserProfile;
  title: string;
  content: string;
  images: PostImage[];
  metrics: SocialMetric[];
}

export interface SocialMetric {
  icon: string;
  label: string;
  count: number;
}

export interface PostImage {
  src: string;
  alt: string;
}

export interface UserProfile {
  avatar: string;
  name: string;
  bio: string;
  postedTime: string;
}

export interface SocialPostProps {
  user: UserProfile;
  title: string;
  content: string;
  images: PostImage[];
  metrics: SocialMetric[];
}