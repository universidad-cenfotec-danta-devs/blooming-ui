import {Component, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomepageComponent} from '../../../features/admin/homepage/homepage.component';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './sidebar.component.html',
})

export class SidebarComponent{

  private sidebarSignal = signal<ISidebarDropdown>({
    users: true,
    products: true,
    reports: true,
  })

  get dropdownState$(){
    return this.sidebarSignal;
  }

  changeDropdownState(state : string){
    switch (state) {
      case 'users':
        this.sidebarSignal.update(options => ({...options, users:!options.users}));
        break;
      case 'products':
        this.sidebarSignal.update(options => ({...options, products:!options.products}));
        break;
      case 'reports':
        this.sidebarSignal.update(options => ({...options, reports:!options.reports}));
        break;
    }
  }
  protected readonly Component = Component;
  protected readonly HomepageComponent = HomepageComponent;
}

interface ISidebarDropdown{
  users: boolean,
  products: boolean,
  reports: boolean,
}
