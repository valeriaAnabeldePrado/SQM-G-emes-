import Image from "next/image";
import React from "react";
import "./catering.scss";
import img from "/public/images/catering.jpg";

const Transporte = () => {
  return (
    <>
      <div class="contenedor">
        <h2>TRANSPORTE & ALQUILER</h2>
        <div class="mitad-izq">
          <section className="div-izq">
            <section className="section-p">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                ac quam a urna tincidunt faucibus. Sed venenatis magna vel risus
                cursus tincidunt.
              </p>
            </section>
            <section className="section-svg"></section>
          </section>
        </div>
        <div class="mitad-der">
          <Image src={img} alt="Imagen de catering" className="img" />
        </div>
      </div>
    </>
  );
};

export default Transporte;
