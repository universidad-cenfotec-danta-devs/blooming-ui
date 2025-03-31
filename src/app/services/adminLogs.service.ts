import { Injectable, signal } from "@angular/core";
import { BaseService } from "../shared/service/base.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { ISearch } from "../interfaces/search.interfaces";
import { IAdminLogs } from "../interfaces/adminLogs.interface";

@Injectable({
    providedIn: 'root'
})
export class AdminLogsService extends BaseService<IAdminLogs> {
    protected override source: string = 'logs';

    private adminLogListSignal = signal<IAdminLogs[]>([]);

    constructor(private toastr: ToastrService, router: Router) {
        super();
    }

    get logs$() {
        return this.adminLogListSignal;
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
                this.adminLogListSignal.set(response.data);
            },
            error: (err: any) => {
                this.toastr.error(err, 'Error');
                console.error('error', err);
            }
        })
    }

    create(email: string, description: string) {
        var data: any = {
            userEmail: email,
            description: description
        }
        this.add(data).subscribe({
            next: (response: any) => {
                this.getAll();
            },
            error: (err: any) => {
                console.error('error', err);
            }
        }
    )}
}