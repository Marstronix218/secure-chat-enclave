
import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { toast } from "@/lib/toast";
import { encryptAndSendPrompt } from "@/lib/api";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "./ChatMessageList";
import ProcessingPanel from "./ProcessingPanel";
import ChatInputForm from "./ChatInputForm";

export interface Message {
  role: "user" | "assistant" | "encrypted" | "decrypted";
  content: string;
  timestamp: Date;
  simulated?: boolean;
}

interface ChatInterfaceProps {
  readyToChat: boolean;
}

export type ChatInterfaceRef = {
  clearAllMessages: () => void;
};

const ChatInterface = forwardRef<ChatInterfaceRef, ChatInterfaceProps>(({ readyToChat }, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Expose the clearAllMessages method via ref
  useImperativeHandle(ref, () => ({
    clearAllMessages: () => {
      setMessages([]);
    }
  }));

  // Add a welcome message when the component loads or messages are cleared
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "こんにちは！私はセキュアなTEE保護アシスタントです。今日はどのようにお手伝いできますか？",
          timestamp: new Date(),
          simulated: false
        }
      ]);
    }
  }, [messages]);

  const handleSendMessage = async (inputValue: string) => {
    if (!readyToChat) {
      toast.error("チャットを開始する前に鍵の設定を完了してください");
      return;
    }
    
    const userMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setCurrentStep(1);
    
    try {
      // Step 1: Encrypt prompt with Key A (public)
      setTimeout(() => {
        setCurrentStep(2);
        // Now add encrypted prompt message to chat after encryption step is shown
        const encryptedMessage: Message = {
          role: "encrypted",
          content: "[0x8f, 0x3a, 0xd2, 0xf7, 0x5b, 0xe2, 0x9c, 0x1a, 0x6b, 0x4d, 0x0e, 0xc8, 0x7f, 0x2b, 0xaa, 0x95...]",
          timestamp: new Date(),
          simulated: true // Default to simulated until we get real data
        };
        setMessages((prev) => [...prev, encryptedMessage]);
      }, 800);
      
      const response = await encryptAndSendPrompt(inputValue);
      
      // Step 2: Send encrypted prompt to TEE (already handled by step transition)
      setTimeout(() => setCurrentStep(3), 1600);
      
      // Step 3: Decrypt prompt in TEE with Key A (private)
      setTimeout(() => setCurrentStep(4), 1000);
      
      // Step 4: Generate response in TEE
      setTimeout(() => setCurrentStep(5), 1000);
      
      // Step 5: Encrypt response with Key B (public)
      setTimeout(() => {
        setCurrentStep(6);
        // Now add encrypted response message to chat after encryption step
        const encryptedResponseMessage: Message = {
          role: "encrypted",
          content: response.encryptedResponse || "[0xc4, 0x7b, 0xf1, 0x2a, 0x9e, 0x5d, 0x0f, 0x3b, 0xa2, 0x6c, 0x8d, 0x4e, 0xb5, 0x1f, 0xd3, 0x70...]",
          timestamp: new Date(),
          simulated: !response.success
        };
        setMessages((prev) => [...prev, encryptedResponseMessage]);
      }, 1000);
      
      // Step 6: Decrypt response with Key B (private)
      setTimeout(() => {
        // Final step - add the decrypted assistant message
        const assistantMessage: Message = {
          role: "assistant",
          content: response.decryptedResponse,
          timestamp: new Date(),
          simulated: !response.success
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
        setCurrentStep(0);
        setIsLoading(false);
        
        if (!response.success) {
          toast.error(response.message || "メッセージの処理に失敗しました");
        }
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add simulated encrypted messages to maintain flow but with byte syntax
      const encryptedMessage: Message = {
        role: "encrypted",
        content: "[0x8f, 0x3a, 0xd2, 0xf7, 0x5b, 0xe2, 0x9c, 0x1a, 0x6b, 0x4d, 0x0e, 0xc8, 0x7f, 0x2b, 0xaa, 0x95...]",
        timestamp: new Date(),
        simulated: true
      };
      
      const encryptedResponseMessage: Message = {
        role: "encrypted",
        content: "[0xc4, 0x7b, 0xf1, 0x2a, 0x9e, 0x5d, 0x0f, 0x3b, 0xa2, 0x6c, 0x8d, 0x4e, 0xb5, 0x1f, 0xd3, 0x70...]",
        timestamp: new Date(),
        simulated: true
      };
      
      const errorMessage: Message = {
        role: "assistant",
        content: "申し訳ありませんが、技術的なエラーのためメッセージを処理できませんでした。後でもう一度お試しください。",
        timestamp: new Date(),
        simulated: true
      };
      
      setMessages((prev) => [...prev, encryptedMessage, encryptedResponseMessage, errorMessage]);
      toast.error("メッセージの送信中にエラーが発生しました。もう一度お試しください。");
      setCurrentStep(0);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />

      <div className="flex-1 overflow-hidden grid grid-cols-3 gap-4 p-4">
        <div className="col-span-2 flex flex-col h-full overflow-hidden">
          <ChatMessageList messages={messages} />
          <ChatInputForm 
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
          />
        </div>

        <ProcessingPanel currentStep={currentStep} />
      </div>
    </div>
  );
});

ChatInterface.displayName = "ChatInterface";

export default ChatInterface;
