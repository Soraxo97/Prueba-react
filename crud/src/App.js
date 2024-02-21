import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Clientescrud from './cliente_crud'; // Importa el componente Clientescrud

/**
 * Componente principal de la aplicación.
 * Renderiza el componente Clientescrud dentro de un diseño con estilos personalizados.
 * @returns {JSX.Element} Elemento JSX que representa la aplicación.
 */
function App() {
  return (
    <div className="bg-light min-vh-100 py-5"> {/* Fondo claro con altura mínima y relleno vertical */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg"> {/* Tarjeta con sombra grande */}
              <div className="card-header bg-primary text-white"> {/* Encabezado con fondo azul y texto blanco */}
                <h1 className="text-center">Mi Aplicación</h1>
              </div>
              <div className="card-body">
                <Clientescrud /> {/* Renderiza el componente Clientescrud */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
