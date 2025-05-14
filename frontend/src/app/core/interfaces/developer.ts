export interface Developer {
    id: number;
    name: string;
    fotoUrl: string;
    rol: string;
    redesSociales: {        
        linkedin?: string;
        github?: string;
    };
}