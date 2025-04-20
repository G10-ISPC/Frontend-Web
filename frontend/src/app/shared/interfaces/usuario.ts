export interface usuario {

    // username: string;
    password: string;
    password2: string;
    email: string;
    first_name: string;
    last_name: string;
    telefono: string;
    token?: string;
    direccion: {
        calle: string;
        numero: string;//lo que sigue es para utilizarlo en un futuro creciemiento de la empresa.
        // barrio: {
        //     nombre_barrio: string;
        //     localidad: {
        //         nombre_localidad: string;
        //         cod_postal: any;
        //     };
        // };
    };

}




