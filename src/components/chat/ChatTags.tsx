import { useTags } from "@/lib/hooks";
import { Tag } from "@/types";
import React, { useState, Dispatch, SetStateAction } from "react";

export default function ChatTagDropdown({
  selectedTags,
  setSelectedTags,
}: {
  selectedTags: Tag[];
  setSelectedTags: Dispatch<SetStateAction<Tag[]>>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { tags, isLoading, error } = useTags();

  console.log(tags);
  const toggleTag = (tag: Tag) => {
    console.log(tag, "selected tags");
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="relative w-64">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border rounded-lg shadow-sm flex justify-between items-center"
        type="button"
      >
        {selectedTags.length > 0
          ? selectedTags.map((tag) => tag.name).join(", ")
          : "Select Tags"}
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <div className="absolute mt-2 w-full bg-white border rounded-lg shadow-lg z-10">
          {tags &&
            tags.map((tag) => (
              <div
                key={tag.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => toggleTag(tag)}
              >
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  readOnly
                  className="mr-2"
                />
                {tag.name}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
