import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import ReplySection from "./ReplySection";
import { formatTimestamp } from "@/functions";
import profile from "../../assets/icon/profile.svg"

interface Reply extends Answer {
  parentId?: string;
}

interface Answer {
  id: number;
  answer_description: string;
  date: string;
  user : {
    name : string;
    profile_picture: string;
    department: string;
    organisation_name: string;
  }
  likes: number;
  dislikes: number;
  replies: Reply[];
  image: string | null;
}

interface AnswerItemProps {
  answer: Answer;
}

const AnswerItem: React.FC<AnswerItemProps> = ({ answer }) => {
  const [likes, setLikes] = useState<number>(answer.likes || 0);
  const [dislikes, setDislikes] = useState<number>(answer.dislikes || 0);
  const [showReplyBox, setShowReplyBox] = useState<boolean>(false);
  const [replies, setReplies] = useState<Reply[]>(answer.replies || []);

  const toggleLike = (): void => setLikes((prev) => prev + 1);
  const toggleDislike = (): void => setDislikes((prev) => prev + 1);

  const handleNewReply = (newReply: Omit<Reply, 'likes' | 'dislikes' | 'replies'>): void => {
    setReplies([...replies, { ...newReply, likes: 0, dislikes: 0, replies: [] }]);
    setShowReplyBox(false);
  };

  const handleReplyLike = (replyId: number, levelReplies: Reply[], setLevelReplies: React.Dispatch<React.SetStateAction<Reply[]>>): void => {
    setLevelReplies(
      levelReplies.map((reply) =>
        reply.id === replyId ? { ...reply, likes: (reply.likes || 0) + 1 } : reply
      )
    );
  };

  const handleReplyDislike = (replyId: number, levelReplies: Reply[], setLevelReplies: React.Dispatch<React.SetStateAction<Reply[]>>): void => {
    setLevelReplies(
      levelReplies.map((reply) =>
        reply.id === replyId ? { ...reply, dislikes: (reply.dislikes || 0) + 1 } : reply
      )
    );
  };

  const renderReplies = (levelReplies: Reply[], setLevelReplies: React.Dispatch<React.SetStateAction<Reply[]>>): JSX.Element[] => {
    return levelReplies.map((reply) => (
      <div key={reply.id} className="ml-10 flex gap-4">
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg"
          alt="profile"
          className="w-8 h-8 rounded-full border border-gray-300"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-sm">Nampally Sriram</h2>
            <p className="text-xs text-gray-500">{reply.date}</p>
          </div>
          <p className="text-gray-700 text-sm mt-1">{reply.answer_description}</p>

          {reply.image && (
            <img src={reply.image} alt="Uploaded content" className="mt-2 w-20 h-20 object-cover rounded-md" />
          )}

          <div className="flex gap-4 mt-2 text-gray-600">
            <button onClick={() => handleReplyLike(reply.id, levelReplies, setLevelReplies)} className="flex items-center gap-1 hover:text-blue-500">
              <ThumbsUp size={16} /> <span>{reply.likes || 0}</span>
            </button>
            <button onClick={() => handleReplyDislike(reply.id, levelReplies, setLevelReplies)} className="flex items-center gap-1 hover:text-red-500">
              <ThumbsDown size={16} /> <span>{reply.dislikes || 0}</span>
            </button>
          </div>

          {reply.replies && reply.replies.length > 0 && (
            <div className="mt-4">{renderReplies(reply.replies, setLevelReplies)}</div>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-white rounded-xl p-4 mb-4">
      <div className="flex gap-4">
        <img
          src={answer?.user?.profile_picture || profile}
          alt="profile"
          className="w-10 h-10 rounded-full border border-gray-300"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-sm">{answer?.user?.name}</h2>
            <p className="text-xs text-gray-500">{ formatTimestamp(answer?.date)}</p>
          </div>
          <p className="text-xs text-gray-500">
            {`${answer?.user?.department} | ${answer?.user?.organisation_name}`}
          </p>
          <p className="text-gray-700 text-sm mt-1">{answer?.answer_description}</p>

          {answer.image && (
            <img src={answer.image} alt="Uploaded content" className="mt-2 w-24 h-24 object-cover rounded-md" />
          )}

          <div className="flex gap-4 mt-2 text-gray-600">
            <button onClick={toggleLike} className="flex items-center gap-1 hover:text-blue-500">
              <ThumbsUp size={16} /> <span>{likes}</span>
            </button>
            <button onClick={toggleDislike} className="flex items-center gap-1 hover:text-red-500">
              <ThumbsDown size={16} /> <span>{dislikes}</span>
            </button>
            <button onClick={() => setShowReplyBox(!showReplyBox)} className="flex items-center gap-1 hover:text-gray-800">
              <MessageCircle size={16} /> Reply
            </button>
          </div>

          {showReplyBox && <ReplySection onNewReply={(newReply: any) => {handleNewReply(newReply)}} onCancel={() => setShowReplyBox(false)} />}
        </div>
      </div>

      {replies.length > 0 && <div className="mt-4 space-y-4">{renderReplies(replies, setReplies)}</div>}
    </div>
  );
};

export default AnswerItem;
