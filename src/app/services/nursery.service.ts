import {Injectable, signal} from '@angular/core';
import {BaseService} from '../shared/service/base.service';
import {INurseries} from '../interfaces/nurseries.interface';
import {ISearch} from '../interfaces/search.interfaces';
import {ToastrService} from 'ngx-toastr';
import {INurseryDTO} from '../interfaces/nurseryDTO.interface';
import { Router } from '@angular/router';
import { IProducts } from '../interfaces/products.interface';
import {environment} from '../../enviroments/enviroment.prod';

@Injectable({
  providedIn: 'root'
})

export class NurseryService extends BaseService<INurseryDTO>{
  protected override source = 'api/nurseries';
  private nurseryListSignal = signal<INurseries[]>([]);
  private nurseryDetailSignal = signal<INurseries>({});
  private nurseryProductsSignal = signal<IProducts[]>([]);
  private userEmailSignal = signal<string>("");
  private currentScreen?: string;
  private idNursery?: number;
  private userLat?: number;
  private userLng?: number;

  constructor(private toastr: ToastrService, private router: Router) {
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

  get userEmail$(){
    return this.userEmailSignal;
  }

  setCurrentScreen(screen: string) {
    this.currentScreen = screen;
  }

  setNurseryId(id: number) {
    this.idNursery = id;
  }

  setUserUbication(lat: number, lng: number) {
    this.userLat = lat;
    this.userLng = lng;
  }

  public search: ISearch = {
    page:1,
    size:5
  }

  public totalItems: any = [];

  getAll() {
    if(!this.currentScreen){
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
    }else{
      switch (this.currentScreen) {
        case 'products':
          this.getMyProducts();
        break;
        case 'productsAdmin':
          this.getProductsByNurseryId(this.idNursery)
        break;
        case 'nearby':
          this.getNearby();
        break;
      }
    }
  }

  getAllActives(){
    this.findAllWithParamsAndCustomSource('actives', { page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages: 0}, (_, i) => i + 1);
        this.nurseryListSignal.set(response.data);
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
        this.nurseryProducts$.set(response.data.products);
        this.userEmail$.set(response.data.userEmail);
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    })
  }

  getNearby(){
    this.findAllWithParamsAndCustomSource(`nearby?userLat=${this.userLat}&userLng=${this.userLng}`,{ page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages: 0}, (_, i) => i + 1);
        this.nurseries$.set(response.data);
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
      }
    })
  }

  addProductToNursery(product: IProducts) {
    this.addCustomSource("addProductByNurseryAdmin", product).subscribe({
      next: (response: any) => {
        this.toastr.success('Product added to nursery', 'Success');
        this.router.navigate(["home/my-products"]);
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    })
  }

  addProduct(product: IProducts, nurseryId: any) {
    this.addCustomSource("add-product/" + nurseryId, product).subscribe({
      next: (response: any) => {
        this.getAll()
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
      }
    })
  }

  getById(id: any, callback?: Function) {
    this.find(id).subscribe({
      next: (response: any) => {
        this.nurseryDetail$.set(response.data);
        if(callback){
          callback(response.data);
        }
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

  createNursery(nursery: any, image:File, url?: string){
    const formData = new FormData();

    formData.append('nurseryRequest',
      new Blob([JSON.stringify(nursery)], {type: 'application/json'})
    );

    formData.append("nurseryImg", image);

    this.http.post(`${environment.apiUrl}/` + this.source, formData).subscribe({
      next: (response: any) =>{
        if(url){
          this.toastr.success("Nursery created", 'Success');
          this.router.navigate([url]);
        }
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    })
  }

  updateNursery(id: any, nursery: any, myNursery?: boolean){
    this.patch(id, nursery).subscribe({
      next: (response: any) => {
        this.toastr.success('Nursery updated', 'Success');
        if (myNursery){
          this.getMyNursery();
        } else {
          this.getAll();
        }
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    })
  }

  updateProduct(id: any, product: any){
    this.patchCustomSource('update-product/' + id, product).subscribe({
      next: (response: any) => {
        this.toastr.success('Product updated', 'Success');
        this.getAll();
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    })
  }

  getMyNursery(){
    this.find('my-nursery').subscribe({
      next: (response: any) => {
        this.nurseryDetailSignal.set(response.body.data);
      }
    })
  }

  getMyProducts(){
    this.findAllWithParamsAndCustomSource('my-products', { page:this.search.page, size:this.search.size }).subscribe({
      next: (response: any) => {
        this.search = {...this.search, ...response.meta};
        this.totalItems = Array.from({length: this.search.totalPages ? this.search.totalPages: 0}, (_, i) => i + 1);
        this.nurseryProductsSignal.set(response.data.products);
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    })
  }

  removeProductFromNursery(idProduct: IProducts){
    this.delCustomSource(`api/nurseries/remove-product/${idProduct}`).subscribe({
      next: (response: any) => {
        this.toastr.success('Product removed', 'Success');
        this.getAll();
      },
      error: (err: any) => {
        this.toastr.error(err, 'Error');
        console.error('error', err);
      }
    })
  }
}
