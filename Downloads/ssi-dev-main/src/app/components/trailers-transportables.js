import Image from "next/image";
import React from "react";
import "../trailers/page.scss";
const Transportables = () => {
  return (
    <>
      <video autoPlay loop playsInline muted className="video-trailer">
        <source src="/video/trailerLoop.mp4" type="video/mp4" />
      </video>
    </>
  );
};

export default Transportables;
