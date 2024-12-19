import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFile, FaUserCircle } from "react-icons/fa";
import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [myProjects, setMyProjects] = useState([]);
  const [sharedProjects, setSharedProjects] = useState([]);
  const [check, setCheck] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
  });
  const user_id = localStorage.getItem("itemhai").toString();
  const fetchProjects = async () => {
    try {
      // Simulate fetching data from the backend
      const response = await axios.post(
        "http://localhost:1000/api/user/my_docs",
        {
          user_id,
        }
      );
      // console.log(response);

      if (response.data.message) {
        // console.log(response.data.message);
        // toast.success(response.data.message);
      }
      setMyProjects(response.data.docs);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  const getting_alldocs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:1000/api/collabs/all_docs"
      );
      const updatedSharedProjects = [];

      response?.data?.data.forEach((item) => {
        item.collaborators.forEach((req_id) => {
          if (
            req_id.user.toString() === user_id &&
            req_id.permission === "edit"
          ) {
            updatedSharedProjects.push({ ...item, action: "edit" });
          } else if (
            req_id.user.toString() === user_id &&
            req_id.permission === "view"
          ) {
            console.log("Aaaaaaaaaa");
            updatedSharedProjects.push({ ...item, action: "view" });
          }
        });
      });

      // Update sharedProjects state
      setSharedProjects(updatedSharedProjects);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleDelete = async (id) => {
    console.log(id);
    console.log("delete");
    const response = await axios.post(
      "http://localhost:1000/api/collabs/delete_doc",
      {
        id,
      }
    );
    console.log(response);
    toast.info(response.data.message);
  };

  useEffect(() => {
    fetchProjects();
    getting_alldocs();
    // console.log(sharedProjects);
  }, []);

  const handleProjectClick = (projectId, action) => {
    const redirectingDocUrl = `/api/new/FluxDocs/${projectId}`;
    console.log(`Navigating to project with ID: ${projectId}`);
    navigate(redirectingDocUrl, { state: { action } });
  };

  const handlelogout = () => {
    localStorage.clear();
    location.reload();
  };

  return (
    <div className="dashboard">
      <div className="header">
        <div className="user-info">
          <FaUserCircle size={32} className="user-avatar" />
          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>
        <Link className="new-project-btn" to="/doc-editing">
          New Project
        </Link>
        <button
          className="bg-red-500 p-3 border-r-4 text-white"
          to="/doc-editing"
          onClick={handlelogout}
        >
          Logout
        </button>
      </div>
      <div className="projects-container">
        <div className="projects-list">
          {myProjects.map((project) => {
            return (
              <button
                key={project.id}
                className="project-card"
                onClick={() => handleProjectClick(project._id)}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <div className="project-details">
                  <h3>{project.title}</h3>
                  <p className="last-modified">
                    Last modified: {project.updatedAt}
                  </p>
                  <p className="last-modified">
                    Created at {project.createdAt}
                  </p>
                </div>
                <div className="delete-btn-container ml-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    className="bi bi-trash text-red-500 cursor-pointer"
                    viewBox="0 0 16 16"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(project._id);
                    }}
                  >
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>

        <div className="shared-projects">
          {sharedProjects.map((project) => {
            // console.log(project);
            return (
              <button
                key={project.id}
                className="project-card"
                onClick={() => handleProjectClick(project._id, project.action)}
              >
                <div className="project-details ml-5">
                  <h3>{project.title}</h3>
                  <p className="last-modified">
                    Last modified: {project.updatedAt}
                  </p>
                  <p className="last-modified">
                    Created at {project.createdAt}
                  </p>
                  <p className="last-modified" style={{ color: "black" }}>
                    You are having{" "}
                    <b style={{ color: "green" }}>{project.action}</b> access
                  </p>
                  <p className="last-modified" style={{ color: "black" }}>
                    Owner:{" "}
                    <b style={{ color: "green" }}>{project.owner.username}</b>
                  </p>
                  <p className="last-modified" style={{ color: "black" }}>
                    Owner email:{" "}
                    <b style={{ color: "green" }}>{project.owner.email}</b>
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
