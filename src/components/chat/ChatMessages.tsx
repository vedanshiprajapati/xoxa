// /components/chat/ChatMessages.tsx
"use client";
import React, { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { Message } from "@/types";

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  currentUserId,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section
      className="flex-1 overflow-y-auto p-4 space-y-4"
      aria-label="Chat messages"
    >
      {messages.map((msg) => (
        <article
          key={msg.id}
          className={`flex ${
            msg.sender_id === currentUserId ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-xs ${
              msg.sender_id === currentUserId
                ? "bg-green-100 rounded-lg p-3"
                : "bg-white rounded-lg p-3 shadow-sm"
            }`}
          >
            {msg.sender_id !== currentUserId && (
              <div className="font-medium text-sm text-gray-800 mb-1">
                {msg.sender_name}
              </div>
            )}
            <div className="text-sm break-words">{msg.content}</div>
            <div className="flex justify-end items-center mt-1 text-xs text-gray-500 space-x-1">
              <time dateTime={msg.created_at}>
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
              {msg.sender_id === currentUserId && msg.is_read && (
                <span className="text-green-500">
                  <Check size={12} />
                </span>
              )}
            </div>
            {msg.sender_id === currentUserId && msg.sent_by && (
              <div className="text-xs text-gray-500 flex items-center mt-1">
                <Check size={10} className="text-green-500 mr-1" />
                {msg.sent_by}
              </div>
            )}
          </div>
        </article>
      ))}
      <div ref={messagesEndRef} />
    </section>
  );
};

export default ChatMessages;
