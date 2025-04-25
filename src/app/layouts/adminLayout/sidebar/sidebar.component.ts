import {Component, HostListener, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationEnd, Router, RouterLink} from '@angular/router';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './sidebar.component.html',
})

export class SidebarComponent{
  isSidebarOpen = false;
  @HostListener('document:click', ['$event'])

  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('#sidebar-multi-level-sidebar')){
      this.isSidebarOpen = false;
    }
  }
  toggleSidebar(){
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.closeSidebar();
      }
    });
  }

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
}


interface ISidebarDropdown{
  users: boolean,
  products: boolean,
  reports: boolean,
}
