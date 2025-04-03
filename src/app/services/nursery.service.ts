import {inject, Injectable, signal} from '@angular/core';
import {BaseService} from '../shared/service/base.service';
import {INurseries} from '../interfaces/nurseries.interface';
import {ISearch} from '../interfaces/search.interfaces';
import {ToastrService} from 'ngx-toastr';
import {INurseryDTO} from '../interfaces/nurseryDTO.interface';

@Injectable({
  providedIn: 'root'
})

export class NurseryService extends BaseService<INurseryDTO>{
  protected override source = 'api/nurseries';
  private nurserieListSignal = signal<INurseries[]>([]);
  // nurseryService: NurseryService = inject(NurseryService);

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
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    });
  }

  // save(nursery: INurseries){
  //   this.add(nursery).subscribe({
  //     next: (response: any) =>{
  //       this.toastr.success("Nursery created", "Success");
  //       this.getAll();
  //     },
  //     error: (err:any) => {
  //       this.toastr.error(err, 'Error');
  //       console.error('Error', err);
  //     }
  //   })
  // }
  // update(data: any){
  //   this.edit(data.id, data).subscribe({
  //     next:(response: any) => {
  //       this.toastr.success('Nursery updated', 'Success');
  //       this.getAll();
  //     },
  //     error: (err: any) => {
  //       this.toastr.error(err, 'Error');
  //       console.error('error', err);
  //     }
  //   })
  // }
}
