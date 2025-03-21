import React from "react";
import "./home-hero.scss";
import { motion, useScroll, useTransform } from "framer-motion";
import mygif from "/public/images/gif/mygif.gif";
import Image from "next/image";

const HomeHero = () => {
  let { scrollYProgress } = useScroll();
  let y = useTransform(scrollYProgress, [0, 1], ["0px", "-5000px"]);
  return (
    <>
      <div className="video-hero-container">
        <div className="contenido">
          <motion.div style={{ y }}>
            <Image src={mygif} className="gif" alt="gif" />
          </motion.div>
          <video autoPlay loop muted playsInline className="background-video">
            <source src="/video/Home.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </>
  );
};

export default HomeHero;
