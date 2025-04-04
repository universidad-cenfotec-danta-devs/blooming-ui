import { Component, inject, ViewChild } from '@angular/core';
import { UserListComponent } from "../user-list/user-list.component";
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../interfaces/user.interface';
import { PaginationComponent } from '../pagination/pagination.component';
import { ModalService } from '../../services/modal.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalComponent } from '../detail-modal/detail-modal.component';
import {LayoutService} from '../../services/layout.service';

@Component({
  selector: 'app-users',
  imports: [UserListComponent, PaginationComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  public usersService: UsersService = inject(UsersService);
  public authService: AuthService = inject(AuthService);
  public modalService: ModalService = inject(ModalService);
  public isModalOpen: boolean = false;
  public selectedItem: any = null;
  public fb: FormBuilder = inject(FormBuilder);
  public layoutService = inject(LayoutService);

  userForm = this.fb.group({
    id: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/)]],
    name: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    gender: ['', Validators.required],
    role: this.fb.group({
      name: ['', Validators.required]
    })
  })

  constructor() {
    this.layoutService.setTitle('Usuarios')
    this.layoutService.setDescription('En esta sección, puedes ver el listado completo de usuarios registrados en la plataforma. Explora sus perfiles, revisa sus actividades y gestiona sus roles y permisos.')

    this.usersService.search.page = 1;
    this.usersService.getAll()
  }

  saveUser(user: IUser) {
    this.usersService.save(user);
  }

  updateUser(user: IUser) {
    this.usersService.update(user);
  }

  deleteUser(user: IUser) {
    this.usersService.delete(user);
  }

  callEdition(user: IUser) {
    this.userForm.controls['id'].setValue(user.id ? JSON.stringify(user.id) : '');
    this.userForm.controls['email'].setValue(user.email ? user.email : '');
    this.userForm.controls['password'].setValue(user.password ? JSON.stringify(user.password) : '');
    this.userForm.controls['name'].setValue(user.name ? JSON.stringify(user.name) : '');
    this.userForm.controls['dateOfBirth'].setValue(user.name ? JSON.stringify(user.name) : '');
    this.userForm.controls['gender'].setValue(user.name ? JSON.stringify(user.name) : '');
    this.userForm.controls['role'].setValue(user.role ? { name: user.role.name ?? '' } : { name: '' });
  }

  openModal(item: any) {
    this.selectedItem = item;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
