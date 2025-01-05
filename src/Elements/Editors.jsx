import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./Editors.css";
import { io } from "socket.io-client";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Editor() {
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const { id: documentId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [core, setcore] = useState(false);
  const user_id = localStorage.getItem("itemhai");
  const location = useLocation();
  const { action } = location.state || {};
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
        "http://localhost:1000/api/user/checking-the-owner",
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
    const s = io("http://localhost:1000", {
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
        "http://localhost:1000/api/user/saving-the-doc",
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
  useEffect(() => {
    if (!quill) return;
    const handleSelectionChange = (range, oldRange, source) => {
      if (range) {
        if (range.length === 0) {
          console.log("User cursor is on", range.index);
          socket.emit("selection-change", {
            documentId,
            userName,
            cursorPosition: range.index,
          });
        } else {
          const text = quill.getText(range.index, range.length);
          console.log("User has highlighted", text);
          socket.emit("selection-change", {
            documentId,
            userName,
            highlightedText: text,
            range: range,
          });
        }
      } else {
        console.log("Cursor not in the editor");
        socket.emit("selection-change", {
          documentId,
          userName,
          cursorPosition: null,
        });
      }
    };

    quill.on("selection-change", handleSelectionChange);
    return () => {
      quill.off("selection-change", handleSelectionChange);
    };
  }, [quill, documentId, userName]);

  return (
    <div className="editor-container">
      <div ref={initializeQuill}></div>
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
  );
}

export default Editor;
