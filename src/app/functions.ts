import { MAT_NATIVE_DATE_FORMATS, MatDateFormats } from "@angular/material/core";

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

export function singularEntity(entities: string): string {
    if (typeof entities !== "string") {
        return "entidad introducida no es válida";
    }

    return entities.endsWith('es') ? entities.slice(0, -2) :
        entities.endsWith('s') ? entities.slice(0, -1) :
            entities;
}

//Función que devuelva una formateado un string la primera letra en mayúscula y las demás en minusula
export function upperString(cadena: string) {

    return cadena.charAt(0).toUpperCase() + cadena.slice(1).toLowerCase();
}

export const GRI_DATE_FORMATS: MatDateFormats = {
    ...MAT_NATIVE_DATE_FORMATS,
    display: {
        ...MAT_NATIVE_DATE_FORMATS.display,
        dateInput: {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        } as Intl.DateTimeFormatOptions,
    }
};


export function fechaToday(): string {

    const fechaHoy = new Date().toISOString().split('T')[0];
    localStorage.setItem('fechaHoy', fechaHoy);

    return fechaHoy;

}

