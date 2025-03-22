<?php
    // Configuración de la base de datos
    $db_host = "localhost"; 
    $db_usuario = "root";
    $db_password = ""; 
    $db_nombre = "diabetesdb";

    // Establecer conexión
    $db = new mysqli($db_host, $db_usuario, $db_password, $db_nombre);
    
    // Verificar si hay errores en la conexión
    if($db->connect_error){
        die("No se pudo conectar a la base de datos: " . $db->connect_error);
    }
?>
