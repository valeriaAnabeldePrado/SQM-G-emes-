import React, { forwardRef } from "react";
import "./home-contact.scss";
import { BsFacebook } from "react-icons/bs";
import { RiTwitterXFill } from "react-icons/ri";
import { AiFillInstagram } from "react-icons/ai";
import Form from "./home-form";
import { IconContext } from "react-icons";
import { FaLinkedinIn } from "react-icons/fa";

const Contact = forwardRef((props, ref) => {
  return (
    <div ref={ref} className="contact-container">
      <div className="contact-box">
        <div className="contact-box1">
          <section className="contact-form">
            <Form />
          </section>
        </div>

        <div className="contact-box2">
          <section className="contact-h2">
            <h2>CONT</h2>
            <h2>ACT</h2>
            <h2>US</h2>
          </section>
          <section className="contact-p"></section>
        </div>
      </div>
      <div className="contact-box">
        <div>
          <h3 className="text-contact-box">
            Podes contactarte directamente a <b>ssi@ssisrl.com.ar</b>
          </h3>
          <h3 className="text-contact-box">
            Tel <b>2996286151</b>
          </h3>
        </div>
        <div className="contact-box3">
          <IconContext.Provider value={{ size: "4rem" }}>
            <a href="https://www.facebook.com/profile.php?id=61558974149296">
              <BsFacebook />
            </a>
            <a href="https://www.instagram.com/soto.servicios.industriales/">
              <AiFillInstagram />
            </a>
            <a href="https://www.linkedin.com/company/soto-servicios-industriales-srl/">
              <FaLinkedinIn />
            </a>
          </IconContext.Provider>
        </div>
      </div>
    </div>
  );
});

Contact.displayName = "Contact";

export default Contact;
