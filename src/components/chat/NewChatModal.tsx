"use client";
import { useState, useEffect } from "react";
import { useChat } from "@/contexts/chatContext"; // Assuming your context is here
import { useCreateChat, useAllUsers } from "@/lib/hooks";
import { Button } from "@/components/ui/Button";
import { User } from "@/types";

export function NewChatModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // Get context and hooks
  const { setActiveChat, currentUser, setChats, chats } = useChat();
  const { users } = useAllUsers();
  const { createChat, isLoading } = useCreateChat();
  // Chat type selection
  const [isGroupChat, setIsGroupChat] = useState(false);

  // Direct message state
  const [recipientEmail, setRecipientEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [foundRecipient, setFoundRecipient] = useState<User | null>(null);
  // Group chat state
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const participants =
    currentUser && users?.filter((user) => user.id != currentUser.id);
  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsGroupChat(false);
      setRecipientEmail("");
      setEmailError("");
      setFoundRecipient(null);
      setGroupName("");
      setSelectedParticipants([]);
      setSelectedTags([]);
    }
  }, [isOpen]);

  // Validate email and find user
  const handleEmailChange = (email: string) => {
    setRecipientEmail(email);
    setEmailError("");
    setFoundRecipient(null);

    if (!email) return;

    const matchedUser = users?.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
    console.log(users);
    if (matchedUser) {
      setFoundRecipient(matchedUser);
    } else if (email.includes("@")) {
      setEmailError("No user found with this email");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let newChatData;

      if (isGroupChat) {
        // Create group chat
        if (!groupName.trim()) {
          return; // Prevent empty group name
        }

        newChatData = await createChat(
          selectedParticipants,
          groupName,
          selectedTags
        );
        if (newChatData) {
          // Update chat list immediately
          if (chats && setChats) {
            setChats([newChatData, ...chats]);
          }

          setActiveChat(newChatData);
        }
        onClose();
      } else {
        // Create direct message
        if (!foundRecipient) {
          setEmailError("Please enter a valid user email");
          return;
        }

        // Create chat with just the recipient
        newChatData = await createChat(
          [foundRecipient.id],
          foundRecipient.name,
          []
        );
      }

      // Set the newly created chat as active
      if (newChatData) {
        setActiveChat(newChatData);
      }

      onClose();
    } catch (error) {
      alert("Error creating chat");
      console.log(error);
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

        <div className="mb-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={!isGroupChat}
                onChange={() => setIsGroupChat(false)}
                className="mr-2"
              />
              Direct Message
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={isGroupChat}
                onChange={() => setIsGroupChat(true)}
                className="mr-2"
              />
              Group Chat
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isGroupChat ? (
            // Group Chat Form
            <>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter group name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Add Participants
                </label>
                <div className="max-h-48 overflow-y-auto border rounded-md p-2">
                  {participants?.map((user) => (
                    <label
                      key={user.id}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedParticipants.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedParticipants([
                              ...selectedParticipants,
                              user.id,
                            ]);
                          } else {
                            setSelectedParticipants(
                              selectedParticipants.filter(
                                (id) => id !== user.id
                              )
                            );
                          }
                        }}
                      />
                      <span>{user.name}</span>
                      <span className="text-xs text-gray-500">
                        {user.email}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* <div>
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
              </div> */}
            </>
          ) : (
            // Direct Message Form
            <div>
              <label className="block text-sm font-medium mb-1">
                Recipient Email
              </label>
              <input
                type="email"
                required
                value={recipientEmail}
                onChange={(e) => handleEmailChange(e.target.value)}
                className={`w-full p-2 border rounded-md ${
                  emailError
                    ? "border-red-500"
                    : foundRecipient
                    ? "border-green-500"
                    : ""
                }`}
                placeholder="Enter recipient's email..."
              />

              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}

              {foundRecipient && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm">
                    <span className="font-medium">{foundRecipient.name}</span>
                    {foundRecipient.email !== foundRecipient.name && (
                      <span className="text-gray-500">
                        {" "}
                        ({foundRecipient.email})
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || (!isGroupChat && !foundRecipient)}
            >
              {isLoading ? "Creating..." : "Create Chat"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
