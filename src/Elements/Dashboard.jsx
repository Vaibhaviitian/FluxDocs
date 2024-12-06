import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFile, FaUserCircle } from "react-icons/fa";
import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [myProjects, setMyProjects] = useState([]);
  const [sharedProjects, setSharedProjects] = useState([]);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
  });

  useEffect(() => {
    const user_id = localStorage.getItem("itemhai");
    const fetchProjects = async () => {
      try {
        // Simulate fetching data from the backend
        const response = await axios.post(
          "http://localhost:1000/api/user/my_docs",
          {
            user_id,
          }
        );
        console.log(response);
        if (response.data.message) {
          // console.log(response.data.message);
          toast.success(response.data.message);
        }
        // const sharedProjectsData = [
        //   {
        //     id: "4",
        //     title: "Team OKRs",
        //     icon: <FaFile size={24} />,
        //     lastModified: "2 days ago",
        //     shared: true,
        //   },
        //   {
        //     id: "5",
        //     title: "Design System Documentation",
        //     icon: <FaFile size={24} />,
        //     lastModified: "1 week ago",
        //     shared: true,
        //   },
        // ];
        setMyProjects(response.data.docs);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (projectId) => {
    const redirectingDocUrl = `/api/new/FluxDocs/${projectId}`; 
    console.log(`Navigating to project with ID: ${projectId}`);
    navigate(redirectingDocUrl); 
  };

  const handlelogout = () => {
    localStorage.clear();
    location.reload();
  }
  
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
        <button className="bg-red-500 p-3 border-r-4 text-white" to="/doc-editing" onClick={handlelogout}>
          Logout
        </button>
      </div>
      <div className="projects-container">
        <div className="projects-list">
          {myProjects.map((project) => {
            console.log(project);
            return (
              <button
                key={project.id}
                className="project-card"
                onClick={() => handleProjectClick(project._id)}
              >
                <div className="project-icon-container">{project.icon}</div>
                <div className="project-details">
                  <h3>{project.title}</h3>
                  <p className="last-modified">
                    Last modified: {project.updatedAt}
                  </p>
                  <p className="last-modified">
                    Created at {project.createdAt}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="shared-projects">
          {/* {sharedProjects.map((project) => (
            <button
              key={project.id}
              className="project-card"
              onClick={() => handleProjectClick(project.id)}
            >
              <div className="project-icon-container">{project.icon}</div>
              <div className="project-details">
                <h3>{project.title}</h3>
                <p className="last-modified">
                  Last modified: {project.lastModified}
                </p>
              </div>
              <p className="shared-label">Shared</p>
            </button>
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
