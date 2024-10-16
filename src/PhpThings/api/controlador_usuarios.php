<?php

include_once '../Daos/EntityDao.php';
include_once '../Daos/Conexion.php';

// Crear una instancia de Conexion para establecer la conexión

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents('php://input'));

$modoCrud = isset($data['modo']) ? $data['modo'] : 'read';
$entidad = isset($data['entidad']) ? $data['entidad'] : 'entidad';
$id = isset($data['id']) ? intval($data['id']) : 0;
$entityData = isset($data['entityData']) ? $data['entityData'] : '';

// Creamos una nueva instancia del DAO para hacer la consulta
$daoEntity = new EntityDao();

$modoCrud = "editar";
$resultado = "sin_opciones";

switch ($modoCrud) {

    // Funcionalidad Crud

    case 'create':
        $resultado = $daoEntity->insertEntity($entidad, $entityData);
        break;
    case 'read':
        $resultado = $daoEntity->getEntity($entidad, ["rol", "estado", "telefono", "usuario_id", "contrasena"], true);
        break;
    case 'update':
        $resultado = $daoEntity->editEntity($id, $entidad, $entityData);
        break;

    case 'delete':
        $resultado = $daoEntity->deleteById($id, $entidad);
        break;

    default:
        $resultado = ["error" => "Modo crud no está soportado"];
}

// Devolvemos los datos como JSON
echo json_encode($resultado);
