
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, RefreshCw } from "lucide-react";

interface ChatInputFormProps {
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

const ChatInputForm: React.FC<ChatInputFormProps> = ({ isLoading, onSendMessage }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    onSendMessage(inputValue);
    setInputValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex space-x-2">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="メッセージを入力..."
        disabled={isLoading}
        className="flex-1"
      />
      <Button 
        type="submit" 
        disabled={isLoading || !inputValue.trim()}
      >
        {isLoading ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        <span className="ml-2">送信</span>
      </Button>
    </form>
  );
};

export default ChatInputForm;
