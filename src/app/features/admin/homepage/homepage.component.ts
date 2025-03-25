import {Component, inject} from '@angular/core';
import {CardDashboardComponent} from './elements/cardDashboard/cardDashboard.component';
import {LayoutService} from '../../../services/layout.service';

@Component({
  selector: 'app-homepage',
  imports: [
    CardDashboardComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrls: [
    './homepage.component.css',
    '../src/styles.css'],
})
export class HomepageComponent {
  public layoutService = inject(LayoutService);

  constructor() {
    this.layoutService.setTitle('Panel de administración')
    this.layoutService.setDescription('Desde aquí, puedes gestionar todos los aspectos de la plataforma. Accede rápidamente a las secciones de usuarios, productos, pedidos y reportes. Mantén el control total de tu plataforma y toma decisiones informadas con herramientas poderosas y fáciles de usar.')
  }
}
