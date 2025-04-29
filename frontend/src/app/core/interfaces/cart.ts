export interface CartItem {
    id_producto: string;
    nombre_producto: string;
    main_imagen: string;
    precio: number;
    quantity: number;
  }
  
  export interface Cart {
    items: CartItem[];
    count: number;
    total: number;
  }
  