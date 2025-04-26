import {Injectable, signal} from '@angular/core';
import {BaseService} from './base-service';
import {environment} from '../../enviroments/enviroment.development';
import {Observable} from 'rxjs';
import {IResponse} from '../interfaces/auth.interfaces';
import {IUser, IUserProfileUpdateRequest} from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService extends BaseService<IUser> {

  private BACKEND_URL = `${environment.apiUrl2}/api/users`;
  protected override source: string = `${this.BACKEND_URL}`;
  private profileSignal = signal<IUser | null>(null);

  get profile() {
    return this.profileSignal;
  }

  getUserProfileInfo() {
    this.getCustom<IUser>('getUser').subscribe({
      next: (response) => {
        this.profileSignal.set(response.data);
      },
      error: (err) => {
        console.error('Error fetching profile info:', err);
      }
    });
  }

  updateUserProfile(userProfileUpdateRequest: IUserProfileUpdateRequest): Observable<IResponse<IUser>> {
    return this.updateToThisEndpoint(userProfileUpdateRequest);
  }


}
