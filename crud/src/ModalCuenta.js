import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table, Form } from "react-bootstrap";

/**
 * Componente para mostrar un modal con las cuentas de un cliente.
 * @param {object} props - Propiedades del componente.
 * @param {number} props.clienteId - ID del cliente del cual se mostrarán las cuentas.
 * @param {function} props.onClose - Función para cerrar el modal.
 * @returns {JSX.Element} Elemento JSX que representa el modal de cuentas.
 */
function ModalCuenta({ clienteId, onClose }) {
  // Estados para el nombre de la cuenta, las cuentas, la cuenta en edición y el nombre de la cuenta en edición
  const [nombreCuenta, setNombreCuenta] = useState("");
  const [cuentas, setCuentas] = useState([]);
  const [cuentaEditandoId, setCuentaEditandoId] = useState(null);
  const [nombreCuentaEditando, setNombreCuentaEditando] = useState("");

  // Función useEffect para cargar los datos al iniciar y cuando cambie el ID del cliente
  useEffect(() => {
    fetchData();
  }, [clienteId]);

  // Función para obtener las cuentas del cliente desde la API
  const fetchData = async () => {
    try {
      const response = await axios.get(`https://localhost:7288/api/CuentaInversion_/SeleccionarPorCliente/${clienteId}`);
      setCuentas(response.data);
    } catch (error) {
      console.error("Error al obtener las cuentas:", error);
    }
  };

  // Función para guardar una nueva cuenta
  const handleGuardarCuenta = async () => {
    try {
      const response = await axios.post("https://localhost:7288/api/CuentaInversion_/Guardar", {
        nombreCuenta: nombreCuenta,
        idCliente: clienteId,
      });

      if (response.status === 201) {
        setNombreCuenta("");
        fetchData();
        alert("Cuenta guardada exitosamente");
      } else {
        throw new Error("Error al guardar la cuenta");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      alert("Error al guardar la cuenta");
    }
  };

  // Función para editar una cuenta
  const handleEditarCuenta = async (cuentaId) => {
    setCuentaEditandoId(cuentaId);
    const cuenta = cuentas.find((c) => c.id === cuentaId);
    setNombreCuentaEditando(cuenta.nombreCuenta);
  };

  // Función para cancelar la edición de una cuenta
  const handleCancelarEdicion = () => {
    setCuentaEditandoId(null);
    setNombreCuentaEditando("");
  };

  // Función para guardar la edición de una cuenta
  const handleGuardarEdicion = async () => {
    try {
      const response = await axios.put(`https://localhost:7288/api/CuentaInversion_/Editar/${cuentaEditandoId}`, {
        id: cuentaEditandoId,
        nombreCuenta: nombreCuentaEditando,
        idCliente: clienteId, // Agregar el ID del cliente aquí
      });

      if (response.status === 204) {
        fetchData();
        alert("Cuenta editada exitosamente");
        handleCancelarEdicion();
      } else {
        throw new Error("Error al editar la cuenta");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      alert("Error al editar la cuenta");
    }
  };

  // Función para eliminar una cuenta
  const handleEliminarCuenta = async (cuentaId) => {
    try {
      const response = await axios.delete(`https://localhost:7288/api/CuentaInversion_/Eliminar/${cuentaId}`);
      if (response.status === 204) {
        fetchData();
        alert("Cuenta eliminada exitosamente");
      } else {
        throw new Error("Error al eliminar la cuenta");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      alert("Error al eliminar la cuenta");
    }
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cuentas del cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Formulario para ingresar nueva cuenta */}
        <Form.Control
          type="text"
          placeholder="Nombre de la cuenta"
          value={nombreCuenta}
          onChange={(e) => setNombreCuenta(e.target.value)}
        />
        <Button onClick={handleGuardarCuenta}>Guardar</Button>
        {/* Tabla para mostrar las cuentas existentes */}
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre de la cuenta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cuentas.map((cuenta) => (
              <tr key={cuenta.id}>
                <td>{cuenta.id}</td>
                <td>
                  {/* Renderizado condicional del campo de edición */}
                  {cuentaEditandoId === cuenta.id ? (
                    <Form.Control
                      type="text"
                      value={nombreCuentaEditando}
                      onChange={(e) => setNombreCuentaEditando(e.target.value)}
                    />
                  ) : (
                    cuenta.nombreCuenta
                  )}
                </td>
                <td>
                  {/* Renderizado condicional de los botones de acción */}
                  {cuentaEditandoId === cuenta.id ? (
                    <>
                      <Button onClick={() => handleGuardarEdicion(cuenta.id)}>
                        Guardar
                      </Button>
                      <Button onClick={handleCancelarEdicion}>Cancelar</Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => handleEditarCuenta(cuenta.id)} className="btn btn-warning mr-2">
                        Editar
                      </Button>
                      <Button onClick={() => handleEliminarCuenta(cuenta.id)} className="btn btn-danger mr-2">
                        Eliminar
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        {/* Botón para cerrar el modal */}
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalCuenta;
