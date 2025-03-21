"use client";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import "./home-trailers.scss";

import trailer1 from "/public/images/trailer-uno.png";
import trailer2 from "/public/images/trailer-dos.png";
import Link from "next/link";

const HomeTrailers = () => {
  return (
    <>
      <div className="home-contenedor-modulo">
        <h2 className="h2-laterales-modulo">MODULOS & TRAILERS</h2>

        <div className="mitad-izq-modulo">
          <section className="div-izq-modulo">
            <section className="section-p-lateralesHome-modulo">
              <p>
                Los módulos habitacionales están hechas con contenedores
                marítimos y son sustitutos ideales de las construcciones
                convencionales.
              </p>
            </section>
            <Link href={"/trailers"} className="buton-modulo visualizacion">
              VER MAS
            </Link>
          </section>
        </div>
        <div className="mitad-der-home-modulo">
          <Link href={"/trailers"} className="buton-modulo">
            VER MAS
          </Link>
        </div>
      </div>
    </>
  );
};

export default HomeTrailers;
