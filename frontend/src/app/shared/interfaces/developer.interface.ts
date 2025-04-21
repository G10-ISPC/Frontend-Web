export interface Developer {
    id: number;
    name: string;
    fotoUrl: string;
    rol: string;
    redesSociales: {
        facebook?: string;
        instagram?: string;
        linkedin?: string;
        github?: string;
    };
}