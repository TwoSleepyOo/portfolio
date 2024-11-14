export interface User{
    id?:number,
    email:string,
    password:string,
    tipo?:string
}

export interface Patient{
    idPatient?:number,
    email:string,
    nombre:string,
    apellidos:string,
    genero:string,
    fecha_nac:string,
    telefono:string,
    provincia:string,
    domicilio?:string,
    detalles?:string[],
    comentario?:string
}   

export interface Doctor{
    idDoc?:number,
    email:string,
    nombre:string,
    apellidos:string,
    genero:string,
    fecha_nac:string,
    telefono:string,
    provincia:string,
    direccion?:string,
    modalidad:string,
    especialidades?:string[]
}

export interface Relation{
    id?:number,
    idDoc:number,
    idPatient:number,
    notas?:string
}

export interface Pending{
    id?:number,
    idDoc:number,
    idPatient:number,
    estado:string
}

export interface Appointment{
    id?:number,
    idPatient:number,
    idDoc:number,
    fecha:string,
    hora:string,
    estado?:string
}

export interface NotAvailable{
    id?:number,
    idDoc:number,
    fecha:string
}