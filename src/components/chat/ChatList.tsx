import React from "react";
import { Search, Filter, ListFilter } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useChat } from "@/contexts/chatContext";

export function ChatListHeader() {
  const { searchTerm, setSearchTerm, filteredView, setFilteredView } =
    useChat();

  return (
    <div className="p-3 border-b border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-1">
          <ListFilter size={18} className="text-green-600" />
          <span className="text-green-600 font-medium text-sm">
            Custom filter
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-2 py-1 text-xs text-gray-600 border border-gray-300 rounded">
            Save
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-2 top-2 text-gray-400" />
          <input
            type="text"
            className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded text-sm"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className={`px-2 py-1.5 text-xs border border-gray-300 rounded flex items-center ${
            filteredView ? "bg-green-100 text-green-600" : "text-gray-600"
          }`}
          onClick={() => setFilteredView(!filteredView)}
        >
          <Filter size={14} className="mr-1" />
          Filtered
          <div className="ml-1 w-2 h-2 bg-green-600 rounded-full"></div>
        </button>
      </div>
    </div>
  );
}

export function ChatList() {
  const { chats, activeChat, setActiveChat, searchTerm, filteredView } =
    useChat();

  // Filter chats based on search term and filtered view
  const filteredChats =
    chats &&
    chats.filter((chat) => {
      // Search filter
      const matchesSearch = searchTerm
        ? chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          chat.lastMessage?.content
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          chat.phone?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      // Filtered view (can be customized based on specific filter criteria)
      const matchesFilter = filteredView ? true : true;

      return matchesSearch && matchesFilter;
    });

  // Format timestamp to display just the time
  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    if (dateString === "Yesterday") return "Yesterday";

    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {filteredChats &&
        filteredChats.map((chat) => (
          <div
            key={chat.id}
            className={`p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${
              activeChat?.id === chat.id ? "bg-gray-100" : ""
            }`}
            onClick={() => setActiveChat(chat)}
          >
            <div className="flex">
              <div className="mr-2 relative">
                <Avatar src={chat.avatar_url} name={chat.name} size="md" />
                {chat.unreadCount && chat.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-xs text-white">
                      {chat.unreadCount}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div className="font-medium text-sm truncate">
                    {chat.name}
                  </div>
                  <div className="text-xs text-gray-500 ml-1 whitespace-nowrap">
                    {formatTime(chat.lastMessage?.created_at)}
                  </div>
                </div>
                <div className="text-sm text-gray-600 truncate">
                  {chat.lastMessage?.content}
                </div>
                <div className="flex items-center mt-1">
                  <div className="text-xs text-gray-500">{chat.phone}</div>
                  <div className="ml-auto flex">
                    {chat.tags?.map((tag, index) => {
                      // Map tag names to appropriate variants
                      const getVariant = (tag: string) => {
                        switch (tag.toLowerCase()) {
                          case "demo":
                            return "demo";
                          case "internal":
                            return "internal";
                          case "signup":
                            return "signup";
                          case "content":
                            return "content";
                          case "dont send":
                            return "dont-send";
                          default:
                            return "default";
                        }
                      };

                      return (
                        <Badge
                          key={index}
                          label={tag.name}
                          variant={getVariant(tag.color)}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
