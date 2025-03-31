import { CommonModule } from '@angular/common';
import { Component, inject, Input, ViewChild } from '@angular/core';
import { ModalComponent } from '../detail-modal/detail-modal.component';
import { IRoleRequest } from '../../interfaces/roleRequest.interface';
import { RoleRequestService } from '../../services/roleRequests.service';

@Component({
  selector: 'app-requests-list',
  imports: [CommonModule, ModalComponent],
  templateUrl: './requests-list.component.html',
  styleUrl: './requests-list.component.scss'
})
export class RequestsListComponent {
  roleRequestService: RoleRequestService = inject(RoleRequestService);
  public selectedItem: IRoleRequest = {};
  @Input() title: string = '';
  @Input() requests: IRoleRequest[] = [];
  @ViewChild('denyModal') denyModal!: ModalComponent;
  @ViewChild('approveModal') approveModal!: ModalComponent;

  showApproveModal(item: IRoleRequest, modal: any) {
    this.selectedItem = { ...item };
    this.approveModal.openModal();
  }

  showDenyModal(item: IRoleRequest, modal: any) {
    this.selectedItem = { ...item };
    this.denyModal.openModal();
  }

  approve(item: IRoleRequest) {
    this.roleRequestService.approve(item)
    this.approveModal.closeModal();
  }

  deny(item: IRoleRequest) {
    this.roleRequestService.deny(item);
    this.denyModal.closeModal();
  }
}
