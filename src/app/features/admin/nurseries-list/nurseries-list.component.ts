import {Component, inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutService} from '../../../services/layout.service';
import {INurseries} from '../../../interfaces/nurseries.interface';

@Component({
  selector: 'admin-nurseries-list',
  standalone: true,
  imports:[
    CommonModule,
  ],
  templateUrl: 'nurseries-list.component.html',
})

export class NurseriesListComponent{
  @Input() nurseryList: INurseries[]=[];
  public layoutService = inject(LayoutService);

}
