import { Component, inject } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { RequestsListComponent } from '../requests-list/requests-list.component';
import { RoleRequestService } from '../../services/roleRequests.service';
import {LayoutService} from '../../services/layout.service';

@Component({
  selector: 'app-role-requests',
  imports: [PaginationComponent, RequestsListComponent],
  templateUrl: './role-requests.component.html',
  styleUrl: './role-requests.component.scss'
})
export class RoleRequestsComponent {
  public roleRequestService: RoleRequestService = inject(RoleRequestService);
  public layoutService: LayoutService = inject(LayoutService);

  constructor() {
    this.layoutService.setTitle('Solicitudes')
    this.layoutService.setDescription('En esta sección, puedes ver el listado de tus pedidos con su ID, estado actual y la última modificación del estado. Cambia el estado de tus pedidos según sea necesario y mantén un registro actualizado de cada uno.')
    this.roleRequestService.search.page = 1;
    this.roleRequestService.getAll();
  }
}
