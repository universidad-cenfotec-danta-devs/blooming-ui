import { Component, inject } from '@angular/core';
import { AdminLogListComponent } from '../admin-log-list/admin-log-list.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { AdminLogsService } from '../../services/adminLogs.service';

@Component({
  selector: 'app-admin-logs',
  imports: [AdminLogListComponent, PaginationComponent],
  templateUrl: './admin-logs.component.html',
  styleUrl: './admin-logs.component.scss'
})
export class AdminLogsComponent {
  public adminLogsService: AdminLogsService = inject(AdminLogsService);
  
  constructor() {
    this.adminLogsService.search.page = 1;
    this.adminLogsService.getAll();
  }
}
