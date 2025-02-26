import { ReactNode } from "react";

export interface StoryProps {
  imageUrl: string;
  name: string;
  onClick?: () => void;
}


export interface NavItemProps {
  activeIcon: ReactNode;
  inactiveIcon: ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  onClick?: () => void;
}


export interface SocialMetric {
  icon: string;
  label: string;
  count: number;
}



export interface UserProfile {
  avatar: string;
  name: string;
  bio: string;
  postedTime: string;
}







export interface UserProfile {
  avatar: string;
  name: string;
  bio: string;
  postedTime: string;
}

