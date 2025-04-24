import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MapPickerComponent } from "../map-picker/map-picker.component";
import { IUser } from "../../../interfaces/user.interface";

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

    constructor(private fb: FormBuilder) {
      this.nurseryForm = this.fb.group({
        name: ['', [Validators.required]],
        description: ['', [Validators.required]],
        latitude: ['', Validators.required],
        longitude: ['', Validators.required],
        userEmail: ['']
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

    onSubmit() {
      if (this.nurseryForm.valid) {
        this.formSubmitted.emit(this.nurseryForm.value);
      }
    }
  }
