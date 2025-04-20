import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-amount-adjuster',
  standalone: true,
  imports: [],
  templateUrl: './amount-adjuster.component.html',
  styleUrl: './amount-adjuster.component.css',
})
export class AmountAdjusterComponent{
  @Input() quantity: number = 1;
  @Output() quantityChange = new EventEmitter<number>();

  onIncreaseQuantity() {
    this.quantityChange.next(this.quantity + 1);
  }

  onDecreaseQuantity() {
    if (this.quantity > 1) this.quantityChange.next(this.quantity - 1);
  }
}

