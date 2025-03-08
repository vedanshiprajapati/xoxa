"use client";
import { useState, useEffect } from "react";
import { useUsers, useTags, useCreateChat } from "@/lib/hooks";
import { Button } from "@/components/ui/Button";

export function NewChatModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedParticipants, setParticipants] = useState<string[]>([]);
  const [selectedTags, setTags] = useState<string[]>([]);
  const [chatName, setChatName] = useState("");
  const { users } = useUsers();
  const { tags } = useTags();
  const { createChat, isLoading } = useCreateChat();

  useEffect(() => {
    if (!isOpen) {
      setParticipants([]);
      setTags([]);
      setChatName("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createChat(selectedParticipants, chatName, selectedTags);
      onClose();
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg relative">
        <h2 className="text-lg font-medium mb-4">Create New Chat</h2>
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Chat Name (optional)
            </label>
            <input
              type="text"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Add Participants
            </label>
            <div className="grid grid-cols-2 gap-2">
              {users?.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center space-x-2 p-2 border rounded-md"
                >
                  <input
                    type="checkbox"
                    checked={selectedParticipants.includes(user.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setParticipants([...selectedParticipants, user.id]);
                      } else {
                        setParticipants(
                          selectedParticipants.filter((id) => id !== user.id)
                        );
                      }
                    }}
                  />
                  <span>{user.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Add Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag) => (
                <label
                  key={tag.id}
                  className="flex items-center space-x-2 px-3 py-1 border rounded-full"
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTags([...selectedTags, tag.id]);
                      } else {
                        setTags(selectedTags.filter((id) => id !== tag.id));
                      }
                    }}
                  />
                  <span>{tag.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Chat"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
