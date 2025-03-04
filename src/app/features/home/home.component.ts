import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.module';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

}
