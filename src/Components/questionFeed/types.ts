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
  reposts: number;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onRepost?: () => void;
  onMoreOptions?: () => void;
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


export interface UserInfo {
  name: string;
  title: string;
  date: string;
  avatar: string;
}

export interface PostStats {
  answers: number;
  shares: number;
}

export interface PostImage {
  src: string;
  alt: string;
}



export interface QuestionPostProps {
  avatar: string;
  name: string;
  bio: string;
  timeAgo: string;
  title: string;
  date: string;
  content: string;
  images: string[];
  agrees: number;
  answers: number;
  disagrees: number;
  isUrgent:boolean;
  comments: number;
  shares: number;
  reposts: number;
  onReply?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onAnswer?: () => void;
  onMoreOptions?: () => void;
}
