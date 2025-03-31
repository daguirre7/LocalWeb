// Routes
import React from 'react';
import PaginaPrincipal from './components/paginaprincipal'; // ajusta el path si es diferente
import {BrowserRouter, Routes, Route} from 'react-router-dom';
function App() {
  //const rutaServidor="/"; //Desarrollo
  const rutaServidor="/ficowaze"; //Desarrollo
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path={rutaServidor} Component={PaginaPrincipal} />
      </Routes>
    </BrowserRouter>    
  );
}

export default App;
