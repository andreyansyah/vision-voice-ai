import { useEffect, useRef } from "react";
import { Message } from "@/features/messages/messages";
type Props = {
  messages: Message[];
};
export const ChatLog = ({ messages }: Props) => {
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({
      behavior: "auto",
      block: "center",
    });
  }, []);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [messages]);
  return (
    <div className="absolute w-col-span-6 max-w-full h-[100svh] pb-64">
      <div className="max-h-full px-16 pt-104 pb-64 overflow-y-auto scroll-hidden">
        {messages.map((msg, i) => {
          return (
            <div key={i} ref={messages.length - 1 === i ? chatScrollRef : null}>
              <Chat role={msg.role} message={msg.content} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Chat = ({ role, message }: { role: string; message: string }) => {
  const isAssistant = role === "assistant";
  const offsetX = isAssistant ? "pr-40" : "pl-40";

  return (
    <div className={`mx-auto max-w-md my-16 ${offsetX}`}>
      <div className={isAssistant ? "futuristic-chat-assistant" : "futuristic-chat-user"}>
        <div className={isAssistant ? "futuristic-chat-assistant-header" : "futuristic-chat-user-header"}>
          <span
            className={`w-2 h-2 rounded-full ${
              isAssistant ? "bg-rose-400" : "bg-white"
            } animate-pulse`}
          ></span>
          {isAssistant ? "KARAKTER" : "ANDA"}
        </div>
        <div className={isAssistant ? "futuristic-chat-assistant-body" : "futuristic-chat-user-body"}>
          <div style={{ color: "#ffffff" }}>
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};
