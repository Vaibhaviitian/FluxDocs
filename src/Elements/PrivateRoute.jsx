import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Privateroutes = ({ children }) => {
  const authtoken = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!authtoken) {
      navigate("/login");
    }
  }, [authtoken, navigate]);
  if (!authtoken) {
    return null;
  }
  return children;
};

export default Privateroutes;
