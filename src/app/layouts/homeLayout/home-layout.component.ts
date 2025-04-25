import {Component, Output, ViewChild} from '@angular/core';
import {FooterComponent} from '../../shared/components/footer/footer.component';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {RouterOutlet} from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSidenav } from '@angular/material/sidenav';
import { TranslateModule } from '@ngx-translate/core';
import { CartItemComponent } from "../../features/cart-item/cart-item.component";

@Component({
  selector: 'home-layout',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    RouterOutlet,
    MatSidenavModule,
    TranslateModule,
    CartItemComponent
],
  templateUrl: 'home-layout.component.html',
  styleUrls: ['home-layout.component.css'],
})

export class HomeLayoutComponent{
  @ViewChild('cart') cart!: MatSidenav;

  toggleCart() {
    this.cart.toggle();
  }
}
