// Routes
import React from 'react';
import PaginaPrincipal from './components/paginaprincipal'; // ajusta el path si es diferente
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
function App() {
  //const rutaServidor="/"; //Desarrollo
  //const rutaServidor="/ficowaze"; //Desarrollo
  const rutaServidor="/ficoinsight";
  return (
    <BrowserRouter>
      <Routes>
        <Route path={rutaServidor} element={<PaginaPrincipal/>} />
        <Route path="/ficowaze" element={<Navigate to={rutaServidor} replace/>} />
      </Routes>
    </BrowserRouter>    
  );
}

export default App;
