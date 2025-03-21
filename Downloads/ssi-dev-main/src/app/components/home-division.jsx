import React from "react";
import "./home-division.scss";

const Division = ({ number = 0, servicio = "Nuestros servicios" }) => {
  return (
    <div className="division-container">
      <section>
        <p className="division-number">{number}</p>
      </section>
      <section>
        <p className="division-p">{servicio}</p>
      </section>
    </div>
  );
};

export default Division;
