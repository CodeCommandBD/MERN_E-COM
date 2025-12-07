"use client";
import React, { useState, useEffect, useRef } from "react";
import { IoChatbubbleEllipses, IoClose, IoSend } from "react-icons/io5";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const [ticketNumber, setTicketNumber] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const messagesEndRef = useRef(null);

  const handleEndChat = React.useCallback(() => {
    localStorage.removeItem("supportTicketId");
    localStorage.removeItem("supportTicketNumber");
    setTicketId(null);
    setTicketNumber(null);
    setMessages([]);
    setUnreadCount(0);
    setFormData({ name: "", phone: "", message: "" });
  }, []);

  const fetchMessages = React.useCallback(
    async (id) => {
      try {
        const response = await axios.get(`/api/support/message?ticketId=${id}`);
        if (response.data.success) {
          const fetchedMessages = response.data.data.messages || [];
          setMessages(fetchedMessages);

          // Calculate unread messages from admin
          const unread = fetchedMessages.filter(
            (m) => m.sender === "admin" && !m.isRead
          ).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        // If ticket not found (404), clear local storage to reset state
        if (error.response && error.response.status === 404) {
          handleEndChat();
        }
      }
    },
    [handleEndChat]
  );

  const markMessagesAsRead = React.useCallback(async (id) => {
    try {
      await axios.put("/api/support/message", {
        ticketId: id,
        role: "customer",
      });
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  }, []);

  // Load ticket from localStorage on mount
  useEffect(() => {
    const savedTicketId = localStorage.getItem("supportTicketId");
    const savedTicketNumber = localStorage.getItem("supportTicketNumber");
    if (savedTicketId) {
      setTicketId(savedTicketId);
      setTicketNumber(savedTicketNumber);
      fetchMessages(savedTicketId);
    }
  }, [fetchMessages]);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    let interval;
    if (ticketId) {
      interval = setInterval(() => {
        fetchMessages(ticketId);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [ticketId, fetchMessages]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen && unreadCount > 0 && ticketId) {
      markMessagesAsRead(ticketId);
    }
  }, [isOpen, unreadCount, ticketId, markMessagesAsRead]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleStartChat = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;

    // Validate Phone Number
    if (formData.phone) {
      const phoneRegex = /^01[3-9]\d{8}$/;
      if (!phoneRegex.test(formData.phone)) {
        setErrorModalMessage(
          "Please enter a valid 11-digit Bangladeshi phone number (e.g., 01712345678)"
        );
        setErrorModalOpen(true);
        return;
      }
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/support/create", formData);
      if (response.data.success) {
        const { ticketId: newTicketId, ticketNumber: newTicketNumber } =
          response.data.data;
        setTicketId(newTicketId);
        setTicketNumber(newTicketNumber);
        localStorage.setItem("supportTicketId", newTicketId);
        localStorage.setItem("supportTicketNumber", newTicketNumber);
        fetchMessages(newTicketId);
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !ticketId) return;

    try {
      const response = await axios.post("/api/support/message", {
        ticketId,
        message: newMessage,
        sender: "customer",
      });
      if (response.data.success) {
        setNewMessage("");
        fetchMessages(ticketId);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 relative"
          aria-label="Open chat"
        >
          {isOpen ? (
            <IoClose className="w-6 h-6" />
          ) : (
            <IoChatbubbleEllipses className="w-6 h-6" />
          )}
          {/* Notification Badge */}
          {!isOpen && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[350px] max-w-[calc(100vw-48px)] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-primary text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Customer Support</h3>
                <p className="text-sm opacity-90">
                  {ticketNumber
                    ? `Ticket: ${ticketNumber}`
                    : "We're here to help!"}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          {!ticketId ? (
            // Start Chat Form
            <form onSubmit={handleStartChat} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={3}
                  placeholder="How can we help you?"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Starting Chat..." : "Start Chat"}
              </button>
            </form>
          ) : (
            // Chat Interface
            <div className="flex flex-col h-[400px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>No messages yet</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.sender === "customer"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                          msg.sender === "customer"
                            ? "bg-primary text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        <p>{msg.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender === "customer"
                              ? "text-white/70"
                              : "text-gray-500"
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="border-t border-gray-200 p-3 flex gap-2"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="Type a message..."
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-primary text-white p-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IoSend className="w-5 h-5" />
                </button>
              </form>

              {/* End Chat Button */}
              <div className="border-t border-gray-200 p-2">
                <button
                  onClick={handleEndChat}
                  className="w-full text-sm text-gray-500 hover:text-red-500 transition-colors py-1"
                >
                  End Chat & Start New
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Error Modal */}
      <Dialog open={errorModalOpen} onOpenChange={setErrorModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Invalid Input</DialogTitle>
            <DialogDescription>{errorModalMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setErrorModalOpen(false)}>Okay</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatWidget;
