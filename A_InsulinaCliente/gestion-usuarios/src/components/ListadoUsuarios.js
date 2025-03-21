import "./ListadoUsuarios.css";
import { useState, useEffect } from "react";
import {
  getAllUsuarios,
  createUsu,
  updateUsuById,
  deleteUsuById,
} from "../services/usuServer";

import FormUsuarios from "./FormUsuarios";

const ListadoUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nombreUsuarioBusqueda, setNombreUsuarioBusqueda] = useState("");

  const CargarUsuarios = async () => {
    setLoading(true);
    try {
      const usuServer = await getAllUsuarios();
      console.log("Usuarios cargados:", usuServer);
      setUsuarios(usuServer);
    } catch (error) {
      console.error("Error al cargar usuarios", error);
      alert("Error al cargar usuarios: " + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  const showForm = (usuario) => {
    setUsuarioActual(usuario);
    setFormVisible(true);
  };

  const updateUsu = (usuario) => showForm(usuario);

  const deleteUsu = async (id) => {
    if (!window.confirm(`¿Estás seguro de que deseas borrar el usuario con ID ${id}?`)) {
      return;
    }
  
    setLoading(true);
    let mensajeError = `Se ha producido un error al borrar el usuario con identificador ${id}`;
    try {
      //console.log("Borrando usuario con ID:", id);
      const exito = await deleteUsuById(id);
  
      if (exito === false) {
        alert(mensajeError);
      } else {
        alert(`El usuario con identificador ${id} se ha borrado correctamente`);
        CargarUsuarios();
      }
    } catch (e) {
      console.error("Error al borrar:", e);
      alert(`${e}: ${mensajeError}`);
    } finally {
      setLoading(false);
    }
  };

  const saveUsu = async (usuario) => {
    console.log("Datos recibidos en saveUsu:", usuario);
    try {
      if (usuarioActual) {
        console.log("Actualizando usuario:", usuario);
        await updateUsuById({ ...usuario, id_usu: usuarioActual.id_usu, usuario: usuarioActual.usuario }); // Asegúrate de pasar el ID correcto
        alert(
          `El usuario con identificador ${usuarioActual.id_usu} se ha modificado correctamente`
        );
      } else {
        console.log("Creando nuevo usuario:", usuario);
        const nuevoUsu = await createUsu(usuario);
        alert(
          `El usuario se ha añadido correctamente con id ${nuevoUsu.id_usu}`
        );
      }
      CargarUsuarios();
      setFormVisible(false);
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      alert(`Error al guardar usuario: ${error.message || error}`);
    }
  };

  useEffect(() => {
    CargarUsuarios();
  }, []);

  const buscarPorUsuario = () => {
    const usuarioEncontrado = usuarios.find((u) => u.usuario === nombreUsuarioBusqueda);
    if (usuarioEncontrado) {
      showForm(usuarioEncontrado);
    } else {
      alert("Usuario no encontrado");
    }
  };
  return (
    <>
      <h1>Gestión de Usuarios</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar usuario por nombre"
          value={nombreUsuarioBusqueda}
          onChange={(e) => setNombreUsuarioBusqueda(e.target.value)}
        />
        <button onClick={buscarPorUsuario}>Buscar y Modificar</button>
      </div>
      <div className="button-container">
        <button className="btn-add-user" onClick={() => showForm(null)} disabled={loading}>
          {loading ? "Cargando..." : "Añadir nuevo usuario"}
        </button>
      </div>

      {loading && <p className="loading-message">Cargando datos...</p>}
      
      <table className="tabla">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Fecha de Nacimiento</th>
            <th>Usuario</th>
           {/*  <th>Contraseña</th> */}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios?.map((usu) => (
            <tr key={usu.id_usu} className="fila">
              <td className="celda-id">{usu.id_usu}</td>
              <td className="celda-nombre">{usu.nombre}</td>
              <td className="celda-apellidos">{usu.apellidos}</td>
              <td className="celda-fecha">{usu.fecha_nacimiento}</td>
              <td className="celda-usuario">{usu.usuario}</td>
              {/* <td className="celda-contrasena">{usu.contra}</td> */}
              <td>
                {/* <button onClick={() => updateUsu(usu)} disabled={loading}>Modificar</button> */}
                <button onClick={() => deleteUsu(usu.id_usu)} disabled={loading}>Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
          <hr />
      {formVisible && (
        <div className="modal-form">
          <FormUsuarios
            usu={usuarioActual}
            saveUsu={saveUsu}
            onCancel={() => {
              setFormVisible(false);
              setUsuarioActual(null);
            }}
          />
        </div>
      )}
    </>
  );
};

export default ListadoUsuarios;