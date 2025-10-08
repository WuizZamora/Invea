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
  const [seguimientoFiltro, setSeguimientoFiltro] = useState("");
  const [numTipo, setNumTipo] = useState("TODA");

  //Ordenar Columnas
  const [ordenColumna, setOrdenColumna] = useState("Num"); // columna a ordenar
  const [ordenAscendente, setOrdenAscendente] = useState(true); // true=asc, false=desc


  const [columnasSeleccionadas, setColumnasSeleccionadas] = useState({
    Num: true,
    REF: true,
    Oficio: true,
    Remitente: true,
    Asunto: true,
    Motivo: true,
    Giro: true,
    Denominacion: true,
    Direccion: true,
    Turnado: true,
    Fecha: true,
    
  });

  const [filasSeleccionadas, setFilasSeleccionadas] = useState([]);
  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [remitente, setRemitente] = useState("");

  // Crear opciones únicas de remitente
  const opcionesRemitente = [
    { value: "", label: "Todos" },
    ...Array.from(new Set(datos.map(item => item.Remitente).filter(Boolean)))
      .map(rem => ({ value: rem, label: rem }))
  ];

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
  
  if (remitente) {
    filtrados = filtrados.filter((item) => item.Remitente === remitente);
  }

  if (numTipo !== "TODA") {
    filtrados = filtrados.filter((item) =>
      item.NumDVSC?.startsWith(numTipo + ":")
    );
  }

  if (seguimientoFiltro === "1") {
    filtrados = filtrados.filter(item => item.Seguimiento === 1);
  } else if (seguimientoFiltro === "0") {
    filtrados = filtrados.filter(item => item.Seguimiento === 0);
  }

  filtrados = ordenarDatos(filtrados);

  setDatosFiltrados(filtrados);
  setFilasSeleccionadas(filtrados.map(() => true));
}, [fechaInicial, fechaFinal, asunto, remitente, numTipo, seguimientoFiltro, datos, ordenAscendente, ordenColumna]);


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

  // columnas seleccionadas del usuario
  let columnas = [
    ...Object.keys(columnasSeleccionadas).filter((col) => columnasSeleccionadas[col])
  ];

  // ✅ renombrar Turnado a Observaciones
  columnas = columnas.map((col) => (col === "Turnado" ? "Observaciones" : col));

  // ✅ agregar columna numeración al inicio
  columnas = ["#", ...columnas];

  // filas con numeración automática
  const filas = datosFiltrados
    .filter((_, i) => filasSeleccionadas[i])
    .map((item, index) => {
      return [
        // ✅ número de fila
        index + 1,
        ...columnas.slice(1).map((col) => {
          if (col === "Num") return item.NumDVSC;
          if (col === "REF") return item.OP || "S/N";
          if (col === "Oficio") return item.Oficio;
          if (col === "Remitente") return item.Remitente;
          if (col === "Asunto") return item.Asunto;
          if (col === "Motivo") return item.Motivo;
          if (col === "Giro") return item.Giro || "S/G";
          if (col === "Direccion") return item.Direccion;
          if (col === "Denominacion") return item.Denominacion || "S/N";

          // ✅ en Observaciones imprimir vacío si es "Claudia Yvette Molina Sánchez"
          if (col === "Observaciones") {
            return item.TurnadoSub === "Claudia Yvette Molina Sánchez"
              ? ""
              : item.TurnadoSub;
          }

          if (col === "Fecha") return item.FechaDocumento;
          return "";
        }),
      ];
    });

  const totalPagesExp = "{total_pages_count_string}";

  // índices para estilos
  const colIndexNum = columnas.indexOf("Num");
  const colIndexREF = columnas.indexOf("REF");
  const colIndexOficio = columnas.indexOf("Oficio");
  const colIndexDireccion = columnas.indexOf("Direccion");
  const colIndexRemitente = columnas.indexOf("Remitente");
  const colIndexAsunto = columnas.indexOf("Asunto");
  const colIndexMotivo = columnas.indexOf("Motivo");
  const colIndexDenominacion = columnas.indexOf("Denominacion");
  const colIndexGiro = columnas.indexOf("Giro");
  const colIndexObservaciones = columnas.indexOf("Observaciones");

  let startY = 20;

  autoTable(doc, {
    margin: { top: 3, left: 3, right: 23, bottom: 13 },
    head: [columnas],
    body: filas,
    styles: { fontSize: 8.5 },
    headStyles: { fillColor: [159, 34, 65] },
    columnStyles: {
      0: { cellWidth: 10, fontStyle: "bold" }, // ✅ columna #
      [colIndexNum]: { cellWidth: 13, fontStyle: "bold" },
      [colIndexREF]: { cellWidth: 15 },
      [colIndexOficio]: { cellWidth: 43, fontStyle: "bold" },
      [colIndexDireccion]: { cellWidth: 37 },
      [colIndexRemitente]: { cellWidth: 37},
      [colIndexAsunto]: { cellWidth: 25 },
      [colIndexMotivo]: { cellWidth: 23 },
      [colIndexDenominacion]: { cellWidth: 24 },
      [colIndexGiro]: { cellWidth: 20 },
      [colIndexObservaciones]: { cellWidth: 30 },
    },
    startY: startY,
    didDrawPage: (data) => {
      if (data.pageNumber === 1) {
        // encabezado
        doc.setFontSize(16);
        doc.text("Reporte de Correspondencia", data.settings.margin.left, 15);

        doc.setFontSize(10);
        const fecha = `Generado: ${new Date().toLocaleDateString()}`;
        const pageWidth = doc.internal.pageSize.getWidth();
        const textWidth = doc.getTextWidth(fecha);
        doc.text(fecha, pageWidth - data.settings.margin.right - textWidth, 15);
      }

      // pie de página
      let str = `Página ${data.pageNumber} de ${totalPagesExp}`;
      doc.setFontSize(9);
      let pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
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
          if (col === "Num") fila["Num"] = item.NumDVSC;
          else if (col === "REF") fila["REF"] = item.OP || "S/N";
          else if (col === "Oficio") fila["Oficio"] = item.Oficio;
          else if (col === "Remitente") fila["Remitente"] = item.Remitente;
          else if (col === "Asunto") fila["Asunto"] = item.Asunto;
          else if (col === "Motivo") fila["Motivo"] = item.Motivo;
          else if (col === "Giro") fila["Giro"] = item.Giro || "S/G";
          else if (col === "Direccion") fila["Direccion"] = item.Direccion;
          else if (col === "Denominacion") fila["Denominacion"] = item.Denominacion || "S/N";
          else if (col === "Turnado") fila["Turnado"] = item.TurnadoSub;
          else if (col === "Fecha") fila["Fecha"] = item.FechaDocumento;
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
      <div className="modal-report-cap">
        <div className="modal-header">
        <h3>Generar Reporte</h3>
        </div>


        {/* Filtros */}
        <div className="filters-row row text-start">
          <div className="col-md-1">
            <label>Fecha Inicial:</label>
            <input type="date" value={fechaInicial} onChange={(e) => setFechaInicial(e.target.value)} />
          </div>
          <div className="col-md-1">
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
          <div className="col-md-2">
            <label>Remitente:</label>
            <Select
              className="select-remitente"
              options={opcionesRemitente}
              value={opcionesRemitente.find(opt => opt.value === remitente) || { value: "", label: "Todos" }}
              onChange={(selected) => setRemitente(selected?.value || "")}
              isClearable
            />
          </div>
          <div className="col-md-1">
            <label>Seguimiento:</label>
            <Select
              className="select-remitente"
              options={[
                { value: "", label: "Todos" },
                { value: "1", label: "Sí" },
                { value: "0", label: "No" }
              ]}
              value={{ value: seguimientoFiltro, label: seguimientoFiltro === "1" ? "Sí" : seguimientoFiltro === "0" ? "No" : "Todos" }}
              onChange={(selected) => setSeguimientoFiltro(selected?.value || "")}
              isClearable
            />
          </div>
          <div className="col-md-3 text-end">
            <span className="save-button" onClick={generarPDF}>PDF 📋​</span>
            <span className="save-button ms-2" onClick={generarExcel}>Excel 📊</span>
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
          <table border="1" className="tabla-registro report-cap">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={filasSeleccionadas.every(Boolean)}
                    onChange={(e) => toggleTodasFilas(e.target.checked)}
                  /> Seleccionar Fila
                </th>
                <th onClick={() => {
                  if (ordenColumna === "Num") {
                    setOrdenAscendente(!ordenAscendente); // cambiar dirección
                  } else {
                    setOrdenColumna("Num");
                    setOrdenAscendente(true);
                  }
                }}>
                  Num {ordenColumna === "Num" ? (ordenAscendente ? "↑" : "↓") : ""}
                </th>

                {Object.keys(columnasSeleccionadas)
                  .filter(col => columnasSeleccionadas[col] && col !== "Num")
                  .map(col => (
                    <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {datosFiltrados.map((item, i) => (
                <tr key={`${i}`}
                  style={{
                    backgroundColor: item.Seguimiento === 1 ? "rgba(255, 165, 0, 0.6)" : "transparent",
                  }}>
                  <td>
                    <input
                      type="checkbox"
                      checked={filasSeleccionadas[i]}
                      onChange={() => toggleFila(i)}
                    />
                  </td>
                  {columnasSeleccionadas.Num && <td>{item.NumDVSC}</td>}
                  {columnasSeleccionadas.REF && <td>{item.OP || 'S/N'} </td>}
                  {columnasSeleccionadas.Oficio && <td>{item.Oficio}</td>}
                  {columnasSeleccionadas.Remitente && <td>{item.Remitente}</td>}
                  {columnasSeleccionadas.Asunto && <td>{item.Asunto}</td>}
                  {columnasSeleccionadas.Motivo && <td>{item.Motivo}</td>}
                  {columnasSeleccionadas.Giro && <td>{item.Giro || 'S/G'}</td>}
                  {columnasSeleccionadas.Denominacion && <td>{item.Denominacion || 'S/D'}</td>}
                  {columnasSeleccionadas.Direccion && <td>{item.Direccion}</td>}
                  {columnasSeleccionadas.Turnado && <td>{item.TurnadoSub}</td>}
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
