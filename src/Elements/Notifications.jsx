import axios from "axios";
import React, { act, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Example Notification Data

export default function NotificationTabs() {
  const [activeTab, setActiveTab] = useState("sent");

  const [sentNotifications, setSentNotifications] = useState([]);
  const [docinfo, setDocinfo] = useState({});

  const [incomingNotifications, setIncomingNotifications] = useState([]);
  const user_id = localStorage.getItem("itemhai");
  const incomingNotifications_handler = async () => {
    try {
      const response = await axios.post(
        "http://localhost:1000/api/collabs/my_requests",
        {
          user_id,
        }
      );
      console.log(response);
      setIncomingNotifications(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const sentNotifications_handler = async () => {
    const user_id = localStorage.getItem("itemhai");
    try {
      const response = await axios.post(
        "http://localhost:1000/api/collabs/sended_requests",
        {
          user_id,
        }
      );
      console.log(response);
      setSentNotifications(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptingrequest = async (request_id) => {
    try {
      const action = "accepted";
      console.log(user_id, request_id, action);
      const response = await axios.post(
        "http://localhost:1000/api/collabs/handling_request",
        { user_id, request_id, action }
      );
      console.log(response);
      toast.success(response?.data?.message);
    } catch (error) {
      toast.error(error?.response?.message);
      console.log(error);
    }
  };

  const rejectingrequest = async (request_id) => {
    try {
      const action = "rejected";
      console.log(action, user_id, request_id);
      const response = await axios.post(
        "http://localhost:1000/api/collabs/handling_request",
        { action, request_id, user_id }
      );
      console.log(response);
      toast.success(response?.data?.message);
    } catch (error) {
      toast.error(error?.response?.message);
      console.log(error);
    }
  };

  useEffect(() => {
    incomingNotifications_handler();
    sentNotifications_handler();
  }, []);

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-700">
        Notifications
      </h1>

      {/* Tabs */}
      <div className="flex justify-center mb-4">
        <div className="flex space-x-4 bg-white shadow rounded-lg p-2">
          <button
            className={`px-4 py-2 rounded-md font-semibold text-gray-700 transition ${
              activeTab === "sent" ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("sent")}
          >
            Sent Requests
          </button>
          <button
            className={`px-4 py-2 rounded-md font-semibold text-gray-700 transition ${
              activeTab === "incoming" ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("incoming")}
          >
            Incoming Requests
          </button>
        </div>
      </div>

      {/* Notifications Container */}
      <div className="bg-white shadow-md rounded-lg max-w-4xl mx-auto overflow-y-auto">
        {/* Sent Requests Tab */}
        {activeTab === "sent" && (
          <>
            {sentNotifications.length > 0 ? (
              sentNotifications.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row justify-between items-center gap-2 p-4 border-b hover:bg-gray-50 transition"
                >
                  {/* Left Section */}
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-teal-100 text-teal-600 font-semibold">
                      {item.owner.username[0]} {/* First Letter of Sender */}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">
                        Sent request to{" "}
                        <span className="font-bold ">
                          {item.owner.username} ({item.owner.email})
                        </span>{" "}
                        for doc collaboration
                      </p>
                      <p className="text-gray-500 text-sm">{item.updatedAt}</p>
                    </div>
                  </div>

                  {/* Right Section - Status */}
                  <div>
                    <span
                      className={`py-1 px-4 rounded-full text-xs font-semibold ${
                        item.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : item.status === "accepted"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No Sent Requests
              </div>
            )}
          </>
        )}

        {/* Incoming Requests Tab because you are owner of that doc*/}
        {activeTab === "incoming" && (
          <>
            {incomingNotifications.length > 0 ? (
              incomingNotifications.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row justify-between items-center gap-2 p-4 border-b hover:bg-gray-50 transition"
                >
                  {/* Left Section */}
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-600 font-semibold">
                      {item.owner.username[0]} {/* First Letter of Sender */}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">
                        <span className="font-semibold">{item.sender}</span>{" "}
                        Incoming request by{" "}
                        <span className="font-bold">
                          {item.requester.username} ({item.requester.email})
                        </span>{" "}
                        <br />
                        asking for edit access
                      </p>
                      <p className="text-gray-500 text-sm">{item.updatedAt}</p>
                    </div>
                  </div>

                  {/* Right Section - Status */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-2 mt-4 sm:mt-0">
                    <span
                      className={`py-1 px-4 rounded-full text-xs font-semibold ${
                        item.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : item.status === "accepted"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.status}
                    </span>

                    {/* Yes / No buttons */}
                    {item.status === "pending" && (
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        <button
                          onClick={() => {
                            acceptingrequest(item._id);
                          }}
                          className="px-4 py-2 bg-green-100 ml-2 text-green-600 font-semibold rounded-md transition hover:bg-green-200"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => {
                            rejectingrequest(item._id);
                          }}
                          className="px-4 py-2 bg-red-100 text-red-600 font-semibold rounded-md transition hover:bg-red-200 ml-2"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No Incoming Requests
              </div>
            )}
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
