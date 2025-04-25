import { CommonModule } from "@angular/common";
import {Component, EventEmitter, inject, OnInit, Output, ViewChild} from "@angular/core";
import { Router } from "@angular/router";
import { NurseryService } from "../../services/nursery.service";
import { ModalComponent } from "../detail-modal/detail-modal.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { INurseries } from "../../interfaces/nurseries.interface";
import { MapPickerComponent } from "../../shared/components/map-picker/map-picker.component";
import { TranslateModule } from "@ngx-translate/core";
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'nursery-user-page',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ModalComponent,
        MapPickerComponent,
        TranslateModule

],
    templateUrl: 'my-nursery.component.html',
    styleUrl: 'my-nursery.component.css'
})

export class myNurseryComponent implements OnInit{

    public nurseryService = inject(NurseryService);
    public selectedNursery: INurseries = {
        name: '',
        description: '',
        latitude: 0,
        longitude: 0,
    };
    nurseryForm: FormGroup;
    @ViewChild('editModal') editModal!: ModalComponent;
    @Output() callEditModal: EventEmitter<INurseries> = new EventEmitter<INurseries>();
    latitude!: number;
    longitude!: number;
    @ViewChild(MapPickerComponent) mapPicker!: MapPickerComponent;


    constructor(private router: Router, private fb: FormBuilder, private toastr: ToastrService) {
        this.nurseryForm = this.fb.group({
            name: ['', [Validators.required]],
            description: ['', [Validators.required]],
            latitude: ['', Validators.required],
            longitude: ['', Validators.required]
        })
    }

    ngOnInit() {
        this.nurseryService.getMyNursery();
    }

    showEditModal(item: INurseries, modal: any) {
      this.mapPicker.reset(item.latitude, item.longitude);
        this.selectedNursery = { ...item };
        if (this.selectedNursery) {
            this.nurseryForm.patchValue({
                id: this.selectedNursery.id,
                name: this.selectedNursery.name,
                description: this.selectedNursery.description,
                latitude: this.selectedNursery.latitude,
                longitude: this.selectedNursery.longitude,
            });
            setTimeout(() => {
                this.mapPicker.forceResize();
              }, 300);
        }
        this.editModal.openModal();
    }

    onLocationSelected(event: { lat: number, lng: number }) {
      this.latitude = event.lat;
      this.longitude = event.lng;
      this.nurseryForm.patchValue({
            latitude: event.lat,
            longitude: event.lng
        });
    }

    updateNursery(nursery: any, $event: any) {
      if (this.nurseryForm.valid) {
        this.nurseryService.updateNursery(this.selectedNursery.id, nursery, true);
        this.editModal.closeModal();
        this.nurseryService.getMyNursery();
      }else {
        this.toastr.error('Por favor llenar todos los campos');
      }

    }

    createNursery() {
        this.router.navigate(['/home/create-nursery']);
    }

    showProductsPage(){
        this.router.navigate(['/home/my-products']);
    }
}
