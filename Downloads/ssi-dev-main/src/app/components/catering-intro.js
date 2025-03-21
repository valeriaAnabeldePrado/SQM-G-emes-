import React from "react";
import "./catering-intro.scss";
import Image from "next/image";
//----svg----//
import svg1 from "/public/images/svg/fruta1.svg";
import svg2 from "/public/images/svg/fruta2.svg";
import svg3 from "/public/images/svg/fruta3.svg";
import svg6 from "/public/images/svg/fruta4.svg";

const CateringIntro = () => {
  return (
    <div className="intro-container">
      <section className="intro-frutas">
        <Image src={svg1} alt="unafrutita" />
        <Image src={svg6} alt="laranja" />
        <Image src={svg2} alt="picante" />
        <Image src={svg3} alt="palta" />
      </section>
      <section className="intro-p">
        <div className="intro-box">
          <h2>Nosotros</h2>
          <p>
            Nos dedicamos a proporcionar soluciones gastronómicas de alta
            calidad para satisfacer las necesidades culinarias más exigentes.
            Desde viandas saludables y equilibradas hasta eventos de gran
            envergadura con una atención meticulosa a cada detalle, nuestro
            compromiso con la excelencia se refleja en cada plato que servimos.
          </p>
        </div>
      </section>
    </div>
  );
};

export default CateringIntro;
