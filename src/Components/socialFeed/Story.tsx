import * as React from "react";
import { StoryProps } from "./types";

export const Story: React.FC<StoryProps> = ({ imageUrl, name, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center p-1 hover:bg-slate-50 rounded-lg transition-colors"
    >
      <div className="w-[64px] h-[64px] rounded-full p-[1px] bg-mainc">
        <img
          src={imageUrl}
          alt={`${name}'s story`}
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <span className="mt-1 text-xs text-neutral-700">{name}</span>
    </button>
  );
};
