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

  
  //Ordenar Columnas
  const [ordenColumna, setOrdenColumna] = useState("Num"); // columna a ordenar
  const [ordenAscendente, setOrdenAscendente] = useState(true); // true=asc, false=desc
  

  const [columnasSeleccionadas, setColumnasSeleccionadas] = useState({
    Num: true,
    Expediente: true,
    Asunto: true,
    Tipo: true,
    Nombre: true,
    Giro: true,
    Direccion: true,
    TurnadoA: true,
    Fecha: true,
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

//Función para ordenar los datos por Num
const ordenarDatos = (datosAOrdenar) => {
  const copia = [...datosAOrdenar];
  copia.sort((a, b) => {
    const numA = a.NumDVSC || "";
    const numB = b.NumDVSC || "";

    // Si quieres comparar como números reales y no como strings:
    const parsedA = parseInt(numA.replace(/\D/g, "")) || 0;
    const parsedB = parseInt(numB.replace(/\D/g, "")) || 0;

    if (ordenAscendente) {
      return parsedA - parsedB;
    } else {
      return parsedB - parsedA;
    }
  });
  return copia;
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

    // 🔹 Transformar Denominacion en Tipo y Nombre
  filtrados = filtrados.map((item) => {
    let tipo = "";
    let nombre = "";

    if (item.Denominacion && item.Denominacion.includes(":")) {
      const partes = item.Denominacion.split(":");
      tipo = partes[0]?.trim() || "";
      nombre = partes[1]?.trim() || "";
    } else {
      nombre = item.Denominacion || "";
    }

    return {
      ...item,
      Tipo: tipo || item.Tipo || "S/T",
      Nombre: nombre || "S/N",
    };
  });

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
  const doc = new jsPDF({ orientation: "landscape" });

  // Claves internas reales
  const columnasClaves = Object.keys(columnasSeleccionadas)
    .filter(col => columnasSeleccionadas[col]);

  // Encabezados visibles
  const columnasVisibles = columnasClaves.map(col =>
    col === "Nombre" ? "Denominación" : col
  );

  // Generar filas usando las claves internas (no los encabezados)
  const filas = datosFiltrados
    .filter((_, i) => filasSeleccionadas[i])
    .map((item) =>
      columnasClaves.map((col) => {
        if (col === "Num") return item.NumDVSC;
        if (col === "Oficio") return item.Oficio;
        if (col === "Expediente") return item.Expediente;
        if (col === "Asunto") return item.Asunto;
        if (col === "Tipo") return item.Tipo || "S/T";
        if (col === "Nombre") return item.Nombre || "S/D";
        if (col === "Giro") return item.Giro || "S/G";
        if (col === "Direccion") return item.Direccion;
        if (col === "Fecha") return item.FechaDocumento;
        if (col === "TurnadoA") return item.TurnadoA;
        return "";
      })
    );

  const totalPagesExp = "{total_pages_count_string}";
  let startY = 30;

  autoTable(doc, {
    head: [columnasVisibles], // 👈 mostramos los encabezados visibles
    body: filas,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [159, 34, 65] },
    margin: { top: 3, left: 5, right: 23, bottom: 13 },
    startY: startY,
    didDrawPage: (data) => {
      if (data.pageNumber === 1) {
        doc.setFontSize(16);
        doc.text("Reporte de Correspondencia", data.settings.margin.left, 15);
        doc.setFontSize(10);
        doc.text(`Generado: ${new Date().toLocaleDateString()}`, data.settings.margin.left, 22);
      }

      const str = `Página ${data.pageNumber} de ${totalPagesExp}`;
      doc.setFontSize(9);
      const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
      doc.text(str, data.settings.margin.left, pageHeight - 10);
    },
  });

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
        const header = col === "Nombre" ? "Denominación" : col; // 👈 encabezado visible
        if (col === "Num") fila[header] = item.NumDVSC;
        else if (col === "Oficio") fila[header] = item.Oficio;
        else if (col === "Expediente") fila[header] = item.Expediente;
        else if (col === "Asunto") fila[header] = item.Asunto;
        else if (col === "Direccion") fila[header] = item.Direccion;
        else if (col === "Tipo") fila[header] = item.Tipo;
        else if (col === "Nombre") fila[header] = item.Nombre;
        else if (col === "Giro") fila[header] = item.Giro;
        else if (col === "Fecha") fila[header] = item.FechaDocumento;
        else if (col === "TurnadoA") fila[header] = item.TurnadoA;
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
                    <th key={col}>
                    {col === "Nombre" ? "Denominación" : col}
                    </th>
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
                  {columnasSeleccionadas.Tipo && <td>{item.Tipo || 'S/T' }</td>}
                  {columnasSeleccionadas.Nombre && <td>{item.Nombre || 'S/N'}</td>}
                  {columnasSeleccionadas.Giro && <td>{item.Giro || 'S/G'}</td>}
                  {columnasSeleccionadas.Direccion && <td>{item.Direccion}</td>}
                  {columnasSeleccionadas.TurnadoA && <td>{item.TurnadoA}</td>}
                  {columnasSeleccionadas.Fecha && <td>{item.FechaDocumento}</td>}

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
