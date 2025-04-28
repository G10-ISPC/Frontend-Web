// export interface LogResponse {
//     id: number;       // ID del usuario
//     name: string;     // Nombre del usuario (si es necesario)
//     email: string;    // Email del usuario
//     token: string;    // Token de autenticación (si es necesario)
//   }
  export interface LogResponse {
    token: string;       // El token de autenticación
    is_staff: boolean;   // Indica si el usuario es un administrador
    user_id?: number;    // Opcional, el ID del usuario (si lo devuelve tu API)
  }