import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() service: any;
  @Input() customCall: boolean = false;
  @Output() callCustomPaginationMethod = new EventEmitter();

  onPage(pPage: number) {
    this.service.search.page = pPage;
    if (this.customCall) {
      this.callCustomPaginationMethod.emit();
    } else {
      this.service.getAll();
    }
  }
}
