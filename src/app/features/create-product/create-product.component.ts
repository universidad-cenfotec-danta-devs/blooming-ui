import { CommonModule } from "@angular/common";
import { Component, Inject} from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NurseryService } from "../../services/nursery.service";
import {ToastrService} from 'ngx-toastr';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
    selector: "create-product",
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule
    ],
    templateUrl: "create-product.component.html",
})

export class CreateProductComponent {
    productForm: FormGroup;

    constructor(
            @Inject(NurseryService) public nurseryService: NurseryService,
            private fb: FormBuilder,
            private toastr: ToastrService,
            private translate: TranslateService){
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
        } else if (this.productForm.get('price')?.value === 0){
          this.translate.get('TOAST.ERROR.INVALID_PRICE').subscribe((translatedMessage: string) => {
            this.toastr.error(translatedMessage);
          });
        }
        else {
          this.translate.get('TOAST.ERROR.REQUIRED_FIELDS').subscribe((translatedMessage: string) => {
            this.toastr.error(translatedMessage);
          });
        }
    }
}
