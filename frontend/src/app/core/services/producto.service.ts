import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/producto';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl = `${environment.apiUrl}/producto/`; 
  // apiUrl: any;
  
  constructor(private http: HttpClient) {}

  getData(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl); 
  }

  deleteData(id: string): Observable<any> {
    const urldel = `${this.apiUrl}${id}/`;
    return this.http.delete(urldel);
  }

  createProduct(product: Product | FormData): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }

  getProducto(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map(productos => productos.filter(producto => producto.visible)) 
    );
  }
  obtenerCard(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map(productos => {
        const ids = new Set();
        return productos.map((producto, index) => {
          if (ids.has(producto.id_producto)) {
            console.warn('Producto con ID duplicado:', producto);
          } else {
            ids.add(producto.id_producto);
          }
  
          if (typeof producto.precio === 'string') {
            producto.precio = parseFloat(producto.precio);
          }       

          return producto;
        });
      })
    );
  }
  updateProduct(id: number, product: Product | FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}${id}/`, product);
  }
}
   
  


