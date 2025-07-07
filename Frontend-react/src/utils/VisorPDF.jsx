import React from 'react';

const VisorPDF = ({ url, onClose }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onClose} style={styles.cerrar}>Cerrar PDF</button>
      </div>
      <iframe
        src={url}
        title="PDF Viewer"
        style={styles.iframe}
        frameBorder="0"
      />
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  header: {
    padding: '0.5rem',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #ccc',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  cerrar: {
    padding: '0.4rem 1rem',
    backgroundColor: '#d32f2f',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  iframe: {
    flex: 1,
    width: '100%',
    height: '600px', // o ajustable según tu diseño
  },
};

export default VisorPDF;
