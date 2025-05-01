import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";
import { X, Image, ChevronDown } from "lucide-react";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import { FaCaretRight } from "react-icons/fa";
import publicIcon from "../../assets/icon/public.svg";
import privateIcon from "../../assets/icon/private.svg";
import { Document, Page, pdfjs } from "react-pdf";
import add from "../../assets/icon/add2.svg";
import media from "../../assets/icon/media.svg";
import { toast } from "sonner";
import axios from "axios";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PostPopupProps {
  isOpen: boolean;
  postType1: string;
  onClose: () => void;
  onTypeChange: (type: string) => void;
  userAvatar: string;
}

type Visibility = "Public" | "Private(Followers Only)";
type PostType = "Post" | "Question" | "Resource" | "Video";

const PostPopup: React.FC<PostPopupProps> = ({
  isOpen,
  onClose,
  userAvatar,
  postType1,
  onTypeChange,
}) => {
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("Public");
  const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);
  const [postType, setPostType] = useState<PostType>("Post");
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const [titleCount, setTitleCount] = useState(100);
  const [currentStep, setCurrentStep] = useState(1);
  const [currVideoStep, setCurrVideoStep] = useState(1);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [videothumbnail, setVideoThumbnail] = useState<string | null>(null);
const [videoThumbnailFile, setVideoThumbnailFile] = useState<File | null>(null);
const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);

// Helper: Generate thumbnail from video file
const generateVideoThumbnail = async (videoFile: File): Promise<{ url: string, file: File }> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(videoFile);
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;

    // Wait for metadata to load
    video.addEventListener('loadedmetadata', () => {
      // Seek to 0.1s for a better first frame (some videos have black at 0)
      video.currentTime = Math.min(0.1, video.duration || 0.1);
    });

    // When seeked, draw the frame
    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Thumbnail generation failed'));
          return;
        }
        const thumbUrl = URL.createObjectURL(blob);
        const thumbFile = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
        resolve({ url: thumbUrl, file: thumbFile });
      }, 'image/jpeg', 0.92);
    });

    video.addEventListener('error', () => {
      reject(new Error('Failed to load video for thumbnail'));
    });
  });
};
  const [showUpload, setShowUpload] = useState(true);
  const startXRef = useRef<number | null>(null);
  const currentTranslate = useRef(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  // const [localPostType, setLocalPostType] = useState(postType);

  // Always generate a thumbnail when a new video is selected
  useEffect(() => {
    if (postType === "Video" && selectedMedia.length > 0) {
      const videoFile = selectedMedia[0];
      if (videoFile && videoFile.type.startsWith("video/")) {
        setIsGeneratingThumbnail(true);
        toast.loading("Generating video thumbnail...");
        generateVideoThumbnail(videoFile)
          .then(({ url, file }) => {
            setVideoThumbnail(url);
            setVideoThumbnailFile(file);
          })
          .catch((err) => {
            console.error('Failed to generate video thumbnail:', err);
            toast.error("Failed to generate video thumbnail");
          })
          .finally(() => {
            setIsGeneratingThumbnail(false);
            toast.dismiss();
          });
      }
    }
  }, [postType, selectedMedia]);
  const handleClose = () => {
    setIsTypeOpen(false);
    // setLocalPostType(type);
    // Reset media when changing type
    setSelectedMedia([]);
    setPdfFile(null);
    setShowUpload(true);
    setPostTitle("");
    setPostContent("");
    setTitleCount(100);
    setThumbnail(null);
    setVideoThumbnail(null);
    setCurrVideoStep(1);
    setCurrentStep(1);
  };

  useEffect(() => {
    setPostType(postType1 as PostType);
  }, [postType1]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  };

  const handleFileSelection = async (files: File[]) => {
    if (postType === "Resource") {
      const file = files[0];

      if (file?.type === "application/pdf") {
        setPdfFile(file);
      } else {
        alert("Please upload a PDF file for resources");
      }
      return;
    }

    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      return (
        (postType === "Video" ? isVideo : isImage) &&
        selectedMedia.length + files.length <= 4
      );
    });

    setSelectedMedia((prev) => [...prev, ...validFiles]);

    // If video selected, always auto-generate a new thumbnail for the first video
    if (postType === "Video" && validFiles.length > 0) {
      setIsGeneratingThumbnail(true);
      toast.loading("Generating video thumbnail...");
      try {
        const { url, file } = await generateVideoThumbnail(validFiles[0]);
        setVideoThumbnail(url);
        setVideoThumbnailFile(file);
      } catch (err) {
        console.error('Failed to generate video thumbnail:', err);
        toast.error("Failed to generate video thumbnail");
      } finally {
        setIsGeneratingThumbnail(false);
        toast.dismiss();
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startXRef.current !== null) {
      const currentX = e.touches[0].clientX;
      currentTranslate.current = currentX - startXRef.current;
    }
  };

  const handleTouchEnd = () => {
    if (currentTranslate.current > 50 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (
      currentTranslate.current < -50 &&
      currentIndex < selectedMedia.length - 1
    ) {
      setCurrentIndex(currentIndex + 1);
    }
    startXRef.current = null;
    currentTranslate.current = 0;
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex < selectedMedia.length - 1)
      setCurrentIndex((prev) => prev + 1);
  };

  const getVisibleDots = () => {
    const maxVisibleDots = 5;
    const half = Math.floor(maxVisibleDots / 2);
    return selectedMedia.map((_, index) => {
      const diff = Math.abs(index - currentIndex);
      if (diff <= half) return 1;
      return Math.max(0.3, 1 - (diff - half) * 0.2);
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (text.length <= 100) {
      setPostTitle(text);
      setTitleCount(100 - text.length);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    if (words.length <= 500) {
      setPostContent(text);
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setThumbnail(objectURL); // Store URL instead of File
    }
  };

  const renderMediaUpload = () => {
    if (postType === "Resource") {
      return (
        <div
          className=" rounded-lg px-4 pt-4 h-[180px] flex flex-col justify-end "
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {pdfFile && (
            <div className="flex items-center justify-between mt-4 p-2 border border-gray-100 shadow-sm bg-gray-100 rounded">
              <p className="text-sm px-3    text-gray-600">{pdfFile.name}</p>
              <button
                onClick={() => setPdfFile(null)}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                {" "}
                <X size={20} />
              </button>
            </div>
          )}
        </div>
      );
    }

    if (postType === "Video") {
      return (
        <div className="flex h-full  flex-col gap- items-center justify-center">
          {!selectedMedia.length ? (
            <div
              onClick={() => document.getElementById("mediaInput")?.click()}
              className="bg-buttonclr h-full w-[40%] border  flex flex-col  items-center justify-center border-dashed border-gray-700 rounded-xl cursor-pointer  "
            >
              <Image className="w-8 h-8 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Add Video</p>
              <p className="text-sm text-gray-500">MP4, WebM or Ogg</p>
              <p className="text-xs text-gray-400 mt-1">
                Maximum file size: 100MB
              </p>
              <input
                id="mediaInput"
                type="file"
                accept="video/*"
                onChange={(e) =>
                  handleFileSelection(Array.from(e.target.files || []))
                }
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative  h-full  w-[40%]   bg-gray-50 rounded-lg overflow-hidden">
              <video
                src={URL.createObjectURL(selectedMedia[0])}
                className="w-full h-full object-cover"
                controls
              />
              <button
                onClick={() => setSelectedMedia([])}
                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {selectedMedia.length > 0 && (
          <div
            className="relative w-full h-[450px] group bg-gray-50 rounded-lg overflow-hidden"
            onMouseEnter={() => setShowArrows(true)}
            onMouseLeave={() => setShowArrows(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="absolute top-2 left-4 z-10 bg-gray-400 bg-opacity-50 text-white text-xs py-1 px-2 rounded-full">
              {currentIndex + 1}/{selectedMedia.length}
            </div>

            <div className="relative h-full flex justify-center items-center">
              <img
                src={URL.createObjectURL(selectedMedia[currentIndex])}
                alt={`Upload ${currentIndex + 1}`}
                className="max-h-[450px] w-full object-contain"
              />
              <button
                onClick={() => {
                  setSelectedMedia((prev) =>
                    prev.filter((_, i) => i !== currentIndex)
                  );
                  if (currentIndex === selectedMedia.length - 1) {
                    setCurrentIndex(Math.max(0, currentIndex - 1));
                  }
                }}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {showArrows && selectedMedia.length > 1 && (
              <>
                {currentIndex > 0 && (
                  <button
                    className="absolute top-1/2 left-2 z-10 transform -translate-y-1/2 bg-gray-400 bg-opacity-50 text-white p-1.5 rounded-full hover:bg-opacity-70"
                    onClick={handlePrev}
                  >
                    <IoIosArrowDropleftCircle size={24} />
                  </button>
                )}
                {currentIndex < selectedMedia.length - 1 && (
                  <button
                    className="absolute top-1/2 right-2 z-10 transform -translate-y-1/2 bg-gray-400 bg-opacity-50 text-white p-1.5 rounded-full hover:bg-opacity-70"
                    onClick={handleNext}
                  >
                    <IoIosArrowDroprightCircle size={24} />
                  </button>
                )}
              </>
            )}

            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {selectedMedia.map((_, index) => (
                <button
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-white"
                      : "bg-white bg-opacity-50"
                  }`}
                  style={{ opacity: getVisibleDots()[index] }}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const firstMedia = selectedMedia[0];
  const videoUrl = useMemo(() => {
    if (firstMedia) {
      return URL.createObjectURL(firstMedia);
    }
    return "";
  }, [firstMedia]);

  const renderVideoPreview = useCallback(() => {
    return (
      <div className="flex  flex-col ">
        <div className="flex justify-center">
          <div className="relative h-[230px] w-[130px] bg-gray-50 rounded-lg overflow-hidden">
            {videothumbnail ? (
              <div className="relative w-full h-full">
                <img
                  src={videothumbnail}
                  alt="Video thumbnail"
                  className="w-full h-full object-fill"
                />
                <button
                  onClick={() => setVideoThumbnail(null)}
                  className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-50 rounded-full hover:bg-opacity-70"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4 border border-gray-100 shadow-sm  rounded-lg p-3 my-4">
        <p className="text-sm text-maincl">Description</p>
          <textarea
            placeholder="What do you want to talk about?"
            value={postContent}
            onChange={handleContentChange}
            className="w-full min-h-[20px] resize-none outline-none  text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Thumbnail Upload Section */}
        <div className="mt-auto">
          <button
            onClick={() => document.getElementById("thumbnailInput")?.click()}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <Image className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">change Thumbnail</span>
          </button>
          <input
            id="thumbnailInput"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const imageUrl = URL.createObjectURL(file);
                setVideoThumbnail(imageUrl);
                setVideoThumbnailFile(file);
              }
            }}
            className="hidden"
          />
          {videothumbnail && (
            <div className="mt-2 p-2 bg-gray-50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-gray-600">Thumbnail uploaded</span>
              <button
                onClick={() => setVideoThumbnail(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }, [videoRef, titleCount, postTitle, postContent, videothumbnail, videoUrl]);

  useEffect(() => {
    return () => {
      if (thumbnail) {
        URL.revokeObjectURL(thumbnail);
      }
    };
  }, [thumbnail]);

  const renderResourcePreview = () => {
    return (
      <div className="flex flex-col h-full">
        {/* PDF Preview Section */}
        <div className="bg-gray-50 rounded-lg mb-4 h-[450px]  flex items-center justify-center">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt="Thumbnail preview"
              className="w-full h-full object-contain rounded-lg"
            />
          ) : pdfFile ? (
            <Document file={pdfFile}>
              <Page pageNumber={1} width={300} className="rounded-lg" />
            </Document>
          ) : (
            <p className="text-gray-400">No PDF uploaded</p>
          )}
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h2 className="text-lg font-medium mb-2">{postTitle}</h2>
          <p className="text-sm text-gray-600">{postContent}</p>
        </div>

        {/* Thumbnail Upload Section */}
        <div className="mt-auto">
          <button
            onClick={() => document.getElementById("thumbnailInput")?.click()}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <Image className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">Upload Thumbnail</span>
          </button>
          <input
            id="thumbnailInput"
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            className="hidden"
          />
          {thumbnail && (
            <div className="mt-2 p-2 bg-gray-50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-gray-600">Thumbnail uploaded</span>
              <button
                onClick={() => setThumbnail(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMainContent = () => {
    if (currentStep === 2 && postType === "Resource") {
      return renderResourcePreview();
    }
    if (currVideoStep === 2 && postType === "Video") {
      return renderVideoPreview();
    }
    return (
      <>
        {postType !== "Video" && (
          <div>
            {/* Title Input */}
            <div className="border border-gray-100 shadow-sm rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-maincl">Post Title</p>
                <span className="text-xs text-gray-500">
                  {titleCount} characters left
                </span>
              </div>
              <input
                type="text"
                placeholder="Write your post title here..."
                value={postTitle}
                onChange={handleTitleChange}
                className="w-full outline-none text-sm"
              />
            </div>

            {/* Description */}
            <div className="space-y-4 border border-gray-100 shadow-sm rounded-lg p-3">
              <p className="text-sm text-maincl">Post Description</p>
              <textarea
                placeholder="What do you want to talk about?"
                value={postContent}
                onChange={handleContentChange}
                className="w-full min-h-[150px] resize-none outline-none  text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
        )}

        {/* Media Upload Section */}
        {renderMediaUpload()}
      </>
    );
  };

  if (!isOpen) return null;

  const userId = localStorage.getItem("Id");

  async function handlepost() {
    if (postType === "Resource" && currentStep === 1) {
      setCurrentStep(2);
      setShowUpload(false);
    } else {
      if (postType === "Post") {
        //API call to post a post

        if (selectedMedia.length > 6) {
          toast.error("Maximum 6 images allowed");
          return;
        }

        const promise = async () => {
          try {
            let imageURLs = [];

            if (selectedMedia.length > 0) {
              // Get presigned URLs for all photos
              const { data } = await axios.post(
                `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/uploads/multiple`,
                {
                  fileCount: selectedMedia.length,
                  fileTypes: selectedMedia.map((photo) => photo.type),
                  id: userId,
                  type: "posts",
                }
              );

              // Upload all photos in parallel
              const uploadPromises = selectedMedia.map(async (photo, index) => {
                const uploadResponse = await axios.put(
                  data.urls[index].uploadURL,
                  photo,
                  {
                    headers: {
                      "Content-Type": photo.type,
                    },
                    withCredentials: false,
                  }
                );

                if (uploadResponse.status !== 200) {
                  throw new Error("Failed to upload photo");
                }

                return data.urls[index].imageURL;
              });

              imageURLs = await Promise.all(uploadPromises);
            }

            await axios.post(
              `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/publish-post/${userId}`,
              {
                title: postTitle,
                description: postContent,
                imageUrls: imageURLs,
              }
            );

            setPostTitle("");
            setPostContent("");
            setSelectedMedia([]);

            onClose();

            return "Post published successfully";
          } catch (error: any) {
            throw new Error(
              error.response?.data?.message || error.message || "Failed to publish post"
            );
          }
        };

        toast.promise(promise(), {
          loading: "Publishing post...",
          success: (data) => data,
          error: (err) => err.message,
        });
      } else if (postType === "Question") {
        if (selectedMedia.length > 6) {
          toast.error("Maximum 6 images allowed");
          return;
        }

        const promise = async () => {
          try {
            let imageURLs = [];

            if (selectedMedia.length > 0) {
              // Get presigned URLs for all photos
              const { data } = await axios.post(
                `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/uploads/multiple`,
                {
                  fileCount: selectedMedia.length,
                  fileTypes: selectedMedia.map((photo) => photo.type),
                  id: userId,
                  type: "questions",
                }
              );

              // Upload all photos in parallel
              const uploadPromises = selectedMedia.map(async (photo, index) => {
                const uploadResponse = await axios.put(
                  data.urls[index].uploadURL,
                  photo,
                  {
                    headers: {
                      "Content-Type": photo.type,
                    },
                    withCredentials: false,
                  }
                );

                if (uploadResponse.status !== 200) {
                  throw new Error("Failed to upload photo");
                }

                return data.urls[index].imageURL;
              });

              imageURLs = await Promise.all(uploadPromises);
            }

            const { data: postData } = await axios.post(
              `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/ask-question/${userId}`,
              {
                title: postTitle,
                description: postContent,
                urgency: false,
                anonymous: false,
                imageUrls: imageURLs,
              }
            );

            console.log(postData);

            setPostTitle("");
            setPostContent("");
            setSelectedMedia([]);

            onClose();

            return "Question posted successfully";
          } catch (error: any) {
            throw new Error(
              error.response?.data?.message || error.message || "Failed to post Question"
            );
          }
        };

        toast.promise(promise(), {
          loading: "Posting Question...",
          success: (data) => data,
          error: (err) => err.message,
        });
      }
    }
    if (postType === "Video" && currVideoStep === 1) {
      setCurrVideoStep(2);
    } else if (postType === "Video" && currVideoStep === 2) {
      if (!selectedMedia) return;

      try {
        //  set isuploading true

        const file = selectedMedia[0];
        const loading = toast.loading("Uploading video...");
        try {
          // get total size of the file
          let totalSize = file.size;
          // set chunk size to 10MB
          let chunkSize = 10000000;
          // calculate number of chunks
          let numChunks = Math.ceil(totalSize / chunkSize);
          if (numChunks === 0) {
            numChunks = 1;
          }

          const uniqueSuffix = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)}`;

          const filename = `${userId}/videos/${uniqueSuffix}.${file?.type?.split("/")[1]}`;

          // Prepare thumbnail upload if present
          let thumbnailUrl = null;
          let thumbnailUploadPromise = null;
          let thumbnailFilename = null;

          console.log(thumbnailFilename)
          if (videoThumbnailFile) {
            console.log("uploading thumbnail also")
            thumbnailFilename = `${userId}/videos/thumbnails/${uniqueSuffix}.${videoThumbnailFile.type.split("/")[1]}`;
            // Get presigned URL for thumbnail
            let thumbPresignRes;
            try {
              thumbPresignRes = await axios.post(
                "https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/uploads/multiple",
                {
              fileCount : 1,
              fileTypes : [videoThumbnailFile.type],
              id : userId,
              type : "videos", // Use 'videos' for compatibility
                }
              );
              console.log('Thumbnail presigned URL response:', thumbPresignRes.data);
            } catch (err) {
              toast.error("Failed to get presigned URL for thumbnail");
              throw new Error("Failed to get presigned URL for thumbnail");
            }
            const thumbUploadUrl = thumbPresignRes.data.urls[0].uploadURL;
            const thumbPublicUrl = thumbPresignRes.data.urls[0].imageURL;
            // Upload thumbnail with error handling
            thumbnailUploadPromise = axios.put(thumbUploadUrl, videoThumbnailFile, {
              headers: {
                "Content-Type": videoThumbnailFile.type,
              },
              withCredentials: false,
            })
              .then((resp) => {
                if (resp.status !== 200) {
                  toast.error("Thumbnail upload failed");
                  throw new Error("Thumbnail upload failed");
                }
                toast.success("Thumbnail uploaded successfully");
                return thumbPublicUrl;
              })
              .catch((err) => {
                toast.error("Thumbnail upload failed");
                console.error("Thumbnail upload error:", err);
                throw err;
              });
          }

          // Get presigned URLs for video chunks
          const response = await axios.post(
            "https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/start-multipart-upload",
            {
              fileName: filename,
              contentType: file.type,
              partNumbers: numChunks,
            }
          );

          let presigned_urls = response?.data?.presignedUrls;
          let uploadId = response?.data?.uploadId;

          // Upload video chunks in parallel
          let parts: any = [];
          const uploadPromises = [];

          for (let i = 0; i < numChunks; i++) {
            let start = i * chunkSize;
            let end = Math.min(start + chunkSize, totalSize);
            let chunk = file.slice(start, end);
            let presignedUrl = presigned_urls[i];

            uploadPromises.push(
              axios.put(presignedUrl, chunk, {
                headers: {
                  "Content-Type": file.type,
                },
              })
            );
          }

          // Wait for both video and thumbnail uploads in parallel
          let [uploadResponses, thumbnailResult] = await Promise.all([
            Promise.all(uploadPromises),
            thumbnailUploadPromise ? thumbnailUploadPromise : Promise.resolve(null),
          ]);

          if (thumbnailResult) {
            thumbnailUrl = thumbnailResult;
          }

          uploadResponses.forEach((response, i) => {
            parts.push({
              etag: response.headers.etag,
              PartNumber: i + 1,
            });
          });

          // Complete multipart upload for video
          let complete_upload = await axios.post(
            "https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/complete-multipart-upload",
            {
              fileName: filename,
              uploadId: uploadId,
              parts: parts,
            }
          );

          const url = complete_upload.data.fileData.Location;

          // Create reel post with video and thumbnail URLs
          await axios.post(
            `https://128i1lirkh.execute-api.ap-south-1.amazonaws.com/dev/create-reel/${userId}`,
            {
              title: postTitle,
              description: postContent,
              referenceTags: ["tag1", "tag2"],
              reelMedialink: url,
              thumbnail: thumbnailUrl,
            }
          );

          toast.success("Video uploaded successfully");
          toast.dismiss(loading);

          setCurrVideoStep(1);
          setPostTitle("");
          setPostContent("");
          setSelectedMedia([]);
          setVideoThumbnail(null);
          setVideoThumbnailFile(null);

          onClose();
        } catch (error: any) {
          toast.dismiss(loading);
          toast.error(error.response?.data?.message || error.message || "Failed to create post");
          console.log(error);
        }

        // set isUpload false
      } catch (error: any) {
        console.log(error);
        toast.error(error.response?.data?.message || error.message || "Failed to upload media");
        // set isUpload false
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[700px] h-[600px] shadow-lg mx-auto flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <img
              src={userAvatar}
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover "
            />
            {/* Visibility Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsVisibilityOpen(!isVisibilityOpen)}
                className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-md"
              >
                <span className="font-medium">{visibility}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isVisibilityOpen && (
                <div className="absolute top-full left-0 mt-1 w-auto bg-buttonclr border rounded-lg shadow-lg py-4 z-10">
                  {[
                    { value: "Public", icon: publicIcon },
                    { value: "Private(Followers Only)", icon: privateIcon },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setVisibility(option.value as Visibility);
                        setIsVisibilityOpen(false);
                      }}
                      className="flex items-center justify-between w-full px-5 py-1 hover:bg-gray-100 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <img src={option.icon} alt="" className="w-4 h-4" />
                        <span className="whitespace-nowrap text-gray-800">
                          {option.value}
                        </span>
                      </div>
                      <input
                        type="radio"
                        checked={visibility === option.value}
                        readOnly
                        className="w-4 h-4 ml-20 text-maincl"
                      />
                    </button>
                  ))}

                  <div className="mx-5 my-3 flex justify-between items-center border-t">
                    <div>
                      <p className="text-md text-gray-800">comment settings</p>
                      <p className="text-xs text-gray-500">Public</p>
                    </div>
                    <button>
                      <FaCaretRight className="text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Post Type Dropdown */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsTypeOpen(!isTypeOpen)}
                className="flex items-center gap-1 px-3 py-1 bg-buttonclr rounded-2xl"
              >
                <span className="font-medium">{postType1}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isTypeOpen && (
                <div className="absolute top-full right-0 mt-1 w-36 z-10 bg-white border rounded-lg shadow-lg py-1">
                  {["Post", "Question", "Resource", "Video"].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setPostType(type as PostType);
                        setIsTypeOpen(false);
                        // setLocalPostType(type);
                        onTypeChange(type);
                        // Reset media when changing type
                        setSelectedMedia([]);
                        setPdfFile(null);
                        setShowUpload(true);
                        setPostTitle("");
                        setPostContent("");
                        setTitleCount(100);
                        setThumbnail(null);
                        setVideoThumbnail(null);
                        setCurrentStep(1);
                      }}
                      className="flex items-center w-full px-3 py-2 hover:bg-gray-100 text-left"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                handleClose();
                onClose();
              }}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto">{renderMainContent()}</div>

        {/* Footer */}
        <div className="p-4 sticky bottom-0 flex justify-between items-center gap-4">
          <div className=" flex justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="universalMediaInput"
                className="hidden"
                accept={
                  postType === "Resource"
                    ? "application/pdf"
                    : postType === "Video"
                    ? "video/*"
                    : "image/*"
                }
                multiple={postType !== "Video"}
                onChange={(e) =>
                  handleFileSelection(Array.from(e.target.files || []))
                }
              />

              {showUpload ? (
                <label
                  htmlFor="universalMediaInput"
                  className="flex items-center   cursor-pointer "
                >
                  <span className=" flex border border-gray-200 rounded-3xl gap-2 text-gray-700 p-1 px-3">
                    <img src={media} alt="" />
                    {postType === "Resource" ? "Upload PDF" : "Add Media"}
                  </span>
                  <img src={add} alt="" />
                </label>
              ) : (
                <div></div>
              )}
            </div>

            {/* Post button remains unchanged */}
          </div>
          <div>
            {((postType === "Resource" && currentStep === 2) ||
              (postType === "Video" && currVideoStep === 2)) && (
              <button
                onClick={() => {
                  return (
                    setShowUpload(true), setCurrentStep(1), setCurrVideoStep(1)
                  );
                }}
                className="px-4 py-1.5 border rounded-3xl hover:bg-gray-50"
              >
                Back
              </button>
            )}
            <button
              className="px-6 py-1.5 bg-maincl text-white rounded-3xl hover:bg-opacity-90 transition-all disabled:opacity-50"
              disabled={
                (!postTitle.trim() && postType !== "Video") ||
                (!postContent.trim() && postType !== "Video") ||
                (postType === "Resource" && !pdfFile) ||
                (postType === "Video" && (selectedMedia.length === 0 || !videoThumbnailFile || isGeneratingThumbnail))
              }
              onClick={() => {
                if (postType === "Resource" && currentStep === 1) {
                  setCurrentStep(2);
                  setShowUpload(false);
                } else {
                  // Handle post submission
                  console.log({
                    type: postType,
                    title: postTitle,
                    content: postContent,
                    visibility,
                    media: selectedMedia,
                    pdf: pdfFile,
                  });
                }
                if (postType === "Video" && currVideoStep === 1) {
                  setCurrVideoStep(2);
                } else {
                  // Handle post submission
                  console.log({
                    type: postType,
                    title: postTitle,
                    content: postContent,
                    visibility,
                    media: selectedMedia,
                    pdf: pdfFile,
                  });
                }

                handlepost();
              }}
            >
              {(postType === "Resource" || postType === "Video") &&
              currentStep === 1
                ? "Continue"
                : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPopup;
