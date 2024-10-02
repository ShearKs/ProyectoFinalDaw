export const sameObject = (objeto1: any, objeto2: any): boolean => {
    // Si son estrictamente iguales, devolvemos true.
    if (objeto1 === objeto2) {
        return true;
    }

    // Si uno de los objetos es null o no es un objeto, retornamos false
    if (objeto1 === null || objeto2 === null || typeof objeto1 !== 'object' || typeof objeto2 !== 'object') {
        return false;
    }

    const keys1 = Object.keys(objeto1);
    const keys2 = Object.keys(objeto2);

    // Si tienen diferente número de propiedades, retornamos false
    if (keys1.length !== keys2.length) {
        return false;
    }

    // Recorremos las llaves para comprobar si todos los valores son iguales
    for (let key of keys1) {
        // Si la propiedad no existe en objeto2 o no es igual, retornamos false
        if (!keys2.includes(key) || !sameObject(objeto1[key], objeto2[key])) {
            return false;
        }
    }

    // Si llegamos aquí, los objetos son iguales
    return true;
};