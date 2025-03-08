"use client";
import React, { useState } from "react";
import {
  Send,
  Paperclip,
  Smile,
  Calendar,
  Clock,
  Image,
  Mic,
} from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    onSendMessage(message.trim());
    setMessage("");
  };

  return (
    <footer className="bg-white p-3 border-t border-gray-200">
      <div className="flex items-center bg-white rounded-lg">
        {/* <div className="px-2 flex space-x-2">
          <WhatsAppIcon size={20} className="text-green-500" />
          <span className="text-xs text-gray-500">Private Note</span>
        </div> */}

        <form onSubmit={handleSubmit} className="flex-1 flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 py-2 px-3 border-none focus:outline-none text-sm"
            placeholder="Message..."
            disabled={disabled}
          />
          <div className="flex items-center space-x-3 px-2">
            <button type="button" className="text-gray-500">
              <Paperclip size={18} />
            </button>
            <button type="button" className="text-gray-500">
              <Smile size={18} />
            </button>
            <button type="button" className="text-gray-500">
              <Calendar size={18} />
            </button>
            <button type="button" className="text-gray-500">
              <Clock size={18} />
            </button>
            <button type="button" className="text-gray-500">
              <Image size={18} />
            </button>
            <button type="button" className="text-gray-500">
              <Mic size={18} />
            </button>
            <button
              type="submit"
              disabled={!message.trim() || disabled}
              className={`bg-green-600 p-2 rounded-full ${
                !message.trim() || disabled ? "opacity-50" : ""
              }`}
            >
              <Send size={18} className="text-white" />
            </button>
          </div>
        </form>
      </div>
    </footer>
  );
};

export default MessageInput;
