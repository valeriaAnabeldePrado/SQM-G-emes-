import { useState } from "react";
import emailjs from "@emailjs/browser";

export function useForm(initialForm, validateForm) {
  //servicio de emailjs
  const service = "service_7qyr329";
  const templateId = "template_g14xlbl";
  const key = "OWg5M638v8inPBTaI";

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState({});
  const [response, setResponse] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleBlur = (e) => {
    handleChange(e);
    setError(validateForm(form));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(validateForm(form));

    if (Object.keys(error).length === 0) {
      setResponse(true);
      emailjs.sendForm(service, templateId, e.target, key);
      setForm(initialForm);
      setTimeout(() => setResponse(false), 10000);

      console.log(form);
    } else {
      return;
    }
  };

  return {
    form,
    error,
    response,
    handleSubmit,
    handleChange,
    handleBlur,
  };
}
