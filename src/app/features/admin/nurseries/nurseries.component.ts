import {Component, inject, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutService} from '../../../services/layout.service';
import {INurseries} from '../../../interfaces/nurseries.interface';
import {NurseriesListComponent} from '../nurseries-list/nurseries-list.component';
import {NurseryService} from '../../../services/nursery.service';
import {PaginationComponent} from '../../pagination/pagination.component';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-nurseries',
  standalone: true,
  imports: [
    CommonModule,
    NurseriesListComponent,
    PaginationComponent,
  ],
  templateUrl: 'nurseries.component.html',
})

export class NurseriesComponent implements OnInit {
  @Input() nurseryList: INurseries[]=[];
  public layoutService = inject(LayoutService);
  nurseryService: NurseryService = inject(NurseryService);

  constructor(private router: Router){}

  ngOnInit(): void {
    setTimeout(() => {
    this.layoutService.setTitle('Viveros')
    this.layoutService.setDescription('En esta sección, puedes ver todos los viveros registrados en la plataforma. Revisa detalles como el ID, el nombre, la dirección con latitud y longitud, y el estado del vivero. También puedes editar su información o cambiar su estado a activo o desactivado.')
    this.nurseryService.search.page=1;
    this.nurseryService.getAll();
    });
  }

  createNurseryPage() {
    this.router.navigate(['/admin/create-nursery']);
  }
}
