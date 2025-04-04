import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "express";

@Component({
    selector: 'create-nursery',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: 'create-nursery.component.html',
    styleUrls: ['create-nursery.component.css'],    
})

export class CreateNurseryComponent{

    formState: 'create' = 'create';
    // nurseryForm: FormGroup;
    
    // constructor(
    //     @Inject(AuthService) public authService: AuthService,
    //     private fb: FormBuilder,    
    //     private toastr: ToastrService, 
    //     private router: Router){ 
    //     this.nurseryForm = this.fb.group({
    //         name: ['', [Validators.required, Validators.email]],
    //         description: ['', [Validators.required]],
    //         latitude: ['', Validators.required],
    //         longitude: ['', Validators.required]
    //         })
    // } 


}