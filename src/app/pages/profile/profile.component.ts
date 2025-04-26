import {Component, inject} from '@angular/core';
import {ProfileService} from '../../services/profile.service';
import {SHARED_IMPORTS} from '../../shared/shared.module';
import {ProfileFormComponent} from '../../features/profile-form/profile-form.component';
import {FormBuilder, Validators} from '@angular/forms';
import {IUserProfileUpdateRequest} from '../../interfaces/user.interface';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SHARED_IMPORTS, ProfileFormComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  protected profileService: ProfileService = inject(ProfileService);
  protected toastService: ToastrService = inject(ToastrService);
  protected translate: TranslateService = inject(TranslateService);
  public fb: FormBuilder = inject(FormBuilder);
  public profileForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    dateOfBirth: [''],
    gender: [''],
    profileImageUrl: ['']
  });

  constructor() {
    this.profileService.getUserProfileInfo();
  }

  updateProfile(updatedUser: IUserProfileUpdateRequest) {
    this.profileService.updateUserProfile(updatedUser).subscribe({
      next: (response) => {
        this.toastService.success(this.translate.instant('PROFILE.BUTTON_UPDATED_MSG'));
      },
      error: (err) => {
        this.toastService.error(this.translate.instant('PROFILE.BUTTON_UPDATED_MSG'));
      }
    });
  }
}

