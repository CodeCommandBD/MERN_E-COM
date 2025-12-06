"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSupportChat() {
  const { id } = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchTicket();
    }
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages]);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    let interval;
    if (id) {
      interval = setInterval(() => {
        fetchTicket(true);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [id]);

  const fetchTicket = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await axios.get(`/api/support/${id}`);
      if (response.data.success) {
        setTicket(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Fetch ticket error:", err);
      if (!silent) {
        setError(err.response?.data?.message || "Failed to fetch ticket");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await axios.post("/api/support/message", {
        ticketId: id,
        message: newMessage,
        sender: "admin",
      });

      if (response.data.success) {
        setNewMessage("");
        setTicket(response.data.data);
      }
    } catch (err) {
      console.error("Send message error:", err);
      alert(err.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await axios.put("/api/support/status", {
        ticketId: id,
        status: newStatus,
      });

      if (response.data.success) {
        setTicket({ ...ticket, status: newStatus });
      }
    } catch (err) {
      console.error("Update status error:", err);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: "bg-green-100 text-green-700 border-green-300",
      "in-progress": "bg-blue-100 text-blue-700 border-blue-300",
      resolved: "bg-purple-100 text-purple-700 border-purple-300",
      closed: "bg-gray-100 text-gray-700 border-gray-300",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-center">
          <p className="text-red-600">{error || "Ticket not found"}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/admin/support")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Support
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin/support")}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {ticket.ticketNumber}
              </h1>
              <p className="text-sm text-gray-500">Support Conversation</p>
            </div>
          </div>
          <select
            value={ticket.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-bold border cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary ${getStatusColor(
              ticket.status
            )}`}
          >
            <option value="open">OPEN</option>
            <option value="in-progress">IN PROGRESS</option>
            <option value="resolved">RESOLVED</option>
            <option value="closed">CLOSED</option>
          </select>
        </div>

        {/* Customer Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Customer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{ticket.customerInfo.name}</span>
            </div>
            {ticket.customerInfo.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{ticket.customerInfo.phone}</span>
              </div>
            )}
            {ticket.customerInfo.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{ticket.customerInfo.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {ticket.messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p>No messages yet</p>
            </div>
          ) : (
            ticket.messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "admin" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-lg ${
                    msg.sender === "admin"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-semibold ${
                        msg.sender === "admin"
                          ? "text-white/80"
                          : "text-gray-500"
                      }`}
                    >
                      {msg.sender === "admin" ? "Admin" : "Customer"}
                    </span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                  <p
                    className={`text-xs mt-2 ${
                      msg.sender === "admin" ? "text-white/70" : "text-gray-400"
                    }`}
                  >
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date(msg.createdAt).toLocaleString()}
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
          className="border-t border-gray-200 p-4 flex gap-3"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your reply..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={sending || ticket.status === "closed"}
          />
          <Button
            type="submit"
            disabled={
              !newMessage.trim() || sending || ticket.status === "closed"
            }
            className="px-6"
          >
            {sending ? (
              "Sending..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send
              </>
            )}
          </Button>
        </form>

        {ticket.status === "closed" && (
          <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 text-center text-sm text-gray-500">
            This ticket is closed. Change status to reply.
          </div>
        )}
      </div>
    </div>
  );
}
