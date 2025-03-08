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
  console.log(chats);
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
    <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
      {filteredChats &&
        filteredChats.map((chat) => (
          <div
            key={chat.id}
            className={`group relative flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
              activeChat?.id === chat.id ? "bg-blue-50 hover:bg-blue-100" : ""
            }`}
            onClick={() => setActiveChat(chat)}
          >
            <div className="relative flex-shrink-0">
              <Avatar
                src={chat.avatar_url}
                name={chat.name || "Unknown Chat"}
                size="lg"
                className="ring-2 ring-white"
              />
              {chat.unreadCount! > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full px-2 py-1 shadow-sm">
                  {chat.unreadCount}
                </span>
              )}
            </div>

            <div className="ml-4 min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-gray-900 truncate">
                  {chat.name || "Untitled Chat"}
                </h2>
                {chat.lastMessage?.created_at && (
                  <time
                    className="flex-shrink-0 text-xs text-gray-500"
                    dateTime={chat.lastMessage.created_at}
                  >
                    {formatTime(chat.lastMessage.created_at)}
                  </time>
                )}
              </div>

              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="text-sm text-gray-600 truncate">
                  {chat.lastMessage?.content || (
                    <span className="text-gray-400 italic">
                      No messages yet
                    </span>
                  )}
                </p>

                {chat.phone && (
                  <span className="flex-shrink-0 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {chat.phone}
                  </span>
                )}
              </div>

              {chat.tags && chat.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {chat.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      label={tag.name}
                      className="text-xs px-2 py-0.5 rounded-full"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

      {filteredChats?.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No chats found {searchTerm && `matching "${searchTerm}"`}
        </div>
      )}
    </div>
  );
}
