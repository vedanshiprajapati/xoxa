"use client";
import React, { useState } from "react";
import {
  Home,
  MessageCircle,
  BarChart2,
  Contact,
  Menu,
  Settings,
  Plus,
} from "lucide-react";
import { LogoutButton } from "../auth/LogoutButton";
import { Button } from "../ui/Button";
import { NewChatModal } from "./NewChatModal";

const Sidebar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <nav
      className="w-14 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-6"
      aria-label="Main navigation"
    >
      <a
        href="#"
        className="text-gray-600 hover:text-gray-800"
        aria-label="Home"
      >
        <Home size={22} />
      </a>
      <a href="#" className="relative text-green-600" aria-label="Messages">
        <MessageCircle size={22} />
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-xs text-green-600">6</span>
        </div>
      </a>
      <a
        href="#"
        className="text-gray-600 hover:text-gray-800"
        aria-label="Analytics"
      >
        <BarChart2 size={22} />
      </a>
      <a
        href="#"
        className="text-gray-600 hover:text-gray-800"
        aria-label="Contacts"
      >
        <Contact size={22} />
      </a>
      <a
        href="#"
        className="text-gray-600 hover:text-gray-800"
        aria-label="Menu"
      >
        <Menu size={22} />
      </a>

      <a
        href="#"
        className="text-gray-600 hover:text-gray-800"
        aria-label="Settings"
      >
        <Settings size={22} />
      </a>

      <Button
        variant="icon"
        onClick={() => setIsModalOpen(true)}
        className="mt-auto"
        aria-label="Create new chat"
      >
        <Plus size={22} />
      </Button>
      <LogoutButton />

      <NewChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </nav>
  );
};

export default Sidebar;
