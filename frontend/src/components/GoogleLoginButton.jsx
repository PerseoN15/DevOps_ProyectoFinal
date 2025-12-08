// frontend/src/components/GoogleLoginButton.jsx
import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import API_URL from "../config/api";
import GOOGLE_CLIENT_ID from "../config/google";

const GoogleLoginButton = ({ onSuccess }) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error("Falta GOOGLE_CLIENT_ID en src/config/google.js");
      return;
    }

    if (
      !window.google ||
      !window.google.accounts ||
      !window.google.accounts.id
    ) {
      console.error("Google Identity Services no está disponible");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      shape: "pill",
      text: "continue_with",
    });
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/google`, {
        credential: response.credential,
      });

      if (onSuccess) {
        onSuccess(res.data); // { message, token, user }
      }
    } catch (error) {
      console.error("Error en login con Google:", error);
      alert("Error al iniciar sesión con Google");
    }
  };

  return <div ref={buttonRef}></div>;
};

GoogleLoginButton.propTypes = {
  onSuccess: PropTypes.func,
};

export default GoogleLoginButton;
