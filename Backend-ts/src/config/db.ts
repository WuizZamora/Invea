import { createPool, Pool } from 'mysql2/promise'; // Usamos la versión con Promesas
import dotenv from 'dotenv';
dotenv.config();
// Verifica variables de entorno
if (!process.env.DEVA_DB_HOST || !process.env.DVSC_DB_HOST) {
  throw new Error('❌ Faltan variables de entorno para la configuración de la base de datos');
}

// Configuración para DEVA
const devaConfig = {
  host: process.env.DEVA_DB_HOST,
  user: process.env.DEVA_DB_USER,
  password: process.env.DEVA_DB_PASSWORD,
  database: process.env.DEVA_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Número máximo de conexiones en el pool
};

// Configuración para DVSC
const dvscConfig = {
  host: process.env.DVSC_DB_HOST,
  user: process.env.DVSC_DB_USER,
  password: process.env.DVSC_DB_PASSWORD,
  database: process.env.DVSC_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
};

// Crear los pools de conexión
export const devaPool: Pool = createPool(devaConfig);
export const dvscPool: Pool = createPool(dvscConfig);

// Opcional: Probar conexiones al iniciar (solo en desarrollo)
if (process.env.NODE_ENV !== 'production') {
  devaPool.getConnection()
    .then((conn) => {
      console.log('✅ Conectado a la base de datos DEVA');
      conn.release();
    })
    .catch((err) => console.error('❌ Error conectando a DEVA:', err.message));

  dvscPool.getConnection()
    .then((conn) => {
      console.log('✅ Conectado a la base de datos DVSC');
      conn.release();
    })
    .catch((err) => console.error('❌ Error conectando a DVSC:', err.message));
}