import {Component, EventEmitter, inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutService} from '../../../services/layout.service';
import {INurseries} from '../../../interfaces/nurseries.interface';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ModalComponent} from '../../detail-modal/detail-modal.component';
import {NurseryService} from '../../../services/nursery.service';
import { MapPickerComponent } from "../../../shared/components/map-picker/map-picker.component";
import { Router } from '@angular/router';

@Component({
  selector: 'admin-nurseries-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    MapPickerComponent
],
  templateUrl: 'nurseries-list.component.html',
  styleUrl: 'nursery-list.component.css'
})

export class NurseriesListComponent implements OnInit{
  public layoutService = inject(LayoutService);
  private nurseryService = inject(NurseryService);
  public selectedNursery: INurseries = {
    name: '',
    description: '',
    latitude: 0,
    longitude: 0,
  };
  nurseryForm: FormGroup;
  latitude!: number;
  longitude!: number;
  @ViewChild('editModal') editModal!: ModalComponent;
  @ViewChild('statusActiveModal') statusActiveModal!: ModalComponent;
  @ViewChild('statusDeactivateModal') statusDeactivateModal!: ModalComponent;
  @ViewChild(MapPickerComponent) mapPicker!: MapPickerComponent;
  @Input() nurseryList: INurseries[]=[];

  @Output() callModalAction: EventEmitter<INurseries> = new EventEmitter<INurseries>();
  @Output() callEditModal: EventEmitter<INurseries> = new EventEmitter<INurseries>();

  constructor(private fb: FormBuilder, private route: Router) {
    this.nurseryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onLocationPicked(event: { latitude: number; longitude: number }) {
    this.latitude = event.latitude;
    this.longitude = event.longitude;
    this.nurseryForm.patchValue({
      latitude: event.latitude,
      longitude: event.longitude
    });
  }
  
  onLocationSelected({ lat, lng }: { lat: number, lng: number }): void {
    this.nurseryForm.patchValue({
        latitude: lat,
        longitude: lng
    });
  }

  showEditModal(item: INurseries, modal: any) {
    this.selectedNursery = { ...item};
    if (this.selectedNursery){
      this.nurseryForm.patchValue({
        id: this.selectedNursery.id,
        name: this.selectedNursery.name,
        description: this.selectedNursery.description,
        latitude: this.selectedNursery.latitude,
        longitude: this.selectedNursery.longitude,
        // image: this.selectedNursery.imageURL
      });
      setTimeout(() => {
        this.mapPicker.forceResize(); // creamos este método en el componente MapPicker
      }, 300);
    }
    this.editModal.openModal();
  }

  showStatusModal(nursery: INurseries, modal: any) {
    this.selectedNursery = {...nursery};
    // this.changeStatus(nursery);
    if(this.selectedNursery.active) {
      this.statusDeactivateModal.openModal();
    } else{
      this.statusActiveModal.openModal();
    }
  }
  
  updateNursery(nursery: INurseries, $event: any) {
    this.nurseryService.updateNursery(this.selectedNursery.id, nursery);
    this.editModal.closeModal();
    this.nurseryService.getAll();
  }

  changeStatus(nursery: INurseries) {
    if (nursery.active) {
      this.nurseryService.deactivateNursery(nursery);
      this.statusDeactivateModal.closeModal();
      } else {
        this.nurseryService.activateNursery(nursery);
        this.statusActiveModal.closeModal();
      }
  }
}
