// components/Chatbot.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            className="rounded-full p-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-lg"
            aria-label="Open chatbot"
          >
            {/* You could replace the text with an icon if you prefer */}
            Chat
          </Button>
        </DialogTrigger>
        <DialogContent className="w-80 h-96 bg-white/90 backdrop-blur-md rounded-lg p-4">
          <DialogHeader>
            <DialogTitle className="text-gray-700">Help Assistant</DialogTitle>
          </DialogHeader>
          <div className="mt-2 flex flex-col h-full">
            {/* Chat history container */}
            <div className="flex-1 overflow-y-auto p-2 border border-gray-200 rounded-md">
              <p className="text-gray-500">Hello! How can I help you?</p>
              {/* Dynamically load chat messages here */}
            </div>
            {/* Input area */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
              />
              <Button className="mt-2 w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chatbot;
