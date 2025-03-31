import { Component, inject } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { RequestsListComponent } from '../requests-list/requests-list.component';
import { RoleRequestService } from '../../services/roleRequests.service';

@Component({
  selector: 'app-role-requests',
  imports: [PaginationComponent, RequestsListComponent],
  templateUrl: './role-requests.component.html',
  styleUrl: './role-requests.component.scss'
})
export class RoleRequestsComponent {
  public roleRequestService: RoleRequestService = inject(RoleRequestService);

  constructor() {
    this.roleRequestService.search.page = 1;
    this.roleRequestService.getAll();
  }
}
