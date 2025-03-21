"use client";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useState } from "react";
import "./menu-estilos.scss";
import Link from "next/link";

const rutas = [
  {
    id: 1,
    nombre: "HOME",
    deruta: "/",
  },
  {
    id: 2,
    nombre: "TRAILERS",
    deruta: "/trailers",
  },
  {
    id: 3,
    nombre: "CATERING",
    deruta: "/catering",
  },
  {
    id: 4,
    nombre: "CONTACTO",
    deruta: "/contacto",
  },
];

const Menu = () => {
  const [activo, setActivo] = useState(false);

  const handleClick = () => {
    setActivo(!activo);
  };
  const handleCambio = () => {
    setActivo(false);
  };
  return (
    <>
      <nav className="cont-main">
        <section onClick={handleClick} className="nav">
          <div
            style={{
              backgroundColor: "transparent",
              width: "10vw",
              height: "3vh",
            }}
          ></div>
          <section className="menu-fondo">
            <div
              className={activo ? "open icon nav-icon-5" : "icon nav-icon-5"}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </section>
        </section>

        <nav className={!activo ? " cont-menu " : "cont-menu activo"}>
          <ul className="list">
            {rutas.map(({ id, nombre, deruta }) => (
              <div key={id}>
                <div className="list-cont">
                  <li onClick={handleCambio}>
                    <Link scroll href={deruta}>
                      {nombre}
                    </Link>
                  </li>
                  <FaArrowRight className="icono" />
                </div>
                <hr />
              </div>
            ))}
          </ul>
        </nav>
      </nav>
    </>
  );
};

export default Menu;
