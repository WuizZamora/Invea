import React from 'react';
import TablaDashboard from './TablaDashboard';
import DonutGraph from '../Graphics/DonutGraph';

export default function SeccionGraficaYTabla({ data }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'flex-start',
        flexWrap: 'wrap', // para que sea responsive
        marginBottom: '2rem',
      }}
    >
      <div style={{ flex: 1 }}>
        <TablaDashboard categoria={data} />
      </div>
      <div style={{ flex: 1 }}>
        <DonutGraph data={data} size={250} />
      </div>
    </div>
  );
}
