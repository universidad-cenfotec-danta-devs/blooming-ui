import { inject, Injectable, signal } from "@angular/core";
import { BaseService } from "../shared/service/base.service";
import { IRoleRequest } from "../interfaces/roleRequest.interface";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { ISearch } from "../interfaces/search.interfaces";
import { AdminLogsService } from "./adminLogs.service";

@Injectable({
    providedIn: 'root'
})
export class RoleRequestService extends BaseService<IRoleRequest> {
    protected override source: string = 'requests';
    adminLogsService: AdminLogsService = inject(AdminLogsService);

    private roleRequestListSignal = signal<IRoleRequest[]>([]);

    constructor(private toastr: ToastrService, router: Router) {
        super();
    }

    get roleRequests$() {
        return this.roleRequestListSignal;
    }

    public search: ISearch = {
        page: 1,
        size: 5
    }

    public totalItems: any = [];

    getAll() {
        this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
            next: (response: any) => {
                this.search = {...this.search, ...response.meta};
                this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages: 0 }, (_, i) => i + 1); 
                this.roleRequestListSignal.set(response.data);
            },
            error: (err: any) => {
                this.toastr.error(err, 'Error');
                console.error('error', err);
            }
        })
    }

    approve(data: any) {
        this.editCustomSource('requests/approve/' + data.requesterId, data).subscribe({
            next: (response: any) => {
                this.toastr.success('Request Approved', 'Success');
                this.adminLogsService.create('admin_user@gmail.com', 'Role approved');
                this.getAll();
            },
            error: (err: any) => {
                this.toastr.error(err, 'Error');
                console.error('error', err);
            }
        }
    )}

    deny(data: any) {
        this.editCustomSource('requests/deny/' + data.requesterId, data).subscribe({
            next: (response: any) => {
                this.toastr.success('Request Denied', 'Success');
                this.adminLogsService.create('admin_user@gmail.com', 'Role denied');
                this.getAll();
            },
            error: (err: any) => {
                this.toastr.error(err, 'Error');
                console.error('error', err);
            }
        }
    )}
}