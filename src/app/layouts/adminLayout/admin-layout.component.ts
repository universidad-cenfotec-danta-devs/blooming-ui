import {Component} from '@angular/core';
import {SidebarComponent} from './sidebar/sidebar.component';
import {SHARED_IMPORTS} from '../../shared/shared.module';
import {LayoutService} from '../../services/layout.service';

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [
    SidebarComponent,
    ...SHARED_IMPORTS
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})

export class AdminLayoutComponent{

  public title?: string;
  public description?: string;

  constructor(public layoutService: LayoutService) {
    this.layoutService.title.subscribe((title) => (this.title = title))
    this.layoutService.description.subscribe((description) => (this.description = description))
  }
}
