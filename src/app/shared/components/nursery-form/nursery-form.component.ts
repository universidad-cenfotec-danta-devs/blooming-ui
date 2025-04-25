import {CommonModule} from "@angular/common";
import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MapPickerComponent} from "../map-picker/map-picker.component";
import {IUser} from "../../../interfaces/user.interface";
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-nursery-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MapPickerComponent],
  templateUrl: './nursery-form.component.html',
})

export class NurseryFormComponent implements OnInit {
  @Input() isAdmin: boolean = false;
  @Input() users: IUser[] = [];
  @Output() formSubmitted = new EventEmitter<any>();
  nurseryForm: FormGroup;
  latitude!: number;
  longitude!: number;
  selectedFile?: File;

  constructor(private fb: FormBuilder, private toastr: ToastrService) {
    this.nurseryForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      userEmail: ['']
    });
  }

  ngOnInit(): void {
  }

  onLocationPicked(event: { latitude: number; longitude: number }) {
    this.latitude = event.latitude;
    this.longitude = event.longitude;
    this.nurseryForm.patchValue({
      latitude: event.latitude,
      longitude: event.longitude
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.nurseryForm.valid  && this.selectedFile) {
      const formData = {
        ...this.nurseryForm.value,
        latitude: this.latitude,
        longitude: this.longitude,
      }
      this.formSubmitted.emit({data: formData, image: this.selectedFile});
    } else {
      this.toastr.error('Por favor llenar todos los campos');
    }
  }
}
