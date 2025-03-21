"use client";
import React, { useEffect, useRef } from "react";
import "../trailers/page.scss";
import gsap from "gsap";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

const HeroTrailers = () => {
  useEffect(() => {
    gsap.to(".trailer-hero-title", {
      opacity: 1,
      duration: 2,
    });
  }, []);

  return (
    <div className="cont-hero-trailer">
      <Link className="cont-hero-class" href={"/"}>
        <span>IR AL INICIO</span>
        <span>
          <FaHome />
        </span>
      </Link>
      <div className="trailer-hero-title">
        <h1>Trailers & módulos</h1>
        <h2>Una nueva forma</h2>
        <h2>de construcción</h2>
      </div>
      <video autoPlay loop muted playsInline className="video-trailer">
        <source src="/video/trailerBanner.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default HeroTrailers;
