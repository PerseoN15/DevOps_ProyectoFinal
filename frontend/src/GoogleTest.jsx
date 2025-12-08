import { useEffect, useRef } from "react";

function GoogleTest() {
  const buttonRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    console.log("🔍 Client ID usado en frontend:", clientId);

    // Esperar a que la librería de Google esté cargada
    function initializeGoogle() {
      if (!window.google || !window.google.accounts || !window.google.accounts.id) {
        console.error(" Google Identity Services no está disponible todavía");
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          console.log(" Respuesta de Google:", response);
          alert("Google devolvió un credential (revisa la consola)");
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
      });
    }

    const timeout = setTimeout(initializeGoogle, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Prueba de login con Google (solo frontend)</h2>
      <div ref={buttonRef}></div>
    </div>
  );
}

export default GoogleTest;
