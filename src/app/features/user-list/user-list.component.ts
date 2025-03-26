import { Component, Input, Output, EventEmitter, ViewChild, inject, ElementRef } from '@angular/core';
import { IUser } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, ModalComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  public selectedItem: IUser = {
    name: '',
    email: ''
  };
  isModalOpen = false;
  @Input() title: string = '';
  @Input() users: IUser[] = [];
  @Output() callModalAction: EventEmitter<IUser> = new EventEmitter<IUser>();
  @Output() callDeleteAction: EventEmitter<IUser> = new EventEmitter<IUser>();

  ngOnInit() {
    console.log("users", this.users);
  }

  showDetailModal(item: IUser, modal:any) {
    this.selectedItem = {...item};
    modal.show(); 
  }

  deleteUser(item: IUser) {

  }
}
