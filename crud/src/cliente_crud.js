import React, { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash";
import ModalCuenta from "./ModalCuenta";

/**
 * Componente para administrar la lista de clientes.
 * Permite agregar, editar, eliminar y ver cuentas de clientes.
 * @returns {JSX.Element} Elemento JSX que representa el administrador de clientes.
 */
function Clientescrud() {
  // Estado para almacenar la lista de clientes
  const [clientes, setClientes] = useState([]);
  // Estados para los datos del cliente en el formulario
  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  // Estado para el cliente en edición
  const [editingCliente, setEditingCliente] = useState(null);
  // Estado para controlar el orden ascendente/descendente
  const [orderByIDAsc, setOrderByIDAsc] = useState(true);
  // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);
  // Estado para almacenar el cliente seleccionado
  const [selectedCliente, setSelectedCliente] = useState(null);
  // Estado para controlar la visibilidad del botón Cancelar
  const [showCancelarButton, setShowCancelarButton] = useState(false);

  // Función useEffect para cargar los datos al iniciar y cuando cambie el orden
  useEffect(() => {
    fetchData();
  }, [orderByIDAsc]);

  // Función para obtener los datos de los clientes desde la API
  const fetchData = async () => {
    try {
      const order = orderByIDAsc ? "asc" : "desc";
      const response = await axios.get(
        `https://localhost:7288/api/Cliente_/Seleccionar`
      );
      const sortedData = _.orderBy(response.data, ["id"], [order]);
      setClientes(sortedData);
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    }
  };

  // Función para alternar entre orden ascendente y descendente
  const toggleOrder = () => {
    setOrderByIDAsc(!orderByIDAsc);
  };

  // Función para guardar un nuevo cliente
  const handleGuardar = async () => {
    try {
      const response = await axios.post(
        "https://localhost:7288/api/Cliente_/Guardar",
        {
          rut: rut,
          nombre: nombre,
          fechaNacimiento: fechaNacimiento,
        }
      );

      if (response.status === 200) {
        setRut("");
        setNombre("");
        setFechaNacimiento("");
        fetchData();
        alert("Cliente guardado exitosamente");
      } else {
        throw new Error("Error al guardar el cliente");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      alert("Error al guardar el cliente");
    }
  };

  // Función para editar un cliente
  const handleEditar = async (cliente) => {
    setEditingCliente(cliente);
    setRut(cliente.rut);
    setNombre(cliente.nombre);
    setFechaNacimiento(cliente.fechaNacimiento);
    setShowCancelarButton(true);
  };

  // Función para actualizar un cliente editado
  const handleActualizar = async () => {
    try {
      const response = await axios.put(
        `https://localhost:7288/api/Cliente_/Editar/${editingCliente.id}`,
        {
          id: editingCliente.id,
          rut: rut,
          nombre: nombre,
          fechaNacimiento: fechaNacimiento,
        }
      );

      if (response.status === 200) {
        setRut("");
        setNombre("");
        setFechaNacimiento("");
        fetchData();
        alert("Cliente actualizado exitosamente");
      } else {
        throw new Error("Error al actualizar el cliente");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      alert("Error al actualizar el cliente");
    } finally {
      setEditingCliente(null);
      setShowCancelarButton(false);
    }
  };

  // Función para eliminar un cliente
  const handleEliminar = async (id) => {
    try {
      const response = await axios.delete(
        `https://localhost:7288/api/Cliente_/Eliminar/${id}`
      );

      if (response.status === 200) {
        fetchData(); // Actualizar la lista de clientes después de eliminar
        alert("Cliente eliminado exitosamente");
      } else {
        throw new Error("Error al eliminar el cliente");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      alert("Error al eliminar el cliente");
    }
  };

  // Función para mostrar el modal con las cuentas del cliente
  const handleViewCuentas = (cliente) => {
    setSelectedCliente(cliente);
    setShowModal(true);
  };

  // Función para cancelar la edición del cliente
  const handleCancelar = () => {
    setRut("");
    setNombre("");
    setFechaNacimiento("");
    setEditingCliente(null);
    setShowCancelarButton(false);
  };

  return (
    <div className="container">
      <h1 className="mt-4">Clientes</h1>
      {/* Formulario para ingresar datos del cliente */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Ingresar Nuevo Cliente</h5>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Rut"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="date"
              className="form-control"
              placeholder="Fecha de Nacimiento"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
            />
          </div>
          {/* Botones para guardar o actualizar cliente */}
          {!editingCliente || !showCancelarButton ? (
            <button onClick={handleGuardar} className="btn btn-primary mr-2">
              Guardar
            </button>
          ) : (
            <button onClick={handleActualizar} className="btn btn-warning mr-2">
              Actualizar
            </button>
          )}
          {" "}
          {/* Botón para cancelar edición */}
          {showCancelarButton && (
            <button onClick={handleCancelar} className="btn btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </div>
      {/* Botón para alternar orden ascendente/descendente */}
      <div className="mb-3">
        <button onClick={toggleOrder} className="btn btn-info">
          Ordenar por ID {orderByIDAsc ? "descendente" : "ascendente"}
        </button>
      </div>
      {/* Tabla para mostrar la lista de clientes */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Rut</th>
                  <th>Fecha de Nacimiento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {/* Renderizado dinámico de filas de clientes */}
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.id}</td>
                    <td>{cliente.nombre}</td>
                    <td>{cliente.rut}</td>
                    <td>{cliente.fechaNacimiento}</td>
                    {/* Botones para editar, eliminar y ver cuentas del cliente */}
                    <td>
                      <button
                        onClick={() => handleEditar(cliente)}
                        className="btn btn-warning mr-2"
                      >
                        Editar
                      </button>{" "}
                      <button
                        onClick={() => handleEliminar(cliente.id)}
                        className="btn btn-danger mr-2"
                      >
                        Eliminar
                      </button>{" "}
                      <button
                        onClick={() => handleViewCuentas(cliente)}
                        className="btn btn-info mr-2"
                      >
                        Ver Cuentas
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Modal para mostrar detalles de cuenta */}
      {showModal && (
        <ModalCuenta
          clienteId={selectedCliente.id}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default Clientescrud;
