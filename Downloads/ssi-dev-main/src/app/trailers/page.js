import React from "react";
import Appears from "../components/trailers-lettersAppears";
import "./page.scss";
import HeroTrailers from "../components/trailers-hero";
import TrailerBlack from "../components/trailers-black";
import Transportables from "../components/trailers-transportables";
import Footer from "../components/footer";

export const metadata = {
  title: "Alquiler de Trailers y Módulos para Empresas",
  description:
    "Ofrecemos trailers y módulos en alquiler para empresas. Soluciones rápidas y eficientes con comodidades modernas para tus necesidades temporales.",
  keywords:
    "alquiler de trailers, módulos para empresas, soluciones temporales, comodidades modernas, trailers en alquiler",
};

const phrase1 =
  "Las casas móviles suelen construirse en un entorno controlado y se pueden fabricar más rápidamente que las casas tradicionales, lo que significa que puedes mudarte a tu nueva vivienda más rápido.";
const phrase2 =
  "A pesar de su tamaño compacto, muchas viviendas en remolques están equipadas con comodidades modernas como cocinas, baños y sistemas de entretenimiento.";

const Page = () => {
  return (
    <>
      <h1
        className="seo-title"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: "0",
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: "0",
        }}
      >
        Alquiler de Módulos y Trailers - Soluciones de Transporte y Catering
        para Empresas trailers neuquen alquier de trailers neuquen Catering
        neuquen alquiler de modulos neuquen
      </h1>
      <main className="trailers-container">
        <HeroTrailers />
        <Appears phrase={phrase1} title="Rápida construcción" />
        <section className="contenedor-transportable">
          <Transportables />
        </section>
        <Appears phrase={phrase2} />
        <TrailerBlack />
        {/* <TrailersTrailer /> */}
        <Footer />
      </main>
    </>
  );
};

export default Page;
