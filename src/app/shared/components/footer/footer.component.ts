import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared.module';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {}
