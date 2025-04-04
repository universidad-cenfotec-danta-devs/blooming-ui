import {Component, EventEmitter, inject, Input, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutService} from '../../../services/layout.service';
import {INurseries} from '../../../interfaces/nurseries.interface';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ModalComponent} from '../../detail-modal/detail-modal.component';
import {NurseryService} from '../../../services/nursery.service';
import {SHARED_IMPORTS} from '../../../shared/shared.module';

@Component({
  selector: 'admin-nurseries-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SHARED_IMPORTS,
  ],
  templateUrl: 'nurseries-list.component.html',
  styleUrl: 'nursery-list.component.css'
})

export class NurseriesListComponent{
  public layoutService = inject(LayoutService);
  private nurseryService = inject(NurseryService);
  public selectedNursery: INurseries = {
    id: 0,
    name: '',
    latitude: 0,
    longitude: 0,
  };
  nurseryForm: FormGroup;
  @ViewChild('editModal') editModal!: ModalComponent;
  @Input() nurseryList: INurseries[]=[];

  @Output() callModalAction: EventEmitter<INurseries> = new EventEmitter<INurseries>();
  @Output() callEditModal: EventEmitter<INurseries> = new EventEmitter<INurseries>;

  constructor(private fb: FormBuilder) {
    this.nurseryForm = this.fb.group({
      name: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      active: ['', Validators.required]
    });
  }

  showEditModal(item: INurseries, modal: any) {
    this.selectedNursery = { ...item};

    if (this.selectedNursery){
      this.nurseryForm.patchValue({
        name: this.selectedNursery.name,
        latitude: this.selectedNursery.latitude,
        longitude: this.selectedNursery.latitude,
        active: this.selectedNursery.active
      });
    }
    this.editModal.openModal();
  }

  activate(nursery: any){
    this.nurseryService.activateNursery(nursery);
    console.log("id vivero: "+nursery.id);
  }

  deactivate(nursery: any){
    this.nurseryService.deactivateNursery(nursery);
    console.log("id vivero: "+nursery.id);
  }

  // updateNursery(nurseryForm: FormGroup, $event: void) {}
}
