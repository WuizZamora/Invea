import React from "react";
import "./Tabla.css"; // Estilos separados

const Tabla = () => {

  return (
    <div className="form-card">
      <h2>Tabla de Registros</h2>
      <table className="tabla-registro">
        <thead>
          <tr>
            <th>#DVSC</th>
            <th>Oficio</th>
            <th>Remitente</th>
            <th>Motivo</th>
            <th>CP</th>
            <th>Dirección</th>
            <th>Soporte documental</th>
          </tr>
        </thead>
        <tbody>
              <td style={{ width: '80px' }}>    dvsc</td>
              <td>                              oficio</td>
              <td>                              remitente</td>
              <td>                              motivo</td>
              <td style={{ width: '80px' }}>    cp</td>
              <td>                              direccion</td>
              <td style={{ width: '80px' }}>    soporte</td>
        </tbody>
      </table>
    </div>
  );
};

export default Tabla;
