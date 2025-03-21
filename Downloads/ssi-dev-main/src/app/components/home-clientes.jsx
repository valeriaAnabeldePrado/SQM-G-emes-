"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./home-clientes.scss";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";
import { BsArrowRightCircle } from "react-icons/bs";
import aesa from "/public/images/logos/aesa.png";
import ge from "/public/images/logos/ge.png";
import schlumberger from "/public/images/logos/schlumberger.png";
import ypf from "/public/images/logos/ypf.png";
import milicic from "/public/images/logos/milicic.png";
import transener from "/public/images/logos/Transener.png";
import techint from "/public/images/logos/techint.png";
import tecpetrol from "/public/images/logos/tecpetrol.png";
import siderca from "/public/images/logos/siderca.png";
import cameron from "/public/images/logos/cameron.png";
import contreras from "/public/images/logos/contreras.png";
import pan from "/public/images/logos/pan.png";
import pampa from "/public/images/logos/pampa.png";
import pecom from "/public/images/logos/pecom.png";
import weather from "/public/images/logos/Weatherford.png";
import bolland from "/public/images/logos/bolland.png";

import superior from "/public/images/logos/superior.png";

const logos = [
  {
    image: aesa,
    alt: "aesa",
  },
  {
    image: ge,
    alt: "general-electric",
  },
  {
    image: schlumberger,
    alt: "schlumberger",
  },
  {
    image: ypf,
    alt: "ypf",
  },
  {
    image: techint,
    alt: "techint",
  },
  {
    image: pecom,
    alt: "pecom",
  },
  {
    image: tecpetrol,
    alt: "tecpetrol",
  },
  {
    image: pampa,
    alt: "pampa",
  },
  {
    image: siderca,
    alt: "siderca",
  },
  {
    image: weather,
    alt: "weather",
  },
  {
    image: transener,
    alt: "transener",
  },
  {
    image: milicic,
    alt: "milicic",
  },
  {
    image: cameron,
    alt: "cameron",
  },
  {
    image: contreras,
    alt: "contreras",
  },
  {
    image: pan,
    alt: "pan",
  },

  {
    image: bolland,
    alt: "bolland",
  },
  {
    image: superior,
    alt: "superior",
  },
];

const Clientes = () => {
  const [contador, setContador] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      if (contador === 0) return;
      if (contador < 35) {
        setContador(contador + 1);
      }
    }, 50);

    return () => clearInterval(intervalo);
  }, [contador]);

  gsap.registerPlugin(ScrollTrigger);
  const clientesRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: clientesRef.current,
        start: "top center",
        onEnter: () => setContador(1),
      },
    });
    tl.fromTo(
      ".text-ape",
      {
        opacity: 0,
      },
      {
        opacity: 1,
      }
    )
      .fromTo(
        ".box-box2",
        {
          x: 300,
          opacity: 0,
        },
        {
          opacity: 1,
          x: 0,
        },
        ">0.5"
      )

      .fromTo(
        ".flecha",
        {
          opacity: 0,
        },
        {
          opacity: 1,
        },
        ">0.5"
      );
    gsap.utils.toArray(".section-img-logos > *").forEach((element, index) => {
      tl.fromTo(
        element,
        {
          y: -100,
          scale: 0.2,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.2,
          scale: 1,
        },
        `${index}*0.1`
      );
    });
  }, []);

  return (
    <div className="clientes-container-main">
      <div ref={clientesRef} className="clientes-container">
        <div className="box box-1-container ">
          <section>
            <h2>{contador}</h2>
          </section>
          <div></div>
          <section>
          </section>
        </div>
        <div className="box box-title">
          <section className="box-box1"></section>
          <section className="box-box2">
            <h2 className="h2-nuestrosC">NUESTROS CLIENTES</h2>
          </section>
        </div>
        <div className=" box-clientes">
          <BsArrowRightCircle className="flecha" />
          <section className="section-img-logos">
            {logos.map((el, index) => (
              <Image key={index} src={el.image} alt="logos" />
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Clientes;
