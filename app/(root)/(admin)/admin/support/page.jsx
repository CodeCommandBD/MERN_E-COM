"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { MessageCircle, Search, User, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLoader from "@/components/Application/Admin/PageLoader";

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get("/api/support/list");
      if (response.data.success) {
        setTickets(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Fetch tickets error:", err);
      setError(err.response?.data?.message || "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const response = await axios.put("/api/support/status", {
        ticketId,
        status: newStatus,
      });

      if (response.data.success) {
        setTickets(
          tickets.map((ticket) =>
            ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket
          )
        );
      } else {
        alert(response.data.message || "Failed to update status");
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

  const getUnreadCount = (messages) => {
    return messages.filter((m) => m.sender === "customer" && !m.isRead).length;
  };

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerInfo.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      ticket.customerInfo.phone?.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <PageLoader message="Loading support tickets..." />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Support Tickets
        </h1>
        <p className="text-gray-600">Manage customer support conversations</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by ticket number, name, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Tickets</p>
          <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Open</p>
          <p className="text-2xl font-bold text-green-600">
            {tickets.filter((t) => t.status === "open").length}
          </p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">
            {tickets.filter((t) => t.status === "in-progress").length}
          </p>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Resolved</p>
          <p className="text-2xl font-bold text-purple-600">
            {tickets.filter((t) => t.status === "resolved").length}
          </p>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Messages
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p>No support tickets found</p>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {ticket.ticketNumber}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                          <User className="w-4 h-4 text-gray-400" />
                          {ticket.customerInfo.name}
                        </div>
                        {ticket.customerInfo.phone && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Phone className="w-3 h-3" />
                            {ticket.customerInfo.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {ticket.messages.length} messages
                        </span>
                        {getUnreadCount(ticket.messages) > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {getUnreadCount(ticket.messages)} new
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(ticket.lastMessageAt).toLocaleDateString()}{" "}
                          {new Date(ticket.lastMessageAt).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={ticket.status}
                        onChange={(e) =>
                          handleStatusChange(ticket._id, e.target.value)
                        }
                        className={`px-2 py-1 rounded-full text-xs font-bold border cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        <option value="open">OPEN</option>
                        <option value="in-progress">IN PROGRESS</option>
                        <option value="resolved">RESOLVED</option>
                        <option value="closed">CLOSED</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/support/${ticket._id}`}>
                          <MessageCircle className="w-4 h-4 mr-1" />
                          View Chat
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Count */}
      {filteredTickets.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {filteredTickets.length} of {tickets.length} tickets
        </div>
      )}
    </div>
  );
}
