<?php 
    // Configuración de cabeceras
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    
    // Manejo de preflight request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('HTTP/1.1 204 No Content');
        exit;
    }
    
    // Función para conectar a la base de datos
    function conectarBD() {
        require_once "conexion.php";
        $db = new mysqli($db_host, $db_usuario, $db_password, $db_nombre);
        
        if ($db->connect_error) {
            die("Fallo en la conexión: " . $db->connect_error);
        }
        
        return $db;
    }

    // Función para obtener todos los usuarios
    function obtenerTodosUsuarios($db) {
        $consulta = "SELECT * FROM usuario";
        $resultado = $db->query($consulta);
        $usuarios = $resultado->fetch_all(MYSQLI_ASSOC);
        
        return $usuarios;
    }

    // Función para obtener un usuario por ID
    function obtenerUsuarioPorId($db, $id) {
        $stmt = $db->prepare("SELECT * FROM usuario WHERE id_usu = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        $resultado = $stmt->get_result();
        $usuario = $resultado->fetch_assoc();
        
        $stmt->close();
        
        return $usuario ? $usuario : null;
    }

    // Función para crear un nuevo usuario
    function crearUsuario($db) {
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $datos_json = file_get_contents('php://input');
            $datos = json_decode($datos_json, true);
            
            // Verificar que existan todos los campos requeridos
            if (isset($datos["id_usu"]) && 
                isset($datos["usuario"]) && 
                isset($datos["fecha_nacimiento"]) && 
                isset($datos["nombre"]) &&
                isset($datos["apellidos"]) && 
                isset($datos["contra"])) {
                
                $id_usuario = $datos["id_usu"];
                $fecha_nac = $datos["fecha_nacimiento"];
                $nombre_usuario = $datos["nombre"];
                $apellidos_usuario = $datos["apellidos"];
                $nombre_cuenta = $datos["usuario"];
                $password = password_hash($datos["contra"], PASSWORD_DEFAULT);
                
                // Verificar si el nombre de usuario ya existe
                $usuarios_existentes = obtenerTodosUsuarios($db);
                foreach ($usuarios_existentes as $usuario) {
                    if ($usuario["usuario"] == $nombre_cuenta) {
                        return "Error: Nombre de usuario ya existente";
                    }
                }
                
                // Insertar el nuevo usuario
                $stmt = $db->prepare("INSERT INTO usuario (id_usu, fecha_nacimiento, nombre, apellidos, usuario, contra) VALUES (?,?,?,?,?,?)");
                $stmt->bind_param("isssss", $id_usuario, $fecha_nac, $nombre_usuario, $apellidos_usuario, $nombre_cuenta, $password);
                $stmt->execute();
                $stmt->close();
                
                return "Usuario registrado exitosamente";
            } else {
                return "Error: Datos incompletos para el registro";
            }
        }
        
        return "Error: Método de solicitud inválido";
    }

    // Función para actualizar un usuario
    function actualizarUsuario($db, $id) {
        if ($_SERVER["REQUEST_METHOD"] == "PUT") {
            $datos_json = file_get_contents('php://input');
            $datos = json_decode($datos_json, true);
            
            $fecha_nac = $datos["fecha_nacimiento"];
            $nombre_usuario = $datos["nombre"];
            $apellidos_usuario = $datos["apellidos"];
            $nombre_cuenta = $datos["usuario"];
            
            $stmt = $db->prepare("UPDATE usuario SET fecha_nacimiento=?, nombre=?, apellidos=?, usuario=? WHERE id_usu=?");
            $stmt->bind_param("ssssi", $fecha_nac, $nombre_usuario, $apellidos_usuario, $nombre_cuenta, $id);
            $stmt->execute();
            $stmt->close();
            
            return "Información de usuario actualizada correctamente";
        } else {
            return "Error: Método de solicitud inválido";
        }
    }

    // Función para eliminar un usuario
    function eliminarUsuario($db, $id) {
        if (!$id) {
            return "Error: Se requiere ID de usuario";
        }
        
        $stmt = $db->prepare("DELETE FROM usuario WHERE id_usu=?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        if ($stmt->affected_rows > 0) {
            $stmt->close();
            return "Usuario eliminado correctamente";
        } else {
            $stmt->close();
            return "No se encontró usuario con ID: " . $id;
        }
    }

    // Iniciar conexión
    $db = conectarBD();

    // Procesar la solicitud según el método HTTP
    switch ($_SERVER["REQUEST_METHOD"]) {
        case 'GET':
            if (isset($_GET["id_usu"])) {
                $id = $_GET["id_usu"];
                $usuario = obtenerUsuarioPorId($db, $id);
                echo json_encode($usuario);
            } else {
                $usuarios = obtenerTodosUsuarios($db);
                echo json_encode($usuarios);
            }
            break;

        case 'POST':
            $resultado = crearUsuario($db);
            echo json_encode($resultado);
            break;
            
        case 'PUT':
            $datos_json = file_get_contents('php://input');
            $datos = json_decode($datos_json, true);
            
            if (!isset($datos["id_usu"])) {
                echo json_encode("Error: Se requiere ID de usuario");
                break;
            }
            
            $id = $datos["id_usu"];
            $resultado = actualizarUsuario($db, $id);
            echo json_encode($resultado);
            break;
            
        case 'DELETE':
            $datos_json = file_get_contents('php://input');
            $datos = json_decode($datos_json, true);
            
            if (!isset($datos["id_usu"])) {
                echo json_encode("Error: Se requiere ID de usuario");
                break;
            }
            
            $id = $datos["id_usu"];
            $resultado = eliminarUsuario($db, $id);
            echo json_encode($resultado);
            break;
            
        default:
            header("HTTP/1.1 405 Method Not Allowed");
            break;
    }
?>