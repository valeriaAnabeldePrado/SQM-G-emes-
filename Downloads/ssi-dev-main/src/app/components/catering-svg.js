"use client";
import Image from "next/image";
import "../catering/page.scss";
import cate1 from "/public/images/cate1.png";
import cate2 from "/public/images/cate2.png";
import cate3 from "/public/images/cate3.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef } from "react";

const svgs = [
  {
    id: 1,
    src: cate1,
    alt: "cate1",
  },
  {
    id: 2,
    src: cate2,
    alt: "cate2",
  },
  {
    id: 3,
    src: cate3,
    alt: "cate3",
  },
];

const CateringSvg = () => {
  const svgContainerRef = useRef(null);
  const svgRef = useRef([]);
  gsap.registerPlugin(ScrollTrigger);
  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: svgContainerRef.current,
        start: "center bottom-=200",
      },
    });
    svgRef.current.forEach((el, index) => {
      tl.to(el, {
        opacity: 1,
        scale: 1,
        delay: index * 0.1,
      });
    });
  }, []);

  return (
    <div ref={svgContainerRef} className="cateringsvg-container">
      <div className="svg-boxes">
        {svgs.map((svg, i) => (
          <div
            ref={(el) => (svgRef.current[i] = el)}
            key={svg.id}
            className="svg-box"
          >
            <Image src={svg.src} alt={svg.alt} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CateringSvg;
