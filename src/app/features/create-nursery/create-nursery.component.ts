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

    handleSubmit(data: any) {
        this.nurseryService.createNursery(data, 'home/my-nursery');
    }
  }
