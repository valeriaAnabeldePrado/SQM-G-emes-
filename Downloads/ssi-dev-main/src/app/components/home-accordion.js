import React from "react";

import { Accordion, AccordionItem } from "@nextui-org/react";

export default function AccordionMio() {
  const ofrecemos =
    "Ofrecemos una amplia gama de servicios especializados para la industria, incluyendo transporte, alquiler de equipos, desmontaje, transporte y montaje (DTM), saneamiento en yacimientos, así como la fabricación de módulos a medida. Estos módulos abarcan diversas necesidades, desde espacios habitacionales hasta salas de reunión, oficinas, gimnasios, entre otros.";
  const alquileres =
    'Proporcionamos servicios de alquiler de periféricos, como cisternas de agua de diferentes capacidades, cisternas de combustible, plantas de tratamiento de efluentes, generadores de diversas potencias y torres de iluminación. Nos especializamos en ofrecer soluciones integrales mediante campamentos "llave en mano", garantizando que estén 100% operativos en todos los aspectos, incluyendo agua, luz y cloacas.';
  const hoteleria =
    "También incluyen opciones de hotelería en yacimientos, catering, viandas y servicio de vigilancia. Estamos comprometidos en brindar soluciones completas y de alta calidad para satisfacer las necesidades específicas de nuestros clientes en la industria.";

  const itemClasses = {
    title: "font-xl text-white text-xl",
    content: "text-l",
  };

  return (
    <Accordion itemClasses={itemClasses}>
      <AccordionItem
        key="1"
        aria-label="Nosotros"
        title="Nosotros"
        className="text-left "
      >
        {ofrecemos}
      </AccordionItem>
      <AccordionItem
        key="2"
        aria-label="Alquileres"
        title="Alquileres"
        className="text-left"
      >
        {alquileres}
      </AccordionItem>
      <AccordionItem
        key="3"
        aria-label="Hoteleria y catering"
        title="Hoteleria y catering"
        className="text-left"
      >
        {hoteleria}
      </AccordionItem>
    </Accordion>
  );
}
