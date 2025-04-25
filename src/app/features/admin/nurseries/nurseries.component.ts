import {Component, EventEmitter, inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutService} from '../../../services/layout.service';
import {INurseries} from '../../../interfaces/nurseries.interface';
import {NurseryService} from '../../../services/nursery.service';
import {PaginationComponent} from '../../pagination/pagination.component';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ModalComponent} from '../../detail-modal/detail-modal.component';
import {MapPickerComponent} from '../../../shared/components/map-picker/map-picker.component';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'admin-nurseries',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    PaginationComponent,
    MapPickerComponent,
  ],
  templateUrl: 'nurseries.component.html',
  styleUrl: 'nurseries.component.css'
})

export class NurseriesComponent implements OnInit {
  public layoutService = inject(LayoutService);
  nurseryService: NurseryService = inject(NurseryService);
  public selectedNursery: INurseries = {
    name: '',
    description: '',
    latitude: 0,
    longitude: 0,
  };
  @Input() nurseryList: INurseries[]=[];
  nurseryForm: FormGroup;
  latitude!: number;
  longitude!: number;
  @ViewChild('editModal') editModal!: ModalComponent;
  @ViewChild('statusActiveModal') statusActiveModal!: ModalComponent;
  @ViewChild('statusDeactivateModal') statusDeactivateModal!: ModalComponent;
  @ViewChild(MapPickerComponent) mapPicker!: MapPickerComponent;

  @Output() callModalAction: EventEmitter<INurseries> = new EventEmitter<INurseries>();
  @Output() callEditModal: EventEmitter<INurseries> = new EventEmitter<INurseries>();


  constructor(private router: Router, private fb: FormBuilder, private toastr: ToastrService){
    this.nurseryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
    this.layoutService.setTitle('Viveros')
    this.layoutService.setDescription('En esta sección, puedes ver todos los viveros registrados en la plataforma. Revisa detalles como el ID, el nombre, la dirección con latitud y longitud, y el estado del vivero. También puedes editar su información o cambiar su estado a activo o desactivado.')
    this.nurseryService.search.page=1;
    this.nurseryService.getAll();
    });
  }

  onLocationPicked(event: { latitude: number; longitude: number }) {
    this.latitude = event.latitude;
    this.longitude = event.longitude;
    this.nurseryForm.patchValue({
      latitude: event.latitude,
      longitude: event.longitude
    });
  }

  showEditModal(item: INurseries, modal: any) {
    this.mapPicker.reset(item.latitude, item.longitude);
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
        this.mapPicker.forceResize();
      }, 300);
    }
    this.editModal.openModal();
  }

  showStatusModal(nursery: INurseries, modal: any) {
    this.selectedNursery = {...nursery};
    if(this.selectedNursery.active) {
      this.statusDeactivateModal.openModal();
    } else{
      this.statusActiveModal.openModal();
    }
  }

  updateNursery(nursery: INurseries, $event: any) {
    if (this.nurseryForm.valid){
      this.nurseryService.updateNursery(this.selectedNursery.id, nursery);
      this.editModal.closeModal();
    } else {
      this.toastr.error('Por favor llenar todos los campos');
    }
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

  createProductPage(nursery: INurseries) {
    this.selectedNursery = {...nursery};
    this.router.navigate(['/admin/nursery-products/'+ this.selectedNursery.id]);
  }

  createNurseryPage() {
    this.router.navigate(['admin/create-nursery']);
  }
}
