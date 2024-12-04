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
        quill.setText("Start typing...");
      }
      quill.enable();
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
      console.log(quill.getContents());
      console.log("Auto-saving document...");
    }, 2000); 

    return () => {
      clearInterval(savingInterval);
    };
  }, [socket, quill]);

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

  // Quill Editor Initialization
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
      "Wait please the server is not runnig that's why we are not able to fetch the data from database"
    );
    setQuill(q);
  }, []);

  return (
    <div className="box">
      <div ref={initializeQuill}></div>
    </div>
  );
}

export default Editor;
