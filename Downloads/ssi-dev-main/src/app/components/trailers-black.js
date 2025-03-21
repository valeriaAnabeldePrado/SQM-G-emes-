"use client";
import React from "react";
import AccordionTrailer from "./trailers-accordion";
import "./trailers-black.scss";

const TrailerBlack = () => {
  return (
    <div className="imageClass">
      <video
        autoPlay
        loop
        playsInline
        muted
        alt="trailerLoop"
        className="videoAcordion"
      >
        <source src="video/LOOP.mp4" />
      </video>
      <div className="acordion">
        <AccordionTrailer />
      </div>
    </div>
  );
};

export default TrailerBlack;
