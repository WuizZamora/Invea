import DonutGraph from '../Graphics/DonutGraph';
import useConsultaSub from '../hooks/useConsultaSub';

export default function Dashboard() {
  const { data, loading, error } = useConsultaSub();

  if (loading) return <div className="text-center mt-4">Cargando...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;

  return (
    <div className="container-fluid mt-4">
      <div
        className="d-flex flex-wrap"
        style={{
          gap: '1.5rem',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}
      >
        {/* Panel gráfico */}
        <div
          className="border rounded p-5"
          style={{
            minWidth: 600,
            maxWidth: 280,
            flexShrink: 0,
            flexGrow: 0,
          }}
        >
          <h5 className="mb-2">Gráfica de correspondencia total</h5>
          <DonutGraph data={data} size={220} />
        </div>

        {/* Panel tablas */}
        <div
          className="d-flex flex-wrap"
          style={{
            gap: '1rem',
            flexGrow: 1,
            minWidth: 0,
            maxWidth: 'calc(100% - 300px)', // para que no ocupe todo el ancho y respete la gráfica
          }}
        >
          {data.map((sub, idx) => (
            <div
              key={idx}
              className="border rounded p-3"
              style={{
                minWidth: 240,
                maxWidth: 260,
                flexGrow: 0,
              }}
            >
              <h6 className="mb-3">
                📌 {sub.Nombre}{' '}
                <span className="text-muted">({sub.Total} en total)</span>
              </h6>

              <table
                className="tabla-registro mb-0"
                style={{ fontSize: '0.85rem' }}
              >
                <thead>
                  <tr>
                    <th style={{ width: '70%' }}>Estatus</th>
                    <th style={{ width: '30%' }}>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="color-circulo pendiente"></span>Pendiente</td>
                    <td>{sub.Pendiente}</td>
                  </tr>
                  <tr>
                    <td><span className="color-circulo en-proceso"></span>En proceso</td>
                    <td>{sub.EnProceso}</td>
                  </tr>
                  <tr>
                    <td><span className="color-circulo terminado"></span>Terminada</td>
                    <td>{sub.Terminada}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
