"use client";
import "./footer.scss";
import React from "react";
import { AiOutlineInstagram, AiFillFacebook } from "react-icons/ai";
import { RiTwitterXFill } from "react-icons/ri";
import { IconContext } from "react-icons";
const Footer = () => {
  return (
    <div className="footer-max-container">
      <div className="footer-container">
        <div className="footer-div">
          <div className="footer-div-box">
            <h2>Contacto</h2>
            <p className="p-footer">email: logistica@ssisrl.com.ar </p>
            <p className="p-footer">email: administracion@ssisrl.com.ar </p>
            <p className="p-footer">telefono: 2994870406 </p>
            <p className="p-footer">telefono: 2994873722 </p>
       
          </div>
          <div className="footer-div-box">
            <h2>Redes</h2>
            <IconContext.Provider value={{ size: "6em" }}>
              <div className="footer-png">
                <AiOutlineInstagram />
                <AiFillFacebook />
                <RiTwitterXFill />
              </div>
            </IconContext.Provider>
          </div>
        </div>
        <div className="footer-div footer-div-der">
          <h2>SSI</h2>
        </div>
      </div>
      <p className="footer-p-biult">
        © Built with pride and caffeine by Anabel de Prado y Mauro Lobo. All
        rights reserved.
      </p>
    </div>
  );
};

export default Footer;
