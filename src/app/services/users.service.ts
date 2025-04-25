import {inject, Injectable, signal} from "@angular/core";
import {BaseService} from "../shared/service/base.service";
import {IUser} from "../interfaces/user.interface";
import {ISearch} from "../interfaces/search.interfaces";
import {AuthService} from "./auth.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {AdminLogsService} from "./adminLogs.service";

@Injectable({
  providedIn: 'root'
})
export class UsersService extends BaseService<IUser> {
  protected override source: string = 'users';
  private userListSignal = signal<IUser[]>([]);
  adminLogsService: AdminLogsService = inject(AdminLogsService);

  constructor(private toastr: ToastrService, router: Router) {
    super();
  }

  get users$() {
    return this.userListSignal;
  }

  public search: ISearch = {
    page: 1,
    size: 5
  }

  public totalItems: any = [];
  private authService: AuthService = inject(AuthService);

  getAll() {
    this.findAllWithParams({page: this.search.page, size: this.search.size}).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages : 0}, (_, i) => i + 1);
        this.userListSignal.set(response.data);
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    });
  }

  save(user: IUser) {
    this.add(user).subscribe({
      next: (response: any) => {
        this.toastr.success('User created', 'Success');
        this.adminLogsService.create('admin_user@gmail.com', 'User created');
        this.getAll();
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    })
  }

  update(data: any) {
    this.edit(data.id, data).subscribe({
      next: (response: any) => {
        this.toastr.success('User updated', 'Success');
        this.adminLogsService.create('admin_user@gmail.com', 'User ' + data.id + ' updated');
        this.getAll();
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    })
  }

  delete(user: IUser) {
    this.delCustomSource(`users/${user.id}`).subscribe(
      () => {
        this.toastr.success('User deleted', 'Success');
        this.adminLogsService.create('admin_user@gmail.com', 'User ' + user.id + ' deleted');
        this.getAll();
      },
      (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    );
  }

}
