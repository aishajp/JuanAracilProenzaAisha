const url = "http://localhost/A_InsulinaCliente/lenta.php"; 

export const getLenta = async () => {
    const mensajeError = "Error al obtener los datos de la lenta"; 
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error(mensajeError);
        
        const data = await respuesta.json();
        
        // Asegurarse de que todos los registros tienen los campos correctos
        return data.map(item => ({
            lenta: parseFloat(item.lenta || 0),
            fecha: item.fecha || null
        }));
    } catch (error) {
        console.error(mensajeError, error);
        return [];
    }
}