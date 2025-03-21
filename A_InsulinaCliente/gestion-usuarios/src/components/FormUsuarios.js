import "./ListadoUsuarios.css";
import { useState, useEffect } from "react";

const FormularioUsuarios = ({ usuario, guardarUsuario, alCancelar }) => {
  const [id_usuario, setIdUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [errores, setErrores] = useState({});

  // Expresiones Regulares
  const regexUsuario = /^[a-z][a-z0-9]{5,}$/;
  const regexClave = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const validarFormulario = () => {
    let listaErrores = {};
    let formularioValido = true;

    // Validar nombre
    if (!nombre.trim()) {
      listaErrores.nombre = "El nombre es obligatorio.";
      formularioValido = false;
    }

    // Validar apellidos
    if (!apellidos.trim()) {
      listaErrores.apellidos = "Los apellidos son obligatorios.";
      formularioValido = false;
    }

    // Validar fecha de nacimiento (mayor de 18 años)
    if (fechaNacimiento) {
      const fechaNac = new Date(fechaNacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - fechaNac.getFullYear();
      const diferenciaMes = hoy.getMonth() - fechaNac.getMonth();
      if (diferenciaMes < 0 || (diferenciaMes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
      }
      if (edad < 18) {
        listaErrores.fechaNacimiento = "Debe ser mayor de 18 años.";
        formularioValido = false;
      }
    } else {
      listaErrores.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
      formularioValido = false;
    }

    // Validar nombre de usuario
    if (!nombreUsuario.match(regexUsuario)) {
      listaErrores.nombreUsuario = "El usuario debe comenzar con letra minúscula y tener al menos 6 caracteres alfanuméricos.";
      formularioValido = false;
    }

    // Validar contraseña
    if (!clave.match(regexClave)) {
      listaErrores.clave = "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.";
      formularioValido = false;
    }

    setErrores(listaErrores);
    return formularioValido;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      const datosUsuario = {
        id_usu: id_usuario,
        nombre,
        apellidos,
        fecha_nacimiento: fechaNacimiento,
        usuario: nombreUsuario,
        contra: clave,
      };
      guardarUsuario(datosUsuario);
    }
  };

  const manejarCancelar = () => {
    if (alCancelar) alCancelar();
  };

  useEffect(() => {
    if (usuario) {
      setIdUsuario(usuario.id_usu || 0);
      setNombre(usuario.nombre || "");
      setApellidos(usuario.apellidos || "");
      setFechaNacimiento(usuario.fecha_nacimiento || "");
      setNombreUsuario(usuario.usuario || "");
      setClave(usuario.contra || "");
    }
  }, [usuario]);

  return (
    <div className="form-container">
      <form onSubmit={manejarEnvio} className="user-form">
        <h2 className="form-title">{usuario ? "Actualizar Usuario" : "Crear Nuevo Usuario"}</h2>
        <div className="form-group">
          <label htmlFor="id_usuario">ID:</label>
          <input id="id_usuario" type="number" value={id_usuario} disabled={!!id_usuario} className="form-input" />
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="form-input"
              placeholder="Escribe tu nombre"
            />
            {errores.nombre && <p className="error">{errores.nombre}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="apellidos">Apellidos:</label>
            <input
              id="apellidos"
              type="text"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              className="form-input"
              placeholder="Escribe tus apellidos"
            />
            {errores.apellidos && <p className="error">{errores.apellidos}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
            <input
              id="fechaNacimiento"
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              className="form-input"
            />
            {errores.fechaNacimiento && <p className="error">{errores.fechaNacimiento}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="nombreUsuario">Nombre de Usuario:</label>
            <input
              id="nombreUsuario"
              type="text"
              value={nombreUsuario} 
              onChange={(e) => setNombreUsuario(e.target.value)}
              disabled={!!usuario} className="form-input"
              placeholder="Nombre de usuario"
            />
            {errores.nombreUsuario && <p className="error">{errores.nombreUsuario}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="clave">Contraseña:</label>
            <input
              id="clave"
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="form-input"
              placeholder="Contraseña"
            />
            {errores.clave && <p className="error">{errores.clave}</p>}
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="btn-submit">
            {usuario ? "Guardar Cambios" : "Crear Usuario"}
          </button>
          <button type="button" className="btn-cancel" onClick={manejarCancelar}>
            Cancelar
          </button>
        </div>
      </form>
      <style>{`
        /* Contenedor principal con efecto de cristal */
.form-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.65);
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(8px);
}

/* Formulario con efecto de elevación */
.user-form {
  background-color: white;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25), 0 10px 20px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

/* Efecto de destello en el formulario */
.user-form::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 25%,
    transparent 50%
  );
  transform: rotate(30deg);
  pointer-events: none;
}

@keyframes fadeIn {
  from {
    transform: translateY(-40px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* Estilo más elegante para el título */
.form-title {
  margin: 0 0 36px 0;
  color: #1a202c;
  font-size: 32px;
  text-align: center;
  font-weight: 800;
  letter-spacing: -0.75px;
  position: relative;
  padding-bottom: 20px;
}

.form-title:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #3182ce, #63b3ed, #90cdf4);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(49, 130, 206, 0.2);
}

/* Rejilla de campos más flexible */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
}

/* Grupos de campos con mejor espaciado */
.form-group {
  margin-bottom: 22px;
  position: relative;
}

/* Etiquetas con diseño más moderno */
label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #2d3748;
  font-size: 15px;
  transition: color 0.2s;
  position: relative;
  padding-left: 2px;
}

/* Campos de formulario con más detalle */
.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: #f8fafc;
  color: #2d3748;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.form-input:focus {
  border-color: #3182ce;
  box-shadow: 0 0 0 4px rgba(49, 130, 206, 0.15), 0 2px 8px rgba(0, 0, 0, 0.05);
  outline: none;
  background-color: white;
}

.form-input:hover:not(:focus) {
  border-color: #cbd5e0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

/* Estilos para campos deshabilitados */
.form-input:disabled {
  background-color: #f1f5f9;
  border-color: #cbd5e0;
  cursor: not-allowed;
  opacity: 0.7;
  box-shadow: none;
}

/* Estilos para campos específicos */
input[type="date"].form-input {
  appearance: textfield;
  padding-right: 10px;
}

input[type="number"].form-input {
  appearance: textfield;
}

/* Placeholder más elegante */
.form-input::placeholder {
  color: #a0aec0;
  font-style: italic;
  font-weight: 300;
}

/* Grupo de botones con mejor diseño */
.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 18px;
  margin-top: 38px;
}

/* Botones más modernos */
.btn-submit, .btn-cancel {
  padding: 14px 28px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.3px;
}

/* Botón de envío con degradado mejorado */
.btn-submit {
  background: linear-gradient(135deg, #3182ce, #4299e1);
  color: white;
  box-shadow: 0 6px 15px rgba(49, 130, 206, 0.4);
}

.btn-submit:hover {
  background: linear-gradient(135deg, #2b6cb0, #3182ce);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(49, 130, 206, 0.5);
}

/* Botón de cancelar con efecto de borde */
.btn-cancel {
  background-color: #f8fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.btn-cancel:hover {
  background-color: #edf2f7;
  border-color: #cbd5e0;
  transform: translateY(-3px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.08);
}

.btn-submit:active, .btn-cancel:active {
  transform: translateY(1px);
}

/* Mensajes de error mejorados */
.error {
  color: #e53e3e;
  font-size: 14px;
  margin-top: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 6px;
  background-color: rgba(229, 62, 62, 0.08);
  transition: all 0.2s ease;
}

.error:before {
  content: '!';
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  background-color: #e53e3e;
  color: white;
  border-radius: 50%;
  margin-right: 10px;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(229, 62, 62, 0.3);
}

/* Animación de aparición para los errores */
@keyframes errorFadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error {
  animation: errorFadeIn 0.3s ease-out;
}

/* Responsive mejorado */
@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .user-form {
    padding: 30px 20px;
    border-radius: 16px;
  }
  
  .form-title {
    font-size: 26px;
    margin-bottom: 28px;
  }
  
  .button-group {
    flex-direction: column;
    margin-top: 30px;
  }
  
  .btn-submit, .btn-cancel {
    width: 100%;
    text-align: center;
    padding: 12px 20px;
  }
}

/* Transición más suave para los cambios de estado */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}
      `}</style>
    </div>
  );
};

export default FormularioUsuarios;