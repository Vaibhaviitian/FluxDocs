import React from "react";
import "./Navbar.css";
import { useGSAP } from "@gsap/react";
import gsap from 'gsap'
import { Link } from "react-router-dom";

export default function Navbar() {
  useGSAP(()=>{
    gsap.from('a',{
      y:100,
      opacity:0,
      duration:1,
      scale:0, 
      stagger:0.2
    })
  })
  return ( 
    <>
      <nav className="m-2 text-2xl" style={{fontWeight:'bolder'}} >
        <input type="checkbox" id="sidebar-active" />
        <label for="sidebar-active" class="open-sidebar-button">
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
        <div class="links-container">
          <label for="sidebar-active" class="close-sidebar-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="32"
              viewBox="0 -960 960 960"
              width="32"
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </label>
          <Link class="home-link" to='/'>
            Home
          </Link>
          <a href="https://chatgpt.com/?oai-dm=1">About</a>
          <a href="https://chatgpt.com/?oai-dm=1">Products</a>
          <a href="https://chatgpt.com/?oai-dm=1">Blog</a>
          <a href="https://chatgpt.com/?oai-dm=1">Login</a>
        </div>
      </nav>
    </>
  );
}
