import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import FormCIin from "./components/FormCIin";
import Consulta from "./components/Consulta";
import Login from "./Login";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/consulta" element={<Consulta />} />
        <Route path="/captura" element={<FormCIin />} />
      </Routes>
    </Router>
  );
}

export default App;