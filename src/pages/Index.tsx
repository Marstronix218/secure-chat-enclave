
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import KeyManagement from "@/components/KeyManagement";
import ChatInterface from "@/components/ChatInterface";
import { toast } from "@/components/ui/sonner";

const Index = () => {
  const [isChatReady, setIsChatReady] = useState(false);
  
  // Simulate checking if keys are set up correctly
  useEffect(() => {
    // In a real app, this would check the key status from the backend
    // For now, we'll just have KeyManagement component manage this
  }, []);
  
  const handleClearChat = () => {
    // This would be handled by the ChatInterface
    toast.success("Chat history cleared");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100"
    >
      <Header />
      
      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <KeyManagement onClearChat={handleClearChat} />
          </motion.div>
          
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3 bg-white rounded-lg shadow-subtle overflow-hidden h-[calc(100vh-11rem)]"
          >
            <ChatInterface readyToChat={true} />
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
};

export default Index;
