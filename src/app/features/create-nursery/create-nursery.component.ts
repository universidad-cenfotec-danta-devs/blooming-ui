import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NurseryService } from "../../services/nursery.service";
import { NurseryFormComponent } from "../../shared/components/nursery-form/nursery-form.component";

@Component({
    selector: 'create-nursery',
    standalone: true,
    imports: [
    CommonModule,
    ReactiveFormsModule,
    NurseryFormComponent
],
    templateUrl: 'create-nursery.component.html',
    styleUrls: ['create-nursery.component.css'],
})

export class CreateNurseryComponent {
    constructor(@Inject(NurseryService) private nurseryService: NurseryService,) {}

    handleSubmit(event:{data:any, image: File}) {
      const nurseryRequest = {
        name: event.data.name,
        description: event.data.description,
        latitude: event.data.latitude,
        longitude: event.data.longitude,
        userEmail: event.data.userEmail || '',
      }
      this.nurseryService.createNursery(nurseryRequest, event.image, 'home/my-nursery');
    }
  }
