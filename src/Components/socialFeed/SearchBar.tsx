import * as React from "react";
import { SearchBarProps } from "./types";

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onAddPost,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="flex flex-col mt-6 w-full px-5">
      <div className="flex gap-3 items-center w-full">
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 shrink justify-center self-stretch px-3 py-2 my-auto text-xs font-light text-center whitespace-nowrap rounded-2xl basis-0 bg-neutral-200 bg-opacity-60 min-h-[29px] text-neutral-500"
        >
          <div className="flex gap-2 items-center w-full">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/98ce968e6a6ee75443b0bfff06bf1ae0bd9ff7aa3370320c797ee468c90e5a5f?placeholderIfAbsent=true&apiKey=90dc9675c54b49f9aa0dc15eba780c08"
              className="object-contain shrink-0 self-stretch my-auto w-3 aspect-square"
              alt="Search icon"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-transparent outline-none"
              aria-label="Search"
            />
          </div>
        </form>
        <button
          onClick={onAddPost}
          className="flex gap-2 justify-center items-center self-stretch py-1.5 pr-3 pl-1.5 my-auto text-xs text-white rounded-2xl bg-maincl min-h-[29px] hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
          aria-label="Add post"
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/2ee2fecfef7edf0f14d1ab33f1ada2f9d06a0c54e3ab3d353dc2c647c253134f?placeholderIfAbsent=true&apiKey=90dc9675c54b49f9aa0dc15eba780c08"
            className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
            alt="Add post icon"
          />
          <span>Add Post</span>
        </button>
      </div>
    </div>
  );
};
