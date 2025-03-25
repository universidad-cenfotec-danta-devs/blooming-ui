import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutService} from '../../../services/layout.service';

@Component({
  selector: 'admin-nurseries',
  standalone: true,
  imports:[
    CommonModule,
  ],
  templateUrl: 'nurseries.component.html',
})

export class NurseriesComponent{
  public layoutService = inject(LayoutService);

  constructor() {
    this.layoutService.setTitle('Viveros')
    this.layoutService.setDescription('En esta sección, puedes ver todos los viveros registrados en la plataforma. Revisa detalles como el ID, el nombre, la dirección con latitud y longitud, y el estado del vivero. También puedes editar su información o cambiar su estado a activo o desactivado.')
  }
}
