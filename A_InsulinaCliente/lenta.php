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
    
    // Función para obtener datos de insulina lenta
    function obtenerDatosLenta($db) {
        $consulta = "SELECT lenta, fecha FROM control_glucosa";
        $resultado = $db->query($consulta);
        $datos = $resultado->fetch_all(MYSQLI_ASSOC);
        
        return $datos;
    }

    // Iniciar conexión
    $db = conectarBD();
    
    // Procesar la solicitud según el método HTTP
    switch($_SERVER["REQUEST_METHOD"]) {
        case 'GET':
            $datos_lenta = obtenerDatosLenta($db);
            echo json_encode($datos_lenta);
            break;
            
        default:
            header("HTTP/1.1 405 Method Not Allowed");
            break;
    }
?>