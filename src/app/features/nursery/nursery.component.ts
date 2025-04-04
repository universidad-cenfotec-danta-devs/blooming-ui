import {Component, inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {INurseries} from '../../interfaces/nurseries.interface';
import {LayoutService} from '../../services/layout.service';
import {NurseryService} from '../../services/nursery.service';
import {NurseriesListComponent} from '../admin/nurseries-list/nurseries-list.component';
import {PaginationComponent} from '../pagination/pagination.component';
import {NurseryCardsComponent} from '../nursery-cards/nursery-cards.component';

@Component({
  selector: 'nurseries',
  imports: [
    CommonModule,
    PaginationComponent,
    NurseryCardsComponent,
  ],
  templateUrl: 'nursery.component.html',
  styleUrl: 'nursery.component.css'
})

export class NurseryComponent{
  nurseryService: NurseryService = inject(NurseryService);

  constructor() {
    this.nurseryService.search.page=1;
    this.nurseryService.getAllActives();
  }
}
