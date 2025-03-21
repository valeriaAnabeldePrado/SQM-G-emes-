"use client";
import React from "react";
import "./contactoStyle.scss";
import { svgGroup } from "./shapes";
import Form from "../components/home-form";

const page = () => {
  return (
    <>
      <div className="contacto-fondo">
        {svgGroup.map((el, index) => (
          <div className={el.svgStyle} key={index}>
            <svg
              viewBox="-100 0 200 30"
              xmlns="http://www.w3.org/50/svg"
              width={el.ancho}
              height={el.altura}
            >
              <path fill="#eff1f4">
                <animate
                  attributeName="d"
                  dur="10000ms"
                  repeatCount={"indefinite"}
                  values={el.animacionValores}
                ></animate>
              </path>
            </svg>
          </div>
        ))}
        <section className="infoContacto-box">
          <h2 className="infoContacto-h2">
            Escribinos tu consulta y un asesor se pondra en contacto!
          </h2>
          <Form colorBorde={"#fff"} colorFuente={"#fff"} />
        </section>
      </div>
    </>
  );
};

export default page;
