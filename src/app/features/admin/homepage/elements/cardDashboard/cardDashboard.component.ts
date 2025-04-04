import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'admin-card',
  standalone: true,
  imports:[
    CommonModule
  ],
  templateUrl:'cardDashboard.component.html',

})

export class CardDashboardComponent{
  @Input() title: string = '';
}
