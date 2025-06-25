import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import FormCIin from "./components/FormCIin";
import Consulta from "./components/Consulta";
import Login from "./Login";
import PrivateRoute from "./components/PrivateRoute";
import Turnado from "./components/Turnado";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/captura"
          element={
            <PrivateRoute>
              <>
                <Header />
                <FormCIin />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/consulta"
          element={
            <PrivateRoute>
              <>
                <Header />
                <Consulta />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/turnado"
          element={
            <PrivateRoute>
              <>
                <Header />
                <Turnado />
              </>
            </PrivateRoute>
          }
        />

        {/* Fallback: redirige a login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
export default App;