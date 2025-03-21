"use client";
import Image from "next/image";
import "./catering-cautiva.scss";
import img from "/public/images/catering.jpg";

const CateringCautiva = () => {
  return (
    <>
      <div className="contenedor-catering">
        <h2>CAUTIVA TUS SENTIDOS CON NUESTRO SABORES</h2>
        <div className="mitad-izq-catering">
          <section className="section-p-cautiva">
            <p>
              Nos distinguimos por nuestra dedicación a la calidad y la atención
              al cliente. Trabajamos estrechamente con cada cliente para
              entender sus necesidades específicas y garantizar que cada evento
              sea único y exitoso. Desde la planificación inicial hasta la
              ejecución impecable, nuestro equipo está comprometido a superar
              las expectativas en cada paso del camino.
            </p>
            <p>
              Ofrecemos una amplia gama de opciones culinarias, todas elaboradas
              con ingredientes frescos y de primera calidad
            </p>
          </section>
        </div>
        <div className="mitad-der-catering">
          <Image src={img} alt="Imagen de catering" className="img-catering" />
        </div>
      </div>
    </>
  );
};

export default CateringCautiva;
