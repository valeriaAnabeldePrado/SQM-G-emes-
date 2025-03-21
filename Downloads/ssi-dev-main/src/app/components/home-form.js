"use client";
import React from "react";
import { Input } from "@nextui-org/react";
import { useForm } from "./useForm";
import "./home-contact.scss";
import HomeRespuesta from "./home-respuesta";

const Form = ({ colorFuente, colorBorde }) => {
  //-----FORMULARIO INICIAL-----//
  const initialForm = {
    nombreYapellido: "",
    email: "",
    phoneNumber: "",
    comments: "",
  };
  //-----VALIDACIONES-----//
  const validationsForm = (form) => {
    let regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/;
    let regexPhoneNumber = /^[0-9]{10,16}$/;

    let errors = {};
    if (!form.nombreYapellido.trim()) {
      errors.nombreYapellido = `Debe ingresar su nombre y apellido.`;
    }
    if (!form.email.trim()) {
      errors.email = `Debe ingresar su correo.`;
    } else if (!regexEmail.test(form.email.trim())) {
      errors.email = `Debe ingresar correctamente los datos.`;
    }
    if (!form.phoneNumber) {
      errors.phoneNumber = `Debe ingresar su número telefónico.`;
    } else if (!regexPhoneNumber.test(form.phoneNumber)) {
      errors.phoneNumber = `Debe ingresar un número telefónico válido: 351157878787`;
    }
    if (!form.comments.trim()) {
      errors.comments = "Debe ingresar su consulta.";
    }
    return errors;
  };
  //-----HOOK FORM-----//
  const { handleBlur, handleSubmit, handleChange, form, error, response } =
    useForm(initialForm, validationsForm);

  return (
    <div style={{ position: "relative" }}>
      <form method="POST" onSubmit={handleSubmit}>
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          <Input
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={form.nombreYapellido}
            name="nombreYapellido"
            label="Nombre y Apellido"
            placeholder="Ingrese su Nombre y Apellido"
          />
          {error.nombreYapellido && (
            <p
              style={{
                color: `${colorFuente}`,
                padding: "0",
                fontSize: "12px",
              }}
            >
              {error.nombreYapellido}
            </p>
          )}
          <Input
            type="number"
            onChange={handleChange}
            onBlur={handleBlur}
            value={form.phoneNumber}
            name="phoneNumber"
            label="Telefono"
            placeholder="Ej: 299156494170"
          />
          {error.phoneNumber && (
            <p
              style={{
                color: `${colorFuente}`,
                padding: "0",
                fontSize: "12px",
              }}
            >
              {error.phoneNumber}
            </p>
          )}
          <Input
            type="email"
            label="Email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={form.email}
            name="email"
            placeholder="Ingrese su email"
            isClearables
          />
          {error.email && (
            <p
              style={{
                color: `${colorFuente}`,
                padding: "0",
                fontSize: "12px",
              }}
            >
              {error.email}
            </p>
          )}
          <Input
            onChange={handleChange}
            onBlur={handleBlur}
            value={form.comments}
            name="comments"
            type="text"
            label="Consulta"
            placeholder="Ingrese su consulta"
          />
          {error.comments && (
            <p
              style={{
                color: `${colorFuente}`,
                padding: "0",
                fontSize: "12px",
              }}
            >
              {error.comments}
            </p>
          )}
        </div>
        <button
          className="buttonEnv"
          type="submit"
          style={{ color: `${colorFuente}`, borderColor: `${colorBorde}` }}
        >
          Enviar
        </button>
      </form>
      {response && <HomeRespuesta />}
    </div>
  );
};

export default Form;
