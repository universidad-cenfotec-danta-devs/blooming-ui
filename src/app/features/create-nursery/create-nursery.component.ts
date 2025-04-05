import { CommonModule } from "@angular/common";
import { Component, inject, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "express";
import { NurseryService } from "../../services/nursery.service";
import { INurseries } from "../../interfaces/nurseries.interface";

@Component({
    selector: 'create-nursery',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: 'create-nursery.component.html',
    styleUrls: ['create-nursery.component.css'],    
})

export class CreateNurseryComponent{

    formState: 'create' = 'create';
    nurseryForm: FormGroup;
    
    constructor(
        @Inject(NurseryService) public nurseryService: NurseryService,
        private fb: FormBuilder){ 
        this.nurseryForm = this.fb.group({
            name: ['', [Validators.required]],
            description: ['', [Validators.required]],
            latitude: ['', Validators.required],
            longitude: ['', Validators.required]
            })
    } 

    onSubmit() {
        if (this.nurseryForm.valid) {
            this.nurseryService.createNursery(this.nurseryForm.value)
        }
    }
    
}