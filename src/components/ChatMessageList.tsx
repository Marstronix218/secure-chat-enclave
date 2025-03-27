
import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { Message } from "./ChatInterface";

interface ChatMessageListProps {
  messages: Message[];
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto pr-2">
      <AnimatePresence>
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center text-center p-6"
          >
            <div className="w-16 h-16 mb-4 rounded-full bg-blue-50 flex items-center justify-center">
              <Lock className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">セキュアエンクレーブチャット</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              メッセージはRSAで暗号化され、信頼された実行環境で処理されるため、エンドツーエンドのセキュリティが確保されます。
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          role={message.role}
          content={message.content}
          timestamp={message.timestamp}
          simulated={message.simulated}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
