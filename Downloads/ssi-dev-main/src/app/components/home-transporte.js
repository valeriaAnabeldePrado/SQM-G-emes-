"use client";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import "./home-transporte.scss";
import img from "/public/images/campamentoInt.jpg";
import base from "/public/images/base-integral.png";

const HomeTransporte = () => {
  return (
    <>
      <div className="home-contenedor-base">
        <h2 className="h2-laterales-base">BASE INTEGRAL</h2>
        <div className="mitad-izq-base">
          <section className="div-izq-base">
            <section className="section-p-lateralesHome-base">
              <p>
                Ofrecemos transporte, montaje de obras Civiles, muebles y útiles
                de oficinas, mantenimiento general, administración, provisión de
                energía, agua, combustible, vigilancia, alimentación del
                personal y limpieza, lavandería, hotelería.
              </p>
            </section>
            <button className="buton-lateral-base visualizacion-base">
              VER MAS
            </button>
          </section>
        </div>
        <div className="mitad-der-home-base">
          <button className="buton-lateral-base">VER MAS</button>
        </div>
      </div>
    </>
  );
};

export default HomeTransporte;
