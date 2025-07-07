// src/components/TurnarModal.jsx
import React, { useState } from 'react';
import Select from 'react-select';
import useSelectLCP from '../hooks/SelectPersonalLCP';
import TurnarLCP from '../hooks/TurnarLCP';
import { useUsuario } from '../context/UserContext';
import { showSuccess, showError } from '../utils/alerts'; 

const TurnarModal = ({ isOpen, onClose, idCorrespondencia }) => {
  const  {usuario} = useUsuario();
  const { opcionesLCP, loading } = useSelectLCP(usuario?.id, usuario?.idLCP);
  const [seleccionado, setSeleccionado] = useState(null);

  const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    minWidth: '300px',
    maxWidth: '500px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  },
  botones: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1rem',
    gap: '1rem'
  },
  cancelar: {
    backgroundColor: '#aaa',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Turnar correspondencia</h2>

        <Select
        options={opcionesLCP}
        value={seleccionado}
        onChange={setSeleccionado}
        placeholder={loading ? "Cargando..." : "Selecciona personal a turnar..."}
        isDisabled={loading}
        />

        <div style={styles.botones}>
          <button
            onClick={() => TurnarLCP({ seleccionado, idCorrespondencia, onClose })}
            className='save-button'
            disabled={!seleccionado}
          >
            Turnar
          </button>
          <button onClick={onClose} style={styles.cancelar}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TurnarModal;
