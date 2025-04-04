import {Injectable, signal} from '@angular/core';
import {BaseService} from '../shared/service/base.service';
import {INurseries} from '../interfaces/nurseries.interface';
import {ISearch} from '../interfaces/search.interfaces';
import {ToastrService} from 'ngx-toastr';
import {INurseryDTO} from '../interfaces/nurseryDTO.interface';
import { Router } from '@angular/router';
import { IProducts } from '../interfaces/products.interface';

@Injectable({
  providedIn: 'root'
})

export class NurseryService extends BaseService<INurseryDTO>{
  protected override source = 'api/nurseries';
  private nurseryListSignal = signal<INurseries[]>([]);
  private nurseryDetailSignal = signal<INurseries>({});
  private nurseryProductsSignal = signal<IProducts[]>([]);

  constructor(private toastr: ToastrService,     
    private router: Router
  ) {
    super();
  }

  get nurseries$(){
    return this.nurseryListSignal;
  }

  get nurseryDetail$(){
    return this.nurseryDetailSignal;
  }

  get nurseryProducts$(){
    return this.nurseryProductsSignal;
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
        this.nurseryListSignal.set(response.data);
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    });
  }

  getAllActives(){
    this.findAllWithParamsAndCustomSource('actives', { page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages: 0}, (_, i) => i + 1);
        this.nurseryListSignal.set(response.data.content);
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    })
  }

  getProductsByNurseryId(id: any) {
    this.findAllWithParamsAndCustomSource('get-products/' + id, { page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages: 0}, (_, i) => i + 1);
        this.nurseryProducts$.set(response.data.content);
        
      },
      error: (err: any) => { 
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    })
  }

  addProductToNursery(product: IProducts){
    this.addCustomSource("addProductByNurseryAdmin", product).subscribe({
      next: (response: any) => {
        this.getProductsByNurseryId(product.nursery?.id);
        this.toastr.success('Product added to nursery', 'Success');
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    })
  }

  getById(id: any) {
    this.find(id).subscribe({
      next: (response: any) => {
        this.nurseryDetail$.set(response.data);
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    })
  }
  
  activateNursery(data: any){
    this.patchCustomSource('activate/' + data.id).subscribe({
      next: (response: any) => {
        this.toastr.success("Nursery activated", 'Success');
        this.getAll();
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    })
  }

  deactivateNursery(data: any){
    this.patchCustomSource('deactivate/' + data.id).subscribe({
      next: (response: any) => {
        this.toastr.success("Nursery deactivated", 'Success');
        this.getAll();
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    })
  }

  createNursery(nursery: any ){
    this.add(nursery).subscribe({
      next:(response: any) => {
        this.toastr.success('Nursery created', 'Success').onHidden.subscribe(() => {
          this.router.navigate(['/home/nurseries']);;
        });
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    })
  }

}
