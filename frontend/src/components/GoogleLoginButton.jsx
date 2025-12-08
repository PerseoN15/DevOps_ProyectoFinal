import { useEffect, useRef } from "react";
import axios from "axios";

const GoogleLoginButton = ({ onSuccess }) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error("Falta VITE_GOOGLE_CLIENT_ID en el .env");
      return;
    }

    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      console.error("Google Identity Services no está disponible");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
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
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

      const res = await axios.post(`${apiUrl}/api/auth/google`, {
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

export default GoogleLoginButton;
