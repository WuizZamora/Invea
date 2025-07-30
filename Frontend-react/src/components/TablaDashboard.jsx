import React from "react";
import "../css/TablaDashboard.css";

const TablasDashboard = ({ data }) => {
  if (!Array.isArray(data)) return null;

  const titulos = ["Remitentes", "Asuntos", "Alcaldías"]; // Opcional

  return (
    <div className="container mt-4">
      {data.map((categoria, index) => (
        Array.isArray(categoria) ? (
          <div key={index} className="mb-1">
            <h4 className="text-primary">{titulos[index] || `Tabla ${index + 1}`}</h4>
            <div className="table-responsive">
              <table className="tabla-dashboard">
                <thead>
                  <tr>
                    {categoria.length > 0 &&
                      Object.keys(categoria[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {categoria.map((item, i) => (
                    <tr key={i}>
                      {Object.values(item).map((value, j) => (
                        <td key={j}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null // Evita fallos si no es un array
      ))}
    </div>
  );
};

export default TablasDashboard;
