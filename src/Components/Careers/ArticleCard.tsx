import * as React from "react";

export interface ArticleCardProps {
  type: string;
  readTime: string;
  date: string;
  title: string;
  description: string;
  imageSrc: string;
  hasBookmark?: boolean;
  onClick?: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  type,
  readTime,
  date,
  title,
  description,
  imageSrc,
  hasBookmark,
  onClick
}) => {
  return (
    <div 
      className="flex gap-1 items-center p-3 w-full bg-white rounded-lg border-neutral-200 shadow-[0px_0px_4px_rgba(0,0,0,0.08)] mb-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex flex-1 shrink gap-2 items-center self-stretch my-auto w-full  min-w-[240px]">
        <img
          loading="lazy"
          src={imageSrc}
          alt={title}
          className="object-contain shrink-0 self-stretch my-auto w-24 rounded aspect-square"
        />
        <div className="flex flex-col flex-1 shrink self-stretch my-auto basis-0 pl-1">
          <div className="flex gap-10 justify-between items-center w-full ">
            <div className="gap-1 self-stretch my-auto font-medium text-xs text-indigo-500 whitespace-nowrap w-[105px]">
              {type}
            </div>
            <div className="flex gap-2 items-center self-stretch my-auto text-xs text-zinc-400">
              <div className="self-stretch my-auto">{readTime}</div>
              {hasBookmark && (
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/ead2fb80c31a4ad188cd3664230d7bc4ead4ef5542e84488f2109db84ca952c1?placeholderIfAbsent=true&apiKey=90dc9675c54b49f9aa0dc15eba780c08"
                  alt=""
                  className="object-contain shrink-0 self-stretch my-auto aspect-[1.38] w-[11px]"
                />
              )}
            </div>
          </div>
          <div className="flex flex-col mt-3 w-full text-xs text-neutral-500 ">
            <div className="font-medium text-fontlit">{date}</div>
            <div className="mt-1 text-xs font-medium text-neutral-700">{title}</div>
            <div className="mt-1 font-normal line-clamp-2">{description}</div>
          </div>
        </div>
      </div>
    </div>
  );
};