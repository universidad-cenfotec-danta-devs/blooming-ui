import {Component, EventEmitter, inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PaginationComponent} from '../../pagination/pagination.component';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NurseryService} from '../../../services/nursery.service';
import {IProducts} from '../../../interfaces/products.interface';
import {INurseries} from '../../../interfaces/nurseries.interface';
import {ActivatedRoute} from '@angular/router';
import {LayoutService} from '../../../services/layout.service';
import {ModalComponent} from '../../detail-modal/detail-modal.component';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'nursery-products',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PaginationComponent,
    ModalComponent,
  ],
  templateUrl: "products-admin.component.html",
  styleUrl:"../../my-products/my-products.component.css"
})

export class ProductsAdminComponent implements OnInit {
  public layoutService = inject(LayoutService);
  public nurseryService = inject(NurseryService);
  email: string = '';
  public currentNurseryId: any | null;
  public selectedProduct: any = {
    name: "",
    description: "",
    price: 0
  }

  productForm: FormGroup;
  @ViewChild("editModal") editModal!: ModalComponent;
  @ViewChild("deleteModal") deleteModal!: ModalComponent;
  @ViewChild("createModal") createModal!: ModalComponent;
  @Input() productList: IProducts[] = [];
  @Output() callEditModal: EventEmitter<INurseries> = new EventEmitter<INurseries>();

  constructor(private toastr: ToastrService, private fb: FormBuilder, private route: ActivatedRoute) {
    this.productForm = this.fb.group({
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      price: [0, [Validators.required]],
    })
  }

  ngOnInit() {
    this.layoutService.setTitle('Products')
    this.layoutService.setDescription('En esta sección, puedes ver todos los productos registrados. Revisa detalles como el ID, el nombre, la descripcion y el precio de los productos. También puedes editar su información o eliminarlo')
    this.currentNurseryId = this.route.snapshot.paramMap.get('id');
    this.nurseryService.setCurrentScreen('productsAdmin');
    this.nurseryService.setNurseryId(this.currentNurseryId)
    this.nurseryService.getAll();
  }


  showEditModal(item: IProducts, modal:any) {
    this.selectedProduct = {...item};
    if (this.selectedProduct) {
      this.productForm.patchValue({
        id: this.selectedProduct.id,
        name: this.selectedProduct.name,
        description: this.selectedProduct.description,
        price: this.selectedProduct.price
      })
    }
    this.editModal.openModal();
  }

  showDeleteModal(item: IProducts, modal:any) {
    this.selectedProduct = {...item};
    this.deleteModal.openModal();
  }

  showCreateModal(modal:any) {
    this.createModal.openModal();
  }

  deleteProduct(){
    this.nurseryService.removeProductFromNursery(this.selectedProduct.id);
    this.deleteModal.closeModal();
  }

  updateProduct(product: any, $event:any){
    if (this.productForm.valid && this.productForm.get('price')?.value != 0) {
      this.nurseryService.updateProduct(this.selectedProduct.id, product.value);
      this.productForm.reset();
      this.editModal.closeModal();
    } else if (this.productForm.get('price')?.value == 0){
      this.toastr.error('Por favor introduzca un precio valido');
    }else {
      this.toastr.error('Por favor llenar todos los campos');
    }
  }

  createProduct() {
    if (this.productForm.valid && this.productForm.get('price')?.dirty) {
      this.nurseryService.addProduct(this.productForm.value, this.currentNurseryId);
      this.createModal.closeModal();
    } else {
      this.toastr.error('Por favor llenar todos los campos');
    }
  }
}
