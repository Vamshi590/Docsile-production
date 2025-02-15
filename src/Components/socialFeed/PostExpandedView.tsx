import React, { useState } from 'react';
import { X,  ChevronLeft, ChevronRight } from 'lucide-react';
import like1 from "../../assets/icon/like1.svg"
import like from "../../assets/icon/like1.svg"
import liked from "../../assets/icon/like2.svg"
import liked1 from "../../assets/icon/like2.svg"
import share from "../../assets/icon/share.svg"
import comment   from "../../assets/icon/comment.svg"
import comment1   from "../../assets/icon/comment.svg"
import repost   from "../../assets/icon/repost.svg"
import profile from "../../assets/icon/profile.svg"

interface Author {
  name: string;
  profile_picture: string;
  department : string;
  organisation_name : string;
  timeAgo?: string;
}

interface Comment {
  id: string;
  user: Author;
  comment: string;
  timeAgo: string;
  likes: number;
  replies?: Array<{
    id: string;
    author: {
      name: string;
      avatar: string;
      bio: string;
      timeAgo: string;
    };
    content: string;
    timeAgo?: string;
    likes: number;
  }>;
}

interface PostExpandedViewProps {
  isOpen: boolean;
  onLike?: () => void;
  onClose: () => void;
  likedi : boolean;
  oncomment : (postId : number , content : string) => void;
  currentUser :{
    name : string,
    profile_picture : string,
    bio : string;
  }
  post: {
    id : number;
    images: string[];
    user: Author;
    content: {
      title: string;
      description: string;
    };
    stats: {
      likes: number;
      comments: number;
      shares: number;
      reposts: number;
    };
    comments: Comment[];
    hashtags?: string[];
  };
}

const PostExpandedView: React.FC<PostExpandedViewProps> = ({ isOpen, onClose, likedi, post , oncomment, onLike, currentUser }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReplyInput, setShowReplyInput] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [stats, setStats] = useState(post.stats);

  if (!isOpen) return null;

  const formatComment = (text: string) => {
    return text.split(' ').map((word, index) => {
      if (word.startsWith('@')) {
        return (
          <span key={index}>
            <span className="text-blue-500 hover:underline cursor-pointer">{word}</span>{' '}
          </span>
        );
      }
      return word + ' ';
    });
  };

  const handleLikeComment = (commentId: string) => {
    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });

    setComments(prevComments => 
      prevComments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: likedComments.has(commentId) ? comment.likes - 1 : comment.likes + 1
          };
        }
        return comment;
      })
    );
  };

  const handleSubmitComment = ( postid : number, content : string ) => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: String(Date.now()),
        user: {
          name: currentUser?.name, // Replace with actual user data
          profile_picture: currentUser?.profile_picture ||profile,
          department: currentUser?.bio, // Replace with actual user bio
          organisation_name : '',
          timeAgo: "Just now",
        },
        comment: commentText,
        timeAgo: "Just now",
        likes: 0,
        replies: [],
      };

      oncomment(postid, content)

      setComments(prevComments => [newComment, ...prevComments]);
      setStats(prev => ({
        ...prev,
        comments: prev.comments + 1
      }));
      setCommentText('');
    }
  };

  const handleSubmitReply = (commentId: string) => {
    if (replyText.trim()) {
      const newReply = {
        id: String(Date.now()),
        author: {
          name: currentUser?.name, // Replace with actual user data
          avatar: currentUser?.profile_picture || profile,
          bio: currentUser?.bio, // Replace with actual user bio
          timeAgo: "Just now",
        },
        content: replyText,
        timeAgo: "Just now",
        likes: 0,
      };

      setComments(prevComments => 
        prevComments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply]
            };
          }
          return comment;
        })
      );

      setReplyText('');
      setShowReplyInput(null);
      setStats(prev => ({
        ...prev,
        comments: prev.comments + 1
      }));
    }
  };

  const handleLikeReply = (commentId: string, replyId: string) => {
    setComments(prevComments => 
      prevComments.map(comment => {
        if (comment.id === commentId && comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === replyId) {
                return {
                  ...reply,
                  likes: reply.likes + (likedComments.has(replyId) ? -1 : 1)
                };
              }
              return reply;
            })
          };
        }
        return comment;
      })
    );

    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(replyId)) {
        newSet.delete(replyId);
      } else {
        newSet.add(replyId);
      }
      return newSet;
    });
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/55  flex items-center justify-center z-50 font-fontsm">
      <div className="bg-white w-[1000px] h-[600px] rounded-xl flex overflow-hidden">
        {/* Left Side - Image Carousel */}
        <div className="w-[60%] bg-black relative">
          <div className="relative h-full">
            <img
              src={post.images[currentImageIndex]}
              alt=""
              className="w-full h-full object-contain"
            />
            
            {currentImageIndex > 0 && (
              <button
                onClick={() => setCurrentImageIndex(prev => prev - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full hover:bg-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            
            {currentImageIndex < post.images.length - 1 && (
              <button
                onClick={() => setCurrentImageIndex(prev => prev + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full hover:bg-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
              {post.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex ? 'bg-blue-500 w-3' : 'bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={post.user?.profile_picture || profile}
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-sm text-gray-900">{post.user?.name}</h3>
                <p className="text-xs  text-gray-500">{`${post.user?.department}`}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-3">
              {/* Title and Description */}
              <h2 className="text-sm">{post.content.title}</h2>
              <p className="text-gray-600 text-sm">{post.content.description}</p>

              {/* Hashtags */}
              {post.hashtags && post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.hashtags.map((tag, idx) => (
                    <span key={idx} className="text-blue-600 text-sm hover:underline cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Interaction Stats */}
              <div className="flex items-start  justify-between  py-3">
                <div className="flex gap-12 ">
                  <button 
                    onClick={onLike}
                    className="flex items-center gap-2 text-gray-600"
                  >
                  
                    <img src={likedi ? liked1 : like1} alt="" className='w-5' />
                    <div>

                    <p className='text-fontlit'>likes</p>
                    <span className='text-sm text-gray-800'>{likedi ? post.stats.likes + 1 : post.stats.likes}</span>
                    </div>
                  </button>
                  <div className="flex items-center gap-2 text-gray-600">
                    <img src={comment} alt=""  className='w-5'/>

                    <div>
                      <p className='text-fontlit'>Comments</p>
                    <span className='text-sm text-gray-800'>{stats.comments}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <img src={share} alt="" className='w-5' />
                    <div>
                      <p className='text-fontlit'>Shares</p>
                    <span className='text-sm text-gray-800'>{post.stats.shares}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <img src={repost} alt="" className='w-5' />
                    <div>
                      <p className='text-fontlit'>Reposts</p>
                    <span className='text-sm text-gray-800  ' >{post.stats.reposts}</span>
                    </div>
                  </div>
                </div>
               
              </div>

              {/* Comments Section */}
              <div className="space-y-4">
                <p className='text-maincl pt-1 font-semibold'>Comments</p>
                {comments.map((comment) => (
                  <div key={comment.id} className="space-y-3">
                    <div className="flex gap-3">
                      <img
                        src={comment.user?.profile_picture || profile}
                        alt=""
                        className="w-6 h-6 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="bg-buttonclr rounded-2xl rounded-tl-none px-3 py-2 relative">
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <div>
                              <span className="text-xs  ">{comment.user?.name}</span>
                                <span className="text-fontlit right-0 absolute pt-1 pr-3 text-gray-500">{comment.timeAgo}</span>

                              </div>
                              <p className="text-fontlit text-gray-500 line-clamp-1">{`${comment.user?.department} ${comment.user?.organisation_name}` }</p>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm">{formatComment(comment.comment)}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 ml-4">
                          <button 
                            onClick={() => handleLikeComment(comment.id)}
                            className="hover:text-gray-700 flex text-xs items-center gap-1"
                          >
                            <img 
                              src={likedComments.has(comment.id) ? liked : like} 
                              alt="" 
                              className='w-4 h-4'
                            />
                            {comment.likes}
                          </button>
                          <button 
                            onClick={() => setShowReplyInput(comment.id)}
                            className="hover:text-gray-700 text-xs flex gap-1"
                          >
                            <img src={comment1} alt="" className='w-4 h-4' />
                            Reply
                          </button>
                        </div>

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-2 ml-4">
                            <button
                              onClick={() => toggleReplies(comment.id)}
                              className="text-sm text-gray-500 hover:text-gray-700"
                            >
                              {expandedReplies.has(comment.id)
                                ? 'Hide replies'
                                : `View all ${comment.replies.length} replies`}
                            </button>
                            
                            {expandedReplies.has(comment.id) && (
                              <div className="mt-3 space-y-3">
                                {comment.replies.map((reply) => (
                                  <div key={reply.id} className="flex gap-3">
                                    <img
                                      src={reply.author.avatar}
                                      alt=""
                                      className="w-6 h-6 rounded-full"
                                    />
                                    <div className="flex-1">
                                      <div className="bg-gray-100 rounded-2xl rounded-tl-none px-3 py-2 relative">
                                        <div className="flex items-center justify-between mb-1">
                                          <div>
                                            <span className="text-xs">{reply.author.name}</span>
                                            <span className="text-fontlit right-0 absolute pr-2 text-gray-500">{reply.timeAgo}</span>
                                            <p className="text-fontlit line-clamp-1 text-gray-500">{reply.author.bio}</p>
                                          </div>
                                        </div>
                                        <p className="text-gray-600 text-sm">{formatComment(reply.content)}</p>
                                      </div>
                                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 ml-4">
                                        <button 
                                          onClick={() => handleLikeReply(comment.id, reply.id)}
                                          className="hover:text-gray-700 flex gap-1 items-center"
                                        >
                                          <img 
                                            src={likedComments.has(reply.id) ? liked : like} 
                                            alt="" 
                                            className='w-4 h-4'
                                          />
                                          {reply.likes}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Reply Input */}
                        {showReplyInput === comment.id && (
                          <div className="flex gap-3 items-center mt-3 ml-6">
                            <img
                              src={post.user.profile_picture}
                              alt=""
                              className="w-8 h-8 rounded-full"
                            />
                            <div className="flex-1 flex gap-2">
                              <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSubmitReply(comment.id);
                                  }
                                }}
                                autoFocus
                              />
                              <button 
                                onClick={() => handleSubmitReply(comment.id)}
                                className="px-4 py-2 bg-maincl text-white rounded-full text-sm font-medium hover:bg-opacity-90"
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comment Input */}
          <div className="border-t p-4">
            <div className="flex gap-3 items-center">
              <img
                src={post.user?.profile_picture || profile}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add Comments..."
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmitComment( post.id , commentText );
                    }
                  }}
                />
                <button 
                  onClick={() => handleSubmitComment(post.id , commentText)}
                  className="px-4 py-2 bg-maincl text-white rounded-full text-sm font-medium hover:bg-opacity-90"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostExpandedView;