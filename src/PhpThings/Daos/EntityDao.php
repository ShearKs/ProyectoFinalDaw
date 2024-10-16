<?php

class EntityDao
{
    private $conexion;

    public function __construct()
    {
        // Usamos la clase que maneja la conexión a la BDD
        $this->conexion = Conexion::getConexion();
    }

    public function getEntity($tabla, $camposAQuitar = [], $completo)
    {
        $entidad = [];

        // Hacemos la consulta a la base de datos para obtener los datos de la tabla principal
        $sql = "SELECT * FROM `$tabla`";
        $resultado = $this->conexion->query($sql);

        // Si hemos obtenido algo de la consulta
        if ($resultado->num_rows > 0) {
            while ($fila = $resultado->fetch_assoc()) {
                $entidad[] = $fila;
            }
        }

        // Si queremos obtener también los datos de las relaciones
        if ($completo) {
            // Obtener las relaciones de la tabla usando getRelations
            $relaciones = $this->getRelations($tabla);

            // Para cada relación, hacer una consulta para obtener los datos relacionados
            foreach ($relaciones as $relacionItem) {
                if (isset($relacionItem['columna_relacion'], $relacionItem['tabla_relacionada'], $relacionItem['columna_referenciada'])) {
                    $columna = $relacionItem['columna_relacion'];
                    $tablaRelacionada = $relacionItem['tabla_relacionada'];
                    $columnaReferenciada = $relacionItem['columna_referenciada'];
                    $tipoRelacion = $relacionItem['tipo_relacion'];

                    // Obtener los datos relacionados para cada registro en la tabla principal
                    foreach ($entidad as &$registro) {
                        if ($tipoRelacion == 'saliente' && isset($registro[$columna])) {
                            // Si la relación es saliente, buscar en la tabla relacionada usando el valor del registro actual
                            $valorReferencia = $registro[$columna];
                            $sqlRelacion = "SELECT * FROM `$tablaRelacionada` WHERE `$columnaReferenciada` = '$valorReferencia'";
                        } elseif ($tipoRelacion == 'entrante') {
                            // Si la relación es entrante, buscar en la tabla relacionada usando el ID del registro actual
                            $valorReferencia = $registro['id'];
                            $sqlRelacion = "SELECT * FROM `$tablaRelacionada` WHERE `$columna` = '$valorReferencia'";
                        } else {
                            continue;
                        }

                        $resultadoRelacion = $this->conexion->query($sqlRelacion);

                        if ($resultadoRelacion && $resultadoRelacion->num_rows > 0) {
                            // Combinar los datos de la tabla relacionada con los datos de la tabla principal
                            while ($filaRelacion = $resultadoRelacion->fetch_assoc()) {
                                foreach ($filaRelacion as $key => $value) {
                                    // Prefijar el nombre de la tabla relacionada al nombre del campo para evitar conflictos
                                    $registro[$key] = $value;
                                }
                            }
                        }
                    }
                }
            }
        }

        // Quitar los campos que se han especificado
        if (!empty($camposAQuitar)) {
            foreach ($entidad as &$registro) {
                foreach ($camposAQuitar as $campo) {
                    // Verificar si el campo existe en el registro, sin importar su valor
                    if (array_key_exists($campo, $registro)) {
                        unset($registro[$campo]);
                    }
                }
            }
        }

        return $entidad;
    }


    //METODO ALTERNATIVO GET ENTITY EN EL QUE TU LE PASAS LOS CAMPOS QUE QUIERES Y TE DEVUELVE LOS DATOS....
    public function getEntityAlternative($tabla, $camposElegir = [], $completo = false)
    {

        $entidad = [];
        $sql = "";
        $camposSeleccionados = "";

        if (empty($camposElegir)) {
            $camposSeleccionados = "*";
        } else {
            //$camposSeleccionados = implode(', ', $camposElegir);

            $camposSeleccionados = implode(', ', array_map(fn($campo) => "$campo AS" . strtoupper($campo), $camposElegir));
        }


        $sql = "SELECT `$camposSeleccionados`  FROM `$tabla`  ";

        if ($completo) {
            //Si es completo tenemos que obtener las relaciones de la tabla
            $relaciones = $this->getRelations($tabla);

            //Por cada relación vamos a modificar el select para sacar más campos
            foreach ($relaciones as $relacion) {

                if (isset($relacion['columna_relacion']) && isset($relacion['tabla_relacionada']) && isset($relacion['columna_referenciada'])) {

                    //Recogemos todos los datos de esa relación
                    $tablaRelacionada = $relacion['tabla_relacionada'];
                    $columna = $relacion['columna_relacion'];
                    $columnaReferencia = $relacion['columna_referenciada'];

                    $tipoRelacion = $relacion['tipo_relacion'];

                    if ($tipoRelacion == 'saliente') {

                        $sql .= " LEFT JOIN `$tablaRelacionada` ON `$tabla` . `$columna` = `$tablaRelacionada`.`$columnaReferencia`; ";
                    } elseif ($tipoRelacion == 'entrante') {
                        $sql .= " LEFT JOIN `$tablaRelacionada` ON `$tablaRelacionada`.`$columna` = `$tabla`.`id` ";
                    }
                }
            }
        }

        //Ejecutamos la consulta
        $resultado = $this->conexion->query($sql);

        //Procesamos los datos
        if ($resultado && $resultado->num_rows > 0) {
            while ($fila = $resultado->fetch_assoc()) {
                $entidad[] = $fila;
            }
        }

        return $entidad;
    }

    //Función que ejecuta el getEntity pero coje solo un elemento el filtrado por id.
    public function getById($id, $tabla, $camposAQuitar)
    {
        $entidad = $this->getEntity($tabla, $camposAQuitar, false);

        $valorRegistro = [];

        foreach ($tabla as $registro) {

            if (isset($registro['id'])  && $registro['id'] == $id) {
                $valorRegistro = $registro;
            }
        }

        return $valorRegistro;
    }


    //Función para obtener los campos de una entidad
    public function getFields()
    {
        return null;
    }

    //Método para insertar un registro en una tabla
    public function insertEntity($tabla, $data)
    {

        //Lo primero que hacemos es obtener los nombres de las columnas y los valores a isnertar
        //Ejemplo de lo que nos llega "nombre, email, contraseña"
        $columnas =  implode(', ', array_keys($data));

        //cadena con el número total de interrogaciones
        $placeholders = implode(", ", array_fill(0, count($data), "?"));

        //Preparamos la consulta
        $sql = "INSERT INTO $tabla ($columnas) VALUES ($placeholders)";
        //Preparamos la sentencia
        $sentencia = $this->conexion->prepare($sql);

        //Cadenad de los tipos para los bindParam
        $tipos = implode(', ', $this->tiposArray($data));

        //Vinculamos los parámetros
        $sentencia->bind_param($tipos, ...$data);

        $estado = $sentencia->execute();

        return $estado ?
            ["status" => "exito", "mensaje" => "Se hizo correctamente el insertado de entidad con id: " . $this->conexion->insert_id] :
            ["status" => "error", "mensaje" => "Error al insertar un valor en la entidad, motivo : ", $sentencia->error];
    }


    public function deleteById($id, $nombreTabla)
    {

        $sql = "DELETE FROM $nombreTabla WHERE $id = ?";
        $sentencia = $this->conexion->prepare($sql);
        $sentencia->bind_param('i', $id);

        $eliminado = $sentencia->execute();


        return $eliminado ?
            ["status" => "exito", "mensaje" => "Se eliminó correctamente"] :
            ["status" => "error", "mensaje" => "Ha habido algun error al eliminar.. "];
    }

    public function editEntity($id, $nombreTabla, $entidadActualizada)
    {

        if (empty($entidadActualizada)) {

            return [
                "status" => "",
                "mensaje" => "No se ha proporcionado datos para actualizar"
            ];
        }

        //Construimos la cadena para de actualización de campos de una forma dinámica
        $campos = implode(", ", array_map(fn($campo) => "$campo = ?", array_keys($entidadActualizada)));

        $sql = "UPDATE $nombreTabla SET $campos WHERE id = ?";

        //Preparamos la sentencia
        $sentencia = $this->conexion->prepare($sql);

        //Obtenemos los tipos de datos actualizar
        $tipos = implode('', $this->tiposArray($entidadActualizada)) . 'i';


        //Vinculamos los valores y el id
        $valores = array_merge(array_values($entidadActualizada), [$id]);
        $sentencia->bind_param($tipos, ...$valores);
        $estado = $sentencia->execute();


        return $estado ?
            ($sentencia->affected_rows > 0 ?
                ["status" => "exito", "mensaje" => "Registro actualizado correctamente"] :
                ["status" => "error", "mensaje" => "No se realizó ningún cambio"])
            : ["status" => "error", "mensaje" => "Error al actualizar el registro ,motivo: " . $sentencia->error];
    }

    //Función que devuelve en un array los tipos de un array 
    private function tiposArray($data)
    {

        $tipos = [];

        foreach ($data as $indice => $valor) {

            if (is_int($valor)) {
                $tipos[] = 'i';
            } elseif (is_double($valor) || is_float($valor)) {
                $tipos[] = 'd';
            } elseif (is_string($valor)) {
                $tipos[] = 's';
            } elseif (is_null($valor)) {
                $tipos[] = 's';
            } else {
                throw new Exception('Error, tipo no soportado...' . gettype($valor));
            }
        }

        return $tipos;
    }

    //Función que se encarga de obtener todas las relaciones de una tabla...
    private function getRelations($tabla)
    {
        // Array de relaciones
        $relaciones = [];

        // Consulta para obtener tanto las relaciones salientes como las entrantes
        $sql = "
            SELECT 
                COLUMN_NAME, 
                REFERENCED_TABLE_NAME, 
                REFERENCED_COLUMN_NAME, 
                'saliente' AS tipo_relacion 
            FROM 
                information_schema.KEY_COLUMN_USAGE 
            WHERE 
                TABLE_NAME = '$tabla' 
                AND TABLE_SCHEMA = 'BDD_PROJECT_SFE' 
                AND REFERENCED_TABLE_NAME IS NOT NULL
            UNION
            SELECT 
                COLUMN_NAME, 
                TABLE_NAME AS REFERENCED_TABLE_NAME, 
                REFERENCED_COLUMN_NAME, 
                'entrante' AS tipo_relacion 
            FROM 
                information_schema.KEY_COLUMN_USAGE 
            WHERE 
                REFERENCED_TABLE_NAME = '$tabla' 
                AND TABLE_SCHEMA = 'BDD_PROJECT_SFE' 
                AND REFERENCED_TABLE_NAME IS NOT NULL";

        // Ejecutamos la consulta
        $resultado = $this->conexion->query($sql);

        // Si en esa tabla se encuentran relaciones
        if ($resultado && $resultado->num_rows > 0) {
            while ($fila = $resultado->fetch_assoc()) {
                // Agregamos la relación al array
                $relaciones[] = [
                    'tabla_relacionada' => $fila['REFERENCED_TABLE_NAME'],
                    'columna_relacion' => $fila['COLUMN_NAME'],
                    'columna_referenciada' => $fila['REFERENCED_COLUMN_NAME'],
                    // 'saliente' o 'entrante' y dependiendo de eso elegimos como será el tipo de consulta
                    'tipo_relacion' => $fila['tipo_relacion']
                ];
            }
        }

        return $relaciones;
    }


    public function getEntityAlternative_3($tabla, $camposElegir = [], $completo = false)
    {
        $entidad = [];
        $camposSeleccionados = "";
    
        // Inicializamos arrays para campos de la tabla principal y las relaciones
        $camposPrincipal = [];
        $camposRelaciones = [];
    
        // Clasificar los campos según su origen
        foreach ($camposElegir as $campo) {
            $partes = explode('_', $campo);
            $tablaCampo = count($partes) > 1 ? $partes : $tabla;
            if ($tablaCampo === $tabla) {
                $camposPrincipal[] = $campo;
            } else {
                $camposRelaciones[$tablaCampo][] = $campo;
            }
        }
    
        // Construir la parte SELECT de la tabla principal
        if (empty($camposPrincipal)) {
            $camposPrincipalSeleccionados = "$tabla.*";
        } else {
            $camposPrincipalSeleccionados = implode(', ', array_map(fn($campo) => "UPPER($tabla.$campo) AS " . strtoupper($campo), $camposPrincipal));
        }
    
        // Construir la parte SELECT de las relaciones
        $camposRelacionesSeleccionados = [];
        foreach ($camposRelaciones as $tablaRelacionada => $campos) {
            foreach ($campos as $campo) {
                $camposRelacionesSeleccionados[] = "UPPER($tablaRelacionada.$campo) AS " . strtoupper($campo);
            }
        }
    
        // Combinar todos los campos seleccionados
        $camposSeleccionados = implode(', ', array_merge([$camposPrincipalSeleccionados], $camposRelacionesSeleccionados));
    
        // Construir la sentencia SQL inicial
        $sql = "SELECT $camposSeleccionados FROM `$tabla`";
    
        // Agregar JOINs si es necesario
        if ($completo) {
            // Obtener las relaciones de la tabla
            $relaciones = $this->getRelations($tabla);
    
            foreach ($relaciones as $relacion) {
                if (isset($relacion['columna_relacion']) && isset($relacion['tabla_relacionada']) && isset($relacion['columna_referenciada'])) {
                    $tablaRelacionada = $relacion['tabla_relacionada'];
                    $columna = $relacion['columna_relacion'];
                    $columnaReferencia = $relacion['columna_referenciada'];
                    $tipoRelacion = $relacion['tipo_relacion'];
    
                    if ($tipoRelacion == 'saliente') {
                        $sql .= " LEFT JOIN `$tablaRelacionada` ON `$tabla`.`$columna` = `$tablaRelacionada`.`$columnaReferencia`";
                    } elseif ($tipoRelacion == 'entrante') {
                        $sql .= " LEFT JOIN `$tablaRelacionada` ON `$tablaRelacionada`.`$columna` = `$tabla`.`id`";
                    }
                }
            }
        }
    
        // Ejecutar la consulta
        $resultado = $this->conexion->query($sql);
    
        // Procesar los resultados
        if ($resultado && $resultado->num_rows > 0) {
            while ($fila = $resultado->fetch_assoc()) {
                $entidad[] = $fila;
            }
        }
    
        return $entidad;
    }
    
    



}
