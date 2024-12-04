import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./Editors.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

function Editor() {
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const { id: documentId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");

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

  useEffect(() => {
    if (!socket || !quill) return;

    const handleLoadDocument = (document) => {
      if (document && document.data) {
        quill.setContents(document.data);
      } else {
        quill.setText(
          "Wait please, the server is not running, so we are not able to fetch the data from the database."
        );
      }
      quill.enable();
    };

    socket.on("load-document", handleLoadDocument);
    socket.emit("get-document", documentId);

    return () => {
      socket.off("load-document", handleLoadDocument);
    };
  }, [socket, quill, documentId]);

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

  useEffect(() => {
    if (!socket || !quill) return;

    const handleTextChange = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handleTextChange);

    return () => {
      quill.off("text-change", handleTextChange);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (!socket || !quill) return;

    const savingInterval = setInterval(() => {
      socket.emit("save-changes", quill.getContents());
      console.log(quill.getContents());
      console.log("Auto-saving document...");
    }, 2000);

    return () => {
      clearInterval(savingInterval);
    };
  }, [socket, quill]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Submitted title: ${title}`);
    setIsOpen(false);
    socket.emit('',)
    setTitle("");
  };

  useEffect(() => {}, [socket, quill]);
  const ToolbarOptions = [
    [{ font: [] }, { size: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
  ];

  const initializeQuill = useCallback((wrapper) => {
    if (!wrapper) return;

    wrapper.innerHTML = "";

    const editorContainer = document.createElement("div");
    editorContainer.setAttribute("class", "ql-container ql-snow");

    wrapper.appendChild(editorContainer);

    const q = new Quill(editorContainer, {
      theme: "snow",
      modules: {
        toolbar: ToolbarOptions,
      },
    });

    q.disable();
    q.setText(
      "Wait please, the server is not running, so we are not able to fetch the data from the database."
    );
    setQuill(q);
  }, []);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="editor-container">
      <div ref={initializeQuill}></div>
      <button onClick={togglePopup} className="save-button">
        SAVE
      </button>
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
