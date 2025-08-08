import React, { useState, useEffect } from "react";
import { Catalogo, toSelectOptions } from "../utils/Catalogos";
import Select from "react-select";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const ModalGenerarReporte = ({ isOpen, onClose, datos }) => {
  const [fechaInicial, setFechaInicial] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [asunto, setAsunto] = useState("");
  const [numTipo, setNumTipo] = useState("TODA");

  const [columnasSeleccionadas, setColumnasSeleccionadas] = useState({
    Num: true,
    Expediente: true,
    Asunto: true,
    Fecha: true,
    Direccion: true,
    Denominacion: true,
    TurnadoA: true,
  });

  const [filasSeleccionadas, setFilasSeleccionadas] = useState([]);
  const [datosFiltrados, setDatosFiltrados] = useState([]);

  // Opciones de asunto desde Catalogo
  const opcionesAsunto = toSelectOptions(Catalogo.Asunto);

  // Convierte dd/MM/yyyy a Date en hora local
const parseFecha = (str) => {
  const [dia, mes, anio] = str.split("/").map(Number);
  return new Date(anio, mes - 1, dia, 0, 0, 0, 0); // hora local sin desfase
};

// Convierte yyyy-MM-dd (del input type="date") a Date en hora local
const parseFechaInput = (str) => {
  const [anio, mes, dia] = str.split("-").map(Number);
  return new Date(anio, mes - 1, dia, 0, 0, 0, 0); // hora local sin desfase
};


  // Filtrar datos cada vez que cambian filtros
useEffect(() => {
  let filtrados = [...datos];

  if (fechaInicial && !fechaFinal) {
    filtrados = filtrados.filter((item) => {
      if (!item.FechaDocumento) return false;
      const fechaItem = parseFecha(item.FechaDocumento);
      const fechaIni = parseFechaInput(fechaInicial);
      return fechaItem.getTime() === fechaIni.getTime();
    });
  }

  if (fechaInicial && fechaFinal) {
    filtrados = filtrados.filter((item) => {
      if (!item.FechaDocumento) return false;
      const fechaItem = parseFecha(item.FechaDocumento);
      const fechaIni = parseFechaInput(fechaInicial);
      const fechaFin = parseFechaInput(fechaFinal);
      return fechaItem >= fechaIni && fechaItem <= fechaFin;
    });
  }

  if (asunto) {
    filtrados = filtrados.filter((item) => item.Asunto === asunto);
  }

  if (numTipo !== "TODA") {
    filtrados = filtrados.filter((item) =>
      item.NumDVSC?.startsWith(numTipo + ":")
    );
  }

  setDatosFiltrados(filtrados);
  setFilasSeleccionadas(filtrados.map(() => true));
}, [fechaInicial, fechaFinal, asunto, numTipo, datos]);


  const toggleColumna = (col) => {
    setColumnasSeleccionadas((prev) => ({
      ...prev,
      [col]: !prev[col],
    }));
  };

  const toggleFila = (index) => {
    setFilasSeleccionadas((prev) => {
      const copia = [...prev];
      copia[index] = !copia[index];
      return copia;
    });
  };

  const toggleTodasFilas = (valor) => {
    setFilasSeleccionadas(Array(datosFiltrados.length).fill(valor));
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    const columnas = Object.keys(columnasSeleccionadas).filter(col => columnasSeleccionadas[col]);
    const filas = datosFiltrados
      .filter((_, i) => filasSeleccionadas[i])
      .map((item) =>
        columnas.map((col) => {
          if (col === "Num") return item.NumDVSC;
          if (col === "Oficio") return item.Oficio;
          if (col === "Expediente") return item.Expediente;
          if (col === "Asunto") return item.Asunto;
          if (col === "Direccion") return item.Direccion;
          if (col === "Denominacion") return item.Denominacion;
          if (col === "Fecha") return item.FechaDocumento;
          if (col === "TurnadoA") return item.TurnadoA;
          return "";
        })
      );

  const totalPagesExp = "{total_pages_count_string}";

  autoTable(doc, {
    head: [columnas],
    body: filas,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [159, 34, 65] },
    margin: { top: 30 }, // deja espacio para encabezado
    didDrawPage: (data) => {
      // Encabezado solo en la primera página
      if (data.pageNumber === 1) {
        doc.setFontSize(16);
        doc.text("Reporte de Correspondencia", data.settings.margin.left, 15);
        doc.setFontSize(10);
        doc.text(`Generado: ${new Date().toLocaleDateString()}`, data.settings.margin.left, 22);
      }

      // Pie con número de página
      let str = `Página ${data.pageNumber} de ${totalPagesExp}`;
      doc.setFontSize(9);
      let pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
      doc.text(str, data.settings.margin.left, pageHeight - 10);
    }
  });

  // Reemplaza marcador con número total de páginas
  if (typeof doc.putTotalPages === "function") {
    doc.putTotalPages(totalPagesExp);
  }


    window.open(doc.output("bloburl"), "_blank");
  };

  const generarExcel = () => {
  const columnas = Object.keys(columnasSeleccionadas).filter(col => columnasSeleccionadas[col]);
  const filas = datosFiltrados
    .filter((_, i) => filasSeleccionadas[i])
    .map((item) => {
      const fila = {};
      columnas.forEach((col) => {
        if (col === "Num") fila["Num"] = item.NumDVSC;
        else if (col === "Oficio") fila["Oficio"] = item.Oficio;
        else if (col === "Expediente") fila["Expediente"] = item.Expediente;
        else if (col === "Asunto") fila["Asunto"] = item.Asunto;
        else if (col === "Direccion") fila["Direccion"] = item.Direccion;
        else if (col === "Denominacion") fila["Denominacion"] = item.Denominacion;
        else if (col === "Fecha") fila["Fecha"] = item.FechaDocumento;
        else if (col === "TurnadoA") fila["TurnadoA"] = item.TurnadoA;
      });
      return fila;
    });

  const worksheet = XLSX.utils.json_to_sheet(filas);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

  // Descargar archivo
  XLSX.writeFile(workbook, "ReporteCorrespondencia.xlsx");
};


  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-report">
        <div className="modal-header">
          <h3>Generar Reporte</h3>
        </div>


        {/* Filtros */}
        <div className="filters-row row text-start">
          <div className="col-md-2">
            <label>Fecha Inicial:</label>
            <input type="date" value={fechaInicial} onChange={(e) => setFechaInicial(e.target.value)} />
          </div>
          <div className="col-md-2">
            <label>Fecha Final:</label>
            <input type="date"  value={fechaFinal} onChange={(e) => setFechaFinal(e.target.value)} />
          </div>
          <div className="col-md-2">
            <label>Asunto:</label>
            <Select
              className="select-remitente"
              options={[{ value: "", label: "Todos" }, ...opcionesAsunto]}
              value={opcionesAsunto.find(opt => opt.label === asunto) || { value: "", label: "Todos" }}
              onChange={(selected) => setAsunto(selected?.label || "")}
              isClearable
            />
          </div>

          <div className="col-md-2">
            <label>Num:</label>
            <Select
              className="select-remitente"
              options={[
                { value: "TODA", label: "TODO" },
                { value: "DEVA", label: "DEVA" },
                { value: "DVSC", label: "DVSC" }
              ]}
              value={{ value: numTipo, label: numTipo === "TODA" ? "TODO" : numTipo }}
              onChange={(selected) => setNumTipo(selected?.value || "TODA")}
              isClearable
            />
          </div>
          <div className="col-md-4 text-end">
            <button className="save-button" onClick={generarPDF}>PDF 📋​</button>
            <button className="save-button ms-2" onClick={generarExcel}>Excel 📊</button>
          </div>
        </div><br />
        <div className="card-checkbox">
          <div className="text-center">
            ✔️​ Selecciona opciones para mostrar en el reporte 📋​
          </div>
          <br />
          <div className="row justify-content-center">
            {Object.keys(columnasSeleccionadas).map((col) => (
              <div className="col-md-1 text-center" key={col}>
                <label>
                  <input
                    type="checkbox"
                    checked={columnasSeleccionadas[col]}
                    onChange={() => toggleColumna(col)}
                  /> {col}
                </label>
              </div>
            ))}
          </div>
          
        </div>


        {/* Tabla con checkboxes */}
        <div className="table-report">
          <table border="1" className="tabla-registro">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={filasSeleccionadas.every(Boolean)}
                    onChange={(e) => toggleTodasFilas(e.target.checked)}
                  /> Seleccionar Fila
                </th>
                {Object.keys(columnasSeleccionadas)
                  .filter(col => columnasSeleccionadas[col])
                  .map(col => (
                    <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {datosFiltrados.map((item, i) => (
                <tr key={i}>
                  <td>
                    <input
                      type="checkbox"
                      checked={filasSeleccionadas[i]}
                      onChange={() => toggleFila(i)}
                    />
                  </td>
                  {columnasSeleccionadas.Num && <td>{item.NumDVSC}</td>}
                  {columnasSeleccionadas.Oficio && <td>{item.Oficio}</td>}
                  {columnasSeleccionadas.Expediente && <td>{item.Expediente}</td>}
                  {columnasSeleccionadas.Asunto && <td>{item.Asunto}</td>}
                  {columnasSeleccionadas.Fecha && <td>{item.FechaDocumento}</td>}
                  {columnasSeleccionadas.Asunto && <td>{item.Direccion}</td>}
                  {columnasSeleccionadas.Asunto && <td>{item.Denominacion}</td>}
                  {columnasSeleccionadas.TurnadoA && <td>{item.TurnadoA}</td>}

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Botones */}
          <button className="close-button" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default ModalGenerarReporte;
