"use client";
import { useLayoutEffect, useState } from "react";
import Empresa from "./components/home-empresa";

import Letters from "./components/home-letters";
import Loader from "./components/Loader/Loader";
import gsap from "gsap";
import HomeHero from "./components/home-hero";
import Lateral from "./components/home-lateral";

import Clientes from "./components/home-clientes";
import Contact from "./components/home-contact";
import WhatsAppIcon from "./components/Whats";
import Wraper from "./components/lenis";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setLoading(false),
      });
      setTimeline(tl);
    });

    return () => context.revert();
  }, []);

  return (
    <Wraper>
      {loading ? (
        <Loader timeline={timeline} />
      ) : (
        <div style={{ overflow: "hidden" }}>
          <h1 style={{ visibility: " hidden" }}>Soto Servicios Industriales</h1>
          <p style={{ visibility: " hidden" }}>
            Somos una compañía de servicios dirigidos a satisfacer las
            necesidades de la actividad industrial y de empresas e instituciones
            de gran volumen en la región Patagónica.
          </p>
          <HomeHero />
          <Letters />
          <Empresa />
          <Lateral />
          <Clientes />
          <Contact />
          <WhatsAppIcon />
        </div>
      )}
    </Wraper>
  );
}
