export interface User {
  id: string
  name: string
  profile_picture: string
  department: string
  organisation_name : string
  
}

export interface Comment {
  id: string
  comment: string
  user: User
  commented_at: string
  likes: number
}

export interface Reel {
  id: string
  reelMediaUrl: string
  reelDescription: string
  audioTitle: string
  likes: number
  comments: Comment[]
  reelLikes : any[]
  reelComments : any[]
  user: User
}

