import { CommonModule } from "@angular/common";
import { Component, Inject} from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NurseryService } from "../../services/nursery.service";
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: "create-product",
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: "create-product.component.html",
})

export class CreateProductComponent {
    productForm: FormGroup;

    constructor(
            @Inject(NurseryService) public nurseryService: NurseryService,
            private fb: FormBuilder,
            private toastr: ToastrService){
        this.productForm = this.fb.group({
            name: ['', [Validators.required]],
            description: ['', [Validators.required]],
            price: ['', [Validators.required]],
            })
        }

    onSubmit() {
        if (this.productForm.valid && this.productForm.get('price')?.value !== 0) {
            this.nurseryService.addProductToNursery(this.productForm.value);
            this.productForm.reset();
        } else {
          this.toastr.error('Por favor llenar todos los campos', "Error");
        }
    }
}
