import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "../css/Consulta.css";
import ReporteSub from "./ReporteSub";
import TablasDashboard from "./TablaDashboard";
import DonutGraph from "../Graphics/DonutGraph";

const Consulta = () => {
  const { register, watch } = useForm();

  const fechaInicio = watch("fechaInicio");
  const fechaFin = watch("fechaFinal");

  const [datosDashboard, setDatosDashboard] = useState(null);

  useEffect(() => {
    if (fechaInicio && fechaFin) {
      const enviarFechas = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_DIRECCION}/correspondencia/dashboard`,
            {
            credentials: 'include',
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ fechaInicio, fechaFin }),
            }
            
          );

          if (!response.ok) throw new Error("Error en la solicitud");

          const data = await response.json();
          console.log("Respuesta del servidor:", data);
          setDatosDashboard(data);

        } catch (error) {
          console.error("Error al enviar fechas:", error);
        }
      };

      enviarFechas();
    }
  }, [fechaFin]);

  return (
    <div className="consulta">
      <div>
        <div className="text-center text-danger">
          <h2>Sistema de Consultas en desarrollo no funcional de momento</h2>
        </div>
      </div>

      <div className="Reporte">
        <ReporteSub />
      </div>

      <form>
        <div className="row">
          <div className="col-md-2">
            <label>Fecha Inicio:</label>
            <input type="date" {...register("fechaInicio")} />
          </div>

          <div className="col-md-2">
            <label>Fecha Final:</label>
            <input type="date" {...register("fechaFinal")} />
          </div>
        </div>
      </form>

      {/* Mostrar tablas si hay datos */}
      {datosDashboard && <TablasDashboard data={datosDashboard.data} />}
      <div className="row">
        <div className="col-md-5">
              {datosDashboard && (
                <>
                <h4>Correspondencia por Asunto</h4>
                  <DonutGraph
                    data={datosDashboard.data[1].map(({ Asunto, Total_Registros }) => ({
                      Nombre: Asunto,
                      Total: Total_Registros
                    }))}
                    size={320}
                  />
                </>
              )}
        </div>

        <div className="col-md-5">
          {datosDashboard && (
            <>
            <h4>Correspondencia por Alcaldias</h4>
              <DonutGraph
                data={datosDashboard.data[2].map(({ Alcaldia, Total_Registros }) => ({
                  Nombre: Alcaldia,
                  Total: Total_Registros
                }))}
                size={320}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Consulta;
