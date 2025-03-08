// /components/chat/ChatMessages.tsx
"use client";
import React, { useEffect, useRef } from "react";
import { Check, CheckCheck } from "lucide-react";
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
        <MessageBox msg={msg} currentUserId={currentUserId} key={msg.id} />
      ))}
      <div ref={messagesEndRef} />
    </section>
  );
};

export default ChatMessages;

const MessageBox = ({
  msg,
  currentUserId,
}: {
  msg: Message;
  currentUserId: string;
}) => {
  const isSentByCurrentUser = msg.sender_id === currentUserId;

  return (
    <article
      className={`flex ${
        isSentByCurrentUser ? "justify-end" : "justify-start"
      } mb-2`}
    >
      <div
        className={`relative max-w-xs p-3 text-sm break-words rounded-lg shadow-md ${
          isSentByCurrentUser
            ? "bg-green-200 text-gray-900 rounded-br-none"
            : "bg-white text-gray-900 rounded-bl-none"
        }`}
      >
        {!isSentByCurrentUser && (
          <div className="text-xs font-semibold text-gray-700 mb-1">
            {msg.sender_name}
          </div>
        )}

        <div>{msg.content}</div>

        <div className="flex justify-end items-center mt-1 text-xs text-gray-500 space-x-1">
          <time dateTime={msg.created_at}>
            {new Date(msg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>

          {isSentByCurrentUser && (
            <span className={msg.is_read ? "text-blue-500" : "text-gray-400"}>
              {msg.is_read ? <CheckCheck size={14} /> : <Check size={14} />}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
