import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AmountAdjusterComponent } from "../amount-adjuster/amount-adjuster.component";
import { CartItem } from '../../../../core/interfaces/cart';


@Component({
    selector: 'app-cart-item-card',
    standalone: true,
    templateUrl: './cart-item-card.component.html',
    styleUrl: './cart-item-card.component.css',
    imports: [ AmountAdjusterComponent]  
})

export class CartItemCardComponent {

  @Input() item!: CartItem;
  @Output() itemQuantityUpdate = new EventEmitter<number>();
  @Output() removeItem = new EventEmitter<void>();
  
  onQuantityChange(quantity: number) {
    this.itemQuantityUpdate.next(quantity);
  }

  onRemoveItem() {
    this.removeItem.next();
  }

}


