import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Privateroutes = ({ children }) => {
  const Authorization = localStorage.getItem("token");
  const [isverified, setIsverified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handlingverification = async () => {
    try {
      const response = await axios.post(
        "http://localhost:1000/api/user/checkforauthentication",
        {
          Authorization,
        }
      );
      // console.log(response);

      if (response.data.success) {
        setIsverified(true);
        // toast.success("Token verified! Welcome to your private area.");
      } else {
        setIsverified(false);
        toast.error("Unauthorized access. Please log in.");
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      setIsverified(false);
      toast.error("Token verification failed. Please log in again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handlingverification();
  }, []);

  useEffect(() => {
    if (!isLoading && !isverified) {
      navigate("/login");
    }
  }, [isLoading, isverified, navigate]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div class="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      {isverified ? children : null}
    </>
  );
};

export default Privateroutes;
