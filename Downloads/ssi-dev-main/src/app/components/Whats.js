// WhatsAppIcon.js
import React from "react";
import "./whats.css";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppIcon = () => {
  const openWhatsApp = () => {
    window.open("https://wa.me/542996286151");
  };

  return (
    <div className="whatsapp-icon" onClick={openWhatsApp}>
      <div className="whatsapp-icon-container">
        <FaWhatsapp className="icon-wharap" />
      </div>
    </div>
  );
};

export default WhatsAppIcon;
