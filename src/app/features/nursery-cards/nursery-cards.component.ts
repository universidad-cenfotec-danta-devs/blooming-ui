import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {INurseries} from '../../interfaces/nurseries.interface';

@Component({
  selector: 'nursery-card',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: 'nursery-cards.component.html'
})

export class  NurseryCardsComponent{
  @Input() nurseryList: INurseries[]=[];

}

