import { Component, Input } from '@angular/core';
import { IAdminLogs } from '../../interfaces/adminLogs.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-log-list',
  imports: [CommonModule],
  templateUrl: './admin-log-list.component.html',
  styleUrl: './admin-log-list.component.scss'
})
export class AdminLogListComponent {
  @Input() logs: IAdminLogs[] = [];
}
