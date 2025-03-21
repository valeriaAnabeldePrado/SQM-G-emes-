import React from "react";
import HeroCatering from "../components/catering-hero";
import CateringIntro from "../components/catering-intro";
import CateringCautiva from "../components/catering-cautiva";
import Imagenn from "../components/catering-image";
import CateringSvg from "../components/catering-svg";
import Footer from "../components/footer";

const Page = () => {
  return (
    <div>
      <HeroCatering />
      <CateringIntro />
      <CateringCautiva />
      <CateringSvg />
      <Imagenn />
      <Footer />
    </div>
  );
};

export default Page;
