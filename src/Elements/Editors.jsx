import React, { act, useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./Editors.css";
import { io } from "socket.io-client";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ActiveUsers from "./ActiveUser";

function Editor() {
  const [socket, setSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [quill, setQuill] = useState(null);
  const { id: documentId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [core, setcore] = useState(false);
  const user_id = localStorage.getItem("itemhai");
  const location = useLocation();
  const { action } = location.state || {};
  const [musibat, setMusibat] = useState(() => {
    const saved = localStorage.getItem("docmeinkaamkarnewale");
    return saved ? JSON.parse(saved) : [];
  });
  const [docinfo, setDocinfo] = useState();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState("");

  // console.log(documentId);
  const initializeQuill = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";

    const editor = document.createElement("div");
    wrapper.append(editor);

    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: ToolbarOptions },
      readOnly: true,
    });
    q.setText("Loading...");
    setQuill(q);
  }, []);

  const checkingowner = async () => {
    try {
      const response = await axios.post(
        "https://backendgoogledoc.onrender.com/api/user/checking-the-owner",
        {
          docid: documentId,
        }
      );
      if (
        !response.data.message ||
        user_id.toString() === response.data.data.toString() ||
        response.data.data.toString() === "Doc not having any owner save it to"
      ) {
        console.log(response.data.data);
        if (
          response.data.data.toString() ===
          "Doc not having any owner save it to"
        ) {
          setTimeout(() => {
            toast.info(response.data.data);
          }, 4000);
        }
        console.log(user_id + response.data.data);
        setcore(true);
      }
      setTitle("");
    } catch (error) {
      // Comprehensive error handling
      console.log(error);
      if (error.response.data.message.toString() === "Document not found.") {
        console.error("Error response:", error.response.data);
        console.error("Status code:", error.response.status);
        window.location.reload();
      }
    }
  };
  useEffect(() => {
    checkingowner();
    console.log(core);
  }, []);

  // Purpose: Establishes a connection to the Socket.IO server
  useEffect(() => {
    const s = io("https://backendgoogledoc.onrender.com", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    s.on("connect", () => {
      console.log("Socket connected successfully");
    });

    s.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // Purpose: Fetches the document data from the server and initializes the editor.
  useEffect(() => {
    if (!socket || !quill) return;

    const handleLoadDocument = (document) => {
      console.log("Loaded document:", document);

      if (document && document.data) {
        quill.setContents(document.data);
      } else {
        quill.setText(
          "Wait please, the server is not running, so we are not able to fetch the data from the database."
        );
      }
      console.log(action);
      if (action && action.toString() === "edit") {
        quill.enable();
        console.log("maai chala");
      } else if (action && action.toString() === "view") {
        quill.enable(false);
        console.log("else if");
      } else {
        quill.enable();
        console.log("else ");
      }
    };

    socket.on("load-document", handleLoadDocument);
    socket.emit("get-document", documentId);

    return () => {
      socket.off("load-document", handleLoadDocument);
      // This ensures that the load-document listener is removed when the component is unmounted to prevent memory leaks.
    };
  }, [socket, quill, documentId]);
  // Receive Changes from Other Users
  useEffect(() => {
    if (!socket || !quill) return;

    const handleReceiveChanges = (delta) => {
      quill.updateContents(delta);
    };

    socket.on("receive-changes", handleReceiveChanges);

    return () => {
      socket.off("receive-changes", handleReceiveChanges);
    };
  }, [socket, quill]);

  // Send Local Changes
  useEffect(() => {
    if (!socket || !quill) return;

    const handleTextChange = (delta, oldDelta, source) => {
      if (source !== "user") return;
      // /The check source !== "user" ensures the client only sends its changes, not changes from other users.
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handleTextChange);

    return () => {
      quill.off("text-change", handleTextChange);
    };
  }, [socket, quill]);

  // Auto Save
  useEffect(() => {
    if (!socket || !quill) return;

    const savingInterval = setInterval(() => {
      socket.emit("save-changes", quill.getContents());
      // console.log(quill.getContents());
      // console.log("Auto-saving document...");
    }, 2000); // Increased to 2 seconds for less frequent saves

    return () => {
      clearInterval(savingInterval);
    };
  }, [socket, quill]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsOpen(false);
    try {
      const docid = documentId;
      const user_id = localStorage.getItem("itemhai");
      const response = await axios.post(
        "https://backendgoogledoc.onrender.com/api/user/saving-the-doc",
        {
          title,
          docid,
          user_id,
        }
      );
      console.log(response);
      if (response.data.message) {
        toast.success(response.data.message);
      }
      setTitle("");
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    }
  };
  // Toolbar Configuration
  const ToolbarOptions = [
    [{ font: [] }, { size: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
  ];

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const userName = localStorage.getItem("username");
  // bhai idhar se thoda bhaang bhosda ho gaaya hai

  useEffect(() => {
    const s = io("http://localhost:1000", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    s.on("connect", () => {
      console.log("Socket connected successfully");

      // Emit join-document event with user details
      const userName = localStorage.getItem("username");
      const userID = localStorage.getItem("itemhai");
      s.emit("join-document", {
        documentId,
        userID,
        userName,
      });
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [documentId]);
  useEffect(() => {
    if (!socket) return;

    const handleActiveUsers = (activeUsersList) => {
      console.log("Active Users:", activeUsersList);
      // Optional: Update your state or UI here to display active users
    };

    socket.on("active-users", handleActiveUsers);

    return () => {
      socket.off("active-users", handleActiveUsers);
    };
  }, [socket]);
  useEffect(() => {
    if (!socket) return;

    const handleActiveUsers = (activeUsersList) => {
      console.log("Active Users:", activeUsersList);
      if (activeUsersList && activeUsersList.length > 0) {
        setMusibat(activeUsersList);
        localStorage.setItem(
          "docmeinkaamkarnewale",
          JSON.stringify(activeUsersList)
        );
      }
      setActiveUsers(activeUsersList);
    };

    socket.on("active-users", handleActiveUsers);

    return () => {
      socket.off("active-users", handleActiveUsers);
    };
  }, [socket]);

  useEffect(() => {
    console.log(musibat);
    localStorage.setItem("docmeinkaamkarnewale", JSON.stringify(musibat));
  }, []);
  useEffect(() => {
    console.log(activeUsers);
  }, []);
  useEffect(() => {
    if (!socket) return;

    socket.on("new-message-to-all", (message) => {
      console.log("Broadcast message received:", message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: message.userName, text: message.chatMessage },
      ]);
    });

    return () => {
      socket?.off("new-message-to-all");
    };
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    const newMessage = { user: "You", text: chatMessage };

    socket.emit("sending-message", { chatMessage, userName }, (response) => {
      console.log(userName);
      console.log("Message sent: " + chatMessage);
      console.log("Server response: " + response);
    });
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setChatMessage("");
  };
  const getdocinfo = async () => {
    const resposne = await axios.post(
      "https://backendgoogledoc.onrender.com/api/collabs/individual_docs",
      {
        id: documentId,
      }
    );
    console.log(resposne.data.message);
    setDocinfo(resposne?.data?.message);
  };
  useEffect(() => {
    getdocinfo();
  }, []);
  return (
    <>
      <ActiveUsers
        users={activeUsers.length > 0 ? activeUsers : musibat}
        docinfo={docinfo}
      />
      <div className="editor-container">
        <div ref={initializeQuill}></div>
        <div className="live-chat-container">
          <div
            className={`chat-toggle ${isChatOpen ? "open" : "close"}`}
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            💬
          </div>
          {isChatOpen && (
            <div className="chat-box">
              <div className="chat-header">
                <span>Live Chat</span>
                <button onClick={() => setIsChatOpen(false)}>✖</button>
              </div>
              <div className="chat-body">
                {messages.map(
                  (msg, index) => (
                    (
                      <div
                        key={index}
                        className="chat-message"
                        style={{
                          // console.log(background);
                          backgroundColor:
                            msg.user == "You" ? "#DCF8C6" : "#EDEDED",
                        }}
                      >
                        <strong>{msg.user}:</strong> {msg.text}
                      </div>
                    )
                  )
                )}
              </div>
              <form className="chat-input" onSubmit={sendMessage}>
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  required
                />
                <button type="submit">Send</button>
              </form>
            </div>
          )}
        </div>
        {core && (
          <button onClick={togglePopup} className="save-button">
            SAVE
          </button>
        )}
        {isOpen && (
          <div className="popup-overlay">
            <div className="popup-form">
              <h3>Title:</h3>
              <form onSubmit={handleSubmit}>
                <label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="popup-input"
                    required="true"
                  />
                </label>
                <br />
                <button type="submit" className="popup-submit-button">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={togglePopup}
                  className="popup-close-button"
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export { Editor };
