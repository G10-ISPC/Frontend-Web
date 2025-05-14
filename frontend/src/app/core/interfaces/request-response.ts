export interface LoginRequest {
    id: number;
    email: string;
    password: string
}
export interface LoginResponse {
    token: string;      
    is_staff: boolean;   
    user_id?: number;    
  }
