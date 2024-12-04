import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [check,setCheck]= useState(false)
  useEffect(()=>{
    const authtoken = localStorage.getItem('token');
    if(authtoken){
      setCheck(true);
    }else{
      setCheck(false);
    }
  },[])
  console.log(check);
  return (
    <>
      <nav className="m-2 text-2xl" style={{ fontWeight: "bolder" }}>
        <input type="checkbox" id="sidebar-active" />
        <label for="sidebar-active" className="open-sidebar-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="32"
            viewBox="0 -960 960 960"
            width="32"
          >
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
          </svg>
        </label>
        <label id="overlay" for="sidebar-active"></label>
        <div className="links-container">
          <label for="sidebar-active" className="close-sidebar-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="32"
              viewBox="0 -960 960 960"
              width="32"
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </label>
          <Link className="home-link" to="/">
            Home
          </Link>
          <a href="/aboutus">About us</a>
          <a href="/contactus">Contact</a>
          {!check ? (
            <>
              <a href="/signup">Signup</a>
              <a href="/login">Login</a>
            </>
          ) : (
            <Link to='/dashboard'>Dashboard</Link>
          )}
        </div>
      </nav>
    </>
  );
}
