import { CommonModule } from "@angular/common";
import { Component, Inject} from "@angular/core";
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NurseryService } from "../../services/nursery.service";
import { Router } from "@angular/router";

@Component({
    selector: "create-product",
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: "create-product.component.html",
    // styleUrls: ["create-product.component.css"],
})

export class CreateProductComponent {
    productForm: FormGroup;

    constructor(
            @Inject(NurseryService) public nurseryService: NurseryService,
            private fb: FormBuilder,
            private router: Router){ 
        this.productForm = this.fb.group({
            name: ['', [Validators.required]],
            description: ['', [Validators.required]],
            price: ['', [Validators.required]],
            })
        }
        
    onSubmit() {
        if (this.productForm.valid) {
            console.log(this.productForm.value);
            this.nurseryService.addProductToNursery(this.productForm.value);
            this.productForm.reset(); // Clear the form data
            this.router.navigate(['/home/my-products']);
        }
    }
}