
import React from "react";
import { motion } from "framer-motion";
import { Lock, Shield } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-6 px-4 sm:px-6">
      <motion.div 
        className="max-w-7xl mx-auto flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1] 
        }}
      >
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-medium tracking-tight">
            Secure<span className="text-primary font-semibold">Enclave</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-1.5 bg-secondary/50 px-3 py-1.5 rounded-full">
          <Lock className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">
            Trusted Execution Environment
          </span>
        </div>
      </motion.div>
    </header>
  );
};

export default Header;
