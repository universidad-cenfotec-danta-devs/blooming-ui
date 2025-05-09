import { CommonModule } from "@angular/common";
import {Component, EventEmitter, inject, Input, OnInit, Output, ViewChild} from "@angular/core";
import { Router } from "@angular/router";
import { NurseryService } from "../../services/nursery.service";
import { ModalComponent } from "../detail-modal/detail-modal.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { IProducts } from "../../interfaces/products.interface";
import { INurseries } from "../../interfaces/nurseries.interface";
import { PaginationComponent } from "../pagination/pagination.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: "my-products",
    standalone: true,
    imports: [
        CommonModule,
        ModalComponent,
        ReactiveFormsModule,
        PaginationComponent,
        TranslateModule
    ],
    templateUrl: "my-products.component.html",
    styleUrl: "my-products.component.css",
})

export class MyProductsComponent implements OnInit {
    public nurseryService = inject(NurseryService);
    public selectedProduct: any = {
        name: "",
        description: "",
        price: 0,
    };

    productForm: FormGroup;
    @ViewChild("editModal") editModal!: ModalComponent;
    @ViewChild("deleteModal") deleteModal!: ModalComponent;
    @Input() productList: IProducts[] = [];
    @Output() callEditModal: EventEmitter<INurseries> = new EventEmitter<INurseries>();

    constructor(private router: Router, private fb: FormBuilder, private toastr: ToastrService, private translate: TranslateService) {
        this.productForm = this.fb.group({
            name: ["", Validators.required],
            description: ["", Validators.required],
            price: [0, [Validators.required]],
        })
    }

    ngOnInit() {
        this.nurseryService.setCurrentScreen('products');
        this.nurseryService.getAll();
    }

    showEditModal(item: IProducts, modal: any) {
        this.selectedProduct = { ...item };
        if (this.selectedProduct) {
            this.productForm.patchValue({
                id: this.selectedProduct.id,
                name: this.selectedProduct.name,
                description: this.selectedProduct.description,
                price: this.selectedProduct.price,
            });
        }
        this.editModal.openModal();
    }

    showDeleteModal(item: IProducts, modal: any) {
        this.selectedProduct = { ...item };
        this.deleteModal.openModal();
    }

    deleteProduct() {
        this.nurseryService.removeProductFromNursery(this.selectedProduct.id);
        this.deleteModal.closeModal();
    }

    updateProduct(product: any, $event: any) {
      if (this.productForm.valid) {
        this.nurseryService.updateProduct(this.selectedProduct.id, product.value)
        this.editModal.closeModal();
      }else if (this.productForm.get('price')?.value == 0){
        this.translate.get('TOAST.ERRORS.INVALID_PRICE').subscribe((translatedMessage: string) => {
          this.toastr.error(translatedMessage);
        });
      }else {
        this.translate.get('TOAST.ERRORS.REQUIRED_FIELDS').subscribe((translatedMessage: string) => {
          this.toastr.error(translatedMessage);
        });
      }
    }

    createProduct() {
        this.router.navigate(["/home/create-product"]);
    }

}
