import React from "react";
import "./Activeuser.css";

const ActiveUsers = ({ users, docinfo }) => {
  console.log(users, docinfo);

  return (
    <div className="active-user-container ">
      <div className="doc-container ">
        {/* Left Side: Document Info */}
        <div className="doc-info bg-slate-500" >
          <h3 className="doc-name">
            Doc name - <b>{docinfo?.title || "Document Name"}</b>
          </h3>
          <h4 className="collaborators-title">Collaborators:</h4>
          {docinfo?.collaborators && docinfo.collaborators.length > 0 ? (
            docinfo.collaborators.map((each, index) => {
              console.log(each);
              return (
                <div key={index} className="collaborator">
                  <b>{each.user.username || "Unknown User"}</b> -{" "}
                  <b className="text-green-600">{each.permission} access</b>
                </div>
              );
            })
          ) : (
            <p>No collaborators</p>
          )}
        </div>

        {/* Right Side: Active Users */}
        <div className="active-users bg-slate-500">
          <div className="live-indicator">
            <div className="w-3 h-3 bg-red-700 rounded-full animate-pulse"></div>
            <span className="font-semibold">Live</span>
          </div>
          <h4>Currently Active Users</h4>
          {users.length > 0 ? (
            <ul className="users-list">
              {users.map((user) => (
                <li key={user.userID} className="user-item">
                  <span className="user-name">
                    {user.userName || "Anonymous User"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No active users</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveUsers;
