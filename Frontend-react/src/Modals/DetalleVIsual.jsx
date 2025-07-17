import React from "react";

const DetalleVisual = ({ item, camposOcultos, mostrarNombreCampo }) => {
  const soporte = item.SoporteDocumental;
  const soporteUrl =
    soporte &&
    `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${soporte}`;
    
  return (
    <div className="detalle-visual-container">
      <div className="detalle-visual-izquierda card">
        <h3 className="txt-izq">Detalles del registro</h3>
        <br/><br/>
        <div className="detalle-bloque">
            <div className="fila-arriba">
              <span>
                <strong>{item.NumDVSC ? "DVSC:" : "DEVA:"}</strong> {item.NumDVSC || item.NumDEVA}
              </span>
              <span>{item.FechaDocumento}</span>
            </div>
            <div className="fila-arriba">
              <span className={item.Caracter === "Urgente" ? "caracter-urgente" : "caracter-ordinario"}>
                {item.Caracter}
              </span>
              <span>{item.Oficio}</span>
            </div>
            <div className="fila-arriba">
              {item.OP && (
                  <span><strong>OP:</strong> {item.OP}</span>
              )}
              {item.Expediente && (
                  <span><strong>Exp:</strong> {item.Expediente}</span>
              )}
            </div>
            <br/><br/>
            <div className="fila-arriba">
                <span><strong>Asunto:</strong> {item.Asunto}</span>
                <span><strong>Motivo:</strong> {item.Motivo}</span>
            </div> 
            <div className="fila-arriba">
                <span><strong>Turnado a:</strong> {item.Turnado}</span>
            </div>      
            <br/> <br/>
            <p><strong>Descripcion:</strong></p>
            <p>{item.Descripcion}</p>
            <br/><br/>
            <p>{item.TipoInmueble}:{item.Denominacion}</p>
            <p>{item.Direccion}</p>

            <strong>{item.Remitente}</strong>
            <strong>{item.Cargo}</strong>
        </div>
    </div>

      {soporte ? (
        <div className="detalle-visual-derecha">
          <iframe
            src={soporteUrl}
            title="PDF Preview"
            width="100%"
            height="100%"
            style={{ border: "none" }}
          ></iframe>
        </div>
      ) : (
        <div className="detalle-visual-derecha sin-soporte">
          <p>Sin soporte documental</p>
        </div>
      )}
    </div>
  );
};

export default DetalleVisual;
