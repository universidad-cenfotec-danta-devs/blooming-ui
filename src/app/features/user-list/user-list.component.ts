import { Component, Input, Output, EventEmitter, ViewChild, inject, ElementRef } from '@angular/core';
import { IUser } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../detail-modal/detail-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSelectorComponent } from '../../shared/components/language-selector/language-selector.component';
import { UsersService } from '../../services/users.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, ModalComponent, ReactiveFormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  public auth_user = localStorage.getItem('auth_user');
  public userId = '';
  public selectedItem: IUser = {
    name: '',
    email: ''
  };
  private userService: UsersService = inject(UsersService)
  public modalService: ModalService = inject(ModalService);
  formState: 'login' | 'signup' | 'recover' = 'login';
  signUpForm: FormGroup;
  isModalOpen = false;
  inputDate: string | null = null;
  @ViewChild('detailModal') detailModal!: ModalComponent;
  @ViewChild('deleteModal') deleteModal!: ModalComponent;
  @ViewChild('deleteModalDenied') deleteModalDenied!: ModalComponent;
  @Input() title: string = '';
  @Input() users: IUser[] = [];
  @Output() callModalAction: EventEmitter<IUser> = new EventEmitter<IUser>();
  @Output() callDeleteAction: EventEmitter<IUser> = new EventEmitter<IUser>();
  
  constructor(private fb: FormBuilder) {
    this.signUpForm = this.fb.group({
      id: [''],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      role: this.fb.group({
        name: ['', Validators.required]
      }),
      active: ['', Validators.required]
    });
    if(this.auth_user) {
      this.userId = String(JSON.parse(this.auth_user).id);
    }
  }

  showDetailModal(item: IUser, modal: any) {
    this.selectedItem = { ...item };
  
    if (this.selectedItem) {
      this.signUpForm.patchValue({
        id: this.selectedItem.id,
        name: this.selectedItem.name,
        email: this.selectedItem.email,
        dateOfBirth: this.formatDate(this.selectedItem.dateOfBirth),
        gender: this.selectedItem.gender,
        active: this.selectedItem.active
      });

      // For nested role field
      this.signUpForm.get('role.name')?.setValue(this.selectedItem.role?.name || '');
    }   

    console.log(this.signUpForm.value);
  
    this.detailModal.openModal();
  }

  showDeleteModal(item: IUser, modal: any) {
    this.selectedItem = { ...item };
    if(this.userId == this.selectedItem.id) {
      this.deleteModalDenied.openModal();
    } else {
      this.deleteModal.openModal();
    }
  }

  deleteUser(item: IUser) {
    this.userService.delete(item);
    this.deleteModal.closeModal();
  }

  updateUser(data: any, $event: any) {
    data.dateOfBirth = new Date(data.dateOfBirth);
    this.userService.update(data);
    this.detailModal.closeModal();
  }

  formatDate(date: string | undefined): string {
    const parsedDate = new Date(date!);
    return parsedDate.toISOString().split('T')[0];
  }
}
