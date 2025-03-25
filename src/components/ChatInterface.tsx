
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/toast";
import { Send, RefreshCw, Lock } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ProcessingStep from "./ProcessingStep";
import { encryptAndSendPrompt } from "@/lib/api";
import AnimatedContainer from "./AnimatedContainer";

export interface Message {
  role: "user" | "assistant" | "encrypted" | "decrypted";
  content: string;
  timestamp: Date;
  simulated?: boolean;
}

interface ChatInterfaceProps {
  readyToChat: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ readyToChat }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add a welcome message when component mounts
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        role: "assistant",
        content: "Hello! I'm the Eaglys secure enclave assistant. How can I help you today?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    if (!readyToChat) {
      toast.error("Please complete the key setup before chatting");
      return;
    }
    
    const userMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setCurrentStep(1);
    
    try {
      // Step 1: Encrypt prompt with Key A (public)
      setTimeout(() => setCurrentStep(2), 800);
      
      const response = await encryptAndSendPrompt(inputValue);
      
      if (response.success) {
        // Step 2: Show encrypted text
        const encryptedMessage: Message = {
          role: "encrypted",
          content: response.encryptedPrompt,
          timestamp: new Date(),
          simulated: response.isSimulated
        };
        
        setMessages((prev) => [...prev, encryptedMessage]);
        setTimeout(() => setCurrentStep(3), 800);
        
        // Step 3: Process in TEE (waiting)
        setTimeout(() => setCurrentStep(4), 1600);
        
        // Step 4: Get encrypted response
        const encryptedResponseMessage: Message = {
          role: "encrypted",
          content: response.encryptedResponse,
          timestamp: new Date(),
          simulated: response.isSimulated
        };
        
        setMessages((prev) => [...prev, encryptedResponseMessage]);
        setTimeout(() => setCurrentStep(5), 800);
        
        // Step 5: Decrypt response with Key B (private)
        setTimeout(() => {
          const assistantMessage: Message = {
            role: "assistant",
            content: response.decryptedResponse,
            timestamp: new Date(),
            simulated: response.isSimulated
          };
          
          setMessages((prev) => [...prev, assistantMessage]);
          setCurrentStep(0);
          setIsLoading(false);
          
          if (response.isSimulated) {
            toast.info("Using simulated responses due to API connectivity issues");
          }
        }, 800);
      } else {
        toast.error(response.message || "Failed to process message");
        setCurrentStep(0);
        setIsLoading(false);
        
        // Add a fallback response for errors
        const fallbackMessage: Message = {
          role: "assistant",
          content: response.decryptedResponse || "I'm sorry, but I encountered an issue processing your request. Please try again later.",
          timestamp: new Date(),
          simulated: true
        };
        setMessages((prev) => [...prev, fallbackMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error sending message. Using simulated response instead.");
      setCurrentStep(0);
      setIsLoading(false);
      
      // Fallback response for unhandled errors
      const fallbackMessage: Message = {
        role: "assistant",
        content: `I apologize, but I'm having trouble connecting to the secure enclave. This is a simulated response for demonstration purposes. You asked: "${inputValue}"`,
        timestamp: new Date(),
        simulated: true
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-medium tracking-tight">Secure Chat</h2>
        <p className="text-sm text-muted-foreground mt-1">
          End-to-end encrypted communication
        </p>
      </div>

      <div className="flex-1 overflow-hidden grid grid-cols-3 gap-4 p-4">
        <div className="col-span-2 flex flex-col h-full overflow-hidden">
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
                  <h3 className="text-lg font-medium mb-2">Secure Enclave Chat</h3>
                  <p className="text-muted-foreground text-sm max-w-md">
                    Your messages are encrypted with RSA and processed in a Trusted Execution Environment, 
                    ensuring end-to-end security.
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

          <form onSubmit={handleSendMessage} className="mt-4 flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={!readyToChat || isLoading}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={!readyToChat || isLoading || !inputValue.trim()}
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="ml-2">Send</span>
            </Button>
          </form>
        </div>

        <AnimatedContainer className="h-full bg-white rounded-lg border p-4 overflow-y-auto">
          <h3 className="text-sm font-medium mb-3">TEE Processing</h3>
          
          <div className="space-y-1">
            <ProcessingStep
              step={1}
              currentStep={currentStep}
              text="Encrypting prompt with Key A (public)"
              isCompleted={currentStep > 1}
            />
            
            <ProcessingStep
              step={2}
              currentStep={currentStep}
              text="Sending encrypted prompt to TEE"
              isCompleted={currentStep > 2}
            />
            
            <ProcessingStep
              step={3}
              currentStep={currentStep}
              text="Decrypting prompt in TEE with Key A (private)"
              isCompleted={currentStep > 3}
            />
            
            <ProcessingStep
              step={4}
              currentStep={currentStep}
              text="Generating response in TEE"
              isCompleted={currentStep > 4}
            />
            
            <ProcessingStep
              step={5}
              currentStep={currentStep}
              text="Encrypting response with Key B (public)"
              isCompleted={currentStep > 5}
            />
            
            <ProcessingStep
              step={6}
              currentStep={currentStep}
              text="Decrypting response with Key B (private)"
              isCompleted={currentStep > 6}
            />
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );
};

export default ChatInterface;
