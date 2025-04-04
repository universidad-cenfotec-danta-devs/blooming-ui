import {inject, Injectable, signal} from '@angular/core';
import {BaseService} from '../shared/service/base.service';
import {INurseries} from '../interfaces/nurseries.interface';
import {ISearch} from '../interfaces/search.interfaces';
import {ToastrService} from 'ngx-toastr';
import {INurseryDTO} from '../interfaces/nurseryDTO.interface';
import {response} from 'express';
import { NurseryComponent } from '../features/nursery/nursery.component';
import { IProducts } from '../interfaces/products.interface';

@Injectable({
  providedIn: 'root'
})

export class NurseryService extends BaseService<INurseryDTO>{
  protected override source = 'api/nurseries';
  private nurseryListSignal = signal<INurseries[]>([]);
  private nurseryDetailSignal = signal<INurseries>({});
  private nurseryProductsSignal = signal<IProducts[]>([]);

  constructor(private toastr: ToastrService) {
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
        console.log(response.data);
        
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
        console.log(response);
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    })
  }

  getById(id: any) {
    console.log("id: "+id);
    this.find(id).subscribe({
      next: (response: any) => {
        this.nurseryDetail$.set(response.data);
        console.log(response);
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
        console.log("activate: "+response)
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
        console.log("deactivate: "+ response)
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    })
  }

  createNursery(nursery: INurseries ){
    this.add(nursery).subscribe({
      next:(response: any) => {
        this.toastr.success('Nursery created', 'Success');
        this.getAll();
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    })
  }

}
