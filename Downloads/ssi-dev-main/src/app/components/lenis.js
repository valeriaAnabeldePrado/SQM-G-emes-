"use client";
import React from "react";
import { useEffect } from "react";
import "../globals.scss";
import Lenis from "@studio-freight/lenis";
const Wraper = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis();

    lenis.on("scroll", (e) => {});

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);
  return <main>{children}</main>;
};

export default Wraper;
