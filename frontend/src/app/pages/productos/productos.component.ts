import { DecimalPipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import { ProductsComponent } from './components/products/products.component';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CartComponent } from '../cart/cart.component';
import { CartService } from '../../core/services/cart.service';


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [ DecimalPipe, ProductsComponent, RouterModule, RouterLink, CartComponent ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
})
export class ProductosComponent {
  
  total = computed(() => this.cartService.cart().total);
  count = computed(() => this.cartService.cart().count);

  constructor(private cartService: CartService) {}
}
