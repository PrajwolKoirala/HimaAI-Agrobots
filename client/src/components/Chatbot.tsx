"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

// Initialize the Google AI API
// Replace with your actual API key from Google AI Studio
const API_KEY = "AIzaSyCfuOs8eBCPRh0nFT5C-2wAzySftUA-lHQ";
const genAI = new GoogleGenerativeAI(API_KEY);

interface Message {
  text: string;
  isUser: boolean;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you?", isUser: false }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);  
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState<"en" | "ne">("en");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Stop recording/speaking when component unmounts
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Function to start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      const audioChunks: Blob[] = [];
      
      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });
      
      mediaRecorderRef.current.addEventListener("stop", async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        await processAudioToText(audioBlob);
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      });
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access your microphone. Please check permissions.");
    }
  };

  // Function to stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Function to convert audio to text (simulate with placeholder)
  const processAudioToText = async (audioBlob: Blob) => {
    setIsLoading(true);
    
    try {
      // In a real implementation, you would send this audio to a Speech-to-Text API
      // For Google's Speech-to-Text, you'd upload the blob to your server 
      // and make an API call, or use a client library
      
      // Create a FormData object to send the audio file
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("language", language);
      
      // This would be your API endpoint for speech-to-text
      // For demo, let's assume we're sending to a backend route
      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData
      });
      
      if (!response.ok) {
        throw new Error("Failed to convert speech to text");
      }
      
      const data = await response.json();
      
      // For demo purposes, if you don't have an API yet, you can comment out
      // the above code and use this placeholder text:
      // const data = { text: language === "en" ? "This is a placeholder for speech recognition." : "यो भाषण पहिचानको लागि प्लेसहोल्डर हो।" };
      
      // Set the recognized text as input
      setInputText(data.text);
    } catch (error) {
      console.error("Error processing audio:", error);
      alert("Error processing your speech. Please try again or type your message.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to speak text
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesisRef.current = utterance;
      
      // Set language
      utterance.lang = language === "en" ? "en-US" : "ne-NP";
      
      // Getting available voices
      const voices = window.speechSynthesis.getVoices();
      
      // Try to find a voice for the selected language
      const voice = voices.find(v => v.lang.startsWith(language));
      if (voice) {
        utterance.voice = voice;
      }
      
      // Events
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsSpeaking(false);
      };
      
      // Speak
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Your browser does not support speech synthesis.");
    }
  };

  // Function to stop speaking
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() === "") return;
    
    // Add user message to chat
    const userMessage = { text: inputText, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    
    try {
      // Use Gemini API
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      // Construct a system prompt that includes language instruction
      const systemPrompt = language === "en" 
        ? "Please respond in English." 
        : "कृपया नेपाली भाषामा जवाफ दिनुहोस्।"; // "Please respond in Nepali"
      
      // Get chat history for context (just sending the last few messages)
      const history = messages.slice(-5).map(msg => msg.text).join("\n");
      
      const result = await model.generateContent(`${systemPrompt}\n\n${history}\nUser: ${inputText}\nAssistant:`);
      const response = result.response.text();
      
      // Add bot response to chat
      setMessages((prev) => [...prev, { text: response, isUser: false }]);
      
      // Automatically speak the response if needed
      if (isSpeaking) {
        speakText(response);
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      
      const errorMessage = language === "en"
        ? "Sorry, I encountered an error. Please try again."
        : "माफ गर्नुहोस्, मैले एउटा त्रुटि भेटाएँ। कृपया फेरि प्रयास गर्नुहोस्।";
      
      setMessages((prev) => [...prev, { 
        text: errorMessage, 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "ne" : "en");
    
    // Update the welcome message
    if (messages.length === 1) {
      const welcomeMessage = language === "en"
        ? "नमस्कार! म तपाईंलाई कसरी मद्दत गर्न सक्छु?"  // Hello! How can I help you? in Nepali
        : "Hello! How can I help you?";
      
      setMessages([{ text: welcomeMessage, isUser: false }]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="rounded-full p-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-lg"
            aria-label="Open chatbot"
          >
            Chat
          </Button>
        </DialogTrigger>
        <DialogContent className="w-80 sm:w-96 h-96 bg-white/90 backdrop-blur-md rounded-lg p-4">
          <DialogHeader className="flex flex-row justify-between items-center">
            <DialogTitle className="text-gray-700">
              {language === "en" ? "Help Assistant" : "सहायता सहायक"}
            </DialogTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleLanguage}
              className="text-xs"
            >
              {language === "en" ? "नेपाली" : "English"}
            </Button>
          </DialogHeader>
          <div className="mt-2 flex flex-col h-full">
            {/* Chat history container */}
            <div 
              ref={chatContainerRef} 
              className="flex-1 overflow-y-auto p-2 border border-gray-200 rounded-md"
            >
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`mb-2 p-2 rounded-lg max-w-[80%] ${
                    message.isUser 
                      ? "ml-auto bg-gradient-to-r from-green-100 to-blue-100 text-gray-800" 
                      : "mr-auto bg-gray-100 text-gray-700"
                  }`}
                >
                  {message.text}
                  {!message.isUser && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-1 text-gray-500"
                      onClick={() => speakText(message.text)}
                    >
                      <Volume2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="mr-auto bg-gray-100 text-gray-700 p-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              )}
            </div>
            {/* Input area */}
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  className="mr-2"
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  type="button"
                  variant={isSpeaking ? "destructive" : "outline"}
                  size="sm"
                  className="mr-2"
                  onClick={() => isSpeaking ? stopSpeaking() : setIsSpeaking(true)}
                >
                  {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={language === "en" ? "Type your message..." : "आफ्नो सन्देश टाइप गर्नुहोस्..."}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 resize-none"
                  rows={1}
                />
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                onClick={sendMessage}
                disabled={isLoading || inputText.trim() === ""}
              >
                {isLoading 
                  ? (language === "en" ? "Sending..." : "पठाउँदै...") 
                  : (language === "en" ? "Send" : "पठाउनुहोस्")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chatbot;