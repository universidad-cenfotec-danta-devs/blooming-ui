import {inject, Injectable, signal} from '@angular/core';
import {BaseService} from '../shared/service/base.service';
import {INurseries} from '../interfaces/nurseries.interface';
import {AdminLogsService} from './adminLogs.service';
import {ISearch} from '../interfaces/search.interfaces';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class NurseryService extends BaseService<INurseries>{
  protected override source = 'api/nurseries';
  private nurserieListSignal = signal<INurseries[]>([]);
  adminLogsService: AdminLogsService = inject(AdminLogsService);

  constructor(private toastr: ToastrService) {
    super();
  }

  get nurseries$(){
    return this.nurserieListSignal;
  }

  public search: ISearch = {
    page:1,
    size:5
  }

  public totalItems: any = [];


  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages: 0}, (_, i) => i + 1);
        this.nurserieListSignal.set(response.data);
        console.log(response.data);
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    });
  }

}
