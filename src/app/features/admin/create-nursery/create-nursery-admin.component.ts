import {Component, inject, Input, OnInit} from "@angular/core";
import {NurseryFormComponent} from "../../../shared/components/nursery-form/nursery-form.component";
import {NurseryService} from "../../../services/nursery.service";
import {LayoutService} from "../../../services/layout.service";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {UsersService} from "../../../services/users.service";
import {IUser} from "../../../interfaces/auth.interfaces";

@Component({
  selector: 'create-nursery-admin-page',
  standalone: true,
  templateUrl: 'create-nursery-admin.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NurseryFormComponent],
})

export class CreateNurseryAdminComponent implements OnInit {

  @Input() usersList: IUser[] = [];
  public layoutService = inject(LayoutService);
  private nurseryService: NurseryService = inject(NurseryService);
  userService: UsersService = inject(UsersService);

  constructor() {
    this.layoutService.setTitle('Crear vivero')
    this.layoutService.setDescription('')
  }

  ngOnInit() {
    this.userService.getNurseryUsers();
  }

  handleSubmit(event:{data: any, image: File}) {
    const nurseryRequest = {
      name: event.data.name,
      description: event.data.description,
      latitude: event.data.latitude,
      longitude: event.data.longitude,
      userEmail: event.data.userEmail || '',
    }
    this.nurseryService.createNursery(nurseryRequest, event.image, 'admin/nurseries');
  }
}
