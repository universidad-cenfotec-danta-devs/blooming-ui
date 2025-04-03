import {Component, EventEmitter, inject, Input, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutService} from '../../../services/layout.service';
import {INurseries} from '../../../interfaces/nurseries.interface';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ModalComponent} from '../../detail-modal/detail-modal.component';
import {INurseryDTO} from '../../../interfaces/nurseryDTO.interface';
import {NurseryService} from '../../../services/nursery.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'admin-nurseries-list',
  standalone: true,
  imports:[
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: 'nurseries-list.component.html',
  styleUrl: 'nursery-list.component.css'
})

export class NurseriesListComponent{
  public layoutService = inject(LayoutService);
  @ViewChild('editModal') editModal!: ModalComponent;
  public selectedNursery: INurseryDTO = {
    id: 0,
    name: '',
    latitude: 0,
    longitude: 0,
    active: false
  };
  nurseryForm: FormGroup;
  @Input() nurseryList: INurseries[]=[];
  @Output() callEditModal: EventEmitter<INurseryDTO> = new EventEmitter<INurseryDTO>;

  constructor(private fb: FormBuilder) {
    this.nurseryForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      active: ['', Validators.required]
    });
  }

  showEditModal(item: INurseryDTO, modal: any) {
    this.selectedNursery = { ...item};

    if (this.selectedNursery){
      this.nurseryForm.patchValue({
        id: this.selectedNursery.id,
        name: this.selectedNursery.name,
        latitude: this.selectedNursery.latitude,
        longitude: this.selectedNursery.latitude,
        active: this.selectedNursery.active
      });
    }
  }
}
