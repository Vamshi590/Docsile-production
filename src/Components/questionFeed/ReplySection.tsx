import { useState, ChangeEvent } from "react";
import { Image } from "lucide-react";

interface NewReply {
  id: number;
  text: string;
  date: string;
  image: string | null;
}

interface ReplySectionProps {
  onNewReply: (reply: NewReply) => void;
  onCancel: () => void;
}

const ReplySection: React.FC<ReplySectionProps> = ({ onNewReply, onCancel }) => {
  const [replyText, setReplyText] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const addReply = (): void => {
    if (!replyText.trim()) return;

    const newReply: NewReply = {
      id: Date.now(),
      text: replyText,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      image: selectedImage,
    };

    onNewReply(newReply);
    setReplyText("");
    setSelectedImage(null);
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div className="mt-3">
      <div className="ml-10 bg-gray-50 rounded-lg p-3">
        <textarea
          value={replyText}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setReplyText(e.target.value)}
          placeholder="Write your reply..."
          className="w-full h-20 p-2 bg-transparent focus:outline-none resize-none"
        />
        
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Preview"
            className="mt-2 w-20 h-20 object-cover rounded-md"
          />
        )}

        <div className="flex justify-between items-center mt-2">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="reply-image-upload"
            />
            <label
              htmlFor="reply-image-upload"
              className="flex items-center gap-2 text-blue-500 hover:text-blue-700 cursor-pointer px-3 py-1 rounded-full border border-gray-200 hover:bg-gray-200"
            >
              <Image size={20} />
              <span>Add Media</span>
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-1 rounded-full text-gray-600 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={addReply}
              className="px-4 py-1 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplySection;
