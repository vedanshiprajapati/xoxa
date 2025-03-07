import React from "react";
import {
  Search,
  Award,
  MoreVertical,
  RefreshCw,
  HelpCircle,
  ExternalLink,
  Bell,
  User,
  Menu,
  ChevronDown,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useChat } from "@/contexts/chatContext";

export function AppHeader() {
  return (
    <header className="bg-white py-2 px-4 shadow-sm flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-md bg-green-600 flex items-center justify-center text-white font-bold">
          P<span className="text-xs">12</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-500">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          <span className="text-sm">chats</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="icon">
          <RefreshCw size={18} />
        </Button>
        <Button variant="icon">
          <HelpCircle size={18} />
        </Button>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
          <span className="text-sm text-gray-600">5 / 6 phones</span>
          <ChevronDown size={14} className="text-gray-600" />
        </div>
        <Button variant="icon">
          <ExternalLink size={18} />
        </Button>
        <Button variant="icon">
          <Bell size={18} />
        </Button>
        <Button variant="icon">
          <User size={18} />
        </Button>
        <Button variant="icon">
          <Menu size={18} />
        </Button>
      </div>
    </header>
  );
}

export function ChatHeader() {
  const { activeChat } = useChat();

  if (!activeChat) return null;

  return (
    <div className="bg-white p-3 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center">
        <div className="mr-3">
          <Avatar
            src={activeChat.avatar_url}
            name={activeChat.name}
            size="md"
          />
        </div>
        <div>
          <div className="font-medium">{activeChat.name}</div>
          <div className="text-xs text-gray-500 flex items-center space-x-1">
            <div className="flex items-center">
              <span>
                Roshnag Airtel, Boshnag Jio, Bharat Kumar Ramesh, Periskope
              </span>
              <span className="ml-2">+3</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Button variant="icon">
          <Search size={18} />
        </Button>
        <Button variant="icon">
          <Award size={18} />
        </Button>
        <Button variant="icon">
          <MoreVertical size={18} />
        </Button>
      </div>
    </div>
  );
}
