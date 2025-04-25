import {CommonModule} from '@angular/common';
import {Component, EventEmitter, inject, Input, OnChanges, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {IUser, IUserProfileUpdateRequest} from '../../interfaces/user.interface';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TranslatePipe
  ],
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnChanges {
  public fb: FormBuilder = inject(FormBuilder);
  @Input() user: IUser | undefined;
  @Input() profileForm!: FormGroup;
  @Output() callUpdateMethod: EventEmitter<IUserProfileUpdateRequest> = new EventEmitter<IUserProfileUpdateRequest>();
  private initialProfileData: IUser | undefined;

  ngOnChanges() {
    if (this.user) {
      const formattedDate = this.user.dateOfBirth ? this.user.dateOfBirth.split('T')[0] : '';  // Solo toma la parte de la fecha
      this.profileForm.patchValue({
        id: this.user.id,
        name: this.user.name,
        email: this.user.email,
        dateOfBirth: formattedDate,
        gender: this.user.gender
      });
    }
  }

  updateUserProfile() {
    let item: IUserProfileUpdateRequest = {
      name: this.profileForm.controls['name'].value,
      dateOfBirth: this.profileForm.controls['dateOfBirth'].value,
      gender: this.profileForm.controls['gender'].value,
    }
    this.callUpdateMethod.emit(item);
  }
}
