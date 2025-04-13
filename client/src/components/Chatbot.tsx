"use client";

import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageCircle,
  Send,
  Bot,
  X,
} from "lucide-react";

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
    { text: "Hello! How can I help you?", isUser: false },
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
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
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
        stream.getTracks().forEach((track) => track.stop());
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
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
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
        body: formData,
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
      alert(
        "Error processing your speech. Please try again or type your message."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to speak text
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesisRef.current = utterance;

      // Set language
      utterance.lang = language === "en" ? "en-US" : "ne-NP";

      // Getting available voices
      const voices = window.speechSynthesis.getVoices();

      // Try to find a voice for the selected language
      const voice = voices.find((v) => v.lang.startsWith(language));
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
    if ("speechSynthesis" in window) {
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
      const systemPrompt =
        language === "en"
          ? "Please respond in English."
          : "कृपया नेपाली भाषामा जवाफ दिनुहोस्।"; // "Please respond in Nepali"

      // Get chat history for context (just sending the last few messages)
      const history = messages
        .slice(-5)
        .map((msg) => msg.text)
        .join("\n");

      const result = await model.generateContent(
        `${systemPrompt}\n\n${history}\nUser: ${inputText}\nAssistant:`
      );
      const response = result.response.text();

      // Add bot response to chat
      setMessages((prev) => [...prev, { text: response, isUser: false }]);

      // Automatically speak the response if needed
      if (isSpeaking) {
        speakText(response);
      }
    } catch (error) {
      console.error("Error fetching response:", error);

      const errorMessage =
        language === "en"
          ? "Sorry, I encountered an error. Please try again."
          : "माफ गर्नुहोस्, मैले एउटा त्रुटि भेटाएँ। कृपया फेरि प्रयास गर्नुहोस्।";

      setMessages((prev) => [
        ...prev,
        {
          text: errorMessage,
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ne" : "en"));

    // Update the welcome message
    if (messages.length === 1) {
      const welcomeMessage =
        language === "en"
          ? "नमस्कार! म तपाईंलाई कसरी मद्दत गर्न सक्छु?" // Hello! How can I help you? in Nepali
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

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const chatPopup = document.querySelector(".fixed.bottom-24.right-5");
      const floatingButton = document.querySelector(".fixed.bottom-5.right-5");

      if (
        isOpen &&
        chatPopup &&
        floatingButton &&
        !chatPopup.contains(target) &&
        !floatingButton.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      className="fixed bottom-4 right-4 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-5 right-5 w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white flex items-center justify-center shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "rotate-45" : ""
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-5 w-[400px] max-w-full h-[600px] rounded-3xl bg-white shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out origin-bottom-right scale-100 opacity-100`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-5 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Bot className="text-green-600 h-5 w-5" />
              </div>
              <h1 className="text-white text-lg font-semibold">
                {language === "en" ? "Help Assistant" : "सहायता सहायक"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white text-sm">
                {language === "en" ? "EN" : "ने"}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={language === "ne"}
                  onChange={toggleLanguage}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-white rounded-full peer peer-checked:bg-white/50 transition-all duration-300">
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
                      language === "ne" ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50 space-y-4"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed shadow ${
                  message.isUser
                    ? "ml-auto bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-br-md"
                    : "mr-auto bg-gray-200 text-gray-800 rounded-bl-md"
                }`}
              >
                <div className="flex items-center gap-2">
                  <p>{message.text}</p>
                  {!message.isUser && (
                    <button
                      onClick={() => speakText(message.text)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="mr-auto bg-gray-200 p-4 rounded-2xl shadow">
                <div className="flex gap-1">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${delay}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center gap-3">
              {/* Mic */}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-3 rounded-full shadow ${
                  isRecording
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {isRecording ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </button>

              {/* Speaker */}
              <button
                onClick={() =>
                  isSpeaking ? stopSpeaking() : setIsSpeaking(true)
                }
                className={`p-3 rounded-full shadow ${
                  isSpeaking
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {isSpeaking ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>

              {/* Textarea */}
              <div className="flex-1 relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={
                    language === "en"
                      ? "Type your message..."
                      : "आफ्नो सन्देश टाइप गर्नुहोस्..."
                  }
                  className="w-full p-3 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-green-600 shadow transition-all duration-200 ease-in-out"
                  rows={1}
                  style={{ minHeight: "40px", maxHeight: "120px" }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || inputText.trim() === ""}
                    className={`p-2 rounded-full shadow ${
                      isLoading || inputText.trim() === ""
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                    }`}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
