const url = "http://localhost/A_InsulinaCliente/usuarios.php";

export const getAllUsuarios = async () => {
  const mensajeError = "Error al obtener todas los usuarios.";

  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error(mensajeError);
    return await respuesta.json();
  } catch (error) {
    console.log(error, mensajeError);
    return [];
  }
};

export const getUsuById = async (id) => {
  const mensajeError = "Error al obtener el usuario por ID";
  try {
    const respuesta = await fetch(`${url}?id=${id}`);
    if (!respuesta.ok) throw new Error(mensajeError);
    return await respuesta.json();
  } catch (error) {
    console.log(error, mensajeError);
    return null;
  }
};

export const createUsu = async (nuevoUsu) => {
  const initObject = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(nuevoUsu),
  };
  const mensajeError = "Error al crear el usuario";
  try {
    const respuesta = await fetch(url, initObject);
    if (!respuesta.ok) throw new Error(mensajeError);
    return await respuesta.json();
  } catch (error) {
    console.log(error, mensajeError);
    return null;
  }
 
};
console.log(createUsu);

export const updateUsuById = async (actUsu) => {
  const initObject = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(actUsu),
  };
  const mensajeError = "Error al actualizar la nota";
  try {
    const respuesta = await fetch(`${url}?id=${actUsu.id}`, initObject);
    if (!respuesta.ok) throw new Error(mensajeError);
    return await respuesta.json();
  } catch (error) {
    console.log(error, mensajeError);
    return null;
  }
};
export const deleteUsuById = async (id) => {
  const initObject = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({ id_usu: id }), /*aqui estaba el error*/
  };
  const mensajeError = "Error al eliminar la nota";
  try {
    const respuesta = await fetch(`${url}?id=${id}`, initObject);
    if (!respuesta.ok) throw new Error(mensajeError);
    return await respuesta.json();
  } catch (error) {
    console.log(error, mensajeError);
    return null;
  }
};
