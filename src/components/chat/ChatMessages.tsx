"use client";
import React, { useEffect, useRef } from "react";
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
      className="flex-1 overflow-y-auto p-4 space-y-4 relative"
      aria-label="Chat messages"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cg fill='none' stroke='%23000000' stroke-width='1' stroke-opacity='0.07'%3E%3C!-- Chat bubbles --%3E%3Cpath d='M20,30 h20 a10,10 0 0 1 10,10 v15 a10,10 0 0 1 -10,10 h-20 a10,10 0 0 1 -10,-10 v-15 a10,10 0 0 1 10,-10 z'/%3E%3Cpath d='M35,65 l-5,-10'/%3E%3Cpath d='M65,20 h30 a10,10 0 0 1 10,10 v15 a10,10 0 0 1 -10,10 h-30 a10,10 0 0 1 -10,-10 v-15 a10,10 0 0 1 10,-10 z'/%3E%3Cpath d='M75,55 l-5,-10'/%3E%3Cpath d='M120,40 h40 a10,10 0 0 1 10,10 v20 a10,10 0 0 1 -10,10 h-40 a10,10 0 0 1 -10,-10 v-20 a10,10 0 0 1 10,-10 z'/%3E%3Cpath d='M150,80 l5,-10'/%3E%3C!-- Message lines --%3E%3Cpath d='M25,37 h10'/%3E%3Cpath d='M25,43 h15'/%3E%3Cpath d='M75,27 h15'/%3E%3Cpath d='M75,33 h20'/%3E%3Cpath d='M75,39 h10'/%3E%3Cpath d='M130,50 h20'/%3E%3Cpath d='M130,60 h25'/%3E%3C!-- Circular avatars --%3E%3Ccircle cx='25' cy='90' r='10'/%3E%3Cpath d='M22,87 v6 h6'/%3E%3Ccircle cx='60' cy='110' r='12'/%3E%3Cpath d='M55,110 h10'/%3E%3Cpath d='M60,105 v10'/%3E%3C!-- More chat bubbles --%3E%3Cpath d='M130,120 h30 a10,10 0 0 1 10,10 v15 a10,10 0 0 1 -10,10 h-30 a10,10 0 0 1 -10,-10 v-15 a10,10 0 0 1 10,-10 z'/%3E%3Cpath d='M145,155 l-5,-10'/%3E%3Cpath d='M40,140 h25 a10,10 0 0 1 10,10 v20 a10,10 0 0 1 -10,10 h-25 a10,10 0 0 1 -10,-10 v-20 a10,10 0 0 1 10,-10 z'/%3E%3Cpath d='M45,180 l-5,-10'/%3E%3C!-- Text lines --%3E%3Cpath d='M140,130 h15'/%3E%3Cpath d='M140,136 h10'/%3E%3Cpath d='M140,142 h20'/%3E%3Cpath d='M50,150 h15'/%3E%3Cpath d='M50,156 h10'/%3E%3Cpath d='M50,162 h5'/%3E%3C!-- Some icons --%3E%3Ccircle cx='100' cy='100' r='15'/%3E%3Cpath d='M93,100 h14'/%3E%3Cpath d='M95,95 a10,10 0 0 1 10,0'/%3E%3Crect x='150' y='170' width='20' height='20' rx='5'/%3E%3Cpath d='M155,180 h10'/%3E%3Cpath d='M160,175 v10'/%3E%3C!-- Small devices --%3E%3Crect x='90' cy='155' width='25' height='15' rx='2'/%3E%3Cpath d='M95,162 h15'/%3E%3C!-- Small shapes for decoration --%3E%3Ccircle cx='15' cy='170' r='3'/%3E%3Ccircle cx='185' cy='30' r='3'/%3E%3Ccircle cx='120' cy='85' r='3'/%3E%3Crect x='175' y='130' width='6' height='6'/%3E%3Crect x='40' y='110' width='6' height='6'/%3E%3Cpath d='M100,30 l5,5 l-5,5 l-5,-5 z'/%3E%3Cpath d='M170,80 l5,5 l-5,5 l-5,-5 z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundColor: "#f5f5f5",
      }}
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
        </div>
      </div>
    </article>
  );
};
