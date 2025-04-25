import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cart-item',
  imports: [TranslateModule],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  @Input() name: string = '';
  @Input() img: string = '';
  @Input() price: number = 0;
  @Input() amount: number = 0;
}
