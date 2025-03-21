"use client";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import "./home-catering.scss";
import img from "/public/images/catering.jpg";

import { Button } from "@nextui-org/react";
import Link from "next/link";

const HomeCatering = () => {
  return (
    <>
      <div className="home-contenedor-catering">
        <h2 className="h2-laterales-cat">CATERING EXCLUSIVO</h2>
        <div className="mitad-izq-cat">
          <section className="div-izq-cat">
            <section className="section-p-lateralesHome-cat">
              <p>
                Nuestro servicio de catering abarca una amplia variedad de
                menús, adaptados a requerimientos nutricionales y tipos de
                actividades desarrolladas.
              </p>
            </section>
            <Link href={"/catering"} className="buton-lateral visualizacion">
              VER MAS
            </Link>
          </section>
        </div>
        <div className="mitad-der-home-cat">
          <Link className="buton-lateral" href={"/catering"}>
            VER MAS
          </Link>
        </div>
      </div>
    </>
  );
};

export default HomeCatering;
