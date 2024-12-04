import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFile, FaUserCircle } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const [myProjects, setMyProjects] = useState([]);
  const [sharedProjects, setSharedProjects] = useState([]);
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com'
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Simulate fetching data from the backend
        const myProjectsData = [
          {
            id: '1',
            title: 'Q4 Marketing Strategy',
            icon: <FaFile size={24} />,
            lastModified: 'Today at 2:30 PM'
          },
          {
            id: '2',
            title: 'Product Roadmap 2024',
            icon: <FaFile size={24} />,
            lastModified: 'Yesterday at 11:20 AM'
          },
          {
            id: '3',
            title: 'Website Redesign',
            icon: <FaFile size={24} />,
            lastModified: '2 days ago'
          }
        ];

        const sharedProjectsData = [
          {
            id: '4',
            title: 'Team OKRs',
            icon: <FaFile size={24} />,
            lastModified: '2 days ago',
            shared: true
          },
          {
            id: '5',
            title: 'Design System Documentation',
            icon: <FaFile size={24} />,
            lastModified: '1 week ago',
            shared: true
          }
        ];

        setMyProjects(myProjectsData);
        setSharedProjects(sharedProjectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (projectId) => {
    // Implement navigation to the specific project page
    console.log(`Navigating to project with ID: ${projectId}`);
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
        <button className="new-project-btn">New Project</button>
      </div>
      <div className="projects-container">
        <div className="projects-list">
          {myProjects.map((project) => (
            <button key={project.id} className="project-card" onClick={() => handleProjectClick(project.id)}>
              <div className="project-icon-container">{project.icon}</div>
              <div className="project-details">
                <h3>{project.title}</h3>
                <p className="last-modified">Last modified: {project.lastModified}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="shared-projects">
          {sharedProjects.map((project) => (
            <button key={project.id} className="project-card" onClick={() => handleProjectClick(project.id)}>
              <div className="project-icon-container">{project.icon}</div>
              <div className="project-details">
                <h3>{project.title}</h3>
                <p className="last-modified">Last modified: {project.lastModified}</p>
              </div>
              <p className="shared-label">Shared</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;