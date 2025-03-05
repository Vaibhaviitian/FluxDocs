import React, { useEffect, useRef } from "react";
import "./LandingPage.css"; 
import videofile from "./video.mp4";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link } from "react-router-dom";

function LandingPage() {
  const playButtonRef = useRef(null);

  useGSAP(() => {
    gsap.from(".page2 h1", {
      y: 100,
      opacity: 0,
      delay: 0.7,
      duration: 0.4,
      stagger: 0.1,
    });
    gsap.from(".page2 .SECOND span", {
      y: 100,
      opacity: 0,
      delay: 0.7,
      duration: 0.4,
      stagger: 0.1,
    });
    gsap.from(".page2 .videocontainer", {
      scale: 0.2,
      opacity: 0,
      delay: 1.5,
      duration: 0.5,
      stagger: 0.1,
    });
  });

  return (
    <>
      <div className="main">
        <div className="page2">
          <h1 className="FIRST">CREATE TOGETHER</h1>
          <span className="SECOND" style={{ gap: "15px" }}>
            <span>FROM</span>
            <span>ANY</span>
            <span>CORNER</span>
            <span>OF</span>
            <span>THE</span>
            <span>WORLD</span>
          </span>
          <div className="videocontainer">
            <video src={"https://cdn.pixabay.com/video/2023/10/01/183108-870151713_tiny.mp4"} autoPlay loop muted></video>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#10a37f",
            color: "#fff",
            textAlign: "center",
            padding: "50px 20px",
          }}
        >
          <h2 style={{ fontSize: "36px", marginBottom: "20px" }}>
            Innovate, Collaborate, Succeed
          </h2>
          <p style={{ fontSize: "18px", maxWidth: "600px", margin: "0 auto" }}>
            Join hands with creative minds and bring ideas to life, wherever you
            are in the world.
          </p>
        </div>
        <div
          style={{
            display:'flex',
            justifyContent:'center',
            margin:'10px'
          }}
        >
          <Link className="cssbuttons-io-button" to='/dashboard'>
            Get started
            <div className="icon">
              <svg
                height="24"
                width="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </Link>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "50px 20px",
            backgroundColor: "#f0f0f0",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "300px" }}>
            <img
              src="https://img.icons8.com/external-flat-juicy-fish/2x/external-collaborate-business-flat-flat-juicy-fish.png"
              alt="Collaborate Icon"
              style={{ width: "80px", height: "80px", marginBottom: "20px" }}
            />
            <h3>Collaborate Anytime</h3>
            <p>Work together seamlessly with your team across the globe.</p>
          </div>
          <div style={{ textAlign: "center", maxWidth: "300px" }}>
            <img
              src="https://img.icons8.com/ios/2x/innovation.png"
              alt="Innovate Icon"
              style={{ width: "80px", height: "80px", marginBottom: "20px" }}
            />
            <h3>Innovate Easily</h3>
            <p>
              Turn ideas into reality with powerful tools at your fingertips.
            </p>
          </div>
          <div style={{ textAlign: "center", maxWidth: "300px" }}>
            <img
              src="https://img.icons8.com/color/2x/success.png"
              alt="Success Icon"
              style={{ width: "80px", height: "80px", marginBottom: "20px" }}
            />
            <h3>Achieve Success</h3>
            <p>
              Our platform ensures that your journey to success is smooth and
              enjoyable.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
