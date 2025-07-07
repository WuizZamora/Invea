import { useState } from "react";
import { showSuccess, showError } from '../utils/alerts';

const TurnarLCP = async ({ seleccionado, idCorrespondencia, onClose }) => {
  if (!seleccionado || !idCorrespondencia) return;

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/personal/lcp-turnar`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          Fk_IDCorrespondenciaIn: idCorrespondencia,
          Fk_LCP_Turnado: seleccionado.value,
        }),
      }
    );

    const result = await response.json();

    if (response.ok && result.success) {
      showSuccess('Turnado exitosamente');
      onClose(); // cerrar modal
    } else {
      showError(result.error || 'Error al turnar');
    }
  } catch (error) {
    console.error("Error al turnar:", error);
    showError("No se pudo turnar la correspondencia.");
  }
};

export default TurnarLCP;
