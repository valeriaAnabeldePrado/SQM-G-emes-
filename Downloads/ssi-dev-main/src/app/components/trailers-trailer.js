"use client";
import React, { useState } from "react";
import Scene from "./scene";
import "./trailers-trailer.scss";

const TrailersTrailer = () => {
  const [active, setActive] = useState(false);
  return (
    <div>
      <div className="trailer-h2">
        <h2>Descubre cada detalle de nuestro módulo habitacional</h2>
      </div>

      <div className="trailer-container">
        <div className="trailer-view">
          <div className={`block-covered ${active ? "active" : ""}`}>
            <button onClick={() => setActive(!active)}>Inspeccionar</button>
          </div>
          <Scene />
        </div>
      </div>
    </div>
  );
};

export default TrailersTrailer;
