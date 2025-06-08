import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../../core/interfaces/producto';
import { TruncatePipe } from '../../../../core/pipes/truncate.pipe';
import { CommonModule } from '@angular/common';
import { CartComponent } from '../../../cart/cart.component';
import { CartService } from '../../../../core/services/cart.service';
import { DecimalFormatPipe } from '../../../../core/pipes/decimal-format.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [TruncatePipe, CommonModule, CartComponent, DecimalFormatPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() add = new EventEmitter<Product>();

  constructor(private cartService: CartService) {}

  onAdd(product: Product) {
    if (product.stock === 0) {
      alert("Producto sin stock");
      return;
    }

    const cartItem = {
      id_producto: product.id_producto,
      nombre_producto: product.nombre_producto,
      main_imagen: product.main_imagen,
      precio: product.precio,
      quantity: 1,
      stock: product.stock
    };

    const added = this.cartService.addItem(cartItem);

    if (!added) {
      alert(`No se pudo agregar "${product.nombre_producto}" al carrito. Stock insuficiente.`);
    }
  }

  get imageUrl(): string {
    const url = this.product.main_imagen;
    if (url.startsWith('http')) {
      return url;
    }
    return `http://localhost:8000/${url}`;
  }
}