import "./home-letters.scss";
import { motion } from "framer-motion";

const Letters = () => {
  return (
    <div className="letters-container">
      <motion.h2
        initial={{ x: -200 }}
        animate={{ x: 200 }}
        transition={{ repeat: Infinity, duration: 12, repeatType: "reverse" }}
      >
        DEDICACIÓN EXPERIENCIA INNOVACIÓN PROFESIONALISMO SERVICIO EMPRESA
      </motion.h2>
      <motion.h2
        initial={{ x: 200 }}
        animate={{ x: -200 }}
        transition={{
          repeat: Infinity,
          duration: 12,
          repeatType: "reverse",
          damping: 10,
        }}
      >
        CATERING ALQUILER INSUMOS PETROLEROS VENTA TRAILER MÓDULOS
        HABITACIONALES
      </motion.h2>
    </div>
  );
};

export default Letters;
