import {Component} from '@angular/core';
import {FooterComponent} from '../../shared/components/footer/footer.component';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'home-layout',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    RouterOutlet
  ],
  templateUrl: 'home-layout.component.html'
})

export class HomeLayoutComponent{

}
